import { useCallback } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { useLoginPromptStore } from '../store/loginPromptStore';

/** Signed in = holds a session. Guests (and signed-out users) do not. */
export const isSignedIn = () => Boolean(useSessionStore.getState().accessToken);

export function useIsSignedIn(): boolean {
  return useSessionStore(state => Boolean(state.accessToken));
}

/**
 * Gate an account-only action. Returns true when the caller may proceed;
 * otherwise opens the sign-in prompt with `message` and returns false.
 *
 *   if (!requireAuth('Sign in to book this service.')) return;
 */
export function requireAuth(message?: string): boolean {
  if (isSignedIn()) return true;
  useLoginPromptStore.getState().open(message);
  return false;
}

export function useRequireAuth() {
  const signedIn = useIsSignedIn();
  const gate = useCallback((message?: string) => requireAuth(message), []);
  return { signedIn, requireAuth: gate };
}
