import { useEffect, useState } from 'react';
import { servicesApi, type ApiAvailabilityRangeDay, type ApiAvailabilitySlot } from '../../services/catalogApi';

function toDateLabel(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function to12Hour(time: string): string {
  const [hourStr, minuteStr] = time.split(':');
  let hour = Number(hourStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minuteStr} ${period}`;
}

const RANGE_DAYS = 14;

export function useServiceAvailability(serviceId: string) {
  const [days, setDays] = useState<ApiAvailabilityRangeDay[]>([]);
  const [loadingDays, setLoadingDays] = useState(true);
  const [slots, setSlots] = useState<ApiAvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const from = new Date();
    const to = new Date();
    to.setDate(to.getDate() + RANGE_DAYS);

    const format = (date: Date) => date.toISOString().slice(0, 10);

    setLoadingDays(true);
    servicesApi
      .availabilityRange(serviceId, { from: format(from), to: format(to) })
      .then(range => setDays(range.days.filter(day => !day.closed && !day.isFullyBooked)))
      .catch(() => setDays([]))
      .finally(() => setLoadingDays(false));
  }, [serviceId]);

  const loadSlotsForDate = async (date: string) => {
    setLoadingSlots(true);
    try {
      const availability = await servicesApi.availability(serviceId, { date });
      setSlots(availability.slots.filter(slot => slot.available));
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const dateOptions = days.map(day => ({
    id: day.date,
    label: toDateLabel(day.date),
  }));

  const timeOptions = slots.map(slot => ({ time: slot.time, label: to12Hour(slot.time) }));

  return { dateOptions, loadingDays, timeOptions, loadingSlots, loadSlotsForDate };
}
