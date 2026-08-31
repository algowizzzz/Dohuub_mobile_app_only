import { ENV } from '../config/env';

const SECRET_KEYS = new Set([
  'password',
  'currentpassword',
  'newpassword',
  'pendingpassword',
  'accesstoken',
  'refreshtoken',
  'token',
  'authorization',
  'otp',
]);

export function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [
        key,
        SECRET_KEYS.has(key.toLowerCase()) ? '[REDACTED]' : redact(val),
      ]),
    );
  }

  return value;
}

function log(...args: unknown[]) {
  if (!ENV.apiLogsEnabled) return;
  // eslint-disable-next-line no-console
  console.log(...args);
}

export const apiLog = {
  request(method: string, url: string, data?: unknown) {
    log(`[API →] ${method.toUpperCase()} ${url}`, data ? redact(data) : '');
  },
  success(method: string, url: string, data?: unknown) {
    log(`[API ✓] ${method.toUpperCase()} ${url}`, data ? redact(data) : '');
  },
  failure(method: string, url: string, error: unknown) {
    log(`[API ✗] ${method.toUpperCase()} ${url}`, error);
  },
  event(name: string, data?: unknown) {
    log(`[API event] ${name}`, data ? redact(data) : '');
  },
};
