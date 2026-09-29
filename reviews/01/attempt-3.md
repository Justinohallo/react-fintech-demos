---
challenge: 01
attempt: 3
date: 2026-09-29
minutes: 60
phase: Interaction and states
acs: 5/10
a11y: 4/8
analysis_minutes: 5
tags: money-formatting, missing-derivation, non-semantic-markup, missing-keys, a11y-item-skipped
focus: Write `formatUSD(cents)` before any layout; it is three reps overdue | Give every heading an `id` and point `aria-labelledby` at it, on the section and on its list | Add the Total row and `key={x.id}` as you write each `.map()`, then run `npm run check -- 01 N` at 40
---

## Score

**5/10 ACs · 4/8 a11y**, 1 manual (C01-AC7). Your best AC score so far, and every layout AC passes.

## What landed

- **The whole responsive layout (C01-AC8, 9, 10, 11).** This is the first rep with all three tiers, and the approach is the reference's: one grid whose areas change at `tablet:` and `desktop:` (`page.jsx:99–106`), placement passed in from the page (`page.jsx:109–113`), and `desktop:self-start` so Accounts hugs its content (`page.jsx:111`). Last rep's first focus point, done.
- **Heading (C01-AC1) and heading structure (A11Y-5).** One `h1` (`page.jsx:20`), then `h2`s (lines 41, 66).
- **Keyboard and reflow (A11Y-3, A11Y-4, A11Y-6).**
- **Data flow, fixed since rep 2, even where tests still fail:**
  - Both lists are mapped from the data (`page.jsx:44`, `69`), so the two empty components from rep 2 are filled.
  - The change is derived (`page.jsx:14`), and the percentage now uses the **previous** balance (`page.jsx:15`). That was a rep 2 bug, and it's fixed.
  - Every value on the page comes from `data`: no typed numbers.
- **Empty states** for both lists (`page.jsx:42–53`, `67–78`): a state the design doesn't show, which the worksheet asks for.

## What didn't, and why

| ID | Cause |
|---|---|
| C01-AC2 | The balance renders raw cents: `{balanceCents}` shows `18432075` (`page.jsx:21`). The test expects `$184,320.75`. There is no money formatting anywhere in the attempt. |
| C01-AC3 | `{amountChangeCents} ({amountChangePercentage})` renders `1482075 (0.08743805…)` (`page.jsx:24`). The test expects `+$14,820.75` and `+8.7%`: both values are right, only unformatted. |
| C01-AC4 | All 6 rows render, but the test looks for a list **named** "Recent activity", and the `<ul>` at `page.jsx:68` has no name, so it finds 0 items. `aria-labelledby={title}` on the section (line 64) doesn't help: it expects an element `id`, and "Recent Activity" isn't one. |
| C01-AC5 | The same unnamed list, and amounts render raw (`page.jsx:72`); the test expects `-$4,820.00`. |
| C01-AC6 | No "Total" row: the Accounts card ends at its list (`page.jsx:50`). |
| A11Y-1, A11Y-2 | `color-contrast`: `text-emerald-500` (`page.jsx:23`) is too light on white. `emerald-700` passes, and it's what your own Tokens line chose (notes line 48). |
| C01-A11Y1 | `Account Number **** {last4}` (`page.jsx:28`) has no screen-reader text containing "ending in 4821". `last4` now comes from the data, which is an improvement on rep 2's typed digits. |
| C01-A11Y2 | There's no avatar: the header renders the placeholder text "Header" (`page.jsx:8`). |

## Against the reference analysis

- **Tree:** `AccountCard`, `AccountsCard` and `ActivityCard`, each owning its section and placed by the page: that's the reference's shape, and the [Composing components](/guides/composing-components) pattern. Missing: `TopBar` (the header is a placeholder) and `Total`.
- **Tokens:** the notes (lines 46–50) picked `gray-200` page, `gray-300` border, `emerald-700` / `red-700` status, and `gray-300` paragraph text. The code uses `bg-gray-100` (`page.jsx:87`), a colourless `border` (`page.jsx:6`) and `emerald-500` (`page.jsx:23`), so the plan's tokens weren't carried into the code. The mock's greys are warm (`stone`), not `gray`.
- **Breakpoints:** matches the reference: stack, then `tablet:` balance and accounts beside each other with activity below, then `desktop:` 2fr / 1fr with Accounts spanning. The notes' Tiers line only had 375 and 768 (notes lines 37–38), but the code got 1280 right.
- **State:** none. The notes (line 63) and the code agree.
- **Traps hit:** *"Formatting with `toFixed` and a hand-placed `$`"*: this time the formatting was skipped entirely, which is the same root cause (no `formatUSD` helper built first). *"Dividing by the previous balance without guarding zero"*: the base is now correct, but still unguarded (`page.jsx:15`).

## Process

- **Rep minutes: 60 (estimated).** The notes leave it blank; the checkpoint table runs to 60. **Phase reached: Interaction and states (estimated).** The table claims the closing statement at 60, but the closing-statement lines are empty (notes lines 110–112). The empty states in the code (lines 42–53, 67–78) support Interaction and states.
- **Analysis: 5 minutes,** from the checkpoint table. Started and Finished were left blank.
- **Checkpoints:**

  | Checkpoint | Target | Actual |
  |---|---|---|
  | Plan written | 5 | 5 |
  | Every region on screen at all three tiers | 15 | 15 |
  | All content rendered from data | 40 | 20 |
  | Core interaction and states working | 50 | 40 |
  | Closing statement given | 60 | 60 |

  **First checkpoint that slipped:** "All content rendered from data" is marked at 20. The content is from data, but it's unformatted: raw cents in four places (lines 21, 24, 47, 72). The phase's "done when" is real content, and `18432075` isn't real content yet. Everything after that point was built on unformatted numbers.
- **Lookups: 7, from the help log.** Five of them were styling: `md:` vs `tablet:`, grid items not filling their cell, one item not stretching, centring with a max width, and typography. Two were structure and markup: semantic layout, and where semantics belong. The top one, and the stall in the notes ("Looking up the css grid in tailwind"), was the grid. None were about money formatting, yet that's where the most ACs went.
- **Self-check:** all four boxes are unticked (notes lines 103–106), but the attempt does better than the ticks say. All three tiers **are** built, and every value **does** come from the data. Whether the Requirements were read first, and whether `npm run check` ran before 60, the notes don't say.
- **Notes format:** the answers for Requirements, Tiers, State and Questions were typed on `>` quote lines (notes lines 25–28, 36–38, 63, 67), most likely because the editor continued the prompt's quote. They're read as answers here. The template is being fixed so this can't happen.

## Accessibility

**4/8**, the same as rep 2. The routes to 8/8, in order of effort:

1. `text-emerald-700` for the change (A11Y-1, A11Y-2), and pick red or green from the sign.
2. `<span className="sr-only">{`Account number ending in ${last4}`}</span>` beside an `aria-hidden` visible number (C01-A11Y1). Rep 2 had this pattern right (rep 2's `page.jsx:51–52`).
3. Build the header, with an avatar that has `role="img"` and a full-name `aria-label` (C01-A11Y2).

## Compared with earlier reps

Against [attempt 1](/progress/01/1) and [attempt 2](/progress/01/2):

- **ACs 4 → 2 → 5; a11y 5 → 4 → 4.**
- **Gone this rep:** `missing-tier` (in both earlier reps; last rep's focus 2, done) and `hard-coded-data` (last rep's focus 3, done: both lists are mapped). `analysis-overrun` stays gone: 12 → 4 → 5 minutes.
- **Recurring:** `money-formatting` in **all three reps**, and it was focus point 1 last time. That makes it the top priority. `missing-derivation` (the Total) and `a11y-item-skipped` also recur.
- **Back:** `missing-keys` (lists were rendered again; `id` was used where `key` belongs). `non-semantic-markup` is back because of `aria-labelledby` pointing at text instead of an id.

## Next rep

1. **Write `formatUSD(cents)` before any layout; it's three reps overdue.** Two minutes at the start: `Intl.NumberFormat` in USD, ÷100, and a signed version with `signDisplay: "always"`. Then every money value goes through it as you write it. That's AC2, AC3 and most of AC5. Guide: [Props and money](/guides/props-and-money).
2. **Give every heading an `id` and point `aria-labelledby` at it, on the section and on its list.** `<h2 id="activity-heading">` with `aria-labelledby="activity-heading"` on the `<ul>` fixes AC4 and AC5's lookups, and names each section. Guide: [Composing components](/guides/composing-components).
3. **Add the Total row and `key={x.id}` as you write each `.map()`, then run `npm run check -- 01 N` at 40.** The check names exactly what's left; this rep it would have listed the Total, the list name and the formatting. Guide: [Props and money](/guides/props-and-money).
