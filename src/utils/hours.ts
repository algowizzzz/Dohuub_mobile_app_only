import type { ApiOpeningHours } from '../services/catalogApi';

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

const DAY_LABELS: Record<(typeof DAY_ORDER)[number], string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export type HoursRow = {
  label: string;
  time: string;
};

function formatClock(hhmm: string): string {
  const [hourStr, minuteStr] = (hhmm ?? '').split(':');
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  if (!Number.isFinite(hour)) return hhmm;
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  const paddedMinute = String(Number.isFinite(minute) ? minute : 0).padStart(2, '0');
  return `${hour12}:${paddedMinute} ${suffix}`;
}

function daySignature(day: ApiOpeningHours[keyof ApiOpeningHours] | undefined): string {
  if (!day) return '';
  if (day.closed) return 'closed';
  return `${day.open}-${day.close}`;
}

export function groupOpeningHours(hours: ApiOpeningHours | null | undefined): HoursRow[] {
  if (!hours) return [];

  const rows: HoursRow[] = [];
  let start = 0;

  while (start < DAY_ORDER.length) {
    const startDay = DAY_ORDER[start];
    const startHours = hours[startDay];
    const signature = daySignature(startHours);
    if (!startHours || !signature) {
      start += 1;
      continue;
    }

    let end = start;
    while (
      end + 1 < DAY_ORDER.length &&
      daySignature(hours[DAY_ORDER[end + 1]]) === signature
    ) {
      end += 1;
    }

    const label =
      start === end
        ? DAY_LABELS[DAY_ORDER[start]]
        : `${DAY_LABELS[DAY_ORDER[start]]} - ${DAY_LABELS[DAY_ORDER[end]]}`;

    const time = startHours.closed
      ? 'Closed'
      : `${formatClock(startHours.open)} – ${formatClock(startHours.close)}`;

    rows.push({ label, time });
    start = end + 1;
  }

  return rows;
}