import { HistoricResponse } from "../types";

type StorageValues = {
  darkMode: boolean;
  hideDeprecatedRoutes: boolean;
  historicResponses: HistoricResponse[];
  activeWorkspaces: string[];
  collapsedWorkspaces: string[];
};

export const keys = {
  darkMode: "darkMode",
  hideDeprecatedRoutes: "hideDeprecatedRoutes",
  historicResponses: "historic-responses",
  collapsedWorkspaces: "collapsed-workspaces",
  activeWorkspaces: "activeWorkspaces",
} as const;

type StorageKeys = {
  [k in keyof typeof keys as typeof keys[k]]: k;
};
type StorageKey = keyof StorageKeys;
type StorageKeyOf<K extends StorageKey = StorageKey> = StorageKeys[K];
type StorageValue<K extends StorageKey> =
  StorageKeyOf<K> extends keyof StorageValues
    ? StorageValues[StorageKeyOf<K>]
    : never;

export function get<K extends StorageKey>(key: K): StorageValue<K> | null {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return null;
    }

    return JSON.parse(item);
  } catch (err) {
    console.error("Unable to parse JSON from localStorage", err);
    return null;
  }
}

export function set<K extends StorageKey, V extends StorageValue<K>>(
  key: K,
  value: V
): V {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (err) {
    console.error("Unable to stringify JSON for localStorage", err);
    return value;
  }
}

export function remove<K extends StorageKey>(key: K): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("Unable to stringify JSON for localStorage", err);
  }
}
