---
structure: 2
data_flow: 2
styling: 1
correctness: 1
naming: 2
idioms: 2
markup: 1
---

### page.jsx:5-7 · good · structure
`Card` is now a neutral box (a `div` with border, radius, padding and `h-full`) and knows nothing about what it contains. That's exactly the shape from [Composing components](/guides/composing-components), and it's why each section below can own its own heading.

### page.jsx:6 · should · styling
`border` with no colour is `currentColor` in Tailwind v4, so the cards get a dark outline instead of the light one in your own Tokens line (`gray-300`, notes line 47): `border border-stone-200`.
Guide: [Tailwind utilities that bite](/guides/tailwind-utilities-that-bite)

### page.jsx:8 · should · markup
The header renders the literal text "Header". The top bar (wordmark, label, avatar) is a region in your plan (notes line 34) that was never built, so C01-A11Y2 has no avatar to check.

### page.jsx:9 · should · naming
`AccountCard` and `AccountsCard` (line 34) differ by one letter. Rep 2 lost three ACs to a one-letter typo; names this close invite the next one. Name by what it shows: `BalanceCard`.

### page.jsx:10-15 · good · data_flow
The account is read from the data, and the change is derived (line 14) over the **previous** balance (line 15), which fixes rep 2's wrong denominator.

### page.jsx:13 · nit · naming
`const amount = 0` is never used; a leftover from the placeholder version.

### page.jsx:15 · should · correctness
The division isn't guarded: a previous balance of 0 would render `Infinity`. This is the challenge's second trap; return `null` and hide the percentage when the base is 0.
Guide: [Props and money](/guides/props-and-money)

### page.jsx:18 · should · markup
`aria-labelledby={title}` passes the heading **text**; the attribute expects an element **id**. "Operating Account" isn't an id (ids can't contain spaces, and no element has it), so the section has no accessible name. Same on lines 39 and 64. Give the heading `id="balance-heading"` and pass that.
Guide: [Composing components](/guides/composing-components)

### page.jsx:20 · good · markup
One `h1` for the page's main card and `h2`s for the rest: A11Y-5 passes.

### page.jsx:21 · must · correctness
`{balanceCents}` renders `18432075`. AC2 expects `$184,320.75`. Every money value needs to go through one `formatUSD(cents)`; there isn't one in the file.
Guide: [Props and money](/guides/props-and-money)

### page.jsx:23 · must · styling
`text-emerald-500` fails colour contrast on white, which is the A11Y-1 and A11Y-2 failure. It's also always green, even though the change could be negative. `changeCents < 0 ? "text-rose-700" : "text-emerald-700"`.

### page.jsx:24 · must · correctness
`{amountChangeCents} ({amountChangePercentage})` renders `1482075 (0.08743805…)`. Both numbers are correct, and both unformatted: AC3 expects `+$14,820.75` and `+8.7%`. `formatSignedUSD(changeCents)` and a percent formatter with one decimal.
Guide: [Props and money](/guides/props-and-money)

### page.jsx:28 · should · markup
`****` plus `last4` is read aloud as "star star star star 4821". Rep 2 had the right pattern: the visible text `aria-hidden`, plus `sr-only` text "Account number ending in {last4}". That's C01-A11Y1.

### page.jsx:34-35 · should · data_flow
Each card imports and reads `data` itself (also line 60), so the cards can only ever show this one file: they can't be reused or tested with other data. Rep 2 read the data once at the top of the page and passed values down (rep 2's lines 62–66). Do that again, and pass `accounts` in as a prop.

### page.jsx:42-53 · good · idioms
An empty state for the list, and the same for activity (lines 67–78): the worksheet's "states the image does not show".

### page.jsx:43-50 · must · correctness
The Accounts card ends at its list: there's no Total, the sum of the three balances, so AC6 fails. It's a `reduce` over `accounts`, formatted like every other amount.

### page.jsx:45 · should · idioms
`id={account.id}` where React needs `key={account.id}`: React warns that each child in a list needs a unique key, and without one it can't tell rows apart when the list changes. Same on line 70.

### page.jsx:47 · must · correctness
Raw cents again: `{account.balanceCents}`. `formatUSD`.

### page.jsx:68 · must · markup
The `<ul>` has no accessible name, so AC4's "list named Recent activity" finds nothing, even though all 6 rows render; AC5 fails for the same reason. `aria-labelledby` on the list, pointing at the heading's `id`.

### page.jsx:71-72 · must · correctness
Merchant, category, date and amount are rendered as one run of text with raw cents (`-482000`). AC5 expects a signed, formatted amount (`-$4,820.00`). Give each field its own element, and format the date and amount.

### page.jsx:86-94 · should · idioms
The page renders its own `<body>`, but the root layout already does. The server-rendered HTML has only the layout's `<body class="antialiased">`, so these classes aren't in the first render. Use a `div` wrapper. The centring itself, `mx-auto max-w-7xl` (lines 88–89), is right.

### page.jsx:99-106 · good · styling
The grid: mobile stack by default, `tablet:` two columns with named areas, `desktop:` new areas at `2fr 1fr`, and placement passed in from the page (lines 109–113) with `desktop:self-start` on Accounts (line 111). All four layout ACs pass. This is the reference's breakpoints approach.

### page.jsx:100-103 · nit · styling
`p-4` on `main` doubles the wrapper's padding (line 90), `items-stretch` is the grid default, and `grid-rows-[auto_auto]` is what rows do anyway. All three can go.

### page.jsx:104-105 · nit · naming
Areas named `sec1` to `sec3` make the template hard to read against the design. Name them by content (`balance`, `accounts`, `activity`), and the template reads like your Tiers line.
