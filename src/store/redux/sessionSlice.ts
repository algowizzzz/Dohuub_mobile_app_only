import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ApiUser, Session } from '../sessionStore';

export type SessionState = {
  user: ApiUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  hasHydrated: boolean;
};

const initialState: SessionState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  hasHydrated: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session | null | undefined>) {
      const session = action.payload;
      state.accessToken = session?.accessToken ?? null;
      state.refreshToken = session?.refreshToken ?? null;
      state.expiresAt = session?.expiresAt ?? null;
    },
    setUser(state, action: PayloadAction<ApiUser | null>) {
      state.user = action.payload ?? null;
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresAt = null;
    },
    setHasHydrated(state, action: PayloadAction<boolean>) {
      state.hasHydrated = Boolean(action.payload);
    },
  },
});

export const { setSession, setUser, clearSession, setHasHydrated } = sessionSlice.actions;
export default sessionSlice.reducer;
