export type WebStorageType = 'SESSION' | 'LOCAL';

export const STORAGE_KEYS = {
  uid: '@UID_KEY',
} as const;

export type StorageKeyType = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export function getStorageData(type: WebStorageType, key: StorageKeyType) {
  if (type === 'SESSION') {
    return sessionStorage.getItem(key);
  } else {
    return localStorage.getItem(key);
  }
}

export function setStorageData(
  type: WebStorageType,
  key: StorageKeyType,
  data: string,
) {
  if (type === 'SESSION') {
    sessionStorage.setItem(key, data);
  } else {
    localStorage.setItem(key, data);
  }
}

export function removeStorageData(type: WebStorageType, key: StorageKeyType) {
  if (type === 'SESSION') {
    sessionStorage.removeItem(key);
  } else {
    localStorage.removeItem(key);
  }
}
