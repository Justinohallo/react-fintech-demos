// Issue tags a review may use, transcribed from SPEC.md §6 (Architect-owned).
// A fixed list, so /progress can count how often each habit recurs.

export const REVIEW_TAGS = {
  "analysis-overrun": "Read and plan ran past 5 minutes",
  "hard-coded-data": "Values typed into the page that exist in the data file",
  "missing-derivation": "A derived value missing, wrong, or stored instead of computed",
  "money-formatting": "Money not in integer cents, or not formatted with `Intl.NumberFormat`",
  "missing-tier": "A tier's layout was not built",
  "desktop-first": "Built wide and squeezed down, or used variants outside the standard",
  "non-semantic-markup": "Headings for size, `div`s for buttons or lists, missing landmarks",
  "missing-keys": "List items without stable keys",
  "state-misuse": "Derived values held in state, or effects used to sync state",
  "interaction-unfinished": "The challenge's core interaction does not work",
  "a11y-item-skipped": "A challenge accessibility item was not attempted",
  "focus-management": "Focus lost, not moved, or not returned",
} as const;

export type ReviewTag = keyof typeof REVIEW_TAGS;

export const isReviewTag = (tag: string): tag is ReviewTag => tag in REVIEW_TAGS;
