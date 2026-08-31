import { Linking, Platform } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { authApi } from './authApi';
import { ENV } from '../config/env';
import { ApiError } from './ApiError';

const REDIRECT_URL = ENV.googleAuthRedirectUrl;

function extractCode(url: string): { code?: string; error?: string } {
  const query = url.split('?')[1]?.split('#')[0] ?? '';
  const params = new URLSearchParams(query);
  return { code: params.get('code') ?? undefined, error: params.get('error') ?? undefined };
}

/**
 * Mirrors the PWA's PKCE redirect flow: the backend mints the Google
 * authorize URL (Supabase owns the OAuth client), the user completes
 * consent in a native browser sheet, then Google redirects back to our
 * custom scheme with `?code=`, which we exchange the same way the PWA does.
 */
export async function signInWithGoogle(referralCode?: string) {
  const { url, codeVerifier } = await authApi.googleUrl(REDIRECT_URL);
  if (!url) {
    throw new ApiError({ message: 'Google sign-in is unavailable right now.', status: 0, code: 'GOOGLE_UNAVAILABLE' });
  }

  const available = await InAppBrowser.isAvailable();
  const result = available
    ? await InAppBrowser.openAuth(url, REDIRECT_URL, {
        ephemeralWebSession: false,
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
      })
    : await openWithSystemBrowser(url);

  if (result.type !== 'success' || !result.url) {
    throw new ApiError({ message: 'Google sign-in was cancelled.', status: 0, code: 'GOOGLE_CANCELLED' });
  }

  const { code, error } = extractCode(result.url);
  if (error || !code) {
    throw new ApiError({
      message: error === 'access_denied' ? 'Google sign-in was cancelled.' : 'Google sign-in failed.',
      status: 0,
      code: error === 'access_denied' ? 'GOOGLE_CANCELLED' : 'GOOGLE_DENIED',
    });
  }

  return authApi.googleCallback({ code, codeVerifier, referralCode });
}

async function openWithSystemBrowser(url: string): Promise<{ type: string; url?: string }> {
  return new Promise((resolve) => {
    const subscription = Linking.addEventListener('url', ({ url: returned }) => {
      subscription.remove();
      resolve({ type: 'success', url: returned });
    });
    Linking.openURL(url).catch(() => {
      subscription.remove();
      resolve({ type: 'cancel' });
    });
  });
}

export const isGoogleAuthSupported = Platform.OS === 'ios' || Platform.OS === 'android';
