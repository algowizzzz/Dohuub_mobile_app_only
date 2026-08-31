import type { ApiBooking } from '../../services/bookingApi';
import type { ApiVendorCategory } from '../../services/catalogApi';

export const STREAK_TARGETS = [4, 8, 12, 16] as const;

export type StreakMarker = {
  weeks: number;
  achieved: boolean;
};

function startOfWeekUtc(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diffToMonday);
  return d.getTime();
}

export function longestWeeklyStreak(completedAt: Array<string | null | undefined>): number {
  const weeks = [
    ...new Set(
      completedAt
        .filter((value): value is string => Boolean(value))
        .map(value => startOfWeekUtc(new Date(value))),
    ),
  ].sort((a, b) => a - b);

  if (weeks.length === 0) return 0;

  let best = 1;
  let run = 1;
  for (let i = 1; i < weeks.length; i += 1) {
    if (weeks[i] - weeks[i - 1] === 7 * 24 * 60 * 60 * 1000) {
      run += 1;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }
  return best;
}

export function pendingPointsFromBookings(bookings: ApiBooking[]): number {
  return bookings.reduce((sum, booking) => {
    const pending = ['pending', 'confirmed', 'in_progress'].includes(booking.status);
    if (!pending || !booking.vendor?.poweredByDoHuub) return sum;
    const rate = booking.service?.pointsPerDollar ?? 0;
    return sum + Math.floor((booking.totalAmount || 0) * rate);
  }, 0);
}

export function streakMarkers(currentStreak: number): StreakMarker[] {
  return STREAK_TARGETS.map(weeks => ({
    weeks,
    achieved: currentStreak >= weeks,
  }));
}

export function nextStreakTarget(currentStreak: number): number | null {
  return STREAK_TARGETS.find(weeks => currentStreak < weeks) ?? null;
}

export function categoryIcon(title: string): string {
  const key = title.toLowerCase();
  if (key.includes('clean')) return 'sparkles-outline';
  if (key.includes('handy') || key.includes('repair')) return 'hammer-outline';
  if (key.includes('food') || key.includes('meal')) return 'fast-food-outline';
  if (key.includes('groc')) return 'cart-outline';
  if (key.includes('beauty') || key.includes('salon')) return 'cut-outline';
  if (key.includes('rent') || key.includes('propert')) return 'home-outline';
  if (key.includes('care') || key.includes('companion')) return 'heart-outline';
  if (key.includes('ride')) return 'car-outline';
  return 'grid-outline';
}

export type CategoryProgress = {
  id: string;
  title: string;
  icon: string;
  orderCount: number;
  filledDots: number;
};

export function categoryProgress(
  categories: ApiVendorCategory[],
  bookings: ApiBooking[],
): CategoryProgress[] {
  const counts = new Map<string, number>();
  bookings.forEach(booking => {
    if (booking.status !== 'completed') return;
    const id = booking.vendorCategory?.id ?? booking.vendorCategoryId;
    if (!id) return;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  });

  return categories.map(category => {
    const orderCount = counts.get(category.id) ?? 0;
    return {
      id: category.id,
      title: category.title.endsWith('Services') ? category.title : `${category.title} Services`,
      icon: categoryIcon(category.title),
      orderCount,
      filledDots: Math.min(4, orderCount),
    };
  });
}

export function formatActivityDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}