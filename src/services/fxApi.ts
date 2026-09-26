import { get } from './http';

export type ApiCurrency = { code: string; name: string; symbol: string; decimals: number };

export type ApiFxRates = {
  base: string;
  /** `rates[X]` = how many X one unit of `base` buys. */
  rates: Record<string, number>;
  updatedAt?: string;
  source?: string;
};

/** Public exchange-rate endpoints; converted amounts are display-only. */
export const fxApi = {
  currencies: () =>
    get<{ currencies: ApiCurrency[] }>('/fx/currencies', { skipAuth: true }).then(
      r => r.currencies ?? [],
    ),

  rates: (base = 'USD') => get<ApiFxRates>('/fx/rates', { skipAuth: true, params: { base } }),
};
