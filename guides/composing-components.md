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

With shape B, `Card` stays a small presentational wrapper (border, radius, padding), and each section decides its own heading level.

## Semantics belong with whoever knows the meaning

Different meanings are known at different levels, so the semantic elements live at different levels too:

| Meaning | Who knows it | Where the element goes |
|---|---|---|
| "This is the site's top bar" / "this is the page's main content" | The page or layout | `<header>` and `<main>` in the page, never inside a reusable component |
| "This is a section called Invoices, and here is its list" | The component that owns that content | `<section aria-labelledby>` plus its heading and list, together in `InvoicesCard` |
| "This is a box with a border and padding" | The generic `Card` | **No semantics of its own.** It can't know whether it's a section, a list item or an article. |

A generic `Card` that hard-codes `<section>` bakes in a meaning it can't know: the same box might be a `<section>` on one page, an `<li>` in a list of cards, or an `<article>` in a feed. Two clean ways to keep it neutral:

```jsx
// 1. Card is a plain box; the section component supplies the meaning.
function Card({ className = "", children }) {
  return <div className={`rounded-xl border border-zinc-200 bg-white p-6 ${className}`}>{children}</div>;
}

function InvoicesCard({ invoices, className }) {
  return (
    <section aria-labelledby="invoices-heading" className={className}>
      <Card>
        <h2 id="invoices-heading" className="text-lg font-medium">Invoices</h2>
        <ul aria-labelledby="invoices-heading">
          {invoices.map((inv) => <InvoiceRow key={inv.id} invoice={inv} />)}
        </ul>
      </Card>
    </section>
  );
}

// 2. Card renders whatever element it's told (an `as` prop, common in design systems).
function Card({ as: Tag = "div", className = "", ...props }) {
  return <Tag className={`rounded-xl border border-zinc-200 bg-white p-6 ${className}`} {...props} />;
}

<Card as="section" aria-labelledby="invoices-heading" className={className}>…</Card>
```

Option 1 is simpler in a timed rep; option 2 saves a wrapper. What matters in both: the `<section>`, its heading, and the `id` that links them sit in **one component**, because they have to stay in sync.

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
| A generic `Card` that hard-codes `<section>`, or `<header>`/`<main>` inside a reusable component | `markup` |
| A section title passed as a string from the page, far from its content | `structure` |
| A heading level chosen for size, or skipped | `markup` (and review tag `non-semantic-markup`) |
| A card that knows its own grid area | `structure` |

## Practise it

Take any screen with three cards. Write the page component first, using only section components and `className` for placement. Then write each section. If a section needs a prop only so the page can tell it how to look, move that decision into the section.
