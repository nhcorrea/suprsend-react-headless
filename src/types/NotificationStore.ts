import type { RemoteNotification } from './Notification';

export interface NotificationStore {
  notifications: RemoteNotification[];
  unSeenCount: number;
  lastFetchedOn: number | null;
  firstFetchedOn: number | null;
  pollingTimerId?: ReturnType<typeof setTimeout>;
  fetchNotifications: () => void;
  fetchPrevious: () => void;
  markClicked: (id: string) => void;
  markAllSeen: () => void;
  clearPolling: () => void;
  markAllRead: () => void;
}
