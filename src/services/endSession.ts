import { authApi } from './authApi';
import { useSessionStore } from '../store/sessionStore';

export async function endSession(): Promise<boolean> {
  const { accessToken, clear } = useSessionStore.getState();

  if (!accessToken) {
    clear();
    return false;
  }

  let revoked = false;
  try {
    await authApi.logout();
    revoked = true;
  } catch {
    revoked = false;
  }

  clear();
  return revoked;
}
