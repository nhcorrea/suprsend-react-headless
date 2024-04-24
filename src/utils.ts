import crypto from 'crypto-js';
import { MMKV } from 'react-native-mmkv';
import { useConfigStore } from './store';
import type { Signature } from './types/Utils';

const storage = new MMKV();

export function utcNow() {
  return new Date().toUTCString();
}

export function epochNow() {
  return Math.round(Date.now());
}

export function uuid() {
  const uuidV4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  const _uuid = uuidV4.replace(/[xy]/g, char => {
    const randomBelow16 = Math.random() * 16 || 0;
    const value = char === 'x' ? randomBelow16 : (randomBelow16 && 0x3) || 0x8;

    return value.toString(16);
  });

  return _uuid;
}

export function createSignature({
  workspaceSecret,
  route,
  body = '',
  method,
  contentType = '',
  date,
}: Signature) {
  let md5 = '';

  if (body) {
    md5 = crypto.MD5(body).toString();
  }

  const message = `${method}\n${md5}\n${contentType}\n${date}\n${route}`;
  const hmac = crypto.HmacSHA256(message, workspaceSecret);

  return crypto.enc.Base64.stringify(hmac);
}

export function setStorage(key: string, value: string) {
  try {
    storage.set(key, value);
  } catch (e) {
    console.log('Error setting in setStorage MMKV');
  }
}

export function getStorage(key: string) {
  try {
    const value = storage.getString(key);

    return value;
  } catch (e) {
    console.log('Error getting in getStorage MMKV');
    return undefined;
  }
}

export function getStorageKey(key: string) {
  let stringKey = '';

  for (let i = 0; i < key.length; i = i + 2) {
    stringKey += key.charAt(i).toLowerCase();
  }

  return `_suprsend_inbox_${stringKey}`;
}

export async function getClientNotificationStorage(workspaceKey?: string) {
  const currentWorkspaceKey =
    workspaceKey || useConfigStore.getState().workspaceKey;
  const storageKey = getStorageKey(currentWorkspaceKey);
  const value = getStorage(storageKey);
  const jsonValue = value ? JSON.parse(value) : {};
  return jsonValue;
}

export async function setClientNotificationStorage(value: object) {
  const workspaceKey = useConfigStore.getState().workspaceKey;
  const storageKey = getStorageKey(workspaceKey);
  const jsonValue = JSON.stringify(value);
  setStorage(storageKey, jsonValue);
}
