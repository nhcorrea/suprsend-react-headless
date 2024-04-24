import { useNotificationStore } from '../store';
import type { NotificationStore } from '../types/NotificationStore';

export default function useNotifications() {
  const store = useNotificationStore((_store: NotificationStore) => _store);

  return {
    notifications: store.notifications,
    unSeenCount: store.unSeenCount,
    markClicked: store.markClicked,
    markAllSeen: store.markAllSeen,
    fetchPrevious: store.fetchPrevious,
    markAllRead: store.markAllRead,
  };
}
