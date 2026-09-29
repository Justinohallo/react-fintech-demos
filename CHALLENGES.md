# CHALLENGES.md — Kestrel practice set

**Owner:** Architect · **As of:** 2026-09-28

Ten challenges, rising difficulty, one feature each. Every one is sized for a single 60-minute rep by a senior engineer following the protocol in `SPEC.md` §5. Each builds on skills from the ones before it.

**Kestrel** is a fictional spend-management and crypto-treasury platform for startups: corporate cards, bill pay, approvals, and a bitcoin treasury account. Every challenge uses a different visual direction on purpose, so reps practise reading tokens from a picture rather than memorising one design system.

## Conventions for every challenge

- **Data** lives in `data/NN-<name>.json`. Money is integer minor units (`amountCents`, or `amountSats` for BTC). Dates are ISO strings on or before `2026-09-28`. The mock and the attempt import the same file.
- **Acceptance criteria** are Given/When/Then with IDs `CNN-ACn`. Each must be testable by role, label, and visible text alone. `(manual)` marks one that a person judges from a screenshot.
- **Responsive.** Every challenge is mobile-first on the three tiers in `SPEC.md` §2 (375, 768, 1280). The Visual direction describes the desktop design. Each Layout section's **Responsive** list says what changes at each tier. Where a challenge gives a max width, it is the desktop content width.
- **Accessibility bonus** items have IDs `CNN-A11Yn`: what a careful build does beyond the ACs, testable by role, label and text. They earn bonus points alongside the universal checks in `SPEC.md` §2 and never fail a rep.
- **Reference analysis** is what a good 5-minute read of the mock produces. It sits behind the reveal on the brief page.
- **Fonts** come from `next/font/google`. Colours are given as Tailwind palette names so the token-mapping step has a right answer.

---

## 01 — Treasury balance

**Difficulty:** 1 · **Concept:** Static layout from data · **Target:** responsive, 375 / 768 / 1280

### What this tests

Region naming, a two-column grid, currency formatting with `Intl.NumberFormat`, and rendering a list from an array instead of hard-coding it.

### Visual direction

Quiet and editorial:

- warm off-white page (`stone-50`) and white cards with a 1px `stone-200` border
- no shadows, `rounded-xl`
- headings in **Fraunces** (serif), body in **Inter**
- accent `emerald-700` for positive values, `rose-700` for negative
- generous whitespace: 32px page padding, 24px card padding

### Layout

A top bar with the Kestrel wordmark (plain text), an "Operating account" label, and an avatar circle with initials. Below it is a two-column grid, left 2fr and right 1fr:

- **Left:** a balance card with the large balance, the month-over-month change as a signed amount and percentage, and a masked account number (`•••• 4821`). Under it, a "Recent activity" card lists 6 transactions: merchant, category, date, and signed amount.
- **Right:** an "Accounts" card listing 3 accounts (Operating, Payroll, Tax reserve), each with name and balance, and a derived total at the bottom.

**Responsive:**

- **Mobile:** one column, in the order balance card, Accounts, Recent activity. 16px page padding. The top bar drops the "Operating account" label.
- **Tablet:** the balance card and Accounts side by side (1fr 1fr), with Recent activity full width below. 24px page padding.
- **Desktop:** the 2fr / 1fr grid above. 32px page padding.

### Data

`data/01-treasury.json`

```
{
  account: { name, last4, balanceCents, previousBalanceCents },
  accounts: [{ id, name, balanceCents }],   // 3
  transactions: [{ id, merchant, category, date, amountCents }]  // 6; include 2 negative, 1 over $10,000
}
```

### Acceptance criteria

- **C01-AC1:** Given the page loads, then a heading "Operating account" is visible.
- **C01-AC2:** Given the account data, then the balance is shown formatted as USD with a thousands separator and two decimals.
- **C01-AC3:** Given the current and previous balances, then the change is shown as a signed USD amount and a signed percentage to one decimal. Neither value is stored in the data.
- **C01-AC4:** Given 6 transactions, then a list named "Recent activity" contains exactly 6 items, each showing its merchant name.
- **C01-AC5:** Given a negative transaction, then its amount renders with a leading minus sign, not in parentheses.
- **C01-AC6:** Given 3 accounts, then the "Accounts" card shows a "Total" equal to the sum of the three balances, formatted as USD.
- **C01-AC7 (manual):** The two-column split and the serif/sans pairing match the mock.
- **C01-AC8:** At 375, 768 and 1280, the page does not scroll horizontally.
- **C01-AC9:** Given a 375px viewport, then the balance card, the "Accounts" card and "Recent activity" are stacked in that order.
- **C01-AC10:** Given a 768px viewport, then the balance card and the "Accounts" card sit side by side, with "Recent activity" below both.
- **C01-AC11:** Given a 1280px viewport, then "Recent activity" is below the balance card, and the "Accounts" card is to the right of both.

### Accessibility bonus

- **C01-A11Y1:** The masked account number is exposed as text that includes "ending in 4821", so it is not read out as a run of bullets.
- **C01-A11Y2:** The avatar has an accessible name with the user's full name, not only their initials.

### Reference analysis

- **Tree:** `TopBar`, `BalanceCard`, `ActivityList > ActivityRow`, `AccountsCard > AccountRow`, `Total`.
- **Tokens:** `bg-stone-50`, `bg-white`, `border-stone-200`, `rounded-xl`, text `stone-900` / `stone-500`, `emerald-700` / `rose-700`. Spacing base 8: gaps of 24 and 32. Four type sizes: 36 balance, 18 card title, 14 body, 12 meta.
- **Breakpoints:** one grid whose areas change per tier: `balance / accounts / activity`, then `tablet:` `balance accounts / activity activity`, then `desktop:` `balance accounts / activity accounts` at `2fr 1fr`. Padding `p-4 tablet:p-6 desktop:p-8`.
- **State:** none. The change, the percentage, and the total are all derived.
- **Traps:**
  - Formatting with `toFixed` and a hand-placed `$` breaks negatives and separators. Build one `formatUSD` helper first.
  - Dividing by the previous balance without guarding zero.
  - Rendering the Accounts card twice, once per tier, instead of moving one card with grid areas or `order`.

---

## 02 — Plan picker

**Difficulty:** 2 · **Concept:** One piece of state, derived display · **Target:** responsive, 375 / 768 / 1280

### What this tests

A segmented control, deriving displayed prices from a single billing-period state, responsive grid collapse, and a highlighted "recommended" card.

### Visual direction

Dark and crisp:

- page `zinc-950`, cards `zinc-900` with a `zinc-800` border
- the recommended card has a 2px `lime-400` border and a small "Recommended" pill
- font **Geist** throughout, prices in tabular numerals
- `rounded-2xl`, no shadows
- CTA buttons: solid `lime-400` on dark text for the recommended card, outline for the others

### Layout

A centred heading "Plans for every stage" with a subheading. Below it, a Monthly / Annual segmented control, where Annual shows a "Save 20%" hint. Then three plan cards (Starter, Growth, Scale), each with:

- name
- price per month
- billed-annually note when Annual is selected
- a 5-item feature list with check icons
- a CTA button

**Responsive:**

- **Mobile:** one column, with the recommended card first. The segmented control spans the full width.
- **Tablet:** two columns. The recommended card spans both columns on top; the other two sit side by side below it.
- **Desktop:** three columns in source order: Starter, Growth, Scale.

### Data

`data/02-plans.json`

```
{
  annualDiscountPercent: 20,
  plans: [{ id, name, monthlyPriceCents, recommended, features: [string] }]  // 3; Starter price 0
}
```

### Acceptance criteria

- **C02-AC1:** Given the page loads, then a radio group or tablist named "Billing period" offers "Monthly" and "Annual", with Monthly selected.
- **C02-AC2:** Given Monthly is selected, then each plan shows its monthly price, e.g. "$49" with "/mo".
- **C02-AC3:** When the user selects Annual, then each paid plan's displayed per-month price drops by 20%, rounded to whole dollars, and the text "Billed annually" appears on the paid plans.
- **C02-AC4:** Given a plan with a price of 0, then it shows "Free" instead of "$0", in both periods.
- **C02-AC5:** Given the recommended plan, then its card contains the text "Recommended".
- **C02-AC6:** Given each plan, then a button labelled "Choose <plan name>" is present.
- **C02-AC7:** At 375, 768 and 1280, the page does not scroll horizontally.
- **C02-AC8:** Given a 375px viewport, then the recommended plan's card is first, and all three cards are stacked in one column.
- **C02-AC9:** Given a 768px viewport, then the recommended plan's card spans the full row above the other two, which sit side by side.
- **C02-AC10:** Given a 1280px viewport, then the three plan names sit on one row in the order Starter, Growth, Scale.

### Accessibility bonus

- **C02-A11Y1:** With focus on "Monthly", pressing the Right arrow key selects "Annual" and updates the prices.
- **C02-A11Y2:** The check icons in the feature lists are hidden from assistive tech; the feature text is the content.

### Reference analysis

- **Tree:** `Header`, `PeriodToggle`, `PlanGrid > PlanCard > FeatureList`.
- **Tokens:** `bg-zinc-950`, `bg-zinc-900`, `border-zinc-800`, `border-lime-400`, `text-zinc-50` / `zinc-400`, `rounded-2xl`. Spacing base 4: card padding 32, gaps 24.
- **Breakpoints:** `grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3`. The recommended card takes `order-first tablet:col-span-2 desktop:order-none desktop:col-span-1`.
- **State:** `period: 'monthly' | 'annual'`, owned by the page. The displayed price is `deriveMonthly(plan, period)`.
- **Traps:**
  - Storing two prices per plan in state.
  - A toggle made of two `div`s with no role. Radio inputs styled as segments give keyboard support for free.
  - Floats creeping in from `* 0.8`. Round once, at render.
  - Reordering the plans array per tier instead of changing only the CSS.

---

## 03 — Card controls

**Difficulty:** 3 · **Concept:** Interdependent toggles, masked data · **Target:** responsive, 375 / 768 / 1280

### What this tests

Composing a card visual with CSS, show/hide sensitive data, a switch with correct ARIA, and one control's state constraining another's.

### Visual direction

Glassy and colourful:

- page background is a soft diagonal gradient, `indigo-100` to `sky-100`
- the card face is a 340×214 rectangle, `rounded-2xl`, with a gradient from `indigo-600` to `violet-500`, a subtle diagonal sheen, white text, and a chip drawn as a small rounded gold rectangle (`amber-300`)
- the network mark is two overlapping circles, generic and unlabelled
- the controls panel is white at 80% opacity with a `backdrop-blur` and `shadow-lg`
- font **Manrope**

### Layout

The left column holds the card face, showing:

- cardholder name
- the number masked as `•••• •••• •••• 7314`
- expiry `••/••`
- a "Virtual" badge

The right column is a controls panel with:

- a "Reveal details" button (changing to "Hide details" when revealed)
- a "Freeze card" switch
- a "Copy number" button
- a spend-this-month line with a progress bar against the card limit

When frozen, the card face desaturates to grayscale and shows a "Frozen" badge.

**Responsive:**

- **Mobile:** the card face on top at the full content width, up to 340px, keeping its 1.586 aspect ratio. The controls panel below it.
- **Tablet:** the card face and the controls panel side by side.
- **Desktop:** the same two columns, centred at 1024px max width with a wider gap.

### Data

`data/03-card.json`

```
{
  card: { id, holder, number: "4000123456787314", expMonth, expYear, cvc, limitCents, spentCents, frozen: false, type: "Virtual" }
}
```

### Acceptance criteria

- **C03-AC1:** Given the page loads, then the card shows "•••• 7314" and does not show the full number anywhere in the document text.
- **C03-AC2:** Given the card is frozen, then the "Reveal details" button is disabled.
- **C03-AC3:** When the user activates "Reveal details", then the full number (grouped in fours), expiry as MM/YY, and CVC are visible, and the button's label becomes "Hide details".
- **C03-AC4:** Given details are revealed, when the user turns on "Freeze card", then the details are hidden again and "Frozen" is visible on the card.
- **C03-AC5:** Given the freeze control, then it is exposed as a switch named "Freeze card" whose checked state reflects the frozen state.
- **C03-AC6:** Given spent and limit amounts, then the text "<spent> of <limit>" is shown in USD and a progressbar is present with the matching value.
- **C03-AC7 (manual):** The card face uses no image files, and the grayscale frozen treatment matches the mock.
- **C03-AC8:** At 375, 768 and 1280, the page does not scroll horizontally.
- **C03-AC9:** Given a 375px viewport, then "•••• 7314" is above the "Freeze card" switch.
- **C03-AC10:** Given a 768px or 1280px viewport, then "•••• 7314" is to the left of the "Freeze card" switch.

### Accessibility bonus

- **C03-A11Y1:** When the user activates "Copy number", a status message "Copied" is announced.
- **C03-A11Y2:** The spend progressbar's value text reads "<spent> of <limit>", not a bare percentage.

### Reference analysis

- **Tree:** `CardFace > (Chip, NetworkMark, Number, Meta)`, `ControlsPanel > (RevealButton, FreezeSwitch, CopyButton, SpendMeter)`.
- **Tokens:** gradient `from-indigo-600 to-violet-500`, `bg-white/80`, `backdrop-blur`, `shadow-lg`, `rounded-2xl`, `grayscale` filter. Card aspect ratio 1.586.
- **Breakpoints:** `flex flex-col tablet:flex-row`. The card is `w-full max-w-[340px] aspect-[1.586]`, so it shrinks with its column instead of overflowing.
- **State:** `revealed`, `frozen`. The invariant: frozen implies not revealed. Enforce it in the freeze handler, not with an effect.
- **Traps:**
  - Rendering the full number and hiding it with CSS, so it is still in the DOM.
  - A switch that is a checkbox with no `role="switch"`.
  - `useEffect` to un-reveal on freeze, which renders the revealed number for one frame.
  - Fixing both width and height on the card, so it cannot shrink with its column.

---

## 04 — Send a payment

**Difficulty:** 4 · **Concept:** Controlled form, validation, derived summary · **Target:** responsive, 375 / 768 / 1280

### What this tests

Controlled inputs, parsing a money string into cents, field-level validation with accessible errors, a live summary derived from inputs, and a disabled-until-valid submit.

### Visual direction

Bold and flat:

- page `white`; a single centred panel, max width 560, with a thick 2px `neutral-900` border and a hard offset shadow (4px 4px 0 `neutral-900`)
- `rounded-none` throughout
- accent `orange-500`; error text `red-600`
- font **Space Grotesk**, with large 20px input text
- the summary box has a `orange-50` background

### Layout

The heading is "Send a payment". Fields:

- **From account:** a select listing 2 accounts with balances.
- **Recipient:** a select listing 5 saved vendors.
- **Amount:** a text input with a `$` prefix.
- **Memo:** optional, max 140 characters, with a live character counter.
- **Speed:** a radio pair, "Standard (free, 1–2 days)" and "Instant (1% fee, min $1.00)".

A summary box shows amount, fee, total debited, and remaining balance. A "Review payment" submit button follows. On a valid submit, the form is replaced by a confirmation panel reading "Payment scheduled" with the summary and a "Send another" button.

**Responsive:**

- **Mobile:** the panel fills the width with a 16px margin. The two Speed options stack. "Review payment" spans the full width.
- **Tablet:** the 560px panel, centred. The Speed options sit side by side.
- **Desktop:** the panel widens to 880px: fields in a left column, the summary box in a right column beside them.

### Data

`data/04-payment.json`

```
{
  accounts: [{ id, name, balanceCents }],        // 2
  vendors: [{ id, name, bank, last4 }],          // 5; one vendor name over 40 characters
  instantFeePercent: 1, instantFeeMinCents: 100
}
```

### Acceptance criteria

- **C04-AC1:** Given the form loads, then fields labelled "From account", "Recipient", "Amount", "Memo" and a radio group "Speed" exist, and "Review payment" is disabled.
- **C04-AC2:** When the user types "1,250.5" into Amount, then the summary shows an amount of "$1,250.50".
- **C04-AC3:** When the user selects Instant with an amount of $50.00, then the fee shows "$1.00" (the minimum). With $500.00 it shows "$5.00".
- **C04-AC4:** When the total debited exceeds the selected account's balance, then an error "Exceeds available balance" is shown, associated with the Amount field, and submit stays disabled.
- **C04-AC5:** When the amount is 0 or not a number, then an error "Enter an amount greater than $0" is shown after the field loses focus.
- **C04-AC6:** Given a memo, then a counter shows "<n>/140", and the input accepts no more than 140 characters.
- **C04-AC7:** Given a valid form, when the user submits, then "Payment scheduled" is visible along with the recipient name and total debited, and "Send another" returns an empty form.
- **C04-AC8:** At 375, 768 and 1280, the page does not scroll horizontally.
- **C04-AC9:** Given a 375px viewport, then the "Instant" option is below the "Standard" option.
- **C04-AC10:** Given a 768px viewport, then the "Instant" option is to the right of the "Standard" option.
- **C04-AC11:** Given a 1280px viewport, then the summary's "Total debited" line is to the right of the "Amount" field.

### Accessibility bonus

- **C04-A11Y1:** When an Amount error is shown, the Amount field is marked invalid (`aria-invalid="true"`).
- **C04-A11Y2:** After a valid submit, focus moves to the "Payment scheduled" heading.

### Reference analysis

- **Tree:** `PaymentForm > (Field × 4, SpeedRadio, Summary, Submit)`, `Confirmation`.
- **Tokens:** `border-2 border-neutral-900`, `shadow-[4px_4px_0_var(--color-neutral-900)]`, `rounded-none`, `bg-orange-50`, `text-red-600`. Spacing base 8.
- **Breakpoints:** panel `max-w-[560px] desktop:max-w-[880px]`, body `grid desktop:grid-cols-[1fr_280px]`, Speed `flex flex-col tablet:flex-row`.
- **State:**
  - `values` (strings as typed) and `touched` are state.
  - `amountCents`, `feeCents`, `totalCents`, `errors`, and `canSubmit` are all derived.
  - `submitted` is state.
- **Traps:**
  - Storing the amount as a number in state, which loses what the user typed.
  - `parseFloat("1,250.5")` returns 1. Strip separators, then convert to cents with rounding.
  - Errors shown on the first keystroke.
  - An error message not linked with `aria-describedby`.

---

## 05 — Bitcoin treasury

**Difficulty:** 5 · **Concept:** Unit conversion, denomination toggle, proportional bar · **Target:** responsive, 375 / 768 / 1280

### What this tests

Working in two units (sats and USD) from one source of truth, a denomination switch that changes every amount on the page, a proportional allocation bar drawn with CSS widths, and positive/negative change styling.

### Visual direction

Terminal-inspired:

- page `neutral-950`, panels `neutral-900`, 1px `neutral-800` borders
- mono font **JetBrains Mono** for every number; **IBM Plex Sans** for labels
- accent `amber-400`; gains `green-400`, losses `red-400`
- square corners (`rounded-sm`)
- dense 12/14px type, with a tiny uppercase letter-spaced label style for section titles

### Layout

The header reads "Treasury", with a denomination toggle offering "USD", "BTC" and "sats".

A KPI row holds three tiles: Total value, 24h change, and Cost basis.

An allocation bar spans the full width, split into segments for four wallets (Cold storage, Hot wallet, Lightning, Exchange), each with a legend entry showing its percentage.

A holdings table has columns Wallet, Balance, Share, and 24h. The price line under the header reads "1 BTC = $X · updated 2026-09-28 09:00".

**Responsive:**

- **Mobile:** the KPI tiles stack in one column. The allocation legend is a 2×2 grid. The holdings table shows only Wallet and Balance; Share and 24h are hidden.
- **Tablet:** the KPI tiles in one row of three, the legend in one row of four, and all four table columns.
- **Desktop:** the allocation bar and legend sit in a left column beside the holdings table (1fr 2fr).

### Data

`data/05-treasury.json`

```
{
  btcPriceCents, btcPrice24hAgoCents,
  costBasisCents,
  wallets: [{ id, name, type, balanceSats }]   // 4; one wallet under 100,000 sats
}
```

### Acceptance criteria

- **C05-AC1:** Given the page loads with USD selected, then "Total value" shows the sum of all wallets converted at `btcPriceCents`, formatted as USD.
- **C05-AC2:** When the user selects "BTC", then every amount on the page is shown in BTC to 8 decimal places with the "₿" symbol, and no USD amount remains in the holdings table.
- **C05-AC3:** When the user selects "sats", then amounts are whole numbers with thousands separators followed by "sats".
- **C05-AC4:** Given the 24h prices, then the 24h change tile shows a signed percentage to two decimals. It uses a "▲" glyph for a gain or "▼" for a loss, so colour is not the only signal.
- **C05-AC5:** Given four wallets, then the allocation legend lists four names, each with a percentage to one decimal, and the percentages sum to 100.0 (±0.1).
- **C05-AC6:** Given the holdings table at 1280px, then it is a table with column headers "Wallet", "Balance", "Share", "24h" and four body rows.
- **C05-AC7 (manual):** Allocation segment widths are proportional to balances.
- **C05-AC8:** At 375, 768 and 1280, the page does not scroll horizontally.
- **C05-AC9:** Given a 375px viewport, then the three KPI tiles are stacked, and the "Share" and "24h" column headers are hidden.
- **C05-AC10:** Given a 768px viewport, then "Total value", "24h change" and "Cost basis" sit on one row, and all four column headers are visible.
- **C05-AC11:** Given a 1280px viewport, then the allocation legend is to the left of the holdings table.

### Accessibility bonus

- **C05-A11Y1:** The allocation bar is exposed as an image whose accessible name lists each wallet and its share.
- **C05-A11Y2:** The "▲" / "▼" glyph is hidden from assistive tech, and the direction is given in words ("up" or "down").

### Reference analysis

- **Tree:** `Header > DenominationToggle`, `KpiRow > KpiTile × 3`, `AllocationBar > (Segment × 4, Legend)`, `HoldingsTable`.
- **Tokens:** `bg-neutral-950` / `neutral-900`, `border-neutral-800`, `text-amber-400`, `text-green-400` / `red-400`, `rounded-sm`, `font-mono`, `tracking-widest uppercase text-[11px]` labels.
- **Breakpoints:** KPIs `grid-cols-1 tablet:grid-cols-3`, legend `grid-cols-2 tablet:grid-cols-4`, hidden columns `hidden tablet:table-cell` on both `th` and `td`, page `desktop:grid-cols-[1fr_2fr]`.
- **State:** `denomination`. Everything else is derived from sats and prices through one `formatAmount(sats, denomination, price)` function.
- **Traps:**
  - Converting sats to BTC as a float and then to cents, which accumulates rounding error. Use `sats * priceCents / 100_000_000` with one rounding.
  - Per-component formatting logic, so the toggle misses one amount.
  - Percentages that each round and sum to 99.9.
  - Hiding a column's header but not its cells.

---

## 06 — Budgets

**Difficulty:** 6 · **Concept:** Inline editing, threshold states · **Target:** responsive, 375 / 768 / 1280

### What this tests

A list of progress meters with three threshold states, inline edit-in-place with save/cancel and keyboard support, and validation on the edit.

### Visual direction

Soft and friendly:

- page `slate-50`, cards `white` with `shadow-sm` and `rounded-3xl`
- font **Nunito**
- each category has a coloured circular icon holder (inline SVG glyph) in a pastel tone
- meter track `slate-100`, fills `teal-500` on track, `amber-500` from 80%, `rose-500` over 100%
- pill-shaped buttons

### Layout

The header reads "September budgets" with a month summary ("$X of $Y spent across 6 budgets").

A grid of 6 budget cards follows. Each card shows:

- icon, category name, and owner team
- a meter
- "<spent> of <limit>" and a status line: "On track", "Nearing limit", or "Over by <amount>"
- an "Edit limit" button

Editing replaces the limit text with a number input and Save / Cancel buttons.

**Responsive:**

- **Mobile:** one column. While editing, the limit input, Save and Cancel stack at full width.
- **Tablet:** two columns.
- **Desktop:** three columns.

### Data

`data/06-budgets.json`

```
{
  month: "2026-09",
  budgets: [{ id, category, team, icon, limitCents, spentCents }]  // 6; one at 85%, one at 112%, one with limit 0
}
```

### Acceptance criteria

- **C06-AC1:** Given 6 budgets, then 6 progressbars are present, each named for its category.
- **C06-AC2:** Given a budget at 85% of its limit, then its card shows "Nearing limit".
- **C06-AC3:** Given a budget over its limit, then its card shows "Over by <amount>" in USD. The meter's visible fill is capped at 100%, while its value reports the true figure.
- **C06-AC4:** When the user activates "Edit limit" on a card, then a field labelled "<category> limit" is focused, prefilled with the current limit in dollars.
- **C06-AC5:** When the user enters a new valid limit and presses Enter (or Save), then the card shows the new limit, its status recalculates, and the header summary updates.
- **C06-AC6:** When the user presses Escape (or Cancel) while editing, then the original limit is shown and focus returns to "Edit limit".
- **C06-AC7:** When the user enters a negative or empty limit, then Save is disabled and "Enter a limit of $0 or more" is shown.
- **C06-AC8:** Given a limit of 0 and spend above 0, then the card shows "Over by <spent>" without a divide-by-zero artifact (no "Infinity" or "NaN").
- **C06-AC9:** At 375, 768 and 1280, the page does not scroll horizontally.
- **C06-AC10:** Given a 375px viewport, then the six progressbars are stacked in one column.
- **C06-AC11:** Given a 768px viewport, then the budget cards sit two per row. Given a 1280px viewport, three per row.

### Accessibility bonus

- **C06-A11Y1:** Each progressbar's value text reads "<spent> of <limit>".
- **C06-A11Y2:** After a new limit is saved, the card's new status is announced in a status message.

### Reference analysis

- **Tree:** `Header > MonthSummary`, `BudgetGrid > BudgetCard > (CategoryIcon, Meter, StatusLine, LimitEditor)`.
- **Tokens:** `bg-slate-50`, `bg-white`, `shadow-sm`, `rounded-3xl`, `rounded-full` buttons, fills `teal-500` / `amber-500` / `rose-500`, track `slate-100`.
- **Breakpoints:** `grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3`. The editor is `flex flex-col tablet:flex-row`.
- **State:**
  - `budgets` (limits are now editable) lives at the page level, because the header summary reads it.
  - `editingId` and `draft` are local to the card being edited.
  - Status is derived.
- **Traps:**
  - Keeping limits in card-local state, so the header never updates.
  - Forgetting focus management on enter and exit of edit mode.
  - A `status` field stored alongside the limit.

---

## 07 — Expense report

**Difficulty:** 7 · **Concept:** Dynamic list of form rows · **Target:** responsive, 375 / 768 / 1280

### What this tests

Adding and removing rows with stable keys, per-row validation, a totals block derived across rows with per-category subtotals, and a policy warning driven by data rules.

### Visual direction

Corporate-document feel:

- page `gray-100`; the report sits on a white "paper" sheet, max width 960, `shadow-md`, with a thin `blue-700` top rule 4px tall
- font **Source Sans 3**, headings semibold
- table-like row layout with a `gray-200` hairline between rows
- accent `blue-700`; warnings in an `amber-50` box with `amber-800` text
- compact 14px inputs, `rounded-md`

### Layout

The header shows "Expense report" with an editable report title, the submitter name, and the date range.

Line items are rows with columns Date, Merchant, Category (select), Amount, Receipt (a checkbox "Receipt attached"), and a remove button. The data prefills 3 rows. An "Add line item" button sits below.

A right-aligned summary shows subtotals by category, then a grand total. A policy panel lists violations. "Submit for approval" is at the bottom.

**Responsive:**

- **Mobile:** the paper sheet is full width with no shadow. Each line item is a stacked card: every field on its own line with a visible label, and the Remove button at the bottom.
- **Tablet:** each line item takes two lines: Date, Merchant and Category on the first; Amount, Receipt and Remove on the second.
- **Desktop:** one table-like row per item, as described, on the 960px sheet. Field labels become column headers and stay available to assistive tech.

### Data

`data/07-expenses.json`

```
{
  submitter: { name, team },
  categories: [{ id, name, perItemLimitCents }],     // 5: Meals 7500, Travel 150000, Software 50000, Lodging 40000, Other 20000
  receiptRequiredOverCents: 2500,
  items: [{ id, date, merchant, categoryId, amountCents, receipt }]  // 3 prefilled; one Meals item at 9200
}
```

### Acceptance criteria

- **C07-AC1:** Given 3 prefilled items, then 3 rows are present, each with a "Remove" button labelled with its merchant name.
- **C07-AC2:** When the user activates "Add line item", then a new empty row appears and its Date field receives focus.
- **C07-AC3:** When the user removes the second row, then the other two rows keep their entered values (stable identity, not index-keyed).
- **C07-AC4:** Given items across categories, then a subtotal is shown per category in use and a "Total" equals the sum of all rows.
- **C07-AC5:** Given a Meals item over its $75.00 limit, then the policy panel lists "Meals over $75.00 limit: <merchant>".
- **C07-AC6:** Given an item over $25.00 without "Receipt attached" checked, then the policy panel lists "Receipt required: <merchant>", and it disappears once checked.
- **C07-AC7:** Given any row with an empty merchant or an amount that is not greater than 0, then "Submit for approval" is disabled. When the user activates it with a valid form, then "Report submitted" is shown with the total.
- **C07-AC8:** At 375, 768 and 1280, the page does not scroll horizontally.
- **C07-AC9:** Given a 375px viewport, then in the first row the Merchant field is below the Date field.
- **C07-AC10:** Given a 768px viewport, then in the first row Date and Merchant sit side by side, and Amount is below them.
- **C07-AC11:** Given a 1280px viewport, then in the first row Date, Merchant, Category, Amount and "Receipt attached" are on one line.

### Accessibility bonus

- **C07-A11Y1:** After a row is removed, focus moves to another control in the report (the next row's Date field, or "Add line item"), not to the page.
- **C07-A11Y2:** The policy panel is a status region, so a new violation is announced when it appears.

### Reference analysis

- **Tree:** `ReportHeader`, `LineItemTable > LineItemRow × n`, `AddRowButton`, `Summary > (CategorySubtotals, Total)`, `PolicyPanel`, `SubmitBar`.
- **Tokens:** `bg-gray-100`, `bg-white shadow-md`, `border-t-4 border-blue-700`, `divide-y divide-gray-200`, `bg-amber-50 text-amber-800`, `rounded-md`, 14px inputs.
- **Breakpoints:** each row is `grid grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-[120px_1fr_160px_120px_auto_auto]`; field labels `desktop:sr-only`.
- **State:**
  - `items: [{ id, ...fieldsAsStrings }]` and `submitted`.
  - Subtotals, total, violations, and validity are all derived.
  - New ids come from a counter or `crypto.randomUUID()`.
- **Traps:**
  - `key={index}`, which fails AC3 visibly.
  - Violations stored in state and computed in an effect.
  - Forgetting to parse row amounts to cents before summing.
  - Separate markup for mobile and desktop rows, which doubles every input.

---

## 08 — Approvals queue

**Difficulty:** 8 · **Concept:** Optimistic actions, undo, bulk selection · **Target:** responsive, 375 / 768 / 1280

### What this tests

Selection state across a list, including select-all with an indeterminate checkbox. It also tests optimistic removal with an undo toast that restores the item to its original position, and a live region for announcements.

### Visual direction

Dense, modern SaaS:

- page `white`, a left sidebar in `gray-50` (decorative nav with 5 items, "Approvals" active)
- main content is a list, not cards
- font **Inter** at 13/14px
- accent `violet-600`; approve buttons `emerald-600`, reject outlined `gray-300`
- avatar circles with initials in pastel backgrounds
- the toast is a dark `gray-900` pill fixed bottom-centre with white text and an "Undo" text button in `violet-300`

### Layout

The header reads "Approvals" with a count badge ("8 pending") and filter tabs "All", "Cards", "Reimbursements", "Bills".

A bulk bar appears when anything is selected: "<n> selected · Approve selected · Reject selected".

Each list row has:

- checkbox, requester avatar and name
- type tag and description
- amount and submitted relative date ("3d ago")
- Approve and Reject buttons

Acting on a row removes it and shows the toast "<Approved|Rejected> <description> · Undo" for 5 seconds.

**Responsive:**

- **Mobile:** the sidebar is hidden behind a "Menu" button in the header that toggles it. Each row stacks: requester and description, then amount and date, then Approve and Reject.
- **Tablet:** the sidebar is visible and "Menu" is gone. Rows put amount and date beside the description, with Approve and Reject wrapping below.
- **Desktop:** one line per row, as described.

### Data

`data/08-approvals.json`

```
{
  requests: [{ id, requester, type: "card"|"reimbursement"|"bill", description, amountCents, submittedAt }]  // 8, mixed types
}
```

### Acceptance criteria

- **C08-AC1:** Given 8 requests, then the header shows "8 pending" and 8 rows are listed.
- **C08-AC2:** When the user selects the "Bills" tab, then only bill requests are listed, and the pending count still shows the total across all types.
- **C08-AC3:** When the user checks one row, then a "Select all" checkbox is in the mixed (indeterminate) state and "1 selected" is shown. When all visible rows are checked, it is checked.
- **C08-AC4:** When the user activates Approve on a row, then the row disappears, the count decrements, and a status message "Approved <description>" is announced with an "Undo" button.
- **C08-AC5:** When the user activates Undo, then the row reappears in its original position (not at the end) and the count is restored.
- **C08-AC6:** When the user selects 3 rows and activates "Reject selected", then all 3 are removed and the message reads "Rejected 3 requests", with one Undo that restores all 3 in their original positions.
- **C08-AC7:** Given all requests are actioned, then an empty state "You're all caught up" is shown.
- **C08-AC8 (manual):** The toast auto-dismisses after about 5 seconds; after dismissal the action is final.
- **C08-AC9:** At 375, 768 and 1280, the page does not scroll horizontally.
- **C08-AC10:** Given a 375px viewport, then the sidebar's "Approvals" link is hidden until the user activates "Menu".
- **C08-AC11:** Given a 768px or 1280px viewport, then the sidebar navigation is visible and there is no "Menu" button.
- **C08-AC12:** Given a 1280px viewport, then each row's Approve button is on the same line as its description. Given a 375px viewport, it is below it.

### Accessibility bonus

- **C08-A11Y1:** After Approve or Reject on a row, focus moves to another row's control or to "Undo", not to the page.
- **C08-A11Y2:** While "Undo" has focus or the pointer is over the toast, it stays open past 5 seconds.

### Reference analysis

- **Tree:** `Sidebar`, `Header > (CountBadge, FilterTabs)`, `BulkBar`, `RequestList > RequestRow`, `Toast` (live region), `EmptyState`.
- **Tokens:** `bg-gray-50` sidebar, `text-[13px]`, `violet-600`, `emerald-600`, `border-gray-300`, toast `bg-gray-900 rounded-full`, `divide-y`.
- **Breakpoints:** sidebar `hidden tablet:flex`, with a `menuOpen` state that only mobile uses; rows `grid tablet:grid-cols-[1fr_auto] desktop:grid-cols-[auto_1fr_auto_auto_auto]`.
- **State:** a reducer over `{ requests, selected: Set, lastAction: { kind, removed: [{ item, index }] } | null, filter }`.
  - Actions: `select`, `selectAll`, `act(ids, kind)`, `undo`, `expire`.
  - The visible list, counts, and select-all state are derived.
- **Traps:**
  - Undo that pushes restored items to the end, which fails AC5.
  - Selection that persists ids of removed rows.
  - The toast timer not cleared on undo or on a second action.
  - A select-all that selects hidden (filtered-out) rows.
  - Rendering the sidebar twice, once per tier.

---

## 09 — Spend analytics

**Difficulty:** 9 · **Concept:** Hand-drawn SVG chart with accessible interaction · **Target:** responsive, 375 / 768 / 1280

### What this tests

Scaling data into SVG coordinates by hand, a bar chart with axis ticks and gridlines, range tabs that re-aggregate data, a hover-and-keyboard tooltip, and KPIs derived from the same aggregation. No chart library.

### Visual direction

Clean analytics:

- page `neutral-50`; one large white panel with `rounded-2xl` and `ring-1 ring-neutral-200`
- font **DM Sans**, with tabular numerals for all figures
- bars in `blue-500`; the hovered or focused bar `blue-700`; the prior-period comparison as a `neutral-300` ghost bar behind each bar
- gridlines `neutral-200`, dashed
- the tooltip is a small dark card (`neutral-900`, white text) with an arrow

### Layout

The header reads "Spend" with range tabs "7D", "30D", "90D".

A KPI row shows Total spend, Daily average, Largest day, and change vs prior period.

The chart area is 1000×320 SVG with a y-axis of 5 ticks formatted in compact USD ("$12K"). The x-axis shows day labels for 7D, week labels for 30D, and month-week labels for 90D.

Below the chart, a small "Top merchants" list shows 5 rows for the selected range.

**Responsive:**

- **Mobile:** KPIs in a 2×2 grid. The chart keeps a 640px minimum width inside a panel that scrolls sideways on its own; the page itself does not. Top merchants below the chart.
- **Tablet:** KPIs in one row of four. The chart fits its panel with no sideways scroll.
- **Desktop:** the chart and Top merchants side by side (2fr 1fr).

### Data

`data/09-spend.json`

```
{
  days: [{ date, amountCents, merchants: [{ name, amountCents }] }]   // 180 days ending 2026-09-28, generated with weekday/weekend rhythm and 2 spikes
}
```

The range covers the most recent N days. The prior period is the N days before that. 7D shows 7 daily bars. 30D and 90D aggregate into weekly bars (Monday-start weeks, partial weeks allowed).

### Acceptance criteria

- **C09-AC1:** Given the page loads, then "7D" is the selected tab and the chart is an image with an accessible name containing "Spend".
- **C09-AC2:** Given 7D, then 7 bars are exposed as focusable elements, each with an accessible label "<date>: <amount>".
- **C09-AC3:** When the user selects "30D", then the number of bars equals the number of Monday-start weeks spanned by the last 30 days, and the KPIs change.
- **C09-AC4:** When a bar is hovered or receives keyboard focus, then a tooltip shows its label, amount, and change vs the matching prior-period bar.
- **C09-AC5:** Given the selected range, then "Total spend" equals the sum of the range's daily amounts, and "Daily average" equals the total divided by the number of days (not bars).
- **C09-AC6:** Given the selected range, then the y-axis shows 5 tick labels in compact USD, the top tick is at least the tallest bar, and 0 is labelled "$0".
- **C09-AC7:** Given the selected range, then "Top merchants" lists 5 merchant names ordered by total spend, descending.
- **C09-AC8 (manual):** Gridlines align with ticks, and ghost bars sit behind the current bars.
- **C09-AC9:** At 375, 768 and 1280, the page does not scroll horizontally.
- **C09-AC10:** Given a 375px viewport, then the KPIs sit two per row, and the chart is wider than the viewport while the page does not scroll horizontally.
- **C09-AC11:** Given a 768px viewport, then the four KPIs sit on one row.
- **C09-AC12:** Given a 1280px viewport, then "Top merchants" is to the right of the chart.

### Accessibility bonus

- **C09-A11Y1:** A table of the chart's data, one row per bar with its label and amount, is available visibly or to assistive tech.
- **C09-A11Y2:** With focus on a bar, the Left and Right arrow keys move focus to the previous and next bar.

### Reference analysis

- **Tree:** `Header > RangeTabs`, `KpiRow`, `BarChart > (YAxis, Gridlines, BarGroup × n > (GhostBar, Bar), XAxis, Tooltip)`, `TopMerchants`.
- **Tokens:** `bg-neutral-50`, `ring-1 ring-neutral-200`, `rounded-2xl`, `fill-blue-500` / `blue-700` / `neutral-300`, `stroke-neutral-200 stroke-dasharray`, `tabular-nums`.
- **Breakpoints:** KPIs `grid-cols-2 tablet:grid-cols-4`; chart wrapper `overflow-x-auto` around an SVG `min-w-[640px] tablet:min-w-0 w-full`; page `desktop:grid-cols-[2fr_1fr]`.
- **State:** `range` and `activeIndex`. The buckets, prior buckets, KPIs, scale, ticks, and top merchants are all derived with `useMemo` from `range`.
- **Traps:**
  - A y-scale max equal to the data max, leaving the top bar touching the frame. Use a nice-number ceiling.
  - Forgetting SVG y is inverted.
  - A tooltip on hover only, with no focus path.
  - Daily average computed over bars instead of days.
  - Timezone drift from `new Date("2026-09-28")`. Parse the date parts manually or use UTC throughout.
  - Letting the page, not the chart panel, scroll sideways at 375.

---

## 10 — Transactions

**Difficulty:** 10 · **Concept:** Search, filter, sort, and a detail drawer, composed · **Target:** responsive, 375 / 768 / 1280

### What this tests

Composing derived views (search, then filter, then sort) over 200 rows. It also tests sortable column headers with `aria-sort`, a URL-free but complete state model, and a modal drawer with focus trap, Escape, and focus return. Plus an edit inside the drawer that flows back to the table. This is the full senior-level surface in one screen.

### Visual direction

Premium fintech:

- page `white`; a top nav bar in `stone-950` with the Kestrel wordmark and 4 nav links
- content max width 1280, font **Inter Tight**
- the table has sticky headers, 48px rows, hairline `stone-200` separators, and a zebra-free hover row in `stone-50`
- status badges:
  - Settled: `emerald-50` / `emerald-700`
  - Pending: `amber-50` / `amber-700`
  - Declined: `rose-50` / `rose-700`
  - Refunded: `sky-50` / `sky-700`
- the drawer slides in from the right, 440px wide, with a `black/40` scrim

### Layout

A toolbar holds:

- a search input ("Search merchant, cardholder or memo")
- a Status filter as a multi-select of checkboxes in a popover
- a Category select
- a results count ("Showing 37 of 200")

A table follows with columns:

- Date, Merchant, Cardholder, Category, Status
- Amount, right-aligned, sortable
- a receipt indicator

Headers for Date, Merchant, and Amount are sortable buttons.

Clicking a row, or pressing Enter on a focused row button, opens the drawer. The drawer shows merchant, amount, status badge, date and time, card last4, cardholder, category, and a memo textarea with Save. Saving updates the row's memo and closes the drawer.

**Responsive:**

- **Mobile:** the nav shows only the wordmark. The toolbar stacks: search at full width, then Status and Category side by side, then the count. The table shows Date, Merchant and Amount; Cardholder, Category, Status and the receipt column are hidden. The drawer is full width.
- **Tablet:** the toolbar is one row. The table adds Status; Cardholder, Category and the receipt column stay hidden. The drawer is 440px.
- **Desktop:** everything as described.

### Data

`data/10-transactions.json`

```
{
  transactions: [{ id, postedAt, merchant, cardholder, cardLast4, category, status: "settled"|"pending"|"declined"|"refunded", amountCents, memo, hasReceipt }]  // 200; include refunds as negative amounts, 3 merchant names over 30 characters, 2 memos containing a searchable word
}
```

Default order is `postedAt` descending.

### Acceptance criteria

- **C10-AC1:** Given the page loads, then a table shows "Showing 200 of 200", and the Date column header has `aria-sort="descending"`.
- **C10-AC2:** When the user types in the search field, then rows are filtered case-insensitively on merchant, cardholder, and memo, and the count updates.
- **C10-AC3:** When the user checks only "Declined" in the Status filter, then every visible row's status is Declined. Combined with a search, both filters apply.
- **C10-AC4:** When the user activates the Amount header, then rows sort ascending by amount with `aria-sort="ascending"`. Activating it again sorts descending. Sorting applies after filtering.
- **C10-AC5:** When filters match no rows, then "No transactions match your filters" is shown with a "Clear filters" button that restores all 200.
- **C10-AC6:** When the user opens a row, then a dialog named after the merchant opens, focus moves inside it, and Tab cycles within the dialog.
- **C10-AC7:** When the user presses Escape or activates "Close", then the dialog closes and focus returns to the row that opened it.
- **C10-AC8:** When the user edits the memo in the dialog and activates "Save", then the dialog closes, and searching for a word from the new memo finds that row.
- **C10-AC9 (manual):** The header stays visible while scrolling; long merchant names truncate with an ellipsis and show the full name in the dialog.
- **C10-AC10:** At 375, 768 and 1280, the page does not scroll horizontally.
- **C10-AC11:** Given a 375px viewport, then the "Cardholder", "Category" and "Status" column headers are hidden, and an opened dialog is as wide as the viewport.
- **C10-AC12:** Given a 768px viewport, then the "Status" header is visible, "Cardholder" is hidden, and an opened dialog is 440px wide.
- **C10-AC13:** Given a 1280px viewport, then every column header is visible.

### Accessibility bonus

- **C10-A11Y1:** The results count ("Showing n of 200") is a status message, so each change is announced.
- **C10-A11Y2:** When the dialog closes after Save, a status message "Memo saved" is announced.

### Reference analysis

- **Tree:** `TopNav`, `Toolbar > (SearchInput, StatusFilter > Popover, CategorySelect, ResultCount)`, `TransactionTable > (SortableHeader × 3, TransactionRow × n)`, `EmptyState`, `DetailDrawer > (Summary, MetaList, MemoForm)`.
- **Tokens:** `bg-stone-950` nav, `max-w-7xl`, `h-12` rows, `divide-stone-200`, `hover:bg-stone-50`, badge pairs as listed, `w-[440px]` drawer, `bg-black/40` scrim, `sticky top-0` header.
- **Breakpoints:** columns `hidden tablet:table-cell` (Status) and `hidden desktop:table-cell` (Cardholder, Category, receipt) on both `th` and `td`; toolbar `flex flex-col tablet:flex-row`; drawer `w-full tablet:w-[440px]`.
- **State:**
  - `transactions` (memos are editable)
  - `query`, `statuses: Set`, `category`, `sort: { key, dir }`
  - `openId`, plus a ref to the opener
  - The pipeline `transactions → search → filter → sort` is one `useMemo`, and the count comes from it.
  - The drawer's memo draft is local to the drawer.
- **Traps:**
  - Sorting the source array in place.
  - Storing the filtered list in state.
  - Using the native `<dialog>` without handling focus return, or hand-rolling a trap that misses Shift+Tab.
  - Sort comparators that break on negative refunds or equal values (add a stable tiebreak on `postedAt`).
  - Search that runs `toLowerCase` on a null memo.
