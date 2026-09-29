---
title: Composing components
unit: Code craft
unit_order: 6
order: 1
summary: Decide what each component owns: the page places sections, each section owns its container and content.
addresses: non-semantic-markup
code: structure, markup
---

## The question

A design shows several cards, each with a title and different content. Where does the card wrapper go?

```jsx
// Shape A: the page wraps every section in a Card
<main>
  <Card title="Invoices"><InvoiceList invoices={invoices} /></Card>
  <Card title="Payees" isPrimary><PayeeList payees={payees} /></Card>
</main>

// Shape B: each section renders its own Card
<main>
  <InvoicesCard invoices={invoices} />
  <PayeesCard payees={payees} />
</main>
```

Both render the same pixels. They differ in what happens when the code changes.

## The rule: the page places, the section owns

**Prefer shape B.** A section's heading, its list, the `id` its list is labelled by, and its footer total belong together. When the heading lives in the page and the list lives in a child, they drift apart:

- A typo in the page's `title` breaks the section, but the section's file looks fine.
- Labelling a list with the heading (`aria-labelledby`) needs an `id` that now has to be passed between files.
- The generic `Card` starts growing flags like `isPrimary` to pick a heading level, because it's being told about content it doesn't own.

With shape B, `Card` stays a small presentational wrapper (border, radius, padding), and each section decides its own heading level:

```jsx
function Card({ className = "", children }) {
  return <section className={`rounded-xl border border-zinc-200 bg-white p-6 ${className}`}>{children}</section>;
}

function InvoicesCard({ invoices, className }) {
  return (
    <Card className={className}>
      <h2 id="invoices-heading" className="text-lg font-medium">Invoices</h2>
      <ul aria-labelledby="invoices-heading">
        {invoices.map((inv) => <InvoiceRow key={inv.id} invoice={inv} />)}
      </ul>
    </Card>
  );
}
```

**Placement is the page's job.** Which grid area a card sits in is layout, and layout belongs to the page. So the page passes placement in, and the card never needs to know about the grid:

```jsx
<main className="grid gap-6 tablet:grid-cols-2">
  <SummaryCard className="[grid-area:summary]" … />
  <InvoicesCard className="[grid-area:invoices]" invoices={invoices} />
</main>
```

## Reading the page as a plan

With shape B, the page reads like the Regions line of your plan: `<SummaryCard/> <InvoicesCard/> <PayeesCard/>`. If your plan names a region, there should be a component with that name.

## Where it goes wrong

| Symptom | Code review category |
|---|---|
| A `Card` with flags like `isPrimary` or `showTotal` | `structure` |
| A section title passed as a string from the page, far from its content | `structure` |
| A heading level chosen for size, or skipped | `markup` (and review tag `non-semantic-markup`) |
| A card that knows its own grid area | `structure` |

## Practise it

Take any screen with three cards. Write the page component first, using only section components and `className` for placement. Then write each section. If a section needs a prop only so the page can tell it how to look, move that decision into the section.
