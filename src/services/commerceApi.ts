import { del, get, getPage, patch, post, put, type Page } from './http';

export type ProductKind = 'food' | 'grocery' | 'beauty';

export type CommerceOrderStatus =
  | 'pending_payment'
  | 'placed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type ApiCommerceStore = {
  id: string;
  businessName: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  bio?: string | null;
  poweredByDoHuub?: boolean;
  ratingAverage?: number;
  ratingCount?: number;
  deliveryFee?: number;
  deliveryMinutesMin?: number;
  deliveryMinutesMax?: number;
  productCount?: number;
  cuisineTags?: string[];
  coverImage?: string | null;
  user?: { image?: string | null };
};

export type ApiProduct = {
  id: string;
  vendorId: string;
  kind: ProductKind;
  name: string;
  description?: string | null;
  image?: string | null;
  menuCategory: string;
  unitLabel?: string | null;
  price: number;
  discountedPrice?: number | null;
  effectivePrice?: number;
  currency: string;
  stockQty: number;
  pointsPerDollar?: number;
  isActive?: boolean;
};

export type ApiCartItem = {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: ApiProduct;
};

export type ApiCart = {
  id: string;
  vendorId: string;
  vendor: {
    id: string;
    businessName: string;
    poweredByDoHuub?: boolean;
    deliveryFee: number;
    deliveryMinutesMin: number;
    deliveryMinutesMax: number;
    image?: string | null;
  } | null;
  items: ApiCartItem[];
  itemCount: number;
  subtotal: number;
};

export type ApiCommerceOrder = {
  id: string;
  reference: string;
  status: CommerceOrderStatus;
  paymentStatus: string;
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  pointsEarned: number;
  pointsRedeemed: number;
  notes?: string | null;
  paidAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  vendor?: {
    id: string;
    businessName: string;
    poweredByDoHuub?: boolean;
    image?: string | null;
    deliveryMinutesMin?: number;
    deliveryMinutesMax?: number;
  };
  deliveryAddress?: {
    id: string;
    type?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  items: Array<{
    id: string;
    productId?: string | null;
    name: string;
    unitLabel?: string | null;
    image?: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }>;
  itemCount: number;
};

export const commerceApi = {
  listStores: (params: Record<string, unknown>) =>
    getPage<ApiCommerceStore>('/commerce/vendors', { params, skipAuth: true }),

  listProducts: (params: Record<string, unknown>) =>
    getPage<ApiProduct>('/commerce/products', { params, skipAuth: true }),

  getCart: () => get<{ cart: ApiCart | null }>('/commerce/cart'),

  upsertCartItem: (payload: { productId: string; quantity: number; replaceVendor?: boolean }) =>
    put<{ cart: ApiCart | null }>('/commerce/cart/items', payload),

  clearCart: () => del<{ cleared: boolean }>('/commerce/cart'),

  previewCheckout: (payload: { deliveryAddressId?: string; pointsToRedeem?: number } = {}) =>
    post<{
      cart: ApiCart;
      deliveryFee: number;
      taxAmount: number;
      taxRate: number;
      discountAmount: number;
      subtotal: number;
      totalAmount: number;
      pointsToRedeem: number;
      pointsYouEarn: number;
      currency: string;
    }>('/commerce/cart/checkout-preview', payload),

  createOrder: (payload: { deliveryAddressId: string; pointsToRedeem?: number; notes?: string }) =>
    post<{ order: ApiCommerceOrder }>('/commerce/orders', payload),

  payOrder: (
    id: string,
    payload: { paymentMethodId?: string; confirmNow?: boolean; returnUrl?: string } = {},
  ) =>
    post<{
      orderId: string;
      reference: string;
      paymentIntentId: string;
      clientSecret: string;
      status: string;
      amount: number;
      currency: string;
      requiresAction?: boolean;
    }>(`/commerce/orders/${id}/pay`, payload),

  listMyOrders: (params?: Record<string, unknown>): Promise<Page<ApiCommerceOrder>> =>
    getPage('/commerce/orders', { params }),

  getOrder: (id: string) => get<{ order: ApiCommerceOrder }>(`/commerce/orders/${id}`),

  cancelOrder: (id: string, cancellationReason?: string) =>
    post<{ order: ApiCommerceOrder }>(
      `/commerce/orders/${id}/cancel`,
      cancellationReason ? { cancellationReason } : {},
    ),

  updateOrderStatus: (id: string, payload: { status: string; cancellationReason?: string }) =>
    patch<{ order: ApiCommerceOrder }>(`/commerce/orders/${id}/status`, payload),
};
