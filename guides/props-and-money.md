---
title: Props and money
unit: Code craft
unit_order: 6
order: 2
summary: Pass money as integer cents, name it so, and format it once at render, with the sign and the colour both derived from the number.
addresses: money-formatting, missing-derivation, hard-coded-data
code: data_flow, correctness, naming
---

## The question

Should a component receive a formatted string like `"+$1,250.00"`, or the raw value? And if it's the raw value in cents, should the prop be called `amount` or `amountCents`?

Formatted strings feel convenient, until the component needs to decide something: red or green, a sign, a comparison. Then it has to parse the string back, or receive the number as well.

## The rule

1. **Data moves as numbers, in integer cents.** Floats like `14.99` can't represent most cents exactly, and they drift when added.
2. **Name the unit.** `amountCents`, `balanceCents`, `limitCents`. A prop called `amount` invites someone to pass dollars. The name costs five characters and removes a class of bugs.
3. **Format once, at render, with one helper.** Every money string on the page goes through it.
4. **Derive the sign and the colour from the number,** never from a hand-placed character.

```js
const money = (signDisplay) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", signDisplay });
const plainMoney = money("auto");
const signedMoney = money("always");

export const formatMoney = (cents) => plainMoney.format(cents / 100);
export const formatSignedMoney = (cents) => signedMoney.format(cents / 100);

function Amount({ amountCents, signed = false }) {
  return (
    <span className={amountCents < 0 ? "text-rose-700" : "text-emerald-700"}>
      {signed ? formatSignedMoney(amountCents) : formatMoney(amountCents)}
    </span>
  );
}
```

- **One factory, two formatters.** The options are written once; only `signDisplay` differs. Build them once at module scope, not inside a `.map()`, since creating a formatter is the slow part.
- **Name by job, not by currency.** With one currency, `formatMoney` says what it does, and nothing needs renaming if the currency changes.
- **`signDisplay`:** `"auto"` (the default) shows a minus only when negative. `"always"` adds `+` to positives and keeps `-` on negatives. **`"never"` hides the minus too**, so a debit of −$50.00 renders as `$50.00`. The component never needs to know the sign.

## Why not add the sign by hand?

```js
// Looks fine for positives…
const display = (cents > 0 ? "+" : "-") + formatMoney(cents);
// …and gives "--$50.00" for -5000, because Intl already adds the minus.
```

## Percentages

A change as a percentage is **change ÷ the starting value**, not the current one. Guard the zero:

```js
const pctSigned = new Intl.NumberFormat("en-US", {
  style: "percent", signDisplay: "always", minimumFractionDigits: 1, maximumFractionDigits: 1,
});
const changePct = (nowCents, beforeCents) =>
  beforeCents === 0 ? null : pctSigned.format((nowCents - beforeCents) / beforeCents);
```

`Intl`'s percent style multiplies by 100 for you: pass `0.087`, get `+8.7%`.

## Where it goes wrong

| Symptom | Review tag or code category |
|---|---|
| Cents rendered as-is (`18432075`) or formatted without `/ 100` | `money-formatting`, `correctness` |
| A hand-placed `+` or `-`, or `toFixed(2)` with a typed `$` | `money-formatting` |
| `signDisplay: "never"`, so negatives lose their minus | `money-formatting`, `correctness` |
| Percentage over the wrong base, or unguarded division | `missing-derivation`, `correctness` |
| A prop named `amount` that holds cents | `naming` |
| Formatted strings passed as props, then parsed back | `data_flow` |

## Practise it

Write `formatMoney`, `formatSignedMoney` and `changePct` from memory, then check them in the browser console against `0`, `-5000`, `123456` and a zero starting value. Two minutes; do it at the start of a rep until it's automatic.
