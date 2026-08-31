import { get, patch, post, put, del } from './http';
import type { ApiUser } from '../store/sessionStore';

export type PlatformConfig = {
  password?: { minLength?: number; requireUppercase?: boolean; requireNumber?: boolean };
  commissionPercentage?: number;
  payments?: { publishableKey?: string };
  [key: string]: unknown;
};

export const configApi = {
  get: () => get<PlatformConfig>('/config', { skipAuth: true }),
};

export const usersApi = {
  me: () => get<{ user: ApiUser }>('/users/me'),

  update: (payload: { fullName?: string; phoneNumber?: string; timezone?: string; language?: string }) =>
    patch<{ user: ApiUser }>('/users/me', payload),

  dashboard: () => get<Record<string, unknown>>('/users/me/dashboard'),

  deleteMe: () => del<void>('/users/me', { data: { confirm: true } } as never),

  preferences: () =>
    get<{ preferences: Record<string, unknown> }>('/users/me/preferences').then(
      r => r.preferences,
    ),

  updatePreferences: (payload: Record<string, unknown>) =>
    patch<{ preferences: Record<string, unknown> }>('/users/me/preferences', payload).then(
      r => r.preferences,
    ),

  changeEmail: (email: string, redirectTo?: string) =>
    post<void>('/users/me/email', { email, redirectTo }),

  uploadAvatar: (file: { uri: string; name: string; type: string }) => {
    const form = new FormData();
    form.append('image', file as unknown as Blob);
    return post<{ user: ApiUser; file: { url: string; key: string } }>(
      '/users/me/avatar',
      form,
      { timeout: 60000 },
    );
  },
};

export const vendorApi = {
  myProfile: () =>
    get<{ vendor: Record<string, unknown> }>('/vendors/me/profile').then(r => r.vendor),
  saveProfile: (payload: Record<string, unknown>) =>
    post<{ vendor: Record<string, unknown> }>('/vendors/me/profile', payload).then(r => r.vendor),
  updateProfile: (payload: Record<string, unknown>) =>
    patch<{ vendor: Record<string, unknown> }>('/vendors/me/profile', payload).then(r => r.vendor),
  dashboard: () => get<Record<string, unknown>>('/vendors/me/dashboard'),
  earnings: () => get<Record<string, unknown>>('/vendors/me/earnings'),
  startStripeOnboarding: () => post<{ url: string }>('/vendors/me/stripe/onboarding'),
  stripeStatus: () => get<Record<string, unknown>>('/vendors/me/stripe/status'),
  stripeDashboard: () => get<{ url: string }>('/vendors/me/stripe/dashboard'),
  hours: () => get<Record<string, unknown>>('/vendors/me/hours'),
  saveHours: (payload: Record<string, unknown>) =>
    put<Record<string, unknown>>('/vendors/me/hours', payload),
  availability: (id: string, date: string) =>
    get<Record<string, unknown>>(`/vendors/${id}/availability`, { skipAuth: true, params: { date } }),
};

export const uploadsApi = {
  limits: () => get<Record<string, unknown>>('/uploads/limits'),
  removeImage: (key: string) => del<void>('/uploads', { data: { key } } as never),
};
