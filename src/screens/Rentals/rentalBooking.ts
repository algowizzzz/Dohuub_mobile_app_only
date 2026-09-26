import { useCallback, useEffect, useState } from 'react';
import { servicesApi, type ApiServiceListing } from '../../services/catalogApi';
import { formatMoney } from '../../utils/currency';

/** What the three booking steps need to know about a rental property. */
export type RentalStay = {
  id: string;
  name: string;
  photo: string | null;
  location: string;
  /** 0 when the vendor left it blank — the guest steppers then have no cap. */
  maxGuests: number;
  pricePerNight: number;
  /** The listing's own currency — every amount below is in it. */
  currency: string;
  /** Long-stay rates; null when the vendor set none. */
  pricePerWeek: number | null;
  pricePerMonth: number | null;
  cleaningFee: number | null;
  serviceFee: number | null;
  poweredByDoHuub: boolean;
  pointsPerDollar: number;
};

/** Same field mapping as RentalDetailScreen's `toDetail`, trimmed to booking needs. */
export function toRentalStay(l: ApiServiceListing): RentalStay {
  const d = l.rentalDetail ?? ({} as NonNullable<ApiServiceListing['rentalDetail']>);
  return {
    id: l.id,
    name: l.name ?? '',
    photo: l.image || l.gallery?.find(Boolean) || null,
    location: d.region || [l.store?.city, l.store?.state].filter(Boolean).join(', ') || '',
    maxGuests: Number(d.maxGuests ?? 0),
    pricePerNight: Number(d.pricePerNight ?? l.price ?? 0),
    currency: l.currency || 'USD',
    pricePerWeek: d.pricePerWeek != null ? Number(d.pricePerWeek) : null,
    pricePerMonth: d.pricePerMonth != null ? Number(d.pricePerMonth) : null,
    cleaningFee: d.cleaningFee != null ? Number(d.cleaningFee) : null,
    serviceFee: d.serviceFee != null ? Number(d.serviceFee) : null,
    poweredByDoHuub: Boolean(l.vendor?.poweredByDoHuub),
    pointsPerDollar: Number(l.pointsPerDollar ?? 0),
  };
}

export function useRentalStay(propertyId: string) {
  const [property, setProperty] = useState<RentalStay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    servicesApi
      .get(propertyId)
      .then(listing => setProperty(toRentalStay(listing)))
      .catch(err => setError(err instanceof Error ? err.message : 'Could not load this property'))
      .finally(() => setLoading(false));
  }, [propertyId]);

  useEffect(load, [load]);

  return { property, loading, error, reload: load };
}

const cents = (n: number) => Math.round(n * 100) / 100;

/**
 * The accommodation part of a stay, mirroring the server's `stayRate`: whole
 * 30-night months at the monthly rate, then whole weeks at the weekly rate
 * (each only when the vendor set one), then single nights at the nightly rate.
 * Capped at the plain nightly total, so a long-stay rate is only ever a discount.
 */
export function stayRate(
  property: Pick<RentalStay, 'pricePerNight' | 'pricePerWeek' | 'pricePerMonth'>,
  nights: number,
): number {
  let rest = nights;
  let total = 0;
  if (property.pricePerMonth != null) {
    const months = Math.floor(rest / 30);
    total += property.pricePerMonth * months;
    rest -= months * 30;
  }
  if (property.pricePerWeek != null) {
    const weeks = Math.floor(rest / 7);
    total += property.pricePerWeek * weeks;
    rest -= weeks * 7;
  }
  total += property.pricePerNight * rest;
  const plain = property.pricePerNight * nights;
  return cents(Math.min(total, plain));
}

/**
 * The server's price for a stay: accommodation (see `stayRate`) plus cleaning
 * and service fees, a blank fee counting as 0. The booking endpoint computes
 * the same figure; this is only the preview.
 */
export function stayPricing(property: RentalStay, nights: number, displayCurrency?: string) {
  const accommodation = stayRate(property, nights);
  const plain = cents(property.pricePerNight * nights);
  const cleaningFee = property.cleaningFee ?? 0;
  const serviceFee = property.serviceFee ?? 0;
  // A long-stay rate that actually applied gets a duration label; otherwise
  // the line reads as plain nightly maths.
  const accommodationLabel =
    accommodation < plain
      ? `Accommodation · ${stayDuration(nights)}`
      : `${formatMoney(property.pricePerNight, property.currency, {
          displayCurrency,
          compact: true,
        })} × ${nightsLabel(nights)}`;
  return {
    accommodation,
    accommodationLabel,
    cleaningFee,
    serviceFee,
    subtotal: cents(accommodation + cleaningFee + serviceFee),
  };
}

/**
 * A stay's length the way the wireframe words it: "1 night", "5 nights",
 * "1 week", "2 weeks 3 days", "1 month", "2 months 4 days".
 */
export function stayDuration(nights: number): string {
  if (nights === 1) return '1 night';
  if (nights < 7) return `${nights} nights`;
  if (nights < 30) {
    const weeks = Math.floor(nights / 7);
    const days = nights % 7;
    if (days === 0) return weeks === 1 ? '1 week' : `${weeks} weeks`;
    return `${weeks} week${weeks > 1 ? 's' : ''} ${days} day${days > 1 ? 's' : ''}`;
  }
  const months = Math.floor(nights / 30);
  const days = nights % 30;
  if (days === 0) return months === 1 ? '1 month' : `${months} months`;
  return `${months} month${months > 1 ? 's' : ''} ${days} day${days > 1 ? 's' : ''}`;
}

// ---- dates ----
// Days travel as local calendar keys (YYYY-MM-DD). Never via toISOString(),
// which shifts the day for anyone east or west of UTC.

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, days: number): string {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const [y1, m1, d1] = checkIn.split('-').map(Number);
  const [y2, m2, d2] = checkOut.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

/** "Sep 25, 2026" */
export function formatDateKey(key: string): string {
  return parseDateKey(key).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function nightsLabel(nights: number): string {
  return nights === 1 ? '1 night' : `${nights} nights`;
}
