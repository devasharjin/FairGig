import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface InAppNotification {
  id: string;
  type: "JOB_ACCEPTED" | "JOB_STARTED" | "JOB_COMPLETED" | "EMERGENCY_BOOKING" | string;
  title: string;
  message: string;
  bookingId?: string;
  bookingNumber?: string;
  status?: string;
  timestamp: string;
  read: boolean;
  link?: string;
  data?: Record<string, any>;
}

interface NotificationState {
  notifications: InAppNotification[];
  soundEnabled: boolean;
  addNotification: (notif: Omit<InAppNotification, "id" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  toggleSound: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      soundEnabled: true,

      addNotification: (notif) =>
        set((state) => {
          const newNotif: InAppNotification = {
            ...notif,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            read: false,
          };
          // Keep the last 50 notifications
          const updated = [newNotif, ...state.notifications].slice(0, 50);
          return { notifications: updated };
        }),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      clearAll: () => set({ notifications: [] }),

      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: "fairgig-notifications-store",
    }
  )
);
