export interface UserConfig {
  workspaceKey: string;
  workspaceSecret?: string;
  distinctId: string;
  subscriberId: string;
}

export interface InternalConfig {
  apiUrl: string;
  pollingInterval: number;
  batchSize: number;
  batchTimeInterval: number;
  collectorApiUrl: string;
}

export interface ConfigStore extends UserConfig, InternalConfig {}
