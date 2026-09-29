### –:– · styling · md: is not a breakpoint here
**Asked:** Why isn't my grid working?
**Answer:** Every `md:` class generated no CSS, because this project removes Tailwind's default breakpoints. Rename `md:` to `tablet:` (768px). The grid-areas syntax was already right. Also: the page rendered its own `<body>` inside the layout's body; make it a `div` or a fragment.
Guide: [Tailwind utilities that bite](/guides/tailwind-utilities-that-bite)

### –:– · markup · Semantic page structure: header, main, section
**Asked:** What is the best practice for the semantic layout? We have our header, main and section elements. How should they be structured?
**Answer:** `<header>` for site chrome, outside `<main>`. Exactly one `<main>` for the page's content. Each card a `<section>` with a heading, linked by `aria-labelledby`. One `h1`, then `h2`s, never skipping a level. `<div>` for layout-only wrappers.
Guide: [Composing components](/guides/composing-components)

### –:– · structure · Do semantics belong in components?
**Asked:** Are you sure semantic HTML belongs in components?
**Answer:** Not as a blanket rule; semantics belong with whoever knows the meaning. Landmarks (`header`, `main`) go in the page. A section's element, heading and `aria-labelledby` id go together in the component that owns the content. A generic `Card` stays neutral: a plain `div`, or an `as` prop. (This corrected an earlier answer, and the guide was updated.)
Guide: [Composing components](/guides/composing-components)

### 16:12 · styling · Grid items not filling the cell
**Asked:** How do I get the items in the grid to fill the space? The account card is smaller than the accounts card.
**Answer:** The grid items (the `<section>`s) already stretch; the visible white box is the `Card`'s inner `div`, which is only as tall as its content. Add `h-full` to the Card. Also: `aria-labelledby` takes an element's `id`, not the heading text; `round` isn't a Tailwind class (`rounded-xl`); desktop needs `desktop:grid-cols-[2fr_1fr]`.
Guide: [Tailwind utilities that bite](/guides/tailwind-utilities-that-bite)

### 16:18 · styling · Stop one grid item stretching
**Asked:** Do we want full height on the card? On desktop the Accounts card is now the full height of the grid instead of the height of its content.
**Answer:** Card height depends on placement, so the page controls it: keep `h-full` on the Card, and add `desktop:self-start` to the Accounts grid item so it hugs its content at desktop while the tablet row stays equal-height.
Guide: [Composing components](/guides/composing-components)

### 16:20 · styling · Centre content with a max width
**Asked:** How do I restrict the content to the center of the page on desktop?
**Answer:** Wrap header and main in `mx-auto max-w-7xl` (80rem = 1280px): the max width caps it and `mx-auto` centres it; below 1280 it's just full width. Keep the page background on an outer full-width element.
Guide: [Tailwind utilities that bite](/guides/tailwind-utilities-that-bite)

### 16:22 · styling · Fonts and type scale
**Asked:** How do I get the proper typography?
**Answer:** Fonts through `next/font/google` at module scope, applied with `.className` (serif for headings and the big number, sans for body, judged from the mock). Then count the three or four sizes and map them to the scale (`text-4xl`/`text-lg`/`text-sm`/`text-xs`), add weights, muted meta colour, and `tabular-nums` on money.
Guide: [Reading tokens](/guides/reading-tokens)
