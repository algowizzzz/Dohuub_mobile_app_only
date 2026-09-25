import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { ENV } from '../config/env';
import { useSessionStore } from '../store/sessionStore';
import { ApiError, messageFromEnvelope } from './ApiError';
import { apiLog } from './logger';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
    __retried?: boolean;
  }
}

type Envelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: { code?: string; message?: string; details?: unknown };
  requestId?: string;
  meta?: { pagination?: Pagination; [key: string]: unknown };
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type Page<T> = {
  items: T[];
  pagination: Pagination | null;
};

let requestCounter = 0;

type CryptoWithRandomUUID = { randomUUID?: () => string };

function makeRequestId(): string {
  const cryptoRef = (globalThis as { crypto?: CryptoWithRandomUUID }).crypto;
  if (typeof cryptoRef?.randomUUID === 'function') {
    return cryptoRef.randomUUID();
  }
  requestCounter += 1;
  return `req_${Date.now()}_${requestCounter}`;
}

const NO_REFRESH = ['/auth/login', '/auth/refresh', '/auth/register', '/auth/logout'];

export const http = axios.create({
  baseURL: ENV.apiUrl,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use(config => {
  const requestId = makeRequestId();
  config.headers = config.headers ?? {};
  config.headers['X-Request-Id'] = requestId;

  if (!config.skipAuth) {
    const { accessToken } = useSessionStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  apiLog.request(config.method ?? 'get', config.url ?? '', config.data);
  return config;
});

/**
 * - `ok`: new tokens stored, retry the request.
 * - `rejected`: the server refused the refresh token (400/401) — the session is dead.
 * - `failed`: network error, timeout or 5xx — the session may still be fine, keep it.
 */
type RefreshResult =
  | { kind: 'ok'; accessToken: string }
  | { kind: 'rejected' }
  | { kind: 'failed' };

let refreshing: Promise<RefreshResult> | null = null;

async function refreshSession(): Promise<RefreshResult> {
  if (refreshing) return refreshing;

  refreshing = (async (): Promise<RefreshResult> => {
    const { refreshToken } = useSessionStore.getState();
    if (!refreshToken) return { kind: 'rejected' };

    try {
      const response = await axios.post<Envelope<{ session: { accessToken: string; refreshToken: string; expiresAt: string } }>>(
        `${ENV.apiUrl}/auth/refresh`,
        { refreshToken },
      );
      const session = response.data?.data?.session;
      if (!session) return { kind: 'failed' };

      useSessionStore.getState().setSession(session);
      return { kind: 'ok', accessToken: session.accessToken };
    } catch (err) {
      const refreshStatus = axios.isAxiosError(err) ? err.response?.status ?? 0 : 0;
      return refreshStatus === 400 || refreshStatus === 401 ? { kind: 'rejected' } : { kind: 'failed' };
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

http.interceptors.response.use(
  response => {
    apiLog.success(response.config.method ?? 'get', response.config.url ?? '', response.data);
    return response;
  },
  async (error: AxiosError<Envelope<unknown>>) => {
    const config = error.config as AxiosRequestConfig | undefined;
    const status = error.response?.status ?? 0;
    const body = error.response?.data;
    const url = config?.url ?? '';

    const isRefreshable =
      status === 401 &&
      config &&
      !config.__retried &&
      !config.skipAuth &&
      !NO_REFRESH.some(path => url.includes(path));

    let refreshFailed = false;
    if (isRefreshable) {
      const result = await refreshSession();
      if (result.kind === 'ok') {
        config.__retried = true;
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization = `Bearer ${result.accessToken}`;
        return http.request(config);
      }
      if (result.kind === 'rejected') {
        useSessionStore.getState().clear();
      } else {
        // Offline / server hiccup: keep the session and report a network
        // error rather than a 401, so callers (e.g. restore) don't sign out.
        refreshFailed = true;
      }
    }

    if (refreshFailed) {
      const apiError = new ApiError({
        message: 'Could not reach DoHuub. Check your connection and try again.',
        status: 0,
        code: 'NETWORK_ERROR',
        details: null,
        requestId: body?.requestId ?? null,
      });
      apiLog.failure(config?.method ?? 'get', url, apiError);
      return Promise.reject(apiError);
    }

    const axiosMessage = error.message || '';
    const code =
      body?.error?.code ||
      (status === 0
        ? /timeout/i.test(axiosMessage)
          ? 'TIMEOUT'
          : 'NETWORK_ERROR'
        : 'HTTP_ERROR');

    const apiError = new ApiError({
      message: messageFromEnvelope(body, 'Something went wrong. Please try again.', {
        code,
        axiosMessage,
      }),
      status,
      code,
      details: body?.error?.details ?? body?.error ?? null,
      requestId: body?.requestId ?? null,
    });

    apiLog.failure(config?.method ?? 'get', url, apiError);
    return Promise.reject(apiError);
  },
);

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await http.request<Envelope<T>>(config);
  return response.data?.data as T;
}

export async function requestPage<T>(config: AxiosRequestConfig): Promise<Page<T>> {
  const response = await http.request<Envelope<T[] | { items: T[] }>>(config);
  const body = response.data;
  const data = body?.data;
  const items = Array.isArray(data) ? data : (data as { items?: T[] })?.items ?? [];
  const pagination = body?.meta?.pagination ?? null;
  return { items, pagination };
}

export function get<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...options, method: 'get', url });
}

export function post<T>(url: string, data?: unknown, options?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...options, method: 'post', url, data });
}

export function patch<T>(url: string, data?: unknown, options?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...options, method: 'patch', url, data });
}

export function put<T>(url: string, data?: unknown, options?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...options, method: 'put', url, data });
}

export function del<T>(url: string, options?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...options, method: 'delete', url });
}

export function getPage<T>(url: string, options?: AxiosRequestConfig): Promise<Page<T>> {
  return requestPage<T>({ ...options, method: 'get', url });
}

export { ApiError };
