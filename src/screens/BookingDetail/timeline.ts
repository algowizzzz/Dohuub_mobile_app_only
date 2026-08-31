import type { ApiBooking, ApiBookingStatus } from '../../services/bookingApi';

export type TimelineStepState = 'done' | 'active' | 'upcoming';

export type TimelineStep = {
  key: string;
  title: string;
  description: string;
  state: TimelineStepState;
  timestamp: string | null;
};

const STEP_DEFS = [
  { key: 'pending', title: 'Booking Placed', description: 'Waiting for the provider to accept' },
  { key: 'accepted', title: 'Accepted', description: 'The provider confirmed your booking' },
  { key: 'in_progress', title: 'In Progress', description: 'Service provider is working on your request' },
  { key: 'completed', title: 'Completed', description: 'Service has been completed' },
];

const STATUS_STEP_INDEX: Record<ApiBookingStatus, number> = {
  pending: 0,
  confirmed: 1,
  in_progress: 2,
  completed: 3,
  cancelled: -1,
  rejected: -1,
  refunded: -1,
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const diffMs = Date.now() - date.getTime();
  if (diffMs >= 0 && diffMs < 60_000) return 'Just now';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function buildTimeline(booking: ApiBooking): TimelineStep[] {
  const activeIndex = STATUS_STEP_INDEX[booking.status];
  const stepTimestamps: Record<string, string | null> = {
    pending: booking.createdAt,
    accepted: booking.paidAt,
    in_progress: null,
    completed: booking.completedAt,
  };

  return STEP_DEFS.map((step, index) => {
    let state: TimelineStepState = 'upcoming';
    if (index < activeIndex) state = 'done';
    else if (index === activeIndex) state = booking.status === 'completed' ? 'done' : 'active';

    const rawTimestamp = stepTimestamps[step.key];
    let timestamp: string | null = null;
    if (state === 'active' && !rawTimestamp) {
      timestamp = 'Just now';
    } else if (state !== 'upcoming' && rawTimestamp) {
      timestamp = formatTimestamp(rawTimestamp);
    }

    return { ...step, state, timestamp };
  });
}
