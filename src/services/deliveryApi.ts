import { get, http, post } from './http';

/**
 * DoHuub Delivery — the customer (requester) side.
 *
 *   open → offers → selected → assigned → picked_up → in_transit → delivered
 *     ↘ expired (no rider answered)   ↘ cancelled (only before a rider is assigned)
 *   assigned…delivered → disputed (customer "Report a problem")
 *
 * Mirrors backend/src/modules/delivery (presentDelivery in delivery.shared.js).
 */

export type DeliveryStatus =
  | 'open'
  | 'offers'
  | 'selected'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'disputed'
  | 'expired'
  | 'cancelled';

export type DeliveryVehicle = 'bicycle' | 'motorbike' | 'car' | 'van';

export type DeliveryRider = {
  id: string;
  fullName: string;
  image: string | null;
  vehicle: DeliveryVehicle | null;
  vehiclePlate: string | null;
  rating: number | null;
  ratingCount: number;
  completed: number;
  plan: string | null;
  phone: string | null;
};

export type DeliveryOffer = {
  id: string;
  riderId: string;
  kind: 'accept' | 'counter' | 'decline';
  amount: number | null;
  etaMinutes: number | null;
  status: 'active' | 'selected' | 'rejected' | 'withdrawn' | string;
  at: string;
  rider: DeliveryRider | null;
};

export type DeliveryStop = {
  label: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  phone?: string | null;
};

export type DeliveryEvent = {
  status: string;
  type: string;
  at: string;
  note: string | null;
  actorRole: string | null;
  data: Record<string, unknown> | null;
};

export type FareGuide = { min: number; max: number };

export type Delivery = {
  id: string;
  reference: string;
  type: 'order' | 'package';
  status: DeliveryStatus;
  createdAt: string;
  expiresAt: string | null;
  acceptingResponses: boolean;
  orderRef: string | null;
  orderId: string | null;
  storeId: string | null;
  recipient: { name: string | null; phone: string | null };
  pickup: DeliveryStop;
  dropoff: DeliveryStop;
  distanceKm: number | null;
  etaMinutes: number | null;
  parcel: string | null;
  notes: string | null;
  scheduledPickupAt: string | null;
  currency: string;
  proposedFare: number | null;
  agreedFare: number | null;
  fareGuide: FareGuide | null;
  riderId: string | null;
  rider: DeliveryRider | null;
  selectedOfferId: string | null;
  offers: DeliveryOffer[];
  riderLocation: { lat: number; lng: number; at: string | null } | null;
  progress: number | null;
  events: DeliveryEvent[];
  payment: {
    status: string | null;
    mode: 'test' | 'stripe' | null;
    paidAt: string | null;
    refundAmount: number | null;
    transferStatus: string | null;
    transferredAt: string | null;
  };
  proof: { recipientName: string | null; hasPhoto: boolean } | null;
  rating: { stars: number; comment: string | null; at: string } | null;
  dispute: {
    reason: string;
    details: string | null;
    openedBy: string;
    openedAt: string;
    resolvedAt: string | null;
    resolution: string | null;
  } | null;
  timestamps: Partial<Record<
    'selectedAt' | 'assignedAt' | 'pickedUpAt' | 'inTransitAt' | 'deliveredAt' | 'cancelledAt' | 'expiredAt',
    string | null
  >>;
  cancelReason: string | null;
};

export type DeliveryStopInput = {
  label?: string;
  address?: string;
  lat?: number;
  lng?: number;
  phone?: string;
};

export type CreateDeliveryInput = {
  type?: 'order' | 'package';
  orderId?: string;
  pickup?: DeliveryStopInput;
  dropoff?: DeliveryStopInput;
  recipientName?: string;
  recipientPhone?: string;
  parcel?: string;
  notes?: string;
  /** ISO 8601 with offset; omitted = ASAP. */
  scheduledPickupAt?: string;
  proposedFare: number;
  currency?: string;
  country?: string;
  region?: string;
};

export type DeliveryEstimate = {
  distanceKm: number | null;
  etaMinutes: number | null;
  fareGuide: FareGuide | null;
};

export type DeliveryPayResult = {
  delivery: Delivery;
  clientSecret: string | null;
  paymentIntentId: string;
  status: string;
  requiresAction: boolean;
  testMode: boolean;
  amount: number;
  currency: string;
};

export type DeliveryTab = 'action' | 'live' | 'completed' | 'issues';

export type DeliveryListResult = {
  items: Delivery[];
  counts: Partial<Record<DeliveryStatus, number>>;
};

export const deliveryApi = {
  estimate: (q: { pickupLat: number; pickupLng: number; dropoffLat: number; dropoffLng: number }) =>
    get<DeliveryEstimate>('/deliveries/estimate', { params: q }),

  /** Lists the signed-in customer's requests. `counts` is by status across all of them. */
  listMine: async (params: { tab?: DeliveryTab; orderId?: string; page?: number; limit?: number } = {}) => {
    const response = await http.get<{
      data?: Delivery[];
      meta?: { counts?: DeliveryListResult['counts'] };
    }>('/deliveries/mine', { params });
    return {
      items: response.data?.data ?? [],
      counts: response.data?.meta?.counts ?? {},
    } as DeliveryListResult;
  },

  get: (id: string) => get<{ delivery: Delivery }>(`/deliveries/${id}`).then(r => r.delivery),

  create: (input: CreateDeliveryInput) =>
    post<{ delivery: Delivery }>('/deliveries', input).then(r => r.delivery),

  select: (id: string, offerId: string) =>
    post<{ delivery: Delivery }>(`/deliveries/${id}/select`, { offerId }).then(r => r.delivery),

  unselect: (id: string) =>
    post<{ delivery: Delivery }>(`/deliveries/${id}/unselect`, {}).then(r => r.delivery),

  pay: (id: string, payload: { paymentMethodId?: string; confirmNow?: boolean } = {}) =>
    post<DeliveryPayResult>(`/deliveries/${id}/pay`, payload),

  cancel: (id: string, reason?: string) =>
    post<{ delivery: Delivery }>(`/deliveries/${id}/cancel`, reason ? { reason } : {}).then(r => r.delivery),

  dispute: (id: string, payload: { reason: string; details?: string }) =>
    post<{ delivery: Delivery }>(`/deliveries/${id}/dispute`, payload).then(r => r.delivery),

  rate: (id: string, payload: { stars: number; comment?: string }) =>
    post<{ delivery: Delivery }>(`/deliveries/${id}/rate`, payload).then(r => r.delivery),

  repost: (id: string, proposedFare?: number) =>
    post<{ delivery: Delivery }>(`/deliveries/${id}/repost`, proposedFare ? { proposedFare } : {}).then(
      r => r.delivery,
    ),
};
