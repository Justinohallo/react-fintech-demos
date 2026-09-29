"use client";

import { useSyncExternalStore } from "react";

// A value mirrored to localStorage. Every access is wrapped so private mode,
// blocked storage, or corrupt JSON falls back to the default instead of throwing.

export type LocalStore<T> = {
  get: () => T;
  getServer: () => T;
  set: (next: T) => void;
  subscribe: (listener: () => void) => () => void;
};

const stores = new Map<string, LocalStore<unknown>>();

export function localStore<T>(key: string, fallback: T, parse: (value: unknown) => T | null): LocalStore<T> {
  const existing = stores.get(key);
  if (existing) return existing as LocalStore<T>;

  let cached: T | undefined;
  const listeners = new Set<() => void>();

  const read = (): T => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return fallback;
      return parse(JSON.parse(raw)) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const notify = () => listeners.forEach((l) => l());
  const onStorage = (event: StorageEvent) => {
    if (event.key !== key) return;
    cached = read();
    notify();
  };

  const store: LocalStore<T> = {
    get: () => (cached === undefined ? (cached = read()) : cached),
    getServer: () => fallback,
    set: (next) => {
      cached = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage unavailable: keep the in-memory value for this page view.
      }
      notify();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
  };
  stores.set(key, store as LocalStore<unknown>);
  return store;
}

export function useLocalStore<T>(store: LocalStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.getServer);
}

export const parseBoolean = (value: unknown) => (typeof value === "boolean" ? value : null);
