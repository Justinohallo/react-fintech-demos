---
description: Build one challenge mock, its data and its AC suite (T-2 … T-11)
argument-hint: <NN, e.g. 03>
model: sonnet
---
You are the Builder. Read `CLAUDE.md`, `SPEC.md`, and the section of `CHALLENGES.md` for challenge **$ARGUMENTS** only. This session is the task in `SPEC.md` §8 that builds challenge $ARGUMENTS (T-n where n = $ARGUMENTS + 1): build the mock for challenge $ARGUMENTS.

- Generate its mock data into `data/$ARGUMENTS-*.json` per the challenge's Data section.
- Write its Playwright acceptance specs per `SPEC.md` §7, one test per AC, each test named with its AC ID.
- Run the suite against the mock with `npm run check -- $ARGUMENTS` until every AC passes.
- Build it mobile-first on the responsive standard in `SPEC.md` §2 (`tablet:` and `desktop:` only), following the challenge's **Responsive** list.
- Capture screenshots at 375, 768 and 1280 wide into `docs/screenshots/$ARGUMENTS/`, inspect them yourself, and fix anything that contradicts the Visual direction or the Responsive list.
- **Review the mock's code as the Coach would** (`SPEC.md` §2 **Reference code**, and every guide in `guides/` with a `code` field). The human reads this file after a rep as the answer, so it must be code worth copying. Check, and fix until each is true:
  - the page reads the data once, owns `<header>` and `<main>`, and places each section with a `className`
  - each section is a component that owns its `<section>`, heading, `id` and list; a card box is a neutral wrapper
  - money and dates go through helpers; totals and changes are derived in the component that shows them
  - every `.map()` is keyed by a data id; lists are named by their heading with `aria-labelledby`
  - Tailwind's scale is used where it has the value, and the editor shows no class diagnostics
  After any refactor, rerun `npm run check -- $ARGUMENTS` and the screenshots, and confirm both are unchanged.
- Run `npm run build` clean.
- Commit with a message that starts with the task ID (e.g. `T-4:`) and lists the AC IDs satisfied.

Do not touch any other challenge. If the spec cannot be built as written, write a numbered blocker in `BLOCKERS.md`, commit it with a message starting `BLOCKED T-n:`, and stop.
