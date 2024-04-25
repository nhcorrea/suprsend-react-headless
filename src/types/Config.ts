export interface UserConfig {
  workspaceKey: string;
  workspaceSecret?: string;
  distinctId: string;
  subscriberId: string;
}

export interface InternalConfig {
  pollingInterval: number;
  batchSize: number;
  batchTimeInterval: number;
}

export interface ConfigStore extends UserConfig, InternalConfig {}
