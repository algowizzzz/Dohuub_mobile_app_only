import { get, patch, post, del } from './http';
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

  completeOnboarding: () => post<{ user: ApiUser }>('/users/me/complete-onboarding'),

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

export const uploadsApi = {
  limits: () => get<Record<string, unknown>>('/uploads/limits'),
  removeImage: (key: string) => del<void>('/uploads', { data: { key } } as never),

  /** Up to 5 images in one request; resolves to their public URLs in order. */
  images: (
    files: Array<{ uri: string; name: string; type: string }>,
    folder: 'services' | 'vendors' | 'users' | 'reviews' | 'documents' | 'misc' = 'misc',
  ) => {
    const form = new FormData();
    files.forEach(file => form.append('files', file as unknown as Blob));
    return post<{ files: Array<{ url: string | null; key: string }> }>('/uploads/images', form, {
      params: { folder },
      timeout: 60000,
    }).then(r => r.files.map(f => f.url).filter((u): u is string => !!u));
  },
};
