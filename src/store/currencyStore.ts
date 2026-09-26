import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { fxApi, type ApiCurrency } from '../services/fxApi';
import { deviceCurrency, formatMoney, type FormatMoneyOptions } from '../utils/currency';

type CurrencyState = {
  /** The buyer's pick in Profile → Display currency; null follows the device region. */
  override: string | null;
  /** Guessed from the device region at launch. */
  deviceDefault: string;
  /** USD-based rates, fetched once per app session. */
  rates: Record<string, number> | null;
  ratesUpdatedAt: string | null;
  currencies: ApiCurrency[];
  setOverride: (code: string | null) => void;
  loadRates: (force?: boolean) => Promise<void>;
  loadCurrencies: () => Promise<ApiCurrency[]>;
};

let ratesRequest: Promise<void> | null = null;
let currenciesRequest: Promise<ApiCurrency[]> | null = null;

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      override: null,
      deviceDefault: deviceCurrency(),
      rates: null,
      ratesUpdatedAt: null,
      currencies: [],

      setOverride: code => set({ override: code ? code.toUpperCase() : null }),

      loadRates: (force = false) => {
        if (ratesRequest && !force) return ratesRequest;
        ratesRequest = fxApi
          .rates('USD')
          .then(data => {
            set({ rates: { USD: 1, ...(data?.rates ?? {}) }, ratesUpdatedAt: data?.updatedAt ?? null });
          })
          .catch(() => {
            // Leave the session free to retry; prices just show without a conversion.
            ratesRequest = null;
          });
        return ratesRequest;
      },

      loadCurrencies: () => {
        if (get().currencies.length) return Promise.resolve(get().currencies);
        if (currenciesRequest) return currenciesRequest;
        currenciesRequest = fxApi
          .currencies()
          .then(list => {
            set({ currencies: list });
            return list;
          })
          .catch(err => {
            currenciesRequest = null;
            throw err;
          });
        return currenciesRequest;
      },
    }),
    {
      name: 'dohuub-display-currency',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ override: state.override }),
    },
  ),
);

/** The currency prices are converted into for this buyer. */
export const useDisplayCurrency = () =>
  useCurrencyStore(state => state.override ?? state.deviceDefault);

/**
 * A formatter for places that need a plain string (button labels,
 * accessibility text): the real price in its own currency, no conversion.
 */
export function useFormatMoney() {
  const display = useDisplayCurrency();
  return useCallback(
    (amount: number | string | null | undefined, currency: string | null | undefined, options?: FormatMoneyOptions) =>
      formatMoney(amount, currency, { displayCurrency: display, ...options }),
    [display],
  );
}
