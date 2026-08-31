import { Platform } from 'react-native';
import {
  API_URL,
  API_LOGS,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_RETURN_URL,
  GOOGLE_AUTH_REDIRECT_URL,
  GOOGLE_MAPS_API_KEY,
} from '@env';

function resolveApiUrl(): string {
  if (API_URL && !API_URL.includes('localhost')) return API_URL;

  if (Platform.OS === 'android') {
    return (API_URL || 'http://localhost:4000/api/v1').replace('localhost', '10.0.2.2');
  }

  return API_URL || 'http://localhost:4000/api/v1';
}

export const ENV = {
  apiUrl: resolveApiUrl(),
  apiLogsEnabled: API_LOGS ? API_LOGS === 'true' : __DEV__,
  stripePublishableKey: STRIPE_PUBLISHABLE_KEY || '',
  stripeReturnUrl: STRIPE_RETURN_URL || 'dohuub://checkout/return',
  googleAuthRedirectUrl: GOOGLE_AUTH_REDIRECT_URL || 'dohuub://auth/google',
  googleMapsApiKey: GOOGLE_MAPS_API_KEY || '',
};
