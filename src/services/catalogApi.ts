import { get, getPage } from './http';
import type { Page } from './http';

export type ApiVendorCategory = {
  id: string;
  title: string;
  image: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: { services: number };
};

export type ApiServiceListing = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  discountedPrice: number | null;
  currency: string;
  pointsPerDollar: number;
  serviceTimeInMinutes: number;
  serviceGapInMinutes: number;
  concurrentServices: number;
  isActive: boolean;
  createdAt: string;
  vendorCategory: { id: string; title: string; image?: string | null };
  vendor: {
    id: string;
    businessName: string;
    city: string;
    state: string;
    ratingAverage: number;
    ratingCount: number;
    status: string;
    poweredByDoHuub: boolean;
  };
};

export type ApiOpeningHours = Record<
  'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun',
  { open: string; close: string; closed: boolean }
>;

export type ApiVendorService = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  price: number;
  discountedPrice: number | null;
  currency: string;
  serviceTimeInMinutes: number;
  pointsPerDollar: number;
  vendorCategory: { id: string; title: string };
};

export type ApiVendorReview = {
  id: string;
  stars: number;
  comment: string | null;
  createdAt: string;
  author: { id: string; fullName: string; image: string | null };
};

export type ApiVendorDetail = {
  id: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  phoneNumber: string;
  businessEmail: string;
  bio: string | null;
  serviceRadiusKm: number | null;
  openingHours: ApiOpeningHours;
  status: string;
  ratingAverage: number;
  ratingCount: number;
  poweredByDoHuub: boolean;
  createdAt: string;
  user: { id: string; fullName: string; image: string | null; vendorCategoryIds: string[] };
  services: ApiVendorService[];
  reviews: ApiVendorReview[];
};

export type ServiceListParams = {
  vendorId?: string;
  vendorCategoryId?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  search?: string;
  sortBy?: 'createdAt' | 'price' | 'name';
  sortOrder?: 'asc' | 'desc';
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
};

export type VendorListParams = {
  vendorCategoryId?: string;
  city?: string;
  search?: string;
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
};

export const vendorCategoriesApi = {
  list: (params?: {
    search?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'title';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) =>
    get<ApiVendorCategory[]>('/vendor-categories', {
      skipAuth: true,
      params: { sortBy: 'updatedAt', sortOrder: 'desc', limit: 100, ...params },
    }),
};

export type ApiAvailabilitySlot = {
  time: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  booked: number;
  available: boolean;
};

export type ApiDayAvailability = {
  serviceId: string;
  date: string;
  closed: boolean;
  openingHours: { from: string; to: string } | null;
  serviceTimeInMinutes: number;
  serviceGapInMinutes: number;
  concurrentServices: number;
  slots: ApiAvailabilitySlot[];
};

export type ApiAvailabilityRangeDay = {
  date: string;
  closed: boolean;
  totalSlots: number;
  availableSlots: number;
  firstAvailableTime: string | null;
  isFullyBooked: boolean;
};

export type ApiAvailabilityRange = {
  serviceId: string;
  from: string;
  to: string;
  serviceTimeInMinutes: number;
  concurrentServices: number;
  days: ApiAvailabilityRangeDay[];
};

export const servicesApi = {
  list: (params?: ServiceListParams) =>
    getPage<ApiServiceListing>('/services', { skipAuth: true, params }),

  get: (id: string) =>
    get<{ service: ApiServiceListing }>(`/services/${id}`, { skipAuth: true }).then(
      r => r.service,
    ),

  availability: (id: string, params: { date: string }) =>
    get<ApiDayAvailability>(`/services/${id}/availability`, { skipAuth: true, params }),

  availabilityRange: (
    id: string,
    params: { from: string; to: string; fromTime?: string; toTime?: string },
  ) =>
    get<ApiAvailabilityRange>(`/services/${id}/availability/range`, {
      skipAuth: true,
      params,
    }),
};

export type ApiVendorListItem = {
  id: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  phoneNumber: string;
  businessEmail: string;
  status: string;
  ratingAverage: number;
  ratingCount: number;
  poweredByDoHuub: boolean;
  createdAt: string;
  user: { id: string; fullName: string; image: string | null; vendorCategoryIds: string[] };
  _count?: { services: number };
  distanceKm?: number;
};

export const vendorsApi = {
  list: (params?: VendorListParams): Promise<Page<ApiVendorListItem>> =>
    getPage<ApiVendorListItem>('/vendors', { skipAuth: true, params }),

  get: (id: string) =>
    get<{ vendor: ApiVendorDetail }>(`/vendors/${id}`, { skipAuth: true }).then(r => r.vendor),
};
