import { del, get, post } from './http';
import type { ApiProduct } from './commerceApi';
import type { ApiServiceListing } from './catalogApi';

export type WishlistItemType = 'product' | 'service';

/** One saved product or service on the customer's Shopping List. */
export type ApiWishlistItem = {
  id: string;
  type: WishlistItemType;
  productId?: string | null;
  serviceId?: string | null;
  product?:
    | (ApiProduct & {
        store?: { id: string; name: string; image?: string | null } | null;
        vendor?: { id: string; businessName: string } | null;
      })
    | null;
  service?: ApiServiceListing | null;
  createdAt: string;
};

export type WishlistTarget = { productId: string } | { serviceId: string };

export const wishlistApi = {
  list: () => get<{ items: ApiWishlistItem[] }>('/wishlist'),

  ids: () => get<{ productIds: string[]; serviceIds: string[] }>('/wishlist/ids'),

  /** Idempotent: saving an item twice returns the existing row. */
  add: (target: WishlistTarget) => post<{ item: ApiWishlistItem }>('/wishlist', target),

  remove: (id: string) => del<unknown>(`/wishlist/${id}`),

  removeByTarget: (target: WishlistTarget) => del<unknown>('/wishlist', { params: target }),
};
