import { del, get, getPage, patch, post, put, type Page } from './http';

export type ProductKind = 'food' | 'grocery' | 'beauty';

export type CommerceOrderStatus =
  | 'pending_payment'
  | 'placed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

/**
 * One storefront card. Since vendors can run several locations, this is a
 * single branch: `id` is a store id, and `vendorId` names the business it
 * belongs to. `businessName` is kept as an alias of `name` so screens written
 * before multi-store keep rendering the right label.
 */
export type ApiCommerceStore = {
  id: string;
  vendorId?: string;
  name?: string;
  businessName: string;
  isDefault?: boolean;
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
  /** The branch that stocks this item. */
  storeId?: string;
  /** Shown on product cards. */
  shortDescription?: string | null;
  /** Extra photos beside `image`. */
  gallery?: string[];
  /** Numeric half of the quantity; `unitLabel` holds the unit. */
  quantityAmount?: number | null;
  status?: 'draft' | 'published';
  /** Set for food items only: cuisines and portion size. */
  foodDetail?: { cuisines: string[]; portionSize?: string | null } | null;
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
  /** A cart holds items from exactly one branch; a customer can hold one cart per store. */
  storeId?: string;
  store?: {
    id: string;
    name: string;
    kind?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    image?: string | null;
    deliveryFee: number;
    deliveryMinutesMin: number;
    deliveryMinutesMax: number;
  } | null;
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

/** `GET /commerce/cart`: every store cart the customer holds. */
export type ApiCartsResponse = {
  carts?: ApiCart[];
  itemCount?: number;
  subtotal?: number;
  /** Most recently updated cart (legacy clients). */
  cart?: ApiCart | null;
};

export type ApiCheckoutPreviewGroup = {
  storeId: string;
  store?: ApiCart['store'];
  vendor?: ApiCart['vendor'];
  items: ApiCartItem[];
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  total: number;
};

export type ApiCheckoutPreview = {
  groups: ApiCheckoutPreviewGroup[];
  subtotal: number;
  deliveryFee: number;
  taxAmount: number;
  pointsDiscount: number;
  pointsToRedeem: number;
  totalAmount: number;
  currency: string;
  pointsYouEarn?: number;
};

export type CheckoutStatus = 'pending_payment' | 'paid' | 'failed' | 'cancelled';

/** One payment covering one order per store. */
export type ApiCheckout = {
  id: string;
  reference: string;
  status: CheckoutStatus;
  totalAmount: number;
  pointsDiscount: number;
  currency: string;
  orders: ApiCommerceOrder[];
  paymentStatus: string;
  createdAt: string;
};

export type ApiCommerceOrder = {
  id: string;
  reference: string;
  /** Set when the order was placed as part of a multi-store checkout. */
  checkoutId?: string | null;
  store?: { id: string; name: string; image?: string | null } | null;
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

  getCart: () => get<ApiCartsResponse>('/commerce/cart'),

  upsertCartItem: (payload: { productId: string; quantity: number }) =>
    put<ApiCartsResponse>('/commerce/cart/items', payload),

  /** Clears one store's cart, or every cart when `storeId` is omitted. */
  clearCart: (storeId?: string) =>
    del<{ cleared: boolean }>('/commerce/cart', storeId ? { params: { storeId } } : undefined),

  previewCheckout: (
    payload: { deliveryAddressId?: string; pointsToRedeem?: number; storeIds?: string[] } = {},
  ) => post<ApiCheckoutPreview>('/commerce/cart/checkout-preview', payload),

  /** Creates one checkout with one order per store and clears those carts. */
  createOrder: (payload: {
    deliveryAddressId: string;
    pointsToRedeem?: number;
    notes?: string;
    storeIds?: string[];
  }) => post<{ checkout?: ApiCheckout; order: ApiCommerceOrder }>('/commerce/orders', payload),

  payCheckout: (id: string, payload: { paymentMethodId?: string; confirmNow?: boolean } = {}) =>
    post<{ checkout: ApiCheckout; clientSecret?: string }>(`/commerce/checkouts/${id}/pay`, payload),

  getCheckout: (id: string) => get<{ checkout: ApiCheckout }>(`/commerce/checkouts/${id}`),

  listMyCheckouts: (params?: Record<string, unknown>): Promise<Page<ApiCheckout>> =>
    getPage('/commerce/checkouts', { params }),

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
