---
structure: 1
data_flow: 1
styling: 1
correctness: 0
naming: 2
idioms: 2
markup: 2
---

### page.jsx:6-9 · must · correctness
`toUSD` formats its input as dollars, but it's given cents (lines 38 and 81), so 1482075 cents becomes `$1,482,075.00`. It's also `en-CA` and `CAD`; the brief is USD. One helper that divides by 100 fixes AC2 and most of AC3: `formatUSD = (cents) => usd.format(cents / 100)`.
Guide: [Props and money](/guides/props-and-money)

### page.jsx:10-14 · should · correctness
`maximumFractionDigits: 2` allows `8.04%` or `8%`; AC3 asks for one decimal every time. Set `minimumFractionDigits: 1, maximumFractionDigits: 1`, and add `signDisplay: "always"` so the sign comes from `Intl` (see lines 37–40).

### page.jsx:19-21 · should · markup
Unchanged from attempt 1: the avatar `div` has no accessible name, so C01-A11Y2 fails. `role="img"` plus `aria-label` with the full name.

### page.jsx:19 · nit · styling
`flex justify-center items-center … w-10 h-10` is `grid place-items-center size-10`.
Guide: [Tailwind utilities that bite](/guides/tailwind-utilities-that-bite)

### page.jsx:24-29 · should · structure
The same `Card` with `isPrimary` as attempt 1, so the heading still lives in the page (line 86) and the content in a child. That split is how the "Acccounts" typo went unnoticed: the component that renders the list never sees its own title.
Guide: [Composing components](/guides/composing-components)

### page.jsx:25 · should · styling
`border` with no colour: in Tailwind v4 that's `currentColor`, so every card gets a dark border. `rounded` is 4px, and the cards have no padding. Something like `rounded-xl border border-stone-200 p-6`, read from the mock.
Guide: [Tailwind utilities that bite](/guides/tailwind-utilities-that-bite)

### page.jsx:30-35 · good · data_flow
`OperatingAccount` receives raw numbers and derives its display from them. This is the right direction, and a real change from attempt 1's typed strings. It's the answer to the props question in your notes: pass numbers, format at render.

### page.jsx:31-34 · should · naming
`amount` and `amountChange` hold cents. A reader, or a future you at minute 45, will pass dollars. Name the unit: `balanceCents`, `changeCents`.
Guide: [Props and money](/guides/props-and-money)

### page.jsx:36 · should · correctness
`amountChange > 0` treats zero as negative, so an unchanged balance would show a minus and red. With `signDisplay: "always"` for the text and `changeCents < 0` for the colour, zero is handled for free.

### page.jsx:37-40 · must · correctness
The sign is placed by hand. `Intl` already prints the minus for negatives, so a negative change renders `--$5,000.00`. This is the challenge's first trap in a new form. Let `signDisplay: "always"` do it.
Guide: [Props and money](/guides/props-and-money)

### page.jsx:43 · must · correctness
`{amount}` renders the raw cents, `18432075`. AC2 expects `$184,320.75`: `formatUSD(balanceCents)`.

### page.jsx:44 · nit · styling
`flex flex-row` is just `flex`; row is the default.

### page.jsx:45 · must · styling
`text-green-500` on white fails colour contrast, which is the A11Y-1 and A11Y-2 failure. The design's `emerald-700` (and `rose-700` for negatives) passes.

### page.jsx:48 · should · styling
`text-grey-200` generates no CSS: the palette is spelled `gray`, so this text is unstyled. Also, a 200 shade on white would be far too light for body text; muted text is usually a 500.
Guide: [Tailwind utilities that bite](/guides/tailwind-utilities-that-bite)

### page.jsx:51 · must · data_flow
The screen-reader text is typed, `4 8 2 1`, not built from `last4`, which this component already receives. It also doesn't contain "ending in 4821", so C01-A11Y1 fails. `` {`Account number ending in ${last4}`} ``.

### page.jsx:51 · should · idioms
`class` instead of `className`. React renders it but logs an "Invalid DOM property" warning, and it's easy to miss in a rep.

### page.jsx:51-52 · good · markup
Visible text hidden with `aria-hidden`, plus a screen-reader sentence. That's the right pattern for masked numbers. Keep it; just feed it from the data.

### page.jsx:58-59 · must · data_flow
`Accounts` and `RecentActivity` return empty fragments, and `accounts` and `transactions` (lines 64–65) are never passed to them. This is AC4, AC5 and AC6. Map the arrays before styling anything.

### page.jsx:62-67 · good · data_flow
Destructuring from `data` and deriving the change in the parent: the data flows one way, from the file down. Exactly right.

### page.jsx:68 · must · correctness
The percentage divides by the current balance; a change is measured against the starting value, so divide by `previousBalanceCents`. That's 8.7%, not 8.04%. Guard zero too.
Guide: [Props and money](/guides/props-and-money)

### page.jsx:71 · must · styling
`grid grid-cols-1` with no `tablet:` or `desktop:` classes: the layout never changes, so AC10 and AC11 fail. Your plan's tablet line was right; this is where it goes. `w-full` does nothing on `<main>`.

### page.jsx:72-94 · nit · markup
Each card is wrapped in an extra `<section>` with no heading of its own. Those sections add nothing to the structure. Let each card be the section.

### page.jsx:86 · must · correctness
"Acccounts" has three c's. There's no heading named "Accounts", so the layout tests can't find the card, and AC9, AC10 and AC11 all fail on this line.
