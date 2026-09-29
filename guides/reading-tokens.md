---
title: Reading tokens
unit: Analysis
unit_order: 1
order: 2
summary: Read colours, spacing, type, radius and shadow off a picture and map each to a Tailwind class, in about 90 seconds.
addresses: analysis-overrun
worksheet: tokens
---

## What tokens are

A design is built from a **small set of repeated values**: a handful of colours, a spacing unit and its multiples, three or four type sizes, one corner radius. Those are its tokens.

Reading them before you write markup means the build becomes typing class names you've already chosen. No lookups mid-rep, no pixel-nudging, and the result looks consistent because it is.

## The five questions

### 1. Colours: what are the roles, and what temperature are the greys?

List **roles**, not colours:

- page background
- surface (cards, panels)
- border or divider
- primary text and muted text
- one accent (what you'd click)
- status colours (positive and negative, warning)

For each role, decide two things.

**The family, by temperature.** Tailwind has five greys. Look at a light grey from the design and ask whether it leans warm or cool:

| It looks | Family |
|---|---|
| slightly blue | `slate` |
| faintly cool | `gray` |
| almost neutral | `zinc` |
| pure grey | `neutral` |
| slightly yellow or beige | `stone` |

Note the spelling: it's `gray`, never `grey`. Tailwind silently ignores a class it doesn't know.

**The shade, by job.** Shades follow conventions, so the role usually tells you the number:

| Role | Usual shade |
|---|---|
| page background | `50` or `100` |
| border, divider | `200` |
| muted text | `500` |
| primary text | `900` |
| accent you click | `600` or `700` |
| dark-theme page | `950` |

### 2. Spacing: find the base unit

Measure three or four gaps: the page's outer padding, a card's inner padding, the gap between cards, the gap between rows inside a card. They are almost always multiples of **4** or **8**. That multiple is the base unit.

Tailwind's spacing scale is **pixels ÷ 4**:

| px | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 |
|---|---|---|---|---|---|---|---|---|---|
| class | `1` | `2` | `3` | `4` | `5` | `6` | `8` | `10` | `12` |

So 24px card padding is `p-6`, a 16px gap is `gap-4`, and 32px page padding is `p-8`. Spacing often grows with the tier: `p-4 tablet:p-6 desktop:p-8`.

### 3. Type: count the sizes

There are usually **three or four** distinct sizes. Match each to the scale:

| class | `text-xs` | `text-sm` | `text-base` | `text-lg` | `text-xl` | `text-2xl` | `text-3xl` | `text-4xl` |
|---|---|---|---|---|---|---|---|---|
| px | 12 | 14 | 16 | 18 | 20 | 24 | 30 | 36 |

Then, for each:

- **weight**: regular, `font-medium` or `font-semibold`
- **family**: serif, sans or mono. A named font is loaded with `next/font/google`.
- **numbers**: if figures line up in columns, that's `tabular-nums`

### 4. Shape: radius and shadow

Corners:

| Looks | Class |
|---|---|
| barely rounded | `rounded-md` (6px) |
| softly rounded | `rounded-lg` (8px) |
| clearly rounded | `rounded-xl` (12px) |
| very rounded | `rounded-2xl` (16px) or `rounded-3xl` (24px) |
| pill or circle | `rounded-full` |

Then ask **how surfaces separate from the page**: a thin border (`border`), a shadow (`shadow-sm` to `shadow-lg`), both, or neither (just a colour change).

### 5. Breakpoints: what changes at 768 and 1280?

Padding, columns, what's visible, what moves. This is the Tiers line of [the 5-minute read](/guides/the-5-minute-read).

## A worked example (invented)

A savings screen: a light page with a faint blue tint, white cards with soft shadows and no borders, generous rounded corners, a sky-blue "Add money" button, a large bold balance and small grey labels.

```
Colours   page slate-50 · cards white · text slate-900 / slate-500 · accent sky-600
Spacing   base 4: page 24 (p-6) · card 20 (p-5) · gap 16 (gap-4)
Type      30 bold balance (text-3xl) · 16 body · 12 labels (text-xs) · sans, tabular-nums
Shape     rounded-2xl · shadow-sm, no border
Tiers     375 stack · 768 two columns · 1280 three columns
```

Five lines, and each becomes classes you type later.

## Measuring without guessing

- **Pixel sizes:** on macOS, press ⌘⇧4 and drag across a gap; it shows the size in pixels. On a Retina screen those are device pixels, so **halve them**.
- **Colours:** the built-in **Digital Color Meter** app shows the colour under your cursor. You need the family and a nearby shade, not an exact match.
- **Close is enough.** "That's about 24, so `gap-6`", said out loud, is exactly what an interviewer wants to hear.

## The learning loop

In an interview you only get a picture, so **read the tokens by eye during the rep**. Afterwards, check your guesses: open the mock, right-click, choose Inspect, and read the classes. Then compare with the brief's reference analysis. Each gap between your read and the answer is a calibration you won't need to make next time.
