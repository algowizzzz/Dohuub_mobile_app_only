import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../services/authApi';
import { signInWithGoogle as googleSignIn } from '../services/googleAuth';
import { usersApi } from '../services/platformApi';
import { endSession } from '../services/endSession';
import { ApiError } from '../services/ApiError';
import { apiLog } from '../services/logger';
import { useSessionStore, type ApiUser } from './sessionStore';

const NOT_CUSTOMER =
  'That account is not a customer account. Vendors and admins sign in from their own portals.';
const BLOCKED = 'This account has been blocked. Contact support.';

export type CustomerUser = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  timezone: string;
  language: string;
  userType: string;
  profileComplete: boolean;
};

export function toCustomer(user: ApiUser | null): CustomerUser | null {
  if (!user) return null;
  const fullName = user.fullName || String(user.email || '').split('@')[0];
  const parts = fullName.trim().split(/\s+/);

  return {
    id: user.id,
    fullName,
    firstName: parts[0] || 'there',
    lastName: parts.slice(1).join(' '),
    email: user.email,
    phone: user.phoneNumber,
    avatarUrl: user.image,
    emailVerified: !!user.emailVerifiedAt,
    phoneVerified: !!user.phoneVerifiedAt,
    timezone: user.timezone,
    language: user.language,
    userType: user.userType,
    profileComplete: user.profileCompletion,
  };
}

type AuthStore = {
  user: CustomerUser | null;
  hasOnboarded: boolean;
  signupEmail: string;
  pendingPassword: string;

  setUser: (user: CustomerUser | null) => void;
  setHasOnboarded: (value: boolean) => void;

  signIn: (payload: { email: string; password: string }) => Promise<CustomerUser>;
  signInWithGoogle: (referralCode?: string) => Promise<CustomerUser>;
  signUp: (payload: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    referralCode?: string;
  }) => Promise<void>;
  requestEmailOtp: (email?: string) => Promise<void>;
  verifyEmailOtp: (otp: string, email?: string) => Promise<{ signedIn: boolean }>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (payload: { token: string; newPassword: string }) => Promise<void>;
  restore: () => Promise<boolean>;
  updateProfile: (payload: { fullName?: string; phone?: string }) => Promise<CustomerUser>;
  uploadAvatar: (file: { uri: string; name: string; type: string }) => Promise<string | null>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      hasOnboarded: false,
      signupEmail: '',
      pendingPassword: '',

      setUser: user => set({ user }),
      setHasOnboarded: value => set({ hasOnboarded: value }),

      signIn: async ({ email, password }) => {
        const data = await authApi.login({ email, password });
        const { user } = data;

        if (user.userType !== 'user') {
          throw new ApiError({ message: NOT_CUSTOMER, status: 403, code: 'NOT_A_CUSTOMER' });
        }
        if (user.isBlocked) {
          throw new ApiError({ message: BLOCKED, status: 403, code: 'USER_BLOCKED' });
        }

        useSessionStore.getState().setSession(data.session);
        useSessionStore.getState().setUser(user);
        const customer = toCustomer(user)!;
        set({ user: customer });
        return customer;
      },

      signInWithGoogle: async referralCode => {
        const data = await googleSignIn(referralCode);
        const { user } = data;

        if (user.userType !== 'user') {
          throw new ApiError({ message: NOT_CUSTOMER, status: 403, code: 'NOT_A_CUSTOMER' });
        }
        if (user.isBlocked) {
          throw new ApiError({ message: BLOCKED, status: 403, code: 'USER_BLOCKED' });
        }

        useSessionStore.getState().setSession(data.session);
        useSessionStore.getState().setUser(user);
        const customer = toCustomer(user)!;
        set({ user: customer });
        return customer;
      },

      signUp: async ({ fullName, email, password, phone, referralCode }) => {
        useSessionStore.getState().clear();
        await authApi.register({
          email,
          password,
          fullName,
          userType: 'user',
          phoneNumber: phone,
          referralCode,
        });
        set({ signupEmail: email, pendingPassword: password, user: null });
      },

      requestEmailOtp: async email => {
        const target = email ?? get().signupEmail;
        await authApi.requestEmailOtp(target);
      },

      verifyEmailOtp: async (otp, email) => {
        const target = email ?? get().signupEmail;
        await authApi.verifyEmailOtp({ email: target, otp });

        const { pendingPassword } = get();
        if (pendingPassword) {
          await get().signIn({ email: target, password: pendingPassword });
          set({ pendingPassword: '' });
          return { signedIn: true };
        }
        return { signedIn: false };
      },

      forgotPassword: async email => {
        await authApi.forgotPassword({ email });
      },

      resetPassword: async payload => {
        await authApi.resetPassword(payload);
      },

      restore: async () => {
        const { accessToken } = useSessionStore.getState();
        if (!accessToken) return false;

        try {
          const { user } = await authApi.me();
          if (user.userType !== 'user') {
            useSessionStore.getState().clear();
            set({ user: null });
            return false;
          }
          useSessionStore.getState().setUser(user);
          set({ user: toCustomer(user) });
          return true;
        } catch (error) {
          const status = error instanceof ApiError ? error.status : 0;
          if (status === 401 || status === 403) {
            useSessionStore.getState().clear();
            set({ user: null });
            return false;
          }
          apiLog.event('auth.restore.network_error', { error });
          return true;
        }
      },

      updateProfile: async payload => {
        const { user } = await usersApi.update({
          ...(payload.fullName !== undefined ? { fullName: payload.fullName } : {}),
          ...(payload.phone !== undefined ? { phoneNumber: payload.phone } : {}),
        });
        useSessionStore.getState().setUser(user);
        const customer = toCustomer(user)!;
        set({ user: customer });
        return customer;
      },

      uploadAvatar: async file => {
        const { user } = await usersApi.uploadAvatar(file);
        useSessionStore.getState().setUser(user);
        set({ user: toCustomer(user) });
        return user.image;
      },

      logout: async () => {
        set({ user: null, signupEmail: '', pendingPassword: '' });
        await endSession();
      },
    }),
    {
      name: 'dohuub-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ hasOnboarded: state.hasOnboarded }),
    },
  ),
);
