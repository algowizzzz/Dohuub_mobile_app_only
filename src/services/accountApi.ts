import { del, get, patch, post } from './http';

export type ApiAddressType = 'home' | 'work' | 'other';

export type ApiAddress = {
  id: string;
  userId: string;
  type: ApiAddressType;
  address: string;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  instructions: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AddressPayload = {
  address: string;
  type: ApiAddressType;
  city?: string;
  state?: string;
  zipCode?: string;
  instructions?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
};

export const addressesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    get<ApiAddress[]>('/addresses', { params }),

  get: (id: string) =>
    get<{ address: ApiAddress }>(`/addresses/${id}`).then(r => r.address),

  create: (payload: AddressPayload) =>
    post<{ address: ApiAddress }>('/addresses', payload).then(r => r.address),

  update: (id: string, payload: Partial<AddressPayload>) =>
    patch<{ address: ApiAddress }>(`/addresses/${id}`, payload).then(r => r.address),

  setDefault: (id: string) =>
    patch<{ address: ApiAddress }>(`/addresses/${id}/default`, {}).then(r => r.address),

  remove: (id: string) => del<void>(`/addresses/${id}`),
};

export type ApiCard = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  cardHolderName?: string;
  isDefault: boolean;
};

type RawCard = {
  id: string;
  brand?: string;
  lastFourDigits?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  expMonth?: number;
  expYear?: number;
  cardHolderName?: string | null;
  isDefault?: boolean;
};

function mapCard(raw: RawCard): ApiCard {
  return {
    id: raw.id,
    brand: raw.brand || 'card',
    last4: raw.last4 || raw.lastFourDigits || '',
    expMonth: raw.expMonth ?? raw.expiryMonth ?? 0,
    expYear: raw.expYear ?? raw.expiryYear ?? 0,
    cardHolderName: raw.cardHolderName || undefined,
    isDefault: Boolean(raw.isDefault),
  };
}

export const cardsApi = {
  createSetupIntent: () =>
    post<{ clientSecret: string; customerId: string }>('/cards/setup-intent', {}),

  list: async (params?: { page?: number; limit?: number }) => {
    const data = await get<RawCard[] | { items?: RawCard[] }>('/cards', { params });
    const items = Array.isArray(data) ? data : data?.items ?? [];
    return items.map(mapCard);
  },

  save: (payload: { paymentMethodId: string; cardHolderName?: string; isDefault?: boolean }) =>
    post<{ card: RawCard }>('/cards', payload).then(r => mapCard(r.card)),

  setDefault: (id: string) =>
    patch<{ card: RawCard }>(`/cards/${id}/default`, {}).then(r => mapCard(r.card)),

  remove: (id: string) => del<void>(`/cards/${id}`),
};
