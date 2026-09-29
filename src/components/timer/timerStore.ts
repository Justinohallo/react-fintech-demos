"use client";

import { useSyncExternalStore } from "react";
import { localStore, parseBoolean, useLocalStore } from "./localStore";

// One timer per challenge, shared by the brief page and its attempt pages.
// Persisted as the start timestamp plus paused state; elapsed time is derived.

export type TimerState = {
  startedAt: number | null;
  pausedAt: number | null;
  pausedMs: number;
};

export type TimerStatus = "idle" | "running" | "paused";

const IDLE: TimerState = { startedAt: null, pausedAt: null, pausedMs: 0 };

const isNumberOrNull = (v: unknown) => v === null || typeof v === "number";

function parseTimer(value: unknown): TimerState | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  if (!isNumberOrNull(v.startedAt) || !isNumberOrNull(v.pausedAt) || typeof v.pausedMs !== "number") return null;
  return { startedAt: v.startedAt as number | null, pausedAt: v.pausedAt as number | null, pausedMs: v.pausedMs };
}

export const timerStore = (challenge: string) => localStore(`kestrel:timer:${challenge}`, IDLE, parseTimer);
export const mutedStore = localStore("kestrel:timer:muted", false, parseBoolean);
export const collapsedStore = localStore("kestrel:timer:collapsed", false, parseBoolean);

export function statusOf(state: TimerState): TimerStatus {
  if (state.startedAt === null) return "idle";
  return state.pausedAt === null ? "running" : "paused";
}

export function elapsedMs(state: TimerState, now: number): number {
  if (state.startedAt === null) return 0;
  return Math.max(0, (state.pausedAt ?? now) - state.startedAt - state.pausedMs);
}

export function startTimer(challenge: string) {
  const store = timerStore(challenge);
  const state = store.get();
  const now = Date.now();
  if (state.startedAt === null) store.set({ startedAt: now, pausedAt: null, pausedMs: 0 });
  else if (state.pausedAt !== null) store.set({ ...state, pausedAt: null, pausedMs: state.pausedMs + (now - state.pausedAt) });
}

export function pauseTimer(challenge: string) {
  const store = timerStore(challenge);
  const state = store.get();
  if (statusOf(state) === "running") store.set({ ...state, pausedAt: Date.now() });
}

export function resetTimer(challenge: string) {
  timerStore(challenge).set(IDLE);
}

export function useTimer(challenge: string): TimerState {
  return useLocalStore(timerStore(challenge));
}

// A shared wall clock. The server snapshot is 0, which marks "not hydrated yet".
let clockNow = 0;
const clockListeners = new Set<() => void>();
let clockInterval: ReturnType<typeof setInterval> | undefined;

function subscribeClock(listener: () => void) {
  clockListeners.add(listener);
  clockNow = Date.now();
  if (!clockInterval) {
    clockInterval = setInterval(() => {
      clockNow = Date.now();
      clockListeners.forEach((l) => l());
    }, 250);
  }
  return () => {
    clockListeners.delete(listener);
    if (clockListeners.size === 0 && clockInterval) {
      clearInterval(clockInterval);
      clockInterval = undefined;
    }
  };
}

export function useClock(): number {
  return useSyncExternalStore(subscribeClock, () => clockNow, () => 0);
}
