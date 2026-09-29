---
challenge: 01
attempt: 1
date: 2026-09-29
minutes: 60
phase: Components and data
acs: 4/10
a11y: 5/8
analysis_minutes: 12
tags: analysis-overrun, hard-coded-data, missing-derivation, money-formatting, missing-tier, non-semantic-markup, missing-keys, a11y-item-skipped
focus: Open `data/01-treasury.json` in minute one and render only from `data`; never type a value that is in it | Build the grid at all three tiers during Skeleton (5–15), before any card content | Keep Read and plan to 5 minutes as a five-line list: regions, tiers, tokens, data, state
---

## Score

**4/10 ACs · 5/8 a11y**, 1 manual (C01-AC7). Checked 2026-09-29 against `/challenges/01/deliverable/attempt-1`.

## What landed

- **Heading and balance (C01-AC1, C01-AC2).** "Operating Account" is a real `h1` (`page.jsx:20`), and the balance reads `$184,320.75` (`page.jsx:37`). AC2 passes only because that string is typed by hand; see below.
- **Mobile layout (C01-AC8, C01-AC9).** One column in the right order, with no sideways scroll at any tier. `flex flex-col` (`page.jsx:87`) is a correct mobile base.
- **Accessibility foundations (A11Y-1, 2, 3, 4, 6).** No axe violations at either width, full keyboard reach, visible focus, and reflow at 320px. Using `<main>` (`page.jsx:86`) and real `<ul>`/`<li>` lists is why.
- **The component tree.** `Header`, `Card`, `OperatingAccount`, `Accounts` and `RecentActivity` map almost one-to-one onto the reference tree. The generic `Card` with `title` and `children` (`page.jsx:17`) is a good call.

## What didn't, and why

| ID | Cause |
|---|---|
| C01-AC3 | `page.jsx:27–28` hard-codes `14_820.75` and `0.87`, and line 39 prints them raw: no sign, no `$`. The percentage is also wrong: the change is **8.7%**, not 0.87. The test expects `+$14,820.75` and `+8.7%`, derived from `balanceCents − previousBalanceCents`. |
| C01-AC4 | The list has 1 hard-coded row (`page.jsx:99–106`), not the 6 in the data. It would still fail at 6 rows: the test looks for a list **named** "Recent activity", and the `<ul>` at `page.jsx:67` has no accessible name. Add `aria-label="Recent activity"` or `aria-labelledby` pointing at the card's heading. |
| C01-AC5 | No negative transaction is rendered, because only the first (positive) row was typed in. |
| C01-AC6 | No "Total", and only 1 of 3 accounts (`page.jsx:94`). |
| C01-AC10 | No `tablet:` styles anywhere: at 768 the cards are still stacked. |
| C01-AC11 | No `desktop:` styles: at 1280 the cards are still stacked. |
| C01-A11Y1 | The number renders `****4821` (`page.jsx:30–33, 41`) and nothing exposes "ending in 4821". The masking also works on an invented number (`12344821`, line 29); the data only has `last4`. |
| C01-A11Y2 | The avatar is a `div` with the text "PR" (`page.jsx:10–12`), with no accessible name that includes the full name. |
| A11Y-5 | Heading levels skip `h1` → `h3`: the balance is an `h3` (`page.jsx:37`) and the change an `h4` (`page.jsx:38`), chosen for size, not structure. |

## Against the reference analysis

- **Tree:** matches closely (see What landed). `Total` is missing.
- **Tokens:** `gray` instead of `stone` (`page.jsx:10, 19, 86`), `rounded-md` instead of `rounded-xl` (`page.jsx:19`), `border-gray-300` instead of `border-stone-200`, `gap-2` (8px) instead of `gap-6` (24px) (`page.jsx:87`). Neither Fraunces nor Inter is loaded.
- **Breakpoints:** mobile only. The reference is one grid whose `grid-template-areas` change at `tablet:` and `desktop:`; that grid alone covers AC8–AC11.
- **State:** none, which is correct. The page needs no `useState`.
- **Traps hit:** "Formatting with `toFixed` and a hand-placed `$`". There is no `formatUSD` helper; money is typed as display strings (`page.jsx:37`) or raw floats (`page.jsx:27, 94, 104`). Divide-by-zero and a duplicated Accounts card were not reached.

## Process

- **Read and plan: 12 minutes** (notes: "This analysis took me 12 mins"), 7 over the 5-minute budget. It was written as prose paragraphs; the worksheet asks for a short list.
- **Rep minutes and phase reached:** blank in the notes; 60 and Components and data are **(estimated)** from the rep ending at the hour with components built on hard-coded values.
- **Stalls and lookups:** Tailwind class names, the only lookup recorded. The brief's reference analysis lists every token and breakpoint class for this challenge.
- **Where the plan drifted:** the notes ask "Should I look at the entire design set, or only mobile?", and the build stayed mobile-only. The worksheet's Breakpoints step answers it: read all three tiers, build mobile first. The notes also report the mock scrolling sideways at 375. That was accurate for the deployed site at the time, which still served the pre-rebuild fixed-width mock.

## Accessibility

**5/8.** The universal checks mostly pass because the markup is semantic. Three changes reach 8/8:

1. Use `<p>` with size classes for the balance and change, so headings run `h1` → `h2` (A11Y-5).
2. Render `•••• {last4}` with `aria-hidden`, plus visually hidden "Account number ending in {last4}" (C01-A11Y1).
3. Give the avatar `role="img"` and an `aria-label` with the full name (C01-A11Y2).

## Compared with earlier reps

Baseline.

## Next rep

1. **Open `data/01-treasury.json` in minute one and render only from `data`.** Never type a value that is in it. This alone covers AC3–AC6.
2. **Build the grid at all three tiers during Skeleton (5–15), before any card content.** Three empty cards moving through `grid-template-areas` at `tablet:` and `desktop:` covers AC8–AC11.
3. **Keep Read and plan to 5 minutes as a five-line list:** regions, tiers, tokens, data, state.
