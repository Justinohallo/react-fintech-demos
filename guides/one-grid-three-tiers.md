---
title: One grid, three tiers
unit: Layout
unit_order: 2
order: 1
summary: Build a responsive layout as one CSS grid whose named areas change at each breakpoint, with placement, stretching and centring controlled from the page.
addresses: missing-tier, desktop-first
code: styling, structure
---

## The idea

Most dashboard layouts are the **same regions, rearranged** per width. Instead of different markup per tier, write the regions once and let one grid move them. Named areas make the arrangement readable, like a small picture of the layout in your code.

## The pattern

An invented example: a page with `summary`, `chart` and `list` regions.

- **375:** stacked: summary, chart, list.
- **768:** summary full width on top; chart and list side by side below.
- **1280:** summary becomes a left sidebar spanning both rows; chart and list stack on the right.

```jsx
<main
  className="grid gap-6
    [grid-template-areas:'summary'_'chart'_'list']
    tablet:grid-cols-2 tablet:[grid-template-areas:'summary_summary'_'chart_list']
    desktop:grid-cols-[1fr_2fr] desktop:[grid-template-areas:'summary_chart'_'summary_list']"
>
  <SummaryCard className="[grid-area:summary]" />
  <ChartCard className="[grid-area:chart]" />
  <ListCard className="[grid-area:list]" />
</main>
```

How to read the arbitrary value:

- Each quoted string is one **row**; the words in it are that row's **columns**.
- Inside Tailwind's brackets, **underscores stand for spaces**: `'chart_list'` is the row `"chart list"`.
- A name repeated across rows or columns spans them: `'summary_summary'` makes `summary` two columns wide, and `'summary_chart'_'summary_list'` makes it two rows tall.
- The number of columns in the areas must match `grid-cols-*`.

### What the underscores become

Every underscore becomes a space, wherever it sits. The class, then the CSS Tailwind writes for it:

```
tablet:[grid-template-areas:'summary_summary'_'chart_list']
```

```css
grid-template-areas: 'summary summary' 'chart list';
```

- An underscore **between** strings becomes the space that separates **rows**.
- An underscore **inside** a string becomes the space that separates **columns**.

You can't type a real space because `className` is split on spaces: `[grid-template-areas:'summary' 'chart']` becomes two broken classes, and Tailwind generates nothing and doesn't warn you. The same rule applies to every arbitrary value: `grid-cols-[1fr_2fr]` is `1fr 2fr`. For a literal underscore, write `\_`.

To confirm, select the element in DevTools and find the rule under Styles. If it isn't there, the class didn't parse.

Name areas by **content** (`summary`, `list`), not position (`sec1`). Then the template reads like your plan's Tiers line.

## Mobile first, always

The base classes are the phone layout. `tablet:` and `desktop:` only **override upward**. If you find yourself undoing desktop styles for mobile, the order is backwards.

In this project only `tablet:` (768) and `desktop:` (1280) exist. `md:`, `lg:` and the other defaults generate **no CSS at all**, silently.

## Placement belongs to the page

The page decides where each section goes, so it passes the area in as a `className`. The section component never mentions the grid. See [Composing components](/guides/composing-components).

## Stretching: who decides how tall a card is

Grid items **stretch** to fill their row by default. Two things commonly surprise people:

1. **The grid item stretches, but the box you see doesn't.** If the visible card is a child of the grid item, it's only as tall as its content. Give the card `h-full` so it fills whatever its grid item gives it.
2. **Sometimes one item shouldn't stretch.** A card spanning two rows (here, the desktop sidebar) becomes a tall, mostly empty box. Tell that one item not to stretch, from the page and only at the tier where it matters: `desktop:self-start`.

So the card fills its space (`h-full`), and the page decides how much space that is (`self-start` or the default stretch).

## Centring the page

Cap the width and centre it with one wrapper:

```jsx
<div className="bg-slate-50">                        {/* full-width background */}
  <div className="mx-auto max-w-7xl p-4 tablet:p-6 desktop:p-8">   {/* centred content */}
    <header>…</header>
    <main className="grid …">…</main>
  </div>
</div>
```

`max-w-7xl` is 80rem (1280px). `mx-auto` splits the leftover space evenly. Below the cap it's simply full width. Keep the background on the **outer** element, or the colour stops at the content's edge.

Don't render `<body>` from a page: the root layout already does.

## Where it goes wrong

| Symptom | Tag or category |
|---|---|
| Only the phone layout exists | `missing-tier` |
| `md:` / `lg:` classes, or desktop written first and undone for mobile | `desktop-first`, `styling` |
| Cards don't fill their cell, or one card is stretched tall | `styling` |
| Areas named `a`, `b`, `sec1` | `naming` |
| A card that knows its own grid area | `structure` |

## Checking it

Resize the browser through 375, 768 and 1280 during the skeleton, before any content. In DevTools, the `grid` badge next to the element draws the areas with their names, which is the quickest way to see a typo in a template.

## Practise it

Pick a three-region layout you use daily. Write only the `main` element's classes for all three tiers, with empty coloured boxes as the regions, in under five minutes.
