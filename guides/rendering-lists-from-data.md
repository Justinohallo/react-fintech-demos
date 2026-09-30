---
title: Rendering lists from data
unit: Data and state
unit_order: 3
order: 1
summary: Read the data once, pass it down, map every repeating thing with a stable key, and compute totals instead of storing them.
addresses: hard-coded-data, missing-keys, missing-derivation
code: data_flow, idioms, correctness
worksheet: data
---

## Read once, at the top; pass down

Import the data in **one place**, the page, and hand each section the slice it needs as a prop.

```jsx
import data from "@data/invoices.json";

export default function Page() {
  const { customer, invoices } = data;
  return (
    <main>
      <CustomerCard customer={customer} />
      <InvoicesCard invoices={invoices} />
    </main>
  );
}
```

When each component imports the file itself, it can only ever show that one file: it can't be reused, tested, or fed different data, and the page no longer shows where data comes from.

## Map, with a `key` that isn't the index

Anything that repeats in the design is an array in the data. Render it with `.map()`, and give each element a `key` from the data:

```jsx
<ul aria-labelledby="invoices-heading">
  {invoices.map((inv) => (
    <li key={inv.id}>…</li>
  ))}
</ul>
```

- `key`, not `id`. `id` is a DOM attribute; React ignores it for identity and warns about the missing key.
- Use a **stable id from the data**, not the array index. Index keys break when rows are added, removed or sorted: React reuses the wrong row's state.

## One field, one element

Put each field in its own element, so it can be styled, aligned and read separately:

```jsx
<li key={inv.id} className="flex justify-between gap-4 py-3">
  <div>
    <p className="text-sm font-medium">{inv.customer}</p>
    <p className="text-xs text-slate-500">{inv.status} · {formatDate(inv.dueDate)}</p>
  </div>
  <p className="text-sm tabular-nums">{formatMoney(inv.amountCents)}</p>
</li>
```

`{inv.customer} {inv.status}{inv.dueDate}` in one text node reads as a single run of words, and no test or style can tell the fields apart.

## Derive, don't store

A total, a count, a difference or a percentage is **computed from the data at render**, never typed and never kept in state:

```js
const totalCents = invoices.reduce((sum, inv) => sum + inv.amountCents, 0);
const overdue = invoices.filter((inv) => inv.status === "overdue").length;
```

If a value can be computed from other values, storing it means two sources of truth that can drift apart.

## The empty state

Every list has a state the design doesn't show: no items. Handle it where you map:

```jsx
{invoices.length === 0 ? <p>No invoices yet.</p> : <ul>…</ul>}
```

## Where it goes wrong

| Symptom | Tag or category |
|---|---|
| Values typed from the picture | `hard-coded-data` |
| `id=` instead of `key=`, or `key={index}` | `missing-keys`, `idioms` |
| A total missing, or stored instead of computed | `missing-derivation` |
| Each component importing the data file itself | `data_flow` |
| Several fields in one text run | `correctness` |

## Practise it

Given any array of objects, write the page that reads it once, passes it to a card, maps it with keys, shows a total, and handles an empty array. Time yourself: aim for under five minutes.
