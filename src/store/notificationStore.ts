import { create } from 'zustand';
import { notificationsApi, type ApiNotification } from '../services/engagementApi';

type NotificationStore = {
  notifications: ApiNotification[];
  loading: boolean;
  error: string | null;

  load: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  loading: false,
  error: null,

  load: async () => {
    set({ loading: true, error: null });
    try {
      const notifications = await notificationsApi.list();
      set({ notifications, loading: false });
    } catch (error) {
      set({ loading: false, error: (error as Error).message });
      throw error;
    }
  },

  markRead: async id => {
    const readAt = new Date().toISOString();
    set({
      notifications: get().notifications.map(n => (n.id === id ? { ...n, readAt } : n)),
    });
    try {
      await notificationsApi.markRead(id);
    } catch {
      // best-effort; local state already optimistic
    }
  },

  markAllRead: async () => {
    const readAt = new Date().toISOString();
    set({ notifications: get().notifications.map(n => ({ ...n, readAt: n.readAt ?? readAt })) });
    try {
      await notificationsApi.markAllRead();
    } catch {
      // best-effort
    }
  },
}));
