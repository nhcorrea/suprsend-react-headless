import { utcNow, uuid, epochNow } from './utils';
import { useConfigStore } from './store';
import { httpClient, httpClientCollector } from './api/httpClient';
import type { ResponseNotification } from './types';

export async function getNotifications(after: number, before?: number) {
  const { workspaceKey, subscriberId, distinctId } = useConfigStore.getState();

  const route = `/fetch-notifications/?subscriber_id=${subscriberId}&distinct_id=${distinctId}`;

  const response = await httpClient.get<ResponseNotification>(route, {
    headers: {
      'Authorization': `${workspaceKey}:${uuid()}`,
      'ss-referer': 'react-headless',
      'ss-after': after,
      'ss-before': before || 0,
      'x-amz-date': utcNow(),
    },
  });

  return response;
}

export async function markBellClicked() {
  const { workspaceKey, subscriberId, distinctId } = useConfigStore.getState();

  const data = JSON.stringify({
    time: epochNow(),
    distinct_id: distinctId,
    subscriber_id: subscriberId,
  });

  const response = await httpClient.post<void>('/bell-clicked/', data, {
    headers: {
      'Authorization': `${workspaceKey}:${uuid()}`,
      'Content-Type': 'application/json',
      'x-amz-date': utcNow(),
    },
  });

  return response;
}

export async function markAllRead() {
  const { workspaceKey, subscriberId, distinctId } = useConfigStore.getState();

  const data = JSON.stringify({
    time: epochNow(),
    distinct_id: distinctId,
    subscriber_id: subscriberId,
  });

  const response = await httpClient.post<void>('/mark-all-read/', data, {
    headers: {
      'Authorization': `${workspaceKey}:${uuid()}`,
      'Content-Type': 'application/json',
      'x-amz-date': utcNow(),
    },
  });

  return response;
}

export async function markNotificationClicked(id: string) {
  const { workspaceKey } = useConfigStore.getState();

  const data = JSON.stringify({
    event: '$notification_clicked',
    env: workspaceKey,
    $insert_id: uuid(),
    $time: epochNow(),
    properties: { id },
  });

  const response = await httpClientCollector.post<void>('/event/', data, {
    headers: {
      'Authorization': `${workspaceKey}:${uuid()}`,
      'Content-Type': 'application/json',
      'x-amz-date': utcNow(),
    },
  });

  return response;
}
