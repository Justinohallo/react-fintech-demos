// Universal accessibility checks, transcribed from SPEC.md §2 (Architect-owned).
// Tested by tests/a11y.spec.ts on every challenge. Bonus points; never a failure.

import type { A11yItem } from "./challenges";

export const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] as const;

export const UNIVERSAL_A11Y: A11yItem[] = [
  {
    id: "A11Y-1",
    text: "axe finds no violations tagged `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` or `wcag22aa` at 1280×800",
  },
  { id: "A11Y-2", text: "The same at 375×812" },
  {
    id: "A11Y-3",
    text: "Every enabled button, link, form control, switch and tab can be reached with Tab (one stop per radio group or tablist)",
  },
  { id: "A11Y-4", text: "Every such control visibly changes when it receives keyboard focus" },
  { id: "A11Y-5", text: "One `main` landmark, one level-1 heading, and no skipped heading levels" },
  { id: "A11Y-6", text: "At 320×640 (WCAG reflow), the page does not scroll horizontally" },
];
