import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CustomerUser } from '../authStore';

export type AuthState = {
  user: CustomerUser | null;
  hasOnboarded: boolean;
  /** Browsing without an account; cleared on any sign-in or logout. */
  isGuest: boolean;
  signupEmail: string;
  pendingPassword: string;
};

const initialState: AuthState = {
  user: null,
  hasOnboarded: false,
  isGuest: false,
  signupEmail: '',
  pendingPassword: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<CustomerUser | null>) {
      state.user = action.payload ?? null;
    },
    setHasOnboarded(state, action: PayloadAction<boolean>) {
      state.hasOnboarded = Boolean(action.payload);
    },
    setIsGuest(state, action: PayloadAction<boolean>) {
      state.isGuest = Boolean(action.payload);
    },
    setSignupEmail(state, action: PayloadAction<string>) {
      state.signupEmail = action.payload || '';
    },
    setPendingPassword(state, action: PayloadAction<string>) {
      state.pendingPassword = action.payload || '';
    },
    setAuthFields(state, action: PayloadAction<Partial<AuthState>>) {
      Object.assign(state, action.payload || {});
    },
    clearAuthLocal(state) {
      state.user = null;
      state.isGuest = false;
      state.signupEmail = '';
      state.pendingPassword = '';
    },
  },
});

export const {
  setUser,
  setHasOnboarded,
  setIsGuest,
  setSignupEmail,
  setPendingPassword,
  setAuthFields,
  clearAuthLocal,
} = authSlice.actions;
export default authSlice.reducer;
