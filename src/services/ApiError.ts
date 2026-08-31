type ApiErrorInit = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
  requestId?: string | null;
};

type EnvelopeError = {
  message?: string;
  error?: { code?: string; message?: string; details?: unknown };
};

const FIELD_LABELS: Record<string, string> = {
  email: 'Email',
  password: 'Password',
  fullName: 'Full name',
  phoneNumber: 'Phone number',
  phone: 'Phone number',
  referralCode: 'Referral code',
  otp: 'Code',
  address: 'Address',
  city: 'City',
  state: 'State',
  zipCode: 'Zip code',
};

const GENERIC_VALIDATION = /^(the request did not pass validation|validation failed)$/i;

const CODE_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: 'Could not reach the server. Check your internet connection and try again.',
  TIMEOUT: 'The request timed out. Check your connection and try again.',
  EMAIL_TAKEN: 'An account with this email already exists. Sign in instead.',
  PROVIDER_MISMATCH: 'This email is already registered with Google. Sign in with Google instead.',
  RATE_LIMITED: 'Too many attempts. Please wait a moment and try again.',
  INVALID_CREDENTIALS: 'Email or password is incorrect.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address before signing in.',
  OTP_INVALID: 'The code you entered is incorrect.',
  OTP_EXPIRED: 'This code has expired. Request a new one.',
  OTP_ALREADY_USED: 'This code has already been used.',
  OTP_NOT_REQUESTED: 'No verification code has been requested.',
  REFERRAL_INVALID: 'That referral code is not valid.',
  ACCOUNT_BLOCKED: 'This account has been suspended. Contact support for help.',
  ACCOUNT_NOT_FOUND: 'This account no longer exists.',
  NOT_A_CUSTOMER: 'This app is for customers. Sign in with a customer account.',
  VALIDATION_ERROR: 'Please check your details and try again.',
  GOOGLE_UNAVAILABLE: 'Google sign-in is unavailable right now.',
  GOOGLE_DENIED: 'Google sign-in failed.',
};

function prettyField(raw: string): string {
  const field = raw.replace(/^(body|query|params)\./, '');
  return FIELD_LABELS[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
}

function messagesFromDetails(details: unknown): string[] {
  if (!details) return [];

  if (typeof details === 'string') return [details];

  if (Array.isArray(details)) {
    return details
      .map(item => {
        if (typeof item === 'string') return item;
        if (!item || typeof item !== 'object') return '';
        const row = item as { field?: string; message?: string };
        if (!row.message) return '';
        const field = row.field ? prettyField(String(row.field)) : '';
        if (!field || field === 'Body') return row.message;
        if (row.message.toLowerCase().startsWith(field.toLowerCase())) return row.message;
        return `${field}: ${row.message}`;
      })
      .filter(Boolean);
  }

  if (typeof details === 'object') {
    return Object.entries(details as Record<string, unknown>)
      .map(([key, value]) => {
        const label = prettyField(key);
        const text = typeof value === 'string' ? value : JSON.stringify(value);
        return text ? `${label}: ${text}` : '';
      })
      .filter(Boolean);
  }

  return [];
}

function normalizeEnvelope(body: unknown): EnvelopeError | undefined {
  if (!body) return undefined;
  if (typeof body === 'string') {
    const trimmed = body.trim();
    if (!trimmed || trimmed.startsWith('<')) return undefined;
    if (trimmed.startsWith('{')) {
      try {
        return JSON.parse(trimmed) as EnvelopeError;
      } catch {
        return { message: trimmed };
      }
    }
    return { message: trimmed };
  }
  if (typeof body === 'object') return body as EnvelopeError;
  return undefined;
}

export function messageFromEnvelope(
  body: unknown,
  fallback: string,
  extras?: { code?: string; axiosMessage?: string },
): string {
  const envelope = normalizeEnvelope(body);
  const code = envelope?.error?.code || extras?.code || '';
  const detailLines = messagesFromDetails(envelope?.error?.details);
  if (detailLines.length > 0) return detailLines.join('\n');

  const fromBody = envelope?.error?.message || envelope?.message;
  if (fromBody && !GENERIC_VALIDATION.test(fromBody) && !/^request failed with status code/i.test(fromBody)) {
    return fromBody;
  }

  if (code && CODE_MESSAGES[code]) return CODE_MESSAGES[code];

  const axiosMessage = extras?.axiosMessage || '';
  if (/timeout/i.test(axiosMessage)) return CODE_MESSAGES.TIMEOUT;
  if (/network error/i.test(axiosMessage) || extras?.code === 'NETWORK_ERROR') {
    return CODE_MESSAGES.NETWORK_ERROR;
  }

  if (fromBody && !GENERIC_VALIDATION.test(fromBody) && !/^request failed with status code/i.test(fromBody)) {
    return fromBody;
  }
  return fallback;
}

export class ApiError extends Error {
  status: number;
  code: string;
  details: unknown;
  requestId: string | null;

  constructor({ message, status = 0, code = 'UNKNOWN', details = null, requestId = null }: ApiErrorInit) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }

  get isNetwork(): boolean {
    return this.status === 0 || this.code === 'NETWORK_ERROR' || this.code === 'TIMEOUT';
  }

  get isCancelled(): boolean {
    return this.code === 'GOOGLE_CANCELLED';
  }

  static messageOf(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
    if (err instanceof ApiError) {
      return err.message?.trim() || fallback;
    }
    if (err instanceof Error && err.message.trim()) {
      if (/status code|network error|timeout of /i.test(err.message)) {
        return /timeout/i.test(err.message) ? CODE_MESSAGES.TIMEOUT : CODE_MESSAGES.NETWORK_ERROR;
      }
      return err.message;
    }
    return fallback;
  }
}
