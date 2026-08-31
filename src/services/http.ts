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

let refreshing: Promise<string | null> | null = null;

async function refreshSession(): Promise<string | null> {
  if (refreshing) return refreshing;

  refreshing = (async () => {
    const { refreshToken } = useSessionStore.getState();
    if (!refreshToken) return null;

    try {
      const response = await axios.post<Envelope<{ session: { accessToken: string; refreshToken: string; expiresAt: string } }>>(
        `${ENV.apiUrl}/auth/refresh`,
        { refreshToken },
      );
      const session = response.data?.data?.session;
      if (!session) return null;

      useSessionStore.getState().setSession(session);
      return session.accessToken;
    } catch {
      return null;
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

    if (isRefreshable) {
      const newToken = await refreshSession();
      if (newToken) {
        config.__retried = true;
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
        return http.request(config);
      }
      useSessionStore.getState().clear();
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
