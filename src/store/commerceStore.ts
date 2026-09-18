import { create } from 'zustand';
import {
  commerceApi,
  type ApiCart,
  type ApiCommerceOrder,
} from '../services/commerceApi';

type CommerceState = {
  cart: ApiCart | null;
  cartLoading: boolean;
  orders: ApiCommerceOrder[];
  ordersLoading: boolean;
  error: string | null;
  loadCart: () => Promise<ApiCart | null>;
  setQuantity: (
    productId: string,
    quantity: number,
    opts?: { replaceVendor?: boolean },
  ) => Promise<ApiCart | null>;
  clearCart: () => Promise<void>;
  preview: (payload?: { deliveryAddressId?: string; pointsToRedeem?: number }) => Promise<any>;
  createOrder: (payload: {
    deliveryAddressId: string;
    pointsToRedeem?: number;
    notes?: string;
  }) => Promise<ApiCommerceOrder>;
  payOrder: (
    id: string,
    opts?: { paymentMethodId?: string; confirmNow?: boolean },
  ) => Promise<any>;
  loadOrders: (params?: Record<string, unknown>) => Promise<ApiCommerceOrder[]>;
  getOrder: (id: string) => Promise<ApiCommerceOrder>;
};

export const useCommerceStore = create<CommerceState>((set) => ({
  cart: null,
  cartLoading: false,
  orders: [],
  ordersLoading: false,
  error: null,

  loadCart: async () => {
    set({ cartLoading: true, error: null });
    try {
      const data = await commerceApi.getCart();
      const cart = data?.cart ?? null;
      set({ cart, cartLoading: false });
      return cart;
    } catch (err) {
      set({ cartLoading: false, error: (err as Error).message });
      throw err;
    }
  },

  setQuantity: async (productId, quantity, opts = {}) => {
    set({ error: null });
    try {
      const data = await commerceApi.upsertCartItem({
        productId,
        quantity,
        replaceVendor: opts.replaceVendor,
      });
      const cart = data?.cart ?? null;
      set({ cart });
      return cart;
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    }
  },

  clearCart: async () => {
    await commerceApi.clearCart();
    set({ cart: null });
  },

  preview: async payload => commerceApi.previewCheckout(payload),

  createOrder: async payload => {
    const data = await commerceApi.createOrder(payload);
    const order = data.order;
    set({ cart: null });
    return order;
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
