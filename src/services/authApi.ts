import { get, post } from './http';
import type { ApiUser, Session } from '../store/sessionStore';

export type UserType = 'user' | 'vendor';

type AuthResponse = { user: ApiUser; session: Session };

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    post<AuthResponse>('/auth/login', payload, { skipAuth: true }),

  register: (payload: {
    email: string;
    password: string;
    fullName: string;
    userType: UserType;
    phoneNumber?: string;
    referralCode?: string;
  }) => post<{ user: ApiUser }>('/auth/register', payload, { skipAuth: true }),

  requestEmailOtp: (email: string) =>
    post<{ sent: boolean }>('/auth/email/otp/request', { email }, { skipAuth: true }),

  verifyEmailOtp: (payload: { email: string; otp: string }) =>
    post<{ user: ApiUser; session?: Session }>('/auth/email/otp/verify', payload, { skipAuth: true }),

  me: () => get<{ user: ApiUser }>('/auth/me'),

  refresh: (refreshToken: string) =>
    post<{ session: Session }>('/auth/refresh', { refreshToken }, { skipAuth: true }),

  logout: () => post<void>('/auth/logout'),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    post<void>('/auth/password/change', payload),

  forgotPassword: (payload: { email: string }) =>
    post<{ sent: boolean }>('/auth/password/forgot', payload, { skipAuth: true }),

  resetPassword: (payload: { token: string; newPassword: string }) =>
    post<void>('/auth/password/reset', payload, { skipAuth: true }),

  googleUrl: (redirectTo?: string) =>
    get<{ url: string; provider: string; codeVerifier?: string }>('/auth/google/url', {
      skipAuth: true,
      params: { redirectTo },
    }),

  googleCallback: (payload: { code: string; codeVerifier?: string; referralCode?: string }) =>
    post<AuthResponse>('/auth/google/callback', payload, { skipAuth: true }),

  googleIdToken: (payload: { idToken: string; referralCode?: string }) =>
    post<AuthResponse>('/auth/google/id-token', payload, { skipAuth: true }),

  requestPhoneOtp: (phoneNumber: string) =>
    post<{ sent: boolean }>('/auth/phone/otp/request', { phoneNumber }),

  verifyPhoneOtp: (otp: string) => post<void>('/auth/phone/otp/verify', { otp }),
};
