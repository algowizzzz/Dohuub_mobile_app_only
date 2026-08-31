import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ApiUserType = 'admin' | 'vendor' | 'user';

export type ApiUser = {
  id: string;
  email: string;
  fullName: string;
  image: string | null;
  phoneNumber: string | null;
  userType: ApiUserType;
  provider: string;
  profileCompletion: boolean;
  timezone: string;
  language: string;
  vendorCategoryIds: string[];
  stripeCustomerId: string | null;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

type SessionStore = {
  user: ApiUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  hasHydrated: boolean;
  setSession: (session: Session) => void;
  setUser: (user: ApiUser | null) => void;
  clear: () => void;
  setHasHydrated: (value: boolean) => void;
  isAuthenticated: () => boolean;
  isExpired: () => boolean;
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      hasHydrated: false,

      setSession: session =>
        set({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          expiresAt: session.expiresAt,
        }),

      setUser: user => set({ user }),

      clear: () =>
        set({ user: null, accessToken: null, refreshToken: null, expiresAt: null }),

      setHasHydrated: value => set({ hasHydrated: value }),

      isAuthenticated: () => Boolean(get().accessToken),

      isExpired: () => {
        const { expiresAt } = get();
        return !!expiresAt && new Date(expiresAt).getTime() <= Date.now();
      },
    }),
    {
      name: 'dohuub-session',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
      }),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
