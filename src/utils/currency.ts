import { NativeModules, Platform } from 'react-native';

/** Euro-area (and euro-using) regions. */
const EURO_REGIONS = [
  'AT', 'BE', 'CY', 'DE', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'IE', 'IT', 'LT', 'LU', 'LV',
  'MT', 'NL', 'PT', 'SI', 'SK', 'AD', 'MC', 'SM', 'VA', 'ME', 'XK',
];

const REGION_CURRENCY: Record<string, string> = {
  US: 'USD', PR: 'USD', GU: 'USD', VI: 'USD', AS: 'USD', EC: 'USD', SV: 'USD', PA: 'USD',
  JM: 'JMD', GB: 'GBP', CA: 'CAD', AU: 'AUD', NZ: 'NZD', IN: 'INR', NG: 'NGN', GH: 'GHS',
  KE: 'KES', ZA: 'ZAR', TT: 'TTD', BB: 'BBD', BS: 'BSD', KY: 'KYD', BZ: 'BZD', GY: 'GYD',
  HT: 'HTG', DO: 'DOP', CU: 'CUP', AG: 'XCD', DM: 'XCD', GD: 'XCD', KN: 'XCD', LC: 'XCD',
  VC: 'XCD', MX: 'MXN', BR: 'BRL', AR: 'ARS', CL: 'CLP', CO: 'COP', PE: 'PEN', UY: 'UYU',
  CH: 'CHF', LI: 'CHF', SE: 'SEK', NO: 'NOK', DK: 'DKK', IS: 'ISK', PL: 'PLN', CZ: 'CZK',
  HU: 'HUF', RO: 'RON', BG: 'BGN', RS: 'RSD', UA: 'UAH', TR: 'TRY', RU: 'RUB', IL: 'ILS',
  AE: 'AED', SA: 'SAR', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR', EG: 'EGP', MA: 'MAD',
  JP: 'JPY', CN: 'CNY', HK: 'HKD', TW: 'TWD', KR: 'KRW', SG: 'SGD', MY: 'MYR', TH: 'THB',
  ID: 'IDR', PH: 'PHP', VN: 'VND', PK: 'PKR', BD: 'BDT', LK: 'LKR', NP: 'NPR',
  ...Object.fromEntries(EURO_REGIONS.map(r => [r, 'EUR'])),
};

/** Symbols that name exactly one currency, so they read clearly on their own. */
const UNIQUE_SYMBOLS: Record<string, string> = {
  EUR: '€',
  GBP: '£',
  INR: '₹',
  NGN: '₦',
  KRW: '₩',
  PHP: '₱',
  ILS: '₪',
  VND: '₫',
  UAH: '₴',
  GHS: '₵',
  TRY: '₺',
};

const ZERO_DECIMAL = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW', 'PYG', 'RWF', 'UGX', 'VND', 'VUV',
  'XAF', 'XOF', 'XPF',
]);

function regionFromLocale(locale: string | undefined | null): string | null {
  if (!locale) return null;
  const parts = locale.replace(/@.*$/, '').split(/[-_]/);
  for (let i = parts.length - 1; i > 0; i -= 1) {
    if (/^[A-Za-z]{2}$/.test(parts[i])) return parts[i].toUpperCase();
  }
  return null;
}

function deviceLocales(): string[] {
  const out: string[] = [];
  try {
    if (Platform.OS === 'ios') {
      const settings = NativeModules.SettingsManager?.settings ?? {};
      if (settings.AppleLocale) out.push(settings.AppleLocale);
      if (Array.isArray(settings.AppleLanguages)) out.push(...settings.AppleLanguages);
    } else {
      const id = NativeModules.I18nManager?.localeIdentifier;
      if (id) out.push(id);
    }
  } catch {
    // Native settings unavailable — fall through to Intl.
  }
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale) out.push(locale);
  } catch {
    // Intl unavailable on this engine.
  }
  return out;
}

/** The buyer's default display currency, guessed from the device region (USD when unknown). */
export function deviceCurrency(): string {
  for (const locale of deviceLocales()) {
    const region = regionFromLocale(locale);
    if (region && REGION_CURRENCY[region]) return REGION_CURRENCY[region];
  }
  return 'USD';
}

export function normalizeCurrency(code: string | null | undefined): string {
  const c = (code ?? '').trim().toUpperCase();
  return /^[A-Z]{3}$/.test(c) ? c : 'USD';
}

export function currencyDecimals(code: string, known?: number): number {
  if (typeof known === 'number' && known >= 0) return known;
  return ZERO_DECIMAL.has(code) ? 0 : 2;
}

function groupThousands(n: string): string {
  return n.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatNumber(amount: number, decimals: number, compact: boolean): string {
  const abs = Math.abs(amount);
  const fixed = abs.toFixed(decimals);
  const [whole, frac] = fixed.split('.');
  const trimmed = compact && frac && /^0+$/.test(frac) ? undefined : frac;
  return trimmed ? `${groupThousands(whole)}.${trimmed}` : groupThousands(whole);
}

export type FormatMoneyOptions = {
  /** The buyer's display currency; a USD price only drops to a bare "$" when this is USD too. */
  displayCurrency?: string;
  /** Drop ".00" on whole amounts. */
  compact?: boolean;
  /** Always write the ISO code ("USD 12.40") instead of a symbol. */
  codeOnly?: boolean;
  decimals?: number;
};

/**
 * A price in its own currency with an unambiguous marker: "$12.40" only for USD
 * shown to a USD buyer, "US$12.40" for USD elsewhere, "€12.40" for unique
 * symbols, otherwise "JMD 1,200.00".
 */
export function formatMoney(
  amount: number | string | null | undefined,
  currency: string | null | undefined,
  options: FormatMoneyOptions = {},
): string {
  const code = normalizeCurrency(currency);
  const value = Number(amount) || 0;
  const sign = value < 0 ? '-' : '';
  const num = formatNumber(value, currencyDecimals(code, options.decimals), Boolean(options.compact));
  if (options.codeOnly) return `${sign}${code} ${num}`;
  if (code === 'USD') {
    const display = options.displayCurrency ? normalizeCurrency(options.displayCurrency) : 'USD';
    return `${sign}${display === 'USD' ? '$' : 'US$'}${num}`;
  }
  const symbol = UNIQUE_SYMBOLS[code];
  return symbol ? `${sign}${symbol}${num}` : `${sign}${code} ${num}`;
}

/** `amount` of `from` in `to`, using USD-based rates; null when either rate is missing. */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number> | null | undefined,
): number | null {
  if (from === to) return amount;
  if (!rates) return null;
  const a = from === 'USD' ? 1 : rates[from];
  const b = to === 'USD' ? 1 : rates[to];
  if (!a || !b || !Number.isFinite(a) || !Number.isFinite(b)) return null;
  return (amount * b) / a;
}
