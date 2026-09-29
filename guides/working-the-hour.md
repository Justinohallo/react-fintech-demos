---
title: Working the hour
unit: Analysis
unit_order: 1
order: 3
summary: A build order for the 60 minutes (helpers before layout, layout before content, a check at 40) so the points that matter land first.
addresses: money-formatting, interaction-unfinished, a11y-item-skipped
---

## Why order matters

In a timed rep, whatever you leave for "later" often never happens. The fix is not to work faster; it's to do things **in an order where each step makes the next one cheaper**, and to look at the scoreboard before the time is gone.

## The build order

| Minutes | Do | Why here |
|---|---|---|
| 0–5 | [The 5-minute read](/guides/the-5-minute-read): the five-line plan | Everything after follows the plan |
| 5–7 | **Helpers first:** money and date formatters, and any derived-value functions | Every value you write after this goes through them. Skip this and raw numbers stay on the page for the whole rep. |
| 7–15 | **Skeleton at all three tiers:** empty cards in [one grid](/guides/one-grid-three-tiers), checked at 375, 768 and 1280 | Layout is cheapest before content exists |
| 15–35 | **One section at a time, from data:** heading with an `id`, the list mapped with keys, values through the helpers | Each section is done when it's done, and a half-finished section doesn't block the others |
| 35–40 | **Derived values:** totals, counts, changes | They depend on the data being in place |
| **40** | **Run `npm run check -- NN N`** and fix what it names, in order | The check lists exactly the remaining points. Ten minutes is enough to fix several. |
| 40–50 | The core interaction, empty and error states, the challenge's accessibility items | These are the details that separate a pass from a strong pass |
| 50–58 | Polish: fonts, exact colours, spacing | Visual gaps are the cheapest to leave |
| 58–60 | The closing statement, out loud | It's part of the rep, and the notes have slots for it |

## Helpers first, concretely

Two minutes, before any JSX:

```js
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdSigned = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", signDisplay: "always" });
const formatUSD = (cents) => usd.format(cents / 100);
const formatSignedUSD = (cents) => usdSigned.format(cents / 100);
```

See [Props and money](/guides/props-and-money) for why each piece is there.

## Using the check as a to-do list

`npm run check` prints every failing AC by name. At minute 40, read the list top to bottom and ask of each item: *is this a one-line fix?* A missing list name, a missing Total, an unformatted value: fix those first. Leave anything structural for the closing statement's "not done" line.

## Asking for help mid-rep

Asking is allowed, and every question is logged. The help log shows which topics you keep reaching for, and a topic that stops appearing is one you've learned. Before asking, try one thing yourself for a minute; the answer sticks better when you've already tried.

## Where it goes wrong

| Symptom | Tag |
|---|---|
| Raw cents on the page at 60:00 | `money-formatting` |
| The core interaction still broken at the end | `interaction-unfinished` |
| Accessibility items never reached | `a11y-item-skipped` |

## Practise it

On your next rep, write the actual minute you finish each row of the table in your notes' checkpoint table. The review compares them, and shows which step your time leaks from.
