import { useSelector } from 'react-redux';
import { store } from './redux/store';
import {
  clearSession,
  setHasHydrated,
  setSession,
  setUser,
} from './redux/sessionSlice';

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
  hasCompletedOnboarding?: boolean;
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

/**
 * Session API backed by Redux + redux-persist (AsyncStorage).
 * Keeps the previous Zustand-shaped surface for screens and http.ts.
 */

const actions = {
  setSession: (payload: Session | null | undefined) => {
    store.dispatch(setSession(payload));
  },
  setUser: (user: ApiUser | null) => {
    store.dispatch(setUser(user));
  },
  clear: () => {
    store.dispatch(clearSession());
  },
  setHasHydrated: (value: boolean) => {
    store.dispatch(setHasHydrated(value));
  },
  isAuthenticated: () => Boolean(store.getState().session.accessToken),
  isExpired: () => {
    const { expiresAt } = store.getState().session;
    return !!expiresAt && new Date(expiresAt).getTime() <= Date.now();
  },
};

function buildApi(session: ReturnType<typeof store.getState>['session']) {
  return {
    user: session.user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
    hasHydrated: session.hasHydrated,
    ...actions,
  };
}

type SessionApi = ReturnType<typeof buildApi>;

export function useSessionStore<T>(selector: (s: SessionApi) => T): T;
export function useSessionStore(): SessionApi;
export function useSessionStore<T>(selector?: (s: SessionApi) => T) {
  return useSelector((state: ReturnType<typeof store.getState>) => {
    const api = buildApi(state.session);
    return selector ? selector(api) : api;
  });
}

useSessionStore.getState = () => buildApi(store.getState().session);
