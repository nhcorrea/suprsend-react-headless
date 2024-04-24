import { create } from 'zustand';
import type { ConfigStore } from '../types';

const SECONDS_20 = 20000; // 20 seconds in ms
const DAYS_30 = 2592000000; // 30 days in ms

export const useConfigStore = create<ConfigStore>(() => ({
  workspaceKey: '',
  workspaceSecret: '',
  distinctId: '',
  subscriberId: '',
  collectorApiUrl: 'https://hub.suprsend.com',
  apiUrl: 'https://inboxs.live',
  pollingInterval: SECONDS_20,
  batchSize: 20,
  batchTimeInterval: DAYS_30,
}));
