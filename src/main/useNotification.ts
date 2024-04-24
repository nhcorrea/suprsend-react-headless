import type { RemoteNotification } from '../types/Notification';
import { useNotificationStore } from '../store';

export default function useNotification(notification: RemoteNotification) {
  const store = useNotificationStore();
  return {
    notification: notification,
    markClicked: () => store.markClicked(notification.n_id),
  };
}
