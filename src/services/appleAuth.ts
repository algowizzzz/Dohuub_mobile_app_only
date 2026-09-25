import { Platform } from 'react-native';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { authApi } from './authApi';
import { ApiError } from './ApiError';

/**
 * Native Sign in with Apple (iOS 13+). AuthenticationServices shows Apple's
 * own sheet and returns an identity token; the library generates a nonce,
 * sends its SHA-256 to Apple and hands us the raw value, which the backend
 * forwards to Supabase so it can check the token was minted for this request.
 */
export const isAppleAuthSupported = Platform.OS === 'ios' && appleAuth.isSupported;

export async function signInWithApple(referralCode?: string) {
  if (!isAppleAuthSupported) {
    throw new ApiError({
      message: 'Sign in with Apple is not available on this device.',
      status: 0,
      code: 'APPLE_UNAVAILABLE',
    });
  }

  let response;
  try {
    response = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      // FULL_NAME must come before EMAIL — Apple ignores the name otherwise.
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === appleAuth.Error.CANCELED) {
      throw new ApiError({ message: 'Apple sign-in was cancelled.', status: 0, code: 'APPLE_CANCELLED' });
    }
    throw new ApiError({ message: 'Apple sign-in failed. Please try again.', status: 0, code: 'APPLE_FAILED' });
  }

  if (!response.identityToken) {
    throw new ApiError({ message: 'Apple sign-in failed. Please try again.', status: 0, code: 'APPLE_FAILED' });
  }

  // Apple shares the name only on the first authorization, and never in the token.
  const fullName = [response.fullName?.givenName, response.fullName?.familyName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return authApi.appleIdToken({
    identityToken: response.identityToken,
    nonce: response.nonce,
    authorizationCode: response.authorizationCode ?? undefined,
    fullName: fullName || undefined,
    referralCode,
  });
}
