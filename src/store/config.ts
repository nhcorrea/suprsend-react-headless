import { create } from 'zustand';
import type { ConfigStore } from '../types';

const SECONDS_20 = 20000; // 20 seconds in ms
const DAYS_30 = 2592000000; // 30 days in ms
const BATCH_SIZE = 20;

export const useConfigStore = create<ConfigStore>(() => ({
  workspaceKey: '',
  workspaceSecret: '',
  distinctId: '',
  subscriberId: '',
  pollingInterval: SECONDS_20,
  batchSize: BATCH_SIZE,
  batchTimeInterval: DAYS_30,
}));
