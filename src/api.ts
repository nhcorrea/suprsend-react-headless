import { utcNow, uuid, epochNow } from './utils';
import { useConfigStore } from './store';

export function getNotifications(after: number, before?: number) {
  const { apiUrl, workspaceKey, subscriberId, distinctId } =
    useConfigStore.getState();
  const date = utcNow();
  const route = `/fetch-notifications/?subscriber_id=${subscriberId}&distinct_id=${distinctId}`;

  return fetch(`${apiUrl}${route}`, {
    method: 'GET',
    headers: <any>{
      'Authorization': `${workspaceKey}:${uuid()}`,
      'ss-referer': 'react-headless',
      'ss-after': after,
      'ss-before': before || 0,
      'x-amz-date': date,
    },
  });
}

export function markNotificationClicked(id: string) {
  const { collectorApiUrl, workspaceKey } = useConfigStore.getState();

  const body = {
    event: '$notification_clicked',
    env: workspaceKey,
    $insert_id: uuid(),
    $time: epochNow(),
    properties: { id },
  };

  return fetch(`${collectorApiUrl}/event/`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Authorization': `${workspaceKey}:${uuid()}`,
      'Content-Type': 'application/json',
      'x-amz-date': utcNow(),
    },
  });
}

export function markBellClicked() {
  const { apiUrl, workspaceKey, subscriberId, distinctId } =
    useConfigStore.getState();
  const date = utcNow();
  const route = '/bell-clicked/';
  const body = JSON.stringify({
    time: epochNow(),
    distinct_id: distinctId,
    subscriber_id: subscriberId,
  });

  return fetch(`${apiUrl}${route}`, {
    method: 'POST',
    body,
    headers: {
      'Authorization': `${workspaceKey}:${uuid()}`,
      'Content-Type': 'application/json',
      'x-amz-date': date,
    },
  });
}

export function markAllRead() {
  const { apiUrl, workspaceKey, subscriberId, distinctId } =
    useConfigStore.getState();
  const date = utcNow();
  const route = '/mark-all-read/';
  const body = JSON.stringify({
    time: epochNow(),
    distinct_id: distinctId,
    subscriber_id: subscriberId,
  });

  return fetch(`${apiUrl}${route}`, {
    method: 'POST',
    body,
    headers: {
      'Authorization': `${workspaceKey}:${uuid()}`,
      'Content-Type': 'application/json',
      'x-amz-date': date,
    },
  });
}
