---
title: The 5-minute read
unit: Analysis
unit_order: 1
order: 1
summary: Turn a design and a brief into a five-line plan before you write any markup.
addresses: analysis-overrun, missing-tier, hard-coded-data
worksheet: regions
---

## Why five minutes, and why a plan

The first five minutes decide the next fifty-five. A good read produces a **plan you can execute without thinking**: which components exist, how the layout moves at each width, which Tailwind values to use, where the data comes from, and what changes when the user acts.

The output is a **list**, not an essay. Prose feels thorough, but it takes three times as long to write and you can't build from it. If a thought won't fit on one line, it belongs in the build, not the plan.

## The order that works

Do these in order. Each one feeds the next.

1. **Read the requirements before the picture.** The brief's acceptance criteria are what you are graded on. Count them by kind: how many are about layout, how many about data, how many about interaction. That tells you where the points are.
2. **Name the regions.** Draw boxes over the design in your head. Each box is a component. Nest them. That list is your file plan.
3. **Name the layout at each tier.** Look at the design at 375, 768 and 1280, and write one line per tier. Most layouts are one of: *stack*, *two columns*, *main + sidebar*, *grid of N*. You build mobile first, but you **read all three first**, or the skeleton won't have room for what comes later.
4. **Pull the tokens.** Colours, spacing, type, radius, shadow, mapped to Tailwind classes. See [Reading tokens](/guides/reading-tokens).
5. **Open the data file.** Don't invent a data shape: one is given. Find the arrays (they become `.map()`), the numbers you will format, and the values you'll **derive** rather than read (totals, differences, percentages).
6. **Name the state.** What changes when the user acts? Name each piece and who owns it. Everything else is derived. Plenty of screens have no state at all, and saying so is a valid answer.
7. **Ask your questions out loud.** Then start the timer on the skeleton.

## The five-line plan

Write this in your notes, one line each:

```
Regions   <component tree, nested with >
Tiers     375 … · 768 … · 1280 …
Tokens    <page, surface, text, accent> · <spacing> · <type sizes> · <radius/shadow>
Data      <file> · arrays: … · derived: …
State     <each piece and its owner, or "none">
```

## A worked example (invented)

A "Subscriptions" screen: a header with a monthly total, a filter for Active / Paused, and a list of subscriptions with a name, a price, a renewal date and a Pause button.

```
Regions   Header > MonthlyTotal · FilterTabs · SubscriptionList > SubscriptionRow
Tiers     375 stack, button under price · 768 row per item · 1280 list + summary sidebar (2fr 1fr)
Tokens    zinc-100 page, white rows, zinc-900/zinc-500 text, sky-600 accent · base 4: p-4 → p-6, gap-3 · 24/16/14/12 · rounded-2xl, shadow-sm
Data      subscriptions.json · arrays: subscriptions · derived: monthly total, active count
State     filter (page) · paused ids (page, the total reads it)
```

That took about four minutes. The build now has an order: skeleton for three tiers, then the list from data, then the filter and pause interaction.

## Where reads go wrong

| Symptom | Review tag | Fix |
|---|---|---|
| The read ran to 10+ minutes | `analysis-overrun` | Write the five lines, nothing else. Move on at the timer's 5:00 cue, even with a `?` in a line. |
| Only one width was considered | `missing-tier` | The Tiers line is mandatory, and it has three parts. |
| Values were typed from the picture | `hard-coded-data` | The Data line forces you to open the file. If a number appears in the data, it is never typed. |
| The plan was prose | `analysis-overrun` | If a line needs a second sentence, the extra detail belongs in the build. |

## Practise it

Before your next rep, pick any app you use daily, give yourself five minutes, and write the five lines for one screen. It feels mechanical at first. That's the point: under time pressure, a fixed routine beats inspiration.
