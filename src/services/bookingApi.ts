import { get, getPage, patch, post } from './http';
import { ENV } from '../config/env';

export type ApiBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'refunded';

export type ApiPaymentStatus =
  | 'unpaid'
  | 'requires_payment_method'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'partially_refunded'
  | 'refunded';

export type ApiBookingReview = {
  id: string;
  stars: number;
  comment: string | null;
};

export type ApiBooking = {
  id: string;
  reference: string;
  userId: string;
  vendorId: string;
  vendorCategoryId: string;
  serviceCategoryId: string;
  status: ApiBookingStatus;
  scheduledDate: string;
  scheduledTime: string;
  startsAt: string;
  endsAt: string;
  serviceAddressId: string;
  servicePrice: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  adminCommissionPercentage: number;
  adminCommissionAmount: number;
  vendorAmount: number;
  paymentStatus: ApiPaymentStatus;
  refundAmount: number;
  paymentFailureReason: string | null;
  pointsEarned: number;
  pointsRedeemed: number;
  cancellationReason: string | null;
  cancelledBy: string | null;
  paidAt: string | null;
  refundedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    name: string;
    image: string | null;
    serviceTimeInMinutes: number;
    currency: string;
    pointsPerDollar: number;
  };
  vendor: {
    id: string;
    businessName: string;
    phoneNumber: string;
    city: string;
    state: string;
    ratingAverage: number;
    poweredByDoHuub: boolean;
  };
  vendorCategory: { id: string; title: string };
  address?: {
    id: string;
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    instructions?: string;
  };
  review?: ApiBookingReview | null;
};

export type BookingListParams = {
  status?: ApiBookingStatus;
  paymentStatus?: ApiPaymentStatus;
  from?: string;
  to?: string;
  vendorId?: string;
  serviceCategoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export const bookingsApi = {
  list: (params?: BookingListParams) => getPage<ApiBooking>('/bookings', { params }),

  get: (id: string) =>
    get<{ booking: ApiBooking }>(`/bookings/${id}`).then(r => r.booking),

  create: (payload: {
    serviceCategoryId: string;
    serviceAddressId: string;
    scheduledDate: string;
    scheduledTime: string;
    discountAmount?: number;
    pointsToRedeem?: number;
    notes?: string;
  }) => post<{ booking: ApiBooking }>('/bookings', payload).then(r => r.booking),

  pay: (id: string, payload: { paymentMethodId?: string; confirmNow?: boolean }) =>
    post<{ booking: ApiBooking; clientSecret?: string }>(`/bookings/${id}/pay`, {
      ...payload,
      returnUrl: `${ENV.stripeReturnUrl}?bookingId=${id}`,
    }),

  reschedule: (id: string, payload: { scheduledDate: string; scheduledTime: string }) =>
    patch<{ booking: ApiBooking }>(`/bookings/${id}/reschedule`, payload).then(r => r.booking),

  cancel: (id: string, reason?: string) =>
    post<{ booking: ApiBooking }>(`/bookings/${id}/cancel`, { reason }).then(r => r.booking),
};
