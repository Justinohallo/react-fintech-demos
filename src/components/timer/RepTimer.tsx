"use client";

import { useEffect, useRef } from "react";
import { shellMono, shellSans } from "@/lib/fonts";
import { BOUNDARIES, REP_MINUTES, formatClock, phaseIndexAt, phaseNameAt, PHASES } from "@/lib/phases";
import { useLocalStore } from "./localStore";
import {
  collapsedStore,
  elapsedMs,
  mutedStore,
  pauseTimer,
  resetTimer,
  startTimer,
  statusOf,
  useClock,
  useTimer,
} from "./timerStore";
import { playTone, primeAudio } from "./tone";

const CUE_MS = 5_000;
const REP_MS = REP_MINUTES * 60_000;

export function RepTimer({ challenge }: { challenge: string }) {
  const state = useTimer(challenge);
  const now = useClock();
  const muted = useLocalStore(mutedStore);
  const collapsed = useLocalStore(collapsedStore);

  const status = statusOf(state);
  const elapsed = elapsedMs(state, now);
  const phaseIndex = phaseIndexAt(elapsed);
  const overtime = elapsed >= REP_MS;
  const clock = formatClock(elapsed);

  // Most recent boundary crossed; the cue shows for a few seconds after it.
  const lastBoundary = [...BOUNDARIES].reverse().find((m) => elapsed >= m * 60_000);
  const cue =
    status === "running" && lastBoundary !== undefined && elapsed - lastBoundary * 60_000 < CUE_MS
      ? lastBoundary === REP_MINUTES
        ? "60:00. Give your closing statement."
        : `Next phase: ${PHASES[phaseIndex].name}`
      : null;

  // Tone on each forward phase change while running. Skipped until the clock
  // is live (now > 0) so hydration and reloads never beep.
  const lastPhase = useRef<number | null>(null);
  useEffect(() => {
    if (now === 0) return;
    const previous = lastPhase.current;
    lastPhase.current = phaseIndex;
    if (previous !== null && phaseIndex > previous && status === "running" && !muted) playTone();
  }, [now, phaseIndex, status, muted]);

  const start = () => {
    primeAudio();
    startTimer(challenge);
  };

  if (collapsed) {
    return (
      <section aria-label="Rep timer" className={`${shellSans.className} fixed bottom-4 right-4 z-[1000]`}>
        <button
          type="button"
          onClick={() => collapsedStore.set(false)}
          aria-label={`Expand timer, ${clock}`}
          className={`flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm text-white shadow-lg ring-1 ring-black/10 hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 ${cue ? "animate-pulse" : ""}`}
        >
          <span
            aria-hidden
            className={`size-2 rounded-full ${status === "running" ? (overtime ? "bg-amber-400" : "bg-teal-400") : "bg-stone-500"}`}
          />
          <span className={`${shellMono.className} tabular-nums ${overtime ? "text-amber-300" : ""}`}>{clock}</span>
        </button>
      </section>
    );
  }

  return (
    <section
      aria-label="Rep timer"
      className={`${shellSans.className} fixed bottom-4 right-4 z-[1000] w-72 rounded-xl bg-white p-4 text-stone-900 shadow-lg ring-1 transition-shadow ${cue ? "ring-2 ring-amber-400" : "ring-stone-200"}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">Rep · Challenge {challenge}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-pressed={muted}
            onClick={() => mutedStore.set(!muted)}
            className="rounded-md px-2 py-1 text-xs text-stone-500 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            type="button"
            aria-label="Collapse timer"
            onClick={() => collapsedStore.set(true)}
            className="rounded-md px-2 py-1 text-stone-500 hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75">
              <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p
          role="timer"
          aria-label="Elapsed time"
          className={`${shellMono.className} text-3xl font-medium tabular-nums ${overtime ? "text-amber-600" : ""}`}
        >
          {clock}
        </p>
        <p className={`text-right text-sm ${overtime ? "font-medium text-amber-700" : "text-stone-600"}`}>
          {phaseNameAt(elapsed)}
        </p>
      </div>

      <div className="relative mt-3 h-1.5 rounded-full bg-stone-100" aria-hidden>
        <div
          className={`h-full rounded-full ${overtime ? "bg-amber-500" : "bg-teal-600"}`}
          style={{ width: `${Math.min(elapsed / REP_MS, 1) * 100}%` }}
        />
        {BOUNDARIES.map((m) => (
          <span
            key={m}
            className="absolute -top-0.5 h-2.5 w-px bg-stone-400"
            style={{ left: `calc(${(m / REP_MINUTES) * 100}% - ${m === REP_MINUTES ? 1 : 0}px)` }}
          />
        ))}
      </div>
      <div className={`${shellMono.className} relative mt-1 h-3 text-[10px] text-stone-400`} aria-hidden>
        {BOUNDARIES.map((m) => (
          <span
            key={m}
            className="absolute -translate-x-1/2 last:translate-x-[-100%]"
            style={{ left: `${(m / REP_MINUTES) * 100}%` }}
          >
            {m}
          </span>
        ))}
      </div>

      <p role="status" className="mt-2 min-h-5 text-sm font-medium text-amber-700">
        {cue}
      </p>

      <div className="mt-2 flex gap-2">
        {status === "running" ? (
          <button type="button" onClick={() => pauseTimer(challenge)} className={buttonClass("secondary")}>
            Pause
          </button>
        ) : (
          <button type="button" onClick={start} className={buttonClass("primary")}>
            Start
          </button>
        )}
        <button
          type="button"
          onClick={() => resetTimer(challenge)}
          disabled={status === "idle"}
          className={buttonClass("secondary")}
        >
          Reset
        </button>
      </div>
    </section>
  );
}

function buttonClass(kind: "primary" | "secondary") {
  const base =
    "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-40";
  return kind === "primary"
    ? `${base} bg-teal-700 text-white hover:bg-teal-800`
    : `${base} bg-stone-100 text-stone-900 hover:bg-stone-200`;
}
