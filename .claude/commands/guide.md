---
description: Draft a new curriculum guide for /guides (SPEC.md §6)
argument-hint: <topic>, e.g. "grid-template-areas for tier layouts"
---
Draft a new guide on: **$ARGUMENTS**

Read `CLAUDE.md` (the **Guides** paragraph), `SPEC.md` §5 (the method) and §6 (**Guides** and **Issue tags**), and every existing file in `guides/`, so the new guide fits the curriculum and doesn't repeat one.

## Write `guides/<slug>.md`

- `<slug>`: short, lowercase, hyphenated, from the title.
- Front matter, one `key: value` per line:
  - `title`, and `summary` (one sentence: what the reader can do after reading)
  - `unit`: an existing unit, or one of Analysis, Layout, Data and state, Interaction, Accessibility
  - `unit_order`: the unit's existing number; for a new unit, the next number
  - `order`: the next number within the unit, or a position chosen to sit before a guide that builds on it
  - `addresses`: the §6 issue tags this helps fix, comma-separated; only tags from that list
  - `worksheet` (optional): the §5 worksheet step it expands: `regions`, `tokens`, `data`, `state`, `states` or `questions`
- Body, as `##` sections:
  1. what the skill is and why it matters in a timed rep
  2. the method, as steps or rules with tables where they help
  3. **a worked example that is invented.** Never use a challenge's reference analysis, tokens, layout or data. The human practises by reading those from the mock first.
  4. where it goes wrong, mapped to issue tags
  5. one short practice exercise
- Draw on what came up in this conversation and in `reviews/`, but teach the general method.
- Link other guides as `[Title](/guides/<slug>)`.

## Check and hand over

Run `npm run build`, then show the human the new guide's path, its place in the curriculum (unit and order), and the tags it addresses. **Do not commit**; the human reviews first, then commits with a message starting `Guide:`.
