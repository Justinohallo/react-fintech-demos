---
description: Review a finished rep — grade it, write the review, log it (SPEC.md §6)
argument-hint: <NN> <N>, e.g. 01 1
---
You are the **Coach** (`CLAUDE.md`). Review challenge NN, attempt N, where `$ARGUMENTS` is "NN N" (e.g. `01 1`). Pad NN to two digits.

Read `CLAUDE.md`, then `SPEC.md` §5 (the method) and §6 (**Review**, **Issue tags**, **`REPS.md`**). Follow that contract exactly. This command is the checklist; the spec is the authority.

## 1. Grade

Run `npm run check -- NN N`. It saves `reviews/NN/attempt-N.check.json`. Use that file for every PASS/FAIL/MISSING claim.

## 2. Read

- `src/app/challenges/NN/deliverable/attempt-N/page.jsx` and `notes.md`. **Read only. Never edit anything in the attempt folder.**
  Notes may be guided, prompted or bare (SPEC.md §6). Ignore prompt lines (`> …`), unfilled slots (`Label:` with nothing after), unticked boxes and empty table cells: they are template, not answers.
- The `## NN —` section of `CHALLENGES.md`: ACs, accessibility items, Responsive list, reference analysis.
- `tests/challenges/NN.spec.ts`, to explain precisely what a failed test expected.
- Every earlier review, `reviews/*/attempt-*.md`, for section 7 and for recurring tags.
- The front matter of every guide in `guides/`, to link the guide behind each focus point.

## 3. Write `reviews/NN/attempt-N.md`

Front matter first, one `key: value` per line, exactly these keys:

```
---
challenge: NN
attempt: N
date: <the notes' Date>
minutes: <rep minutes from the notes>
phase: <phase reached at 60:00, a §5 phase name>
acs: <passed>/<graded>
a11y: <passed>/<total>
analysis_minutes: <from the notes>
tags: <comma-separated, only from the SPEC.md §6 list>
focus: <at most three, separated by " | ">
---
```

Take the values from the notes: `analysis_minutes` is `Finished at:` minus `Started at:` when both are filled. Where the notes leave `minutes`, `phase` or `analysis_minutes` blank, estimate from the attempt and the notes, and say "(estimated)" in the Process section.

Then these sections, in order, as `##` headings:

1. `## Score`: the check result in one line.
2. `## What landed`: passed IDs, grouped by what they show.
3. `## What didn't, and why`: every FAIL and MISSING ID with its cause, citing lines as `page.jsx:37`. Explain what the test expected.
4. `## Against the reference analysis`: tree, tokens, breakpoints, state. Name every trap from the challenge's Traps list that the attempt hit.
5. `## Process`: time per phase against §5, from the notes. When the checkpoint table is filled, give it as target vs actual and name the first checkpoint that slipped. Then stalls and lookups. When the Guided self-check is present, note any box left unticked and whether the attempt agrees with the ticks.
6. `## Accessibility`: the bonus result and the specific changes that would raise it.
7. `## Compared with earlier reps`: the score trend and recurring tags, naming the earlier reviews. On the first review: "Baseline."
8. `## Next rep`: the same focus points as the front matter, each specific enough to act on in the first ten minutes. Where a guide addresses the point (its `addresses` or `worksheet`), link it as `[Title](/guides/<slug>)`.

Judge against the ACs, the reference analysis and §5, not your own taste. Every claim cites a line of the attempt, a test result, or the notes. Be direct and specific, and plain about what went well.

## 4. Log

In `REPS.md`, write one row for this rep, replacing any existing row for the same challenge and attempt:

`| <date> | NN | N | <minutes> | <phase> | <acs> | <a11y> | <top lookup from the notes> |`

## 5. Commit

```
git add reviews/NN/attempt-N.md reviews/NN/attempt-N.check.json REPS.md
git commit -m "Review NN attempt N: <acs> ACs · <a11y> a11y"
```

Do not push. Finish by telling the human the score, the three focus points, and the link `/progress/NN/N`.
