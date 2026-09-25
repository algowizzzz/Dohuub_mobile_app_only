import { create } from 'zustand';
import {
  commerceApi,
  type ApiCart,
  type ApiCartsResponse,
  type ApiCheckout,
  type ApiCheckoutPreview,
  type ApiCommerceOrder,
} from '../services/commerceApi';

type CartSnapshot = {
  /** One cart per store the customer is buying from. */
  carts: ApiCart[];
  /** Total quantity across every store cart. */
  itemCount: number;
  subtotal: number;
};

type CommerceState = CartSnapshot & {
  /** Most recently updated cart; kept for screens written before multi-store. */
  cart: ApiCart | null;
  cartLoading: boolean;
  orders: ApiCommerceOrder[];
  ordersLoading: boolean;
  error: string | null;
  loadCart: () => Promise<ApiCart[]>;
  setQuantity: (productId: string, quantity: number) => Promise<ApiCart[]>;
  /** Clears one store's cart, or every cart when `storeId` is omitted. */
  clearCart: (storeId?: string) => Promise<void>;
  /** Forget the cart locally (sign-out). */
  resetCart: () => void;
  preview: (payload?: {
    deliveryAddressId?: string;
    pointsToRedeem?: number;
    storeIds?: string[];
  }) => Promise<ApiCheckoutPreview>;
  /** Creates one checkout (one order per store) and clears those carts. */
  createCheckout: (payload: {
    deliveryAddressId: string;
    pointsToRedeem?: number;
    notes?: string;
    storeIds?: string[];
  }) => Promise<{ checkout: ApiCheckout | null; order: ApiCommerceOrder }>;
  payCheckout: (
    id: string,
    opts?: { paymentMethodId?: string; confirmNow?: boolean },
  ) => Promise<{ checkout: ApiCheckout; clientSecret?: string }>;
  getCheckout: (id: string) => Promise<ApiCheckout>;
  payOrder: (
    id: string,
    opts?: { paymentMethodId?: string; confirmNow?: boolean },
  ) => Promise<any>;
  loadOrders: (params?: Record<string, unknown>) => Promise<ApiCommerceOrder[]>;
  getOrder: (id: string) => Promise<ApiCommerceOrder>;
};

const EMPTY: CartSnapshot & { cart: null } = { carts: [], itemCount: 0, subtotal: 0, cart: null };

/** Accepts the multi-store shape and the legacy `{ cart }` shape alike. */
function toSnapshot(data: ApiCartsResponse | null | undefined): CartSnapshot & {
  cart: ApiCart | null;
} {
  if (!data) return EMPTY;
  const carts = (data.carts ?? (data.cart ? [data.cart] : [])).filter(
    c => (c.items?.length ?? 0) > 0,
  );
  const itemCount =
    data.itemCount ??
    carts.reduce(
      (sum, c) => sum + (c.itemCount ?? c.items.reduce((n, i) => n + i.quantity, 0)),
      0,
    );
  const subtotal = data.subtotal ?? carts.reduce((sum, c) => sum + Number(c.subtotal || 0), 0);
  return {
    carts,
    itemCount: Number(itemCount) || 0,
    subtotal: Number(subtotal) || 0,
    cart: data.cart ?? carts[0] ?? null,
  };
}

/**
 * Bumped when a cart write starts and again when it lands, so a read that
 * overlapped a write — started before it, or while it was still in flight —
 * can never overwrite the newer cart the write returned.
 */
let cartVersion = 0;

export const useCommerceStore = create<CommerceState>(set => ({
  ...EMPTY,
  cartLoading: false,
  orders: [],
  ordersLoading: false,
  error: null,

  loadCart: async () => {
    const version = cartVersion;
    set({ cartLoading: true, error: null });
    try {
      const snapshot = toSnapshot(await commerceApi.getCart());
      if (version === cartVersion) set({ ...snapshot, cartLoading: false });
      else set({ cartLoading: false });
      return snapshot.carts;
    } catch (err) {
      set({ cartLoading: false, error: (err as Error).message });
      throw err;
    }
  },

  setQuantity: async (productId, quantity) => {
    cartVersion += 1;
    set({ error: null });
    try {
      const snapshot = toSnapshot(
        await commerceApi.upsertCartItem({ productId, quantity: Math.max(0, quantity) }),
      );
      cartVersion += 1;
      set(snapshot);
      return snapshot.carts;
    } catch (err) {
      cartVersion += 1;
      set({ error: (err as Error).message });
      throw err;
    }
  },

  clearCart: async storeId => {
    cartVersion += 1;
    await commerceApi.clearCart(storeId);
    cartVersion += 1;
    if (!storeId) {
      set(EMPTY);
      return;
    }
    set(state =>
      toSnapshot({ carts: state.carts.filter(c => cartStoreKey(c) !== storeId) }),
    );
  },

  resetCart: () => {
    cartVersion += 1;
    set({ ...EMPTY, cartLoading: false, orders: [] });
  },

  preview: async payload => commerceApi.previewCheckout(payload),

  createCheckout: async payload => {
    const data = await commerceApi.createOrder(payload);
    cartVersion += 1;
    set(state => {
      if (!payload.storeIds?.length) return EMPTY;
      const paid = new Set(payload.storeIds);
      return toSnapshot({ carts: state.carts.filter(c => !paid.has(cartStoreKey(c))) });
    });
    return { checkout: data.checkout ?? null, order: data.order };
  },

  payCheckout: async (id, opts) => commerceApi.payCheckout(id, opts),

  getCheckout: async id => {
    const data = await commerceApi.getCheckout(id);
    return data.checkout;
  },

  payOrder: async (id, opts) => commerceApi.payOrder(id, opts),

  loadOrders: async (params = {}) => {
    set({ ordersLoading: true, error: null });
    try {
      const { items } = await commerceApi.listMyOrders({ limit: 50, ...params });
      set({ orders: items, ordersLoading: false });
      return items;
    } catch (err) {
      set({ ordersLoading: false, error: (err as Error).message });
      throw err;
    }
  },

  getOrder: async id => {
    const data = await commerceApi.getOrder(id);
    return data.order;
  },
}));

/** Store key used to group cart rows (older payloads may omit storeId). */
export const cartStoreKey = (cart: ApiCart) => cart.storeId ?? cart.store?.id ?? cart.id;
