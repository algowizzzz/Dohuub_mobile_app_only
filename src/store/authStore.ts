import { useSelector } from 'react-redux';
import { authApi } from '../services/authApi';
import { signInWithGoogle as googleSignIn } from '../services/googleAuth';
import { usersApi } from '../services/platformApi';
import { endSession } from '../services/endSession';
import { ApiError } from '../services/ApiError';
import { apiLog } from '../services/logger';
import { useSessionStore, type ApiUser } from './sessionStore';
import { store } from './redux/store';
import {
  clearAuthLocal,
  setAuthFields,
  setHasOnboarded,
  setPendingPassword,
  setUser,
  type AuthState,
} from './redux/authSlice';

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
  hasCompletedOnboarding: boolean;
};

export function toCustomer(user: ApiUser | null): CustomerUser | null {
  if (!user) return null;
  const fullName = user.fullName || String(user.email || '').split('@')[0];
  const parts = fullName.trim().split(/\s+/);
  const profileComplete = Boolean(
    user.profileCompletion || (user.fullName && user.phoneNumber && user.emailVerifiedAt),
  );
  const hasCompletedOnboarding = Boolean(user.hasCompletedOnboarding || profileComplete);

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
    profileComplete,
    hasCompletedOnboarding,
  };
}

function dispatchAuth(partial: Partial<AuthState>) {
  store.dispatch(setAuthFields(partial));
}

const actions = {
  setUser: (user: CustomerUser | null) => {
    store.dispatch(setUser(user));
  },
  setHasOnboarded: (value: boolean) => {
    store.dispatch(setHasOnboarded(value));
  },

  signIn: async ({ email, password }: { email: string; password: string }) => {
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
    dispatchAuth({ user: customer, hasOnboarded: true });
    return customer;
  },

  signInWithGoogle: async (referralCode?: string) => {
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
    dispatchAuth({ user: customer, hasOnboarded: true });
    return customer;
  },

  signUp: async ({
    fullName,
    email,
    password,
    phone,
    referralCode,
  }: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    referralCode?: string;
  }) => {
    useSessionStore.getState().clear();
    await authApi.register({
      email,
      password,
      fullName,
      userType: 'user',
      phoneNumber: phone,
      referralCode,
    });
    dispatchAuth({ signupEmail: email, pendingPassword: password, user: null });
  },

  requestEmailOtp: async (email?: string) => {
    const target = email ?? store.getState().auth.signupEmail;
    await authApi.requestEmailOtp(target);
  },

  verifyEmailOtp: async (otp: string, email?: string) => {
    const target = email ?? store.getState().auth.signupEmail;
    await authApi.verifyEmailOtp({ email: target, otp });

    const { pendingPassword } = store.getState().auth;
    if (pendingPassword) {
      await actions.signIn({ email: target, password: pendingPassword });
      store.dispatch(setPendingPassword(''));
      return { signedIn: true, isNewSignup: true };
    }
    return { signedIn: false, isNewSignup: false };
  },

  forgotPassword: async (email: string) => {
    await authApi.forgotPassword({ email });
  },

  resetPassword: async (payload: { token: string; email: string; newPassword: string }) => {
    await authApi.resetPassword(payload);
  },

  restore: async () => {
    const { accessToken, user: cachedUser } = useSessionStore.getState();
    if (!accessToken) return false;

    try {
      const { user } = await authApi.me();
      if (user.userType !== 'user') {
        useSessionStore.getState().clear();
        store.dispatch(setUser(null));
        return false;
      }
      useSessionStore.getState().setUser(user);
      dispatchAuth({ user: toCustomer(user), hasOnboarded: true });
      return true;
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 0;
      if (status === 401 || status === 403) {
        useSessionStore.getState().clear();
        store.dispatch(setUser(null));
        return false;
      }
      if (cachedUser && cachedUser.userType === 'user') {
        dispatchAuth({ user: toCustomer(cachedUser), hasOnboarded: true });
      }
      apiLog.event('auth.restore.network_error', { error });
      return true;
    }
  },

  updateProfile: async (payload: { fullName?: string; phone?: string }) => {
    const { user } = await usersApi.update({
      ...(payload.fullName !== undefined ? { fullName: payload.fullName } : {}),
      ...(payload.phone !== undefined ? { phoneNumber: payload.phone } : {}),
    });
    useSessionStore.getState().setUser(user);
    const customer = toCustomer(user)!;
    store.dispatch(setUser(customer));
    return customer;
  },

  completeOnboarding: async () => {
    const current = store.getState().auth.user;
    if (current?.hasCompletedOnboarding) return current;
    try {
      const { user } = await usersApi.completeOnboarding();
      useSessionStore.getState().setUser(user);
      const customer = toCustomer(user)!;
      dispatchAuth({ user: customer, hasOnboarded: true });
      return customer;
    } catch {
      if (current) {
        dispatchAuth({
          user: { ...current, hasCompletedOnboarding: true },
          hasOnboarded: true,
        });
      }
      return store.getState().auth.user;
    }
  },

  uploadAvatar: async (file: { uri: string; name: string; type: string }) => {
    const { user } = await usersApi.uploadAvatar(file);
    useSessionStore.getState().setUser(user);
    store.dispatch(setUser(toCustomer(user)));
    return user.image;
  },

  logout: async () => {
    store.dispatch(clearAuthLocal());
    await endSession();
  },
};

function buildApi(auth: ReturnType<typeof store.getState>['auth']) {
  return {
    user: auth.user,
    hasOnboarded: auth.hasOnboarded,
    signupEmail: auth.signupEmail,
    pendingPassword: auth.pendingPassword,
    ...actions,
  };
}

type AuthApi = ReturnType<typeof buildApi>;

/**
 * Customer auth backed by Redux + redux-persist.
 * Same hook/getState API as the previous Zustand store.
 */
export function useAuthStore<T>(selector: (s: AuthApi) => T): T;
export function useAuthStore(): AuthApi;
export function useAuthStore<T>(selector?: (s: AuthApi) => T) {
  return useSelector((state: ReturnType<typeof store.getState>) => {
    const api = buildApi(state.auth);
    return selector ? selector(api) : api;
  });
}

useAuthStore.getState = () => buildApi(store.getState().auth);
