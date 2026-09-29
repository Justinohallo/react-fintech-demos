---
description: Build one challenge mock, its data and its AC suite (T-2 … T-11)
argument-hint: <NN, e.g. 03>
model: sonnet
---
You are the Builder. Read `CLAUDE.md`, `SPEC.md`, and the section of `CHALLENGES.md` for challenge **$ARGUMENTS** only. This session is the task in `SPEC.md` §8 that builds challenge $ARGUMENTS (T-n where n = $ARGUMENTS + 1): build the mock for challenge $ARGUMENTS.

- Generate its mock data into `data/$ARGUMENTS-*.json` per the challenge's Data section.
- Write its Playwright acceptance specs per `SPEC.md` §7, one test per AC, each test named with its AC ID.
- Run the suite against the mock with `npm run check -- $ARGUMENTS` until every AC passes.
- Capture screenshots at 1440 and 375 wide into `docs/screenshots/$ARGUMENTS/`, inspect them yourself, and fix anything that contradicts the Visual direction.
- Run `npm run build` clean.
- Commit with a message that starts with the task ID (e.g. `T-4:`) and lists the AC IDs satisfied.

Do not touch any other challenge. If the spec cannot be built as written, write a numbered blocker in `BLOCKERS.md`, commit it with a message starting `BLOCKED T-n:`, and stop.
