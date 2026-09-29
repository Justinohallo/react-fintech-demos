---
challenge: 01
attempt: 2
date: 2026-09-29
minutes: 60
phase: Components and data
acs: 2/10
a11y: 4/8
analysis_minutes: 4
tags: money-formatting, missing-tier, missing-derivation, hard-coded-data, a11y-item-skipped
focus: Write `formatUSD(cents)` first (÷100, USD, `signDisplay: "always"` for changes) and pass cents everywhere | Put `tablet:` and `desktop:` on the grid in the skeleton, and check 768 and 1280 before minute 15 | Map `accounts` and `transactions` before styling anything, then run `npm run check -- 01 N` at minute 40
---

## Score

**2/10 ACs · 4/8 a11y**, 1 manual (C01-AC7). Down from 4/10 · 5/8, but read on: the process improved, and most of the lost points trace to two small, specific causes.

## What landed

- **Heading (C01-AC1).** "Operating Account" is the page's `h1` (`page.jsx:26`, via `isPrimary` at line 76).
- **No sideways scroll at any tier (C01-AC8, A11Y-6).** The single-column grid (`page.jsx:71`) never overflows.
- **Heading structure (A11Y-5), fixed since attempt 1.** One `h1`, then `h2`s, with no skipped levels. Last time the balance was an `h3`; now it's a `<p>` (`page.jsx:43`).
- **Keyboard (A11Y-3, A11Y-4).** Nothing is unreachable, and focus is visible.
- **Real progress on data and money, even where tests still fail:**
  - The data is imported and destructured (`page.jsx:62–66`).
  - The change is **derived**, not typed: `balanceCents - previousBalanceCents` (`page.jsx:67`).
  - Formatting goes through `Intl.NumberFormat` (`page.jsx:6–14`) instead of hand-typed strings.
  - The masked number uses the right pattern: visible text `aria-hidden`, plus a screen-reader-only sentence (`page.jsx:51–52`).

  These are exactly the habits attempt 1 was missing.

## What didn't, and why

| ID | Cause |
|---|---|
| C01-AC2 | The balance renders the raw cents: `{amount}` is `18432075` (`page.jsx:43`, passed `balanceCents` at line 81). The test looks for `$184,320.75`. Divide by 100 and format. |
| C01-AC3 | Three separate bugs. **Cents not divided by 100:** `toUSD(amountChange)` formats 1482075 as `$1,482,075.00` (`page.jsx:38`). **Wrong denominator:** the percentage divides by the *current* balance (`page.jsx:68`), giving 8.04% instead of **8.7%** (change ÷ *previous*). **Currency:** `en-CA` and `CAD` (`page.jsx:7`); the brief asks for USD. The test expects `+$14,820.75` and `+8.7%`. |
| C01-AC4 | `RecentActivity` renders an empty fragment (`page.jsx:59`); `transactions` is destructured (line 65) but never used. The list also needs an accessible name "Recent activity" (see attempt 1's review). |
| C01-AC5 | No transactions are rendered, so no negative amount exists. Separately, the hand-placed sign on line 38 would produce `--$5,000.00` for a negative, because `Intl` already includes the minus. |
| C01-AC6 | `Accounts` renders an empty fragment (`page.jsx:58`); `accounts` is unused (line 64). No "Total". |
| C01-AC9 | **A typo:** the heading reads "Acccounts" (`page.jsx:86`, three c's). The layout tests locate each card by its heading, find no heading named "Accounts", and fail before measuring anything. Your mobile stack order is otherwise correct; with the typo fixed, this AC would pass. |
| C01-AC10 | The typo, and the grid has no `tablet:` classes (`page.jsx:71`), so at 768 everything is still one column. |
| C01-AC11 | The typo, and no `desktop:` classes (`page.jsx:71`). |
| A11Y-1, A11Y-2 | `color-contrast`: `text-green-500` on white (`page.jsx:45`) is below 4.5:1. The Visual direction's `emerald-700` passes. |
| C01-A11Y1 | Right idea, near miss. The screen-reader text says "ending in 4 8 2 1" (`page.jsx:51`), spaced so each digit is read individually, which is a real technique. But the item asks for text that includes "ending in 4821", and the digits are **typed** rather than taken from `last4`. |
| C01-A11Y2 | The avatar is a `div` containing "PR" (`page.jsx:19–21`), with no accessible name that includes the full name. |

## Against the reference analysis

- **Tree:** Header, Card, OperatingAccount, Accounts, RecentActivity: the same good tree as attempt 1. `Total` is still missing, because Accounts is empty.
- **Tokens:**
  - The notes read "Page: slate-500" (notes line 48); the page uses `bg-gray-200` (`page.jsx:71`). The mock's page is a warm off-white, a light `stone`, not a mid grey.
  - Cards use `rounded` (4px) and a bare `border` (`page.jsx:25`). In Tailwind v4 an unset border colour is `currentColor`, so it draws dark, not `stone-200`.
  - The cards have no padding.
  - `text-grey-200` (`page.jsx:48`) is the `grey`/`gray` spelling: Tailwind ignores it silently.
  - Fraunces and Inter are not loaded.
- **Breakpoints:** the plan's tablet line (notes line 39) matches the reference exactly: balance and Accounts side by side, Recent activity full width below. The plan's desktop line, "Same as 786", does not: at 1280 Accounts moves to a right column spanning both rows (2fr / 1fr). In the code, only the mobile base was built (`page.jsx:71`).
- **State:** none. The notes say so (line 57) and the code has none. Correct.
- **Traps hit:**
  - *"Formatting with `toFixed` and a hand-placed `$` breaks negatives and separators."* `Intl` replaced `toFixed`, which is progress. But the sign is still hand-placed (`page.jsx:38, 40`), and it breaks negatives the way the trap describes.
  - *"Dividing by the previous balance without guarding zero."* The division is unguarded, and uses the wrong balance (`page.jsx:68`).

## Process

- **Rep minutes:** 60. **Phase reached:** Components and data, from the notes.
- **Analysis: 4 minutes.** From the checkpoint table ("Plan written: 4"). `Started at: 12:58` and `Finished at: 1:58` span 60 minutes, which matches the whole rep, so they were read as the rep's start and end. The template didn't say which it wanted; that's being fixed.
- **Checkpoints:**

  | Checkpoint | Target | Actual |
  |---|---|---|
  | Plan written | 5 | 4 |
  | Every region on screen at all three tiers | 15 | 15 (notes) |
  | All content rendered from data | 40 | not reached |
  | Core interaction and states working | 50 | not reached |
  | Closing statement given | 60 | not reached |

  The notes mark 15 as reached, but the code has no tier classes (`page.jsx:71`), so the **first checkpoint that actually slipped is "every region at all three tiers"**. Every region was on screen by 15, but only at one width.
- **Where the time went:** the notes (line 81) describe a long detour deciding whether components should receive formatted strings or raw values, and how to name cents-valued props. That's a real design question, and it has a short answer that also removes the sign bug:
  - pass **cents** as numbers, and name them `…Cents`;
  - decide colour from the number (`cents < 0`);
  - format only at render, with one helper that includes the sign via `signDisplay: "always"`.

  No component ever needs a pre-formatted string, and no code needs to prepend "+" or "-".
- **Stalls:** "Getting hung up on data formatting." **Lookups:** "Looking up data format methods." These are the same issue as above.
- **Self-check:**
  - Ticked "Every value on the page comes from the data file", but `4 8 2 1` is typed (`page.jsx:51`), and Accounts and Recent activity render nothing.
  - Ticked "I read the Requirements before opening the mock", but the Requirements slot holds a question, not a count (notes line 26).
  - The two unticked boxes (three tiers; `npm run check` before 60:00) match the attempt. A check at minute 40 would have shown the "Acccounts" typo and the raw cents in seconds.
- **Closing statement:** not written.
- **On "I don't understand how you're supposed to do this in 5 minutes"** (notes line 65): by your own table, you did it in 4. What a 5-minute plan looks like is exactly what you produced: some lines full, some thin. The one gap that cost the most was the **empty Data line** (notes line 53). The two components that render nothing are the two that needed `.map()` over the data.

## Accessibility

**4/8**, down from 5/8: A11Y-5 now passes, but a colour-contrast failure is new. To reach 8/8:

1. Use `text-emerald-700` / `text-rose-700` for the change (A11Y-1, A11Y-2), which is what the Visual direction specifies anyway.
2. Build the screen-reader sentence from the data: `` `Account number ending in ${last4}` `` (C01-A11Y1).
3. Give the avatar `role="img"` and `aria-label` with the full name (C01-A11Y2).

## Compared with earlier reps

Against [attempt 1](/progress/01/1):

- **Scores:** ACs 4/10 → 2/10; a11y 5/8 → 4/8.
- **Why the scores fell:**
  - attempt 1's AC2 passed on a hand-typed `$184,320.75`, while this attempt formats real data but forgot `/100`;
  - one typo ("Acccounts") blocks three layout ACs;
  - one colour class fails contrast.

  None of these is a missing skill.
- **Tags that went away:**
  - `analysis-overrun`: 12 minutes → 4.
  - `non-semantic-markup`: heading levels fixed; A11Y-5 now passes.
  - `missing-keys`: not exercised, because no lists were rendered.
- **Tags that recur:** `money-formatting`, `missing-tier`, `missing-derivation`, `hard-coded-data` (much reduced: one line) and `a11y-item-skipped`.

  **`missing-tier` is in both reps.** In both, the tablet layout was planned and never coded. That makes it the habit to drill next.

## Next rep

1. **Write `formatUSD(cents)` first**: ÷100, USD, and `signDisplay: "always"` for changes. Pass cents everywhere. It settles the props question and fixes AC2, AC3 and AC5 at once.
2. **Put `tablet:` and `desktop:` on the grid in the skeleton, and check 768 and 1280 before minute 15.** Your tablet plan was already right; code it before any card content. Guide: [The 5-minute read](/guides/the-5-minute-read).
3. **Map `accounts` and `transactions` before styling anything, then run `npm run check -- 01 N` at minute 40.** The empty Data line became two empty components. The check would have caught the typo and the raw cents. Guide: [The 5-minute read](/guides/the-5-minute-read).
