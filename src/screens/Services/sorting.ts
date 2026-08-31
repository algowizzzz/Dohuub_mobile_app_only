export type SortKey = 'top_rated' | 'nearest' | 'price_low' | 'price_high';

export const SORT_LABELS: Record<SortKey, string> = {
  top_rated: 'Top rated',
  nearest: 'Nearest',
  price_low: 'Price: Low to High',
  price_high: 'Price: High to Low',
};

export const SORT_KEYS: SortKey[] = ['top_rated', 'nearest', 'price_low', 'price_high'];
