---
structure: 2
data_flow: 0
styling: 1
correctness: 1
naming: 2
idioms: 2
markup: 1
---

### page.jsx:4 · must · data_flow
`data` is imported and never used. Every value on the page is typed by hand instead (lines 27–29, 94, 99–106), which is why AC3–AC6 fail. Destructure what you need at the top of `Attempt` and pass it down.
Guide: [Props and money](/guides/props-and-money)

### page.jsx:10-12 · should · markup
The avatar is a `div` with the text "PR", so assistive tech hears two letters with no meaning, and C01-A11Y2 fails. Give it `role="img"` and an `aria-label` with the full name.

### page.jsx:10 · nit · styling
`w-10 h-10` is `size-10`, and `flex flex-col justify-center items-center` around a single child is `grid place-items-center`.
Guide: [Tailwind utilities that bite](/guides/tailwind-utilities-that-bite)

### page.jsx:17-24 · should · structure
A generic `Card` wraps every section and takes the title from the page. This shape leads to the `isPrimary` flag on line 20 and separates each section's heading from its content (see lines 94 and 98). Prefer each section rendering its own `Card`, and the page only placing sections.
Guide: [Composing components](/guides/composing-components)

### page.jsx:19 · should · styling
`rounded-md` and `border-gray-300` don't match the design's larger radius and lighter, warmer border. (The `p-6` padding is right.) AC7 (manual) compares these. Read them off the mock during the plan's Tokens line.
Guide: [Reading tokens](/guides/reading-tokens)

### page.jsx:20 · good · markup
Real headings rather than styled `div`s, and exactly one `h1`. That's half of what A11Y-5 checks; the other half is not skipping levels (see lines 37–38).

### page.jsx:27-29 · must · correctness
Three typed values, and one is wrong: `performancePercentage = 0.87`, but the change is 8.7%. Deriving it from the data (change ÷ previous balance) removes both the typing and the error. `accountNumber` is invented; the data only has `last4`.
Guide: [Props and money](/guides/props-and-money)

### page.jsx:37-38 · must · markup
The balance is an `h3` and the change an `h4`, chosen for size. After the `h1` on line 20 this skips a level, which fails A11Y-5. Use `<p>` with size classes; headings are structure.

### page.jsx:39 · must · correctness
`{performanceValue} {performancePercentage}` renders `14820.75 0.87`: no sign, no `$`, no `%`. AC3 expects `+$14,820.75` and `+8.7%`. One `formatSignedUSD(cents)` helper does both the sign and the currency.
Guide: [Props and money](/guides/props-and-money)

### page.jsx:52 · should · idioms
The `<li>` has no `key`. React warns, and without stable keys a reordered or filtered list can mix up rows' state. Use `key={account.id}`.

### page.jsx:53-54 · must · data_flow
`account.title` and `account.amount` invent a shape; the data's fields are `name` and `balanceCents`. Read the data file's shape first and use it as-is, so real data can flow in without a translation layer.

### page.jsx:64-65 · good · idioms
An empty-state guard for the list. The framework's worksheet asks for "states the image does not show", and this is one. Keep the habit.

### page.jsx:67 · must · markup
The `<ul>` has no accessible name. AC4 looks for a list named "Recent activity", so it fails even with all six rows. Label it by its heading: `aria-labelledby` pointing at the heading's `id`.

### page.jsx:70 · should · idioms
Missing `key` again: `key={activity.id}` (the data provides one).

### page.jsx:71-75 · should · markup
Name, category and date are rendered with no separators or elements between them, so they read as `Northwind LogisticsCustomer PaymentSep 27,2026`. Give each its own element, or join them with a separator as the design does.

### page.jsx:86 · nit · styling
`w-full` does nothing on `<main>`: it's a block element and already full width. The page colour is `gray`; the design's page is a warmer off-white.
Guide: [Tailwind utilities that bite](/guides/tailwind-utilities-that-bite)

### page.jsx:87 · must · styling
`flex flex-col gap-2` is the whole layout: correct for mobile, but there are no `tablet:` or `desktop:` classes, so AC10 and AC11 fail. The gap is also 8px where the design spaces cards more widely.
