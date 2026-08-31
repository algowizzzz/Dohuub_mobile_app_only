import type { ApiBookingStatus } from '../../services/bookingApi';

export const STATUS_META: Record<ApiBookingStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#64748B', bg: '#F1F5F9' },
  confirmed: { label: 'Accepted', color: '#1D4AAD', bg: '#DBEAFE' },
  in_progress: { label: 'In Progress', color: '#1E40AF', bg: '#DBEAFE' },
  completed: { label: 'Completed', color: '#1D4AAD', bg: '#DBEAFE' },
  cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6' },
  rejected: { label: 'Rejected', color: '#DC2626', bg: '#FEE2E2' },
  refunded: { label: 'Refunded', color: '#0F766E', bg: '#CCFBF1' },
};

export function formatScheduledDate(scheduledDate: string): string {
  const date = new Date(`${scheduledDate}T00:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatScheduledTime(scheduledTime: string): string {
  const [hourStr, minuteStr] = scheduledTime.split(':');
  let hour = Number(hourStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minuteStr} ${period}`;
}
