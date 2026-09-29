---
title: Semantic page structure
unit: Accessibility
unit_order: 5
order: 1
summary: Landmarks, a heading outline, sections named by their headings, and text alternatives for things that are only visual.
addresses: non-semantic-markup, a11y-item-skipped
code: markup
---

## Why it matters

Screen reader users navigate by structure: jump to the main content, list the headings, move between regions, hear a list's name and length. Semantic elements give them that for free. They're also what role-based tests query, so good structure and passing tests go together.

## The skeleton

```jsx
<>
  <header>…logo, nav, account…</header>
  <main>
    <section aria-labelledby="overview-heading">
      <h1 id="overview-heading">Overview</h1>
      …
    </section>
    <section aria-labelledby="payees-heading">
      <h2 id="payees-heading">Payees</h2>
      <ul aria-labelledby="payees-heading">…</ul>
    </section>
  </main>
</>
```

| Element | Rule |
|---|---|
| `<header>` | Site chrome, outside `<main>`. It's the "banner" landmark. |
| `<main>` | Exactly one per page: the content the page exists for. |
| `<section>` | A themed part of the page, named by its heading. Without a name it's no better than a `div`. |
| Headings | One `h1`, then `h2`s; never skip a level, never pick a level for its size. |
| `<ul>` / `<li>` | Anything that repeats. Name the list when a test or a user needs to find it. |
| `<div>` | Layout wrappers. Having no meaning is its job. |

Which component each element lives in is covered in [Composing components](/guides/composing-components): landmarks in the page; a section's element, heading and id together in the component that owns it.

## `aria-labelledby` takes an id, not text

```jsx
// Wrong: the value is the heading's text. No element has that id, so the section has no name.
<section aria-labelledby="Payees">

// Right: point at the heading's id.
<section aria-labelledby="payees-heading">
  <h2 id="payees-heading">Payees</h2>
```

Ids can't contain spaces and must be unique on the page. The same `id` can label both the section and its list.

## Text for things that are only visual

| Visual | What assistive tech needs | Pattern |
|---|---|---|
| A masked number, `•••• 9012` | "ending in 9012", not "bullet bullet…" | The visible text with `aria-hidden`, plus `<span className="sr-only">Card ending in 9012</span>` |
| An avatar with initials | Whose avatar it is | `role="img"` and `aria-label="Signed in as Sam Rivera"` |
| An icon-only button | What it does | `aria-label="Close"` on the button; the SVG `aria-hidden` |
| A decorative icon | Nothing | `aria-hidden` on the SVG |
| Red or green amounts | The meaning without colour | A sign or word in the text (`-$20.00`, "overdue") |

Build these from the data (`` `ending in ${last4}` ``), never typed.

## Colour contrast

Normal text needs a 4.5:1 contrast ratio. On white, the `500` shades of green, red, amber and sky usually fail; `700` passes. The accessibility check flags these every time.

## Checking it

- **Headings:** open DevTools' Accessibility pane, or list headings with a screen reader shortcut. The outline should read like the page's table of contents.
- **Names:** in the Accessibility pane, a section or list shows its computed name. If it's empty, the `aria-labelledby` id is wrong.
- **Everything:** `npm run check` runs axe and the keyboard checks.

## Where it goes wrong

| Symptom | Tag or category |
|---|---|
| Headings chosen for size, skipped levels, no `main` | `non-semantic-markup`, `markup` |
| `aria-labelledby` pointing at text | `markup` |
| A list the tests can't find by name | `markup` |
| An accessibility item not attempted | `a11y-item-skipped` |

## Practise it

Take any finished page and, without looking at it, write the heading outline and the landmark list you'd expect. Then check it in the Accessibility pane.
