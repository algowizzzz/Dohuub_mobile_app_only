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
  /** Null on listings built from a store-kind form (rentals, food, …). */
  vendorCategory: { id: string; title: string; image?: string | null } | null;
  vendor: {
    id: string;
    businessName: string;
    city: string;
    state: string;
    ratingAverage: number;
    ratingCount: number;
    status: string;
    poweredByDoHuub: boolean;
    /** The account holder; `image` is their profile photo. */
    user?: { image?: string | null } | null;
  };
  /**
   * The branch that serves this listing. Address, hours and rating belong to
   * the store, not the account — two locations of one business differ here.
   */
  store?: {
    id: string;
    name: string;
    kind?: ApiStoreKind | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    openingHours?: ApiOpeningHours;
    deliveryFee?: number | null;
    deliveryMinutesMin?: number | null;
    deliveryMinutesMax?: number | null;
    ratingAverage?: number;
    ratingCount?: number;
    isActive?: boolean;
    image?: string | null;
  };

  /** Split descriptions: short on cards, long on the detail screen. */
  shortDescription?: string | null;
  longDescription?: string | null;
  /** Extra photos beside `image`. */
  gallery?: string[];
  pricingType?: 'fixed' | 'hourly';

  /** Category-specific rows; only the one matching the store's kind is set. */
  tradeDetail?: ApiTradeDetail | null;
  beautyDetail?: ApiTradeDetail | null;
  rentalDetail?: ApiRentalDetail | null;
  companionDetail?: ApiCompanionDetail | null;
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
  /** Null on listings built from a store-kind form (rentals, food, …). */
  vendorCategory: { id: string; title: string } | null;
  /** The branch it belongs to; `kind` says which detail screen fits it. */
  store?: { id: string; name: string; kind?: ApiStoreKind | null };
  rentalDetail?: ApiRentalDetail | null;
};

/** A rental opens the property screen and its stay booking, not a slot booking. */
export const isRentalListing = (s: { rentalDetail?: unknown; store?: { kind?: ApiStoreKind | null } | null }) =>
  Boolean(s.rentalDetail) || s.store?.kind === 'rental';

export type ApiVendorReview = {
  id: string;
  stars: number;
  comment: string | null;
  /** Photos the customer attached (up to 5 URLs). */
  images?: string[];
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
  /** Other locations of the same business, when the API supplies them. */
  stores?: Array<{
    id: string;
    name: string;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    ratingAverage?: number;
    ratingCount?: number;
  }>;
};

export type ServiceListParams = {
  vendorId?: string;
  /** Browse one store category, e.g. every rental property. */
  kind?: ApiStoreKind;
  /** With `kind: 'rental'`: only properties offered under this term. */
  rentalTerm?: ApiRentalTerm;
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

  /**
   * Fully-booked nights of a rental between two days (YYYY-MM-DD). A stay's
   * checkout day is not a booked night, so it never appears here.
   */
  unavailableDates: (id: string, params: { from: string; to: string }) =>
    get<{ dates: string[] }>(`/services/${id}/unavailable-dates`, {
      skipAuth: true,
      params,
    }).then(r => r.dates ?? []),
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

/** What a store sells; decides which extra fields its listings carry. */
export type ApiStoreKind =
  | 'cleaning' | 'handyman' | 'grocery' | 'food'
  | 'beauty_service' | 'beauty_product' | 'rental' | 'companionship';

/** How a property may be rented (vendor form "Rental Type"). */
export type ApiRentalTerm = 'short_term' | 'long_term' | 'commercial';

/** Extra fields a rental listing carries. */
export type ApiRentalDetail = {
  region: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  totalArea: number;
  totalAreaUnit: string;
  pricePerNight: number;
  /** Optional long-stay rates (whole weeks / 30-night months); decimals may arrive as strings. */
  pricePerWeek?: number | string | null;
  pricePerMonth?: number | string | null;
  amenities: string[];
  houseRules?: string | null;
  cleaningFee?: number | null;
  serviceFee?: number | null;
  /** Subset of short_term / long_term / commercial; older listings may have none. */
  rentalTerms?: ApiRentalTerm[] | null;
};

/** Extra fields a companion profile carries. */
export type ApiCompanionDetail = {
  yearsOfExperience: number;
  about?: string | null;
  certifications: string[];
  specialties: string[];
  supportTypes: string[];
  languages: string[];
  credentialImages: string[];
};

/** Extra fields a food item carries. */
export type ApiFoodDetail = {
  cuisines: string[];
  portionSize?: string | null;
};

/** Ticked items on a cleaning, handyman or beauty service. */
export type ApiTradeDetail = { whatsIncluded: string[] };

/**
 * One listing, whatever its category.
 *
 * The shared fields are always present; the rest arrive flattened according to
 * the store's kind, so a rental has `bedrooms` and a food item has `cuisines`
 * on the same object. `kind` says which to expect.
 */
export type ApiListing = {
  id: string;
  kind: ApiStoreKind | null;
  listingKind: 'service' | 'product';
  name: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  description?: string | null;
  image?: string | null;
  gallery: string[];
  price: number;
  discountedPrice?: number | null;
  currency: string;
  status: 'draft' | 'published';
  pricingType?: 'fixed' | 'hourly';
  storeId: string;
  store?: { id: string; name: string; kind: ApiStoreKind | null; city?: string | null };
} & Partial<ApiRentalDetail> &
  Partial<ApiCompanionDetail> &
  Partial<ApiFoodDetail> &
  Partial<ApiTradeDetail>;

/** One field in a category's listing form, as the API describes it. */
export type ApiSchemaField = {
  key: string;
  label: string;
  type: string;
  target?: 'listing' | 'detail';
  required?: boolean;
  optional?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  hint?: string;
  suffix?: string;
  locked?: string;
  lockedLabel?: string;
  lockedNote?: string;
  default?: unknown;
  options?: Array<{ value: string; label: string }>;
  optionsFrom?: string;
  groups?: Array<{ label: string; options: string[] }>;
  units?: Array<{ value: string; label: string }>;
  unitKey?: string;
  defaultUnit?: string;
  maxItems?: number;
  columns?: number;
  allowCustom?: boolean;
  customLabel?: string;
  freeSolo?: boolean;
  latKey?: string;
  lngKey?: string;
};

export type ApiCategorySchema = {
  kind: ApiStoreKind;
  listingKind: 'service' | 'product';
  label: string;
  listingNoun: string;
  createTitle: string;
  createSubtitle: string;
  sections: Array<{ title: string; fields: ApiSchemaField[] }>;
  dynamicOptions?: Record<string, Array<{ value: string; label: string }>>;
};

/**
 * `07 · Listings` — everything a store sells, whatever its category.
 *
 * `schema(kind)` returns that category's fields, so a screen can label and
 * render them without knowing what a rental or a food item is.
 */
export const listingsApi = {
  schemas: () =>
    get<{ schemas: Record<string, ApiCategorySchema> }>('/listings/schemas', { skipAuth: true }).then(
      r => r.schemas,
    ),

  schema: (kind: ApiStoreKind, storeId?: string) =>
    get<{ schema: ApiCategorySchema }>(`/listings/schemas/${kind}`, {
      skipAuth: true,
      params: storeId ? { storeId } : undefined,
    }).then(r => r.schema),

  get: (id: string) =>
    get<{ listing: ApiListing }>(`/listings/${id}`, { skipAuth: true }).then(r => r.listing),
};

/** One location of a business, as customers browse it. */
export type ApiStoreListItem = {
  id: string;
  vendorId: string;
  name: string;
  /** What this branch sells; decides which fields its listings carry. */
  kind?: ApiStoreKind | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  bio?: string | null;
  image?: string | null;
  openingHours?: ApiOpeningHours;
  deliveryFee?: number | null;
  deliveryMinutesMin?: number | null;
  deliveryMinutesMax?: number | null;
  ratingAverage?: number;
  ratingCount?: number;
  distanceKm?: number;
  vendor?: {
    id: string;
    businessName: string;
    status?: string;
    poweredByDoHuub?: boolean;
  };
};

/**
 * `06 · Stores` — locations, the unit customers actually browse and book.
 *
 * Each branch lists separately, with its own address, hours, rating and
 * distance, so "the Downtown one" is a thing a customer can pick.
 */
export const storesApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
    state?: string;
    vendorId?: string;
    vendorCategoryId?: string;
    lat?: number;
    lng?: number;
    radiusKm?: number;
  }): Promise<Page<ApiStoreListItem>> => getPage<ApiStoreListItem>('/stores', { skipAuth: true, params }),

  get: (id: string) =>
    get<{ store: ApiStoreListItem }>(`/stores/${id}`, { skipAuth: true }).then(r => r.store),

  /** Sibling branches of the same business. */
  locations: (id: string) =>
    get<{ stores: ApiStoreListItem[] }>(`/stores/${id}/locations`, { skipAuth: true }).then(
      r => r.stores,
    ),
};
