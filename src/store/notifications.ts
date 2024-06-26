import { create } from 'zustand';
import { useConfigStore } from '../store';
import type { NotificationStore, RemoteNotification } from '../types';
import {
  getNotifications,
  markNotificationClicked,
  markBellClicked,
  markAllRead,
} from '../api';
import { setClientNotificationStorage } from '../utils';
import { suprSendEmitter } from '../main/useEvent';

interface IInternalStorage {
  notifications: RemoteNotification[];
  subscriberId: string;
}

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
  notifications: [],
  unSeenCount: 0,
  lastFetchedOn: null,
  firstFetchedOn: null,

  fetchNotifications: async () => {
    const config = useConfigStore.getState();
    const thisStore = get();
    const isFirstCall = !thisStore.lastFetchedOn;
    const currentTimeStamp = Date.now();
    const prevMonthTimeStamp = currentTimeStamp - config.batchTimeInterval;
    const currentFetchFrom = thisStore.lastFetchedOn || prevMonthTimeStamp;

    try {
      const response = await getNotifications(currentFetchFrom);
      const data = response.data;

      const newNotifications = isFirstCall
        ? [...data.results]
        : [...data.results, ...thisStore.notifications];

      const newCount = thisStore.unSeenCount + data.unread;
      set(() => ({
        notifications: newNotifications,
        unSeenCount: newCount > config.batchSize ? config.batchSize : newCount,
        lastFetchedOn: currentTimeStamp,
        firstFetchedOn: isFirstCall
          ? prevMonthTimeStamp
          : thisStore.firstFetchedOn,
      }));

      // emit new notification event
      if (!isFirstCall && data.results.length > 0) {
        suprSendEmitter.emit('new_notification', data.results);
      }

      // set in client storage
      const storageData: IInternalStorage = {
        notifications: newNotifications.slice(0, config.batchSize),
        subscriberId: config.subscriberId,
      };
      setClientNotificationStorage(storageData);
    } catch (e) {
      console.log('SUPRSEND: error getting latest notifications', e);
    }

    // polling
    const timerId: ReturnType<typeof setTimeout> = setTimeout(() => {
      thisStore.fetchNotifications();
    }, config.pollingInterval);
    set(() => ({ pollingTimerId: timerId }));
  },

  fetchPrevious: async () => {
    const config = useConfigStore.getState();
    const thisStore = get();
    const currentTimeStamp = Date.now();
    const lastFetchedOn = thisStore.firstFetchedOn || currentTimeStamp;
    const fetchFrom = lastFetchedOn
      ? lastFetchedOn - config.batchTimeInterval
      : currentTimeStamp; //get last month time stamp
    try {
      const response = await getNotifications(fetchFrom, lastFetchedOn);
      const data = response.data;

      const newNotifications = [...thisStore.notifications, ...data.results];

      set(() => ({
        notifications: newNotifications,
        firstFetchedOn: fetchFrom,
      }));
    } catch (e) {
      console.log('SUPRSEND: error getting previous notifications', e);
    }
  },

  clearPolling: () => {
    const pollingTimerId = get().pollingTimerId;
    set({ lastFetchedOn: null, firstFetchedOn: null });
    clearTimeout(pollingTimerId);
  },

  markClicked: (id: string) => {
    const notifications = get().notifications;
    const clickedNotification = notifications.find(
      (item: RemoteNotification) => item.n_id === id,
    );
    if (clickedNotification && !clickedNotification.interacted_on) {
      try {
        markNotificationClicked(id);
        clickedNotification.seen_on = Date.now();
        clickedNotification.interacted_on = Date.now();
        set((store: NotificationStore) => ({ ...store }));

        // set in client storage
        const config = useConfigStore.getState();
        const storageData: IInternalStorage = {
          notifications: notifications.slice(0, config.batchSize),
          subscriberId: config.subscriberId,
        };
        setClientNotificationStorage(storageData);
      } catch (e) {
        console.log('SUPRSEND: error marking notification clicked', e);
      }
    }
  },

  markAllSeen: async () => {
    try {
      const res = await markBellClicked();
      if (res.status !== 200) return;
      set((store: NotificationStore) => ({ ...store, unSeenCount: 0 }));
    } catch (e) {
      console.log('SUPRSEND: error marking all notifications seen', e);
    }
  },

  markAllRead: async () => {
    const notifications = get().notifications;
    try {
      if (notifications?.length <= 0) {
        return;
      }
      markAllRead();
      notifications.forEach((notification: RemoteNotification) => {
        if (!notification.seen_on) {
          notification.seen_on = Date.now();
        }
      });
      set((store: NotificationStore) => ({ ...store, notifications }));

      // set in client storage
      const config = useConfigStore.getState();
      const storageData: IInternalStorage = {
        notifications: get().notifications.slice(0, config.batchSize),
        subscriberId: config.subscriberId,
      };
      setClientNotificationStorage(storageData);
    } catch (e) {
      console.log('SUPRSEND: error marking all notifications read', e);
    }
  },
}));
