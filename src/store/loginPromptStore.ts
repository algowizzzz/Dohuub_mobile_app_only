import { create } from 'zustand';

/**
 * The single "sign in to continue" prompt shown to guests. Any screen can open
 * it through `requireAuth()`; `LoginRequiredModal` (mounted once in
 * AppNavigator) renders it and routes to the sign-in screen.
 */
type LoginPromptStore = {
  visible: boolean;
  message: string;
  open: (message?: string) => void;
  close: () => void;
};

export const DEFAULT_LOGIN_PROMPT = 'Sign in or create a free account to continue.';

export const useLoginPromptStore = create<LoginPromptStore>(set => ({
  visible: false,
  message: DEFAULT_LOGIN_PROMPT,
  open: message => set({ visible: true, message: message || DEFAULT_LOGIN_PROMPT }),
  close: () => set({ visible: false }),
}));
