---
title: Tailwind utilities that bite
unit: Code craft
unit_order: 6
order: 3
summary: The small Tailwind mistakes that fail silently, and the shorter utilities that replace common pairs.
addresses: desktop-first
code: styling
---

## Why these matter

Tailwind never errors. A class it doesn't know simply produces no CSS, and the element quietly looks wrong. Most styling time lost in a rep is spent staring at a class that was never generated.

## Silent failures

| You wrote | What happens | Write instead |
|---|---|---|
| `text-grey-500` | Nothing: the palette is spelled `gray` | `text-gray-500` (or `slate`, `zinc`, `neutral`, `stone`) |
| `md:grid-cols-2` in this set | Nothing: default breakpoints are removed here | `tablet:grid-cols-2`, `desktop:…` |
| `class="…"` in JSX | React warns, and linting won't catch it the same way | `className="…"` |
| A class built at runtime, e.g. `` `bg-${color}-500` `` | Tailwind never sees the full name, so no CSS | Write each full class in the source, e.g. a lookup object |
| `border` alone (Tailwind v4) | The border uses `currentColor`, so it's as dark as the text | `border border-stone-200` (always give the colour) |

To check one: right-click, Inspect, and look at Styles. A class on the element with no matching rule is a class Tailwind never generated.

## Shorter and clearer

| Instead of | Use |
|---|---|
| `w-10 h-10` | `size-10` |
| `flex flex-col justify-center items-center` on a single child | `grid place-items-center` |
| `w-full` on a block element (`div`, `main`, `section`) | nothing: blocks are already full width |
| `flex flex-row` | `flex` (row is the default) |
| `rounded` when the design shows clearly rounded cards | `rounded-xl`; `rounded` is only 4px |

## Contrast is part of styling

`text-green-500` or `text-red-500` on white fails WCAG contrast for normal text. The `700` shades pass: `text-emerald-700`, `text-rose-700`. The accessibility check flags these every time.

## Where it goes wrong

| Symptom | Review tag or code category |
|---|---|
| A class that generates nothing | `styling` |
| Legacy breakpoint variants, or desktop styles written first | `desktop-first`, `styling` |
| Borders or text with too little contrast | `styling` (and the accessibility bonus) |

## Practise it

Open any attempt, search for `grey`, `md:`, `lg:`, `border ` without a colour, and `w-full` on block elements. Each one you find is a class that isn't doing what you think.
