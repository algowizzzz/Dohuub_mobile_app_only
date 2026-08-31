import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookingsApi, type ApiBooking, type BookingListParams } from '../services/bookingApi';
import type { Pagination } from '../services/http';

export type BookingDraft = {
  serviceCategoryId?: string;
  serviceId?: string;
  vendorId?: string;
  serviceAddressId?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  notes?: string;
  pointsToRedeem?: number;
};

type BookingStore = {
  draft: BookingDraft;
  lastConfirmation: ApiBooking | null;
  bookings: ApiBooking[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;

  setDraft: (draft: BookingDraft) => void;
  patchDraft: (patch: Partial<BookingDraft>) => void;
  clearDraft: () => void;

  load: (params?: BookingListParams) => Promise<void>;
  getBooking: (id: string) => Promise<ApiBooking>;
  createFromDraft: () => Promise<ApiBooking>;
  pay: (id: string, payload: { paymentMethodId?: string; confirmNow?: boolean }) => Promise<ApiBooking>;
  cancel: (id: string, reason?: string) => Promise<ApiBooking>;
  reschedule: (id: string, payload: { scheduledDate: string; scheduledTime: string }) => Promise<ApiBooking>;
  setConfirmation: (booking: ApiBooking) => void;
  patchRow: (id: string, patch: Partial<ApiBooking>) => void;
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      draft: {},
      lastConfirmation: null,
      bookings: [],
      pagination: null,
      loading: false,
      error: null,

      setDraft: draft => set({ draft }),
      patchDraft: patch => set(state => ({ draft: { ...state.draft, ...patch } })),
      clearDraft: () => set({ draft: {} }),

      load: async params => {
        set({ loading: true, error: null });
        try {
          const { items, pagination } = await bookingsApi.list(params);
          set({ bookings: items, pagination, loading: false });
        } catch (error) {
          set({ loading: false, error: (error as Error).message });
          throw error;
        }
      },

      getBooking: id => bookingsApi.get(id),

      createFromDraft: async () => {
        const { draft } = get();
        if (!draft.serviceCategoryId || !draft.serviceAddressId || !draft.scheduledDate || !draft.scheduledTime) {
          throw new Error('Booking draft is incomplete.');
        }
        const booking = await bookingsApi.create({
          serviceCategoryId: draft.serviceCategoryId,
          serviceAddressId: draft.serviceAddressId,
          scheduledDate: draft.scheduledDate,
          scheduledTime: draft.scheduledTime,
          notes: draft.notes,
          pointsToRedeem: draft.pointsToRedeem,
        });
        set({ lastConfirmation: booking });
        return booking;
      },

      pay: async (id, payload) => {
        const { booking } = await bookingsApi.pay(id, payload);
        set({ lastConfirmation: booking });
        get().patchRow(id, booking);
        return booking;
      },

      cancel: async (id, reason) => {
        const booking = await bookingsApi.cancel(id, reason);
        get().patchRow(id, booking);
        return booking;
      },

      reschedule: async (id, payload) => {
        const booking = await bookingsApi.reschedule(id, payload);
        get().patchRow(id, booking);
        return booking;
      },

      setConfirmation: booking => set({ lastConfirmation: booking }),

      patchRow: (id, patch) =>
        set(state => ({
          bookings: state.bookings.map(booking =>
            booking.id === id ? { ...booking, ...patch } : booking,
          ),
        })),
    }),
    {
      name: 'dohuub-bookings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ draft: state.draft, lastConfirmation: state.lastConfirmation }),
    },
  ),
);
