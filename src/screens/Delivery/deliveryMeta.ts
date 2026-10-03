import { ENV } from '../../config/env';
import type { Delivery, DeliveryStatus, DeliveryVehicle } from '../../services/deliveryApi';

export const DELIVERY_STATUS_META: Record<
  DeliveryStatus,
  { label: string; color: string; bg: string; icon: string }
> = {
  open: { label: 'Finding riders', color: '#1D4AAD', bg: '#DBEAFE', icon: 'radio-outline' },
  offers: { label: 'Riders responded', color: '#B45309', bg: '#FEF3C7', icon: 'people-outline' },
  selected: { label: 'Awaiting payment', color: '#7E22CE', bg: '#EDE9FE', icon: 'card-outline' },
  assigned: { label: 'Rider assigned', color: '#0F766E', bg: '#CCFBF1', icon: 'bicycle-outline' },
  picked_up: { label: 'Picked up', color: '#0F766E', bg: '#CCFBF1', icon: 'cube-outline' },
  in_transit: { label: 'On the way', color: '#0F766E', bg: '#CCFBF1', icon: 'navigate-outline' },
  delivered: { label: 'Delivered', color: '#166534', bg: '#D1FAE5', icon: 'checkmark-circle-outline' },
  disputed: { label: 'Under review', color: '#991B1B', bg: '#FEE2E2', icon: 'alert-circle-outline' },
  expired: { label: 'Expired', color: '#64748B', bg: '#F1F5F9', icon: 'time-outline' },
  cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', icon: 'close-circle-outline' },
};

export const VEHICLE_META: Record<DeliveryVehicle, { label: string; icon: string }> = {
  bicycle: { label: 'Bicycle', icon: 'bicycle-outline' },
  motorbike: { label: 'Motorbike', icon: 'speedometer-outline' },
  car: { label: 'Car', icon: 'car-outline' },
  van: { label: 'Van', icon: 'bus-outline' },
};

/** Before payment the customer can still back out; afterwards only "Report a problem". */
export const PENDING_STATUSES: DeliveryStatus[] = ['open', 'offers', 'selected'];
export const LIVE_STATUSES: DeliveryStatus[] = ['assigned', 'picked_up', 'in_transit'];
export const ACTIVE_STATUSES: DeliveryStatus[] = [...PENDING_STATUSES, ...LIVE_STATUSES, 'disputed'];

/** Statuses that still change on their own (riders answering, rider moving) — worth polling. */
export function isUnfinished(status: DeliveryStatus): boolean {
  return ACTIVE_STATUSES.includes(status);
}

/** The four steps the customer sees once a rider is on it. */
export const TRACKING_STEPS: { status: DeliveryStatus; label: string; stamp: keyof Delivery['timestamps'] }[] = [
  { status: 'assigned', label: 'Rider assigned', stamp: 'assignedAt' },
  { status: 'picked_up', label: 'Parcel picked up', stamp: 'pickedUpAt' },
  { status: 'in_transit', label: 'On the way', stamp: 'inTransitAt' },
  { status: 'delivered', label: 'Delivered', stamp: 'deliveredAt' },
];

export function trackingIndex(d: Delivery): number {
  const status = d.status === 'disputed' ? lastLiveStatus(d) : d.status;
  return TRACKING_STEPS.findIndex(step => step.status === status);
}

function lastLiveStatus(d: Delivery): DeliveryStatus {
  if (d.timestamps.deliveredAt) return 'delivered';
  if (d.timestamps.inTransitAt) return 'in_transit';
  if (d.timestamps.pickedUpAt) return 'picked_up';
  return 'assigned';
}

export function formatClock(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${formatClock(iso)}`;
}

/** "4:59" from milliseconds. */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

type Point = { lat: number | null; lng: number | null } | null | undefined;
const hasCoords = (p: Point): p is { lat: number; lng: number } =>
  p != null && p.lat != null && p.lng != null;

/**
 * Google Static Maps image of the trip: A = pickup, B = drop-off, R = rider,
 * with a line between the stops. No native map module needed; the screen
 * swaps the URL whenever the rider's position changes.
 */
export function deliveryMapUrl(
  d: Pick<Delivery, 'pickup' | 'dropoff' | 'riderLocation'>,
  width = 640,
  height = 320,
): string | null {
  const key = ENV.googleMapsApiKey;
  if (!key || (!hasCoords(d.pickup) && !hasCoords(d.dropoff))) return null;
  const parts: string[] = [`size=${width}x${height}`, 'scale=2', 'maptype=roadmap'];
  if (hasCoords(d.pickup)) {
    parts.push(`markers=${encodeURIComponent(`color:0x2E7AD9|label:A|${d.pickup.lat},${d.pickup.lng}`)}`);
  }
  if (hasCoords(d.dropoff)) {
    parts.push(`markers=${encodeURIComponent(`color:0x10B981|label:B|${d.dropoff.lat},${d.dropoff.lng}`)}`);
  }
  if (hasCoords(d.riderLocation)) {
    parts.push(
      `markers=${encodeURIComponent(`color:0xF59E0B|label:R|${d.riderLocation.lat},${d.riderLocation.lng}`)}`,
    );
  }
  if (hasCoords(d.pickup) && hasCoords(d.dropoff)) {
    parts.push(
      `path=${encodeURIComponent(
        `color:0x2E7AD9CC|weight:4|${d.pickup.lat},${d.pickup.lng}|${d.dropoff.lat},${d.dropoff.lng}`,
      )}`,
    );
  } else {
    const only = hasCoords(d.pickup) ? d.pickup : (d.dropoff as { lat: number; lng: number });
    parts.push(`center=${only.lat},${only.lng}`, 'zoom=15');
  }
  parts.push(`key=${key}`);
  return `https://maps.googleapis.com/maps/api/staticmap?${parts.join('&')}`;
}

export function deliveryTitle(d: Delivery): string {
  if (d.type === 'order') return d.orderRef ? `Order ${d.orderRef}` : 'Marketplace order';
  return d.parcel || 'Package';
}
