// The rep's five phases from SPEC.md §5. Boundaries are in minutes.

export const REP_MINUTES = 60;

export const PHASES = [
  { name: "Read and plan", from: 0, to: 5 },
  { name: "Skeleton", from: 5, to: 15 },
  { name: "Components and data", from: 15, to: 40 },
  { name: "Interaction and states", from: 40, to: 50 },
  { name: "Polish and walkthrough", from: 50, to: 60 },
] as const;

/** Tick marks on the progress bar, in minutes. */
export const BOUNDARIES = [5, 15, 40, 50, 60] as const;

export const OVERTIME = "Overtime";

/** 0–4 for the five phases, 5 once past 60 minutes. */
export function phaseIndexAt(elapsedMs: number): number {
  const minutes = elapsedMs / 60_000;
  const index = PHASES.findIndex((p) => minutes < p.to);
  return index === -1 ? PHASES.length : index;
}

export function phaseNameAt(elapsedMs: number): string {
  const index = phaseIndexAt(elapsedMs);
  return index < PHASES.length ? PHASES[index].name : OVERTIME;
}

/** mm:ss, where minutes keep counting past 59. */
export function formatClock(elapsedMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
