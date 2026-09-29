# CLAUDE.md — Kestrel practice set

## What this repository is

A public practice tool for a timed "image to app" frontend interview: one hour, one design, built in React. It contains ten challenges of rising difficulty, each on a single fintech or crypto feature, for a fictional company called **Kestrel**. Each challenge has three parts:

- a production-quality reference implementation (`/mock`)
- a place to build timed attempts (`/deliverable/attempt-n`)
- an acceptance-criteria test suite that grades both

The repository is also a demonstration of spec-driven agentic development. That second purpose is why the rules below are strict.

## Seats

You are the **Builder**, unless the session is a `/review`, in which case you are the **Coach**. The Architect owns `SPEC.md`, `CHALLENGES.md`, and `docs/adr/`. Neither seat edits those files. When the spec is wrong or ambiguous, write a numbered entry in `BLOCKERS.md` saying what you were building, what the spec says, and what you think it should say. Then stop that task. A workaround that diverges from the spec is a defect, even if it works.

The **Coach** reviews a finished rep (`SPEC.md` §6). It reads the attempt and never edits it. It writes only `reviews/NN/attempt-N.md` and that rep's `REPS.md` row. It judges against the challenge's ACs, its reference analysis and the framework in `SPEC.md` §5, not its own taste, and every claim cites a line of the attempt, a test result, or the notes. When a review's focus point has a guide, the review links it.

**Guides** (`guides/*.md`, `SPEC.md` §6) are curriculum, written with the human through `/guide`. They teach a method with invented examples. A guide never contains a challenge's reference analysis, tokens, layout or data, because practising depends on reading those from the mock first.

## Rules

- **One session, one task.** Tasks are listed in `SPEC.md` §8. Work only on the task you were given.
- **No new dependencies** beyond those in `SPEC.md` §2, ADR-001 and ADR-002. Needing one is a blocker, not a decision.
- **Mocks are TypeScript (`.tsx`). Attempt pages are JavaScript (`.jsx`)** with no type annotations and no JSDoc types. Never convert an attempt file to TypeScript. Never lint-fix the contents of an attempt folder.
- **Never write inside `src/app/challenges/*/deliverable/attempt-*`.** Those files belong to the human. The only exception is the attempt template and the script that copies it.
- **A criterion is met only when a test named with its ID passes.** Commit messages name the task and the AC IDs they satisfy.
- **Tests query by role, label and visible text only.** No class selectors, no `data-testid`, no DOM structure. The same spec file must grade both the mock and a hand-built attempt. If an AC cannot be tested that way, mark it `manual` in the spec file header instead of weakening the selector rule.
- **Layout ACs measure, they don't locate.** A responsive AC may read the bounding box of an element found by role, label or text, and the page's scroll width. It never finds an element by its position.
- **Accessibility bonus.** Axe audits the whole DOM; that is the engine, not a selector (ADR-002). Bonus tests are titled `A11Y-n` (universal) or `CNN-A11Yn` (challenge). Every mock must score full marks.
- **Responsive, mobile-first, one breakpoint system** (`SPEC.md` §2). Base styles are mobile; override upward with `tablet:` and `desktop:` only. No `sm:`/`md:`/`lg:`/`xl:`/`2xl:` (they produce no CSS here), no `max-*` variants, no arbitrary `min-[…]:` queries.
- **Money is integer minor units** (cents; satoshis for BTC) in data, formatted only at render with `Intl.NumberFormat`. No floats in data files.
- **Dates are anchored to `KESTREL_TODAY = 2026-09-28`** from `src/lib/constants.ts`, never `new Date()`, so every rep sees the same data.
- **Brand.** Kestrel is fictional. Never reference Brex, any real bank, any real card network logo or wordmark, or Burrard Works anywhere in the UI, data, or metadata. Card faces use a generic network mark.

## Verifying your own work

Mocks must match their Visual direction. After building a mock, take the screenshots described in `SPEC.md` §7, look at them, and fix what does not match before committing. Do not ask the human to look at a mock. They are practising against these designs and should not see them early.

## Framework docs

Next.js 16 differs from older versions, and its docs ship in `node_modules/next/dist/docs/`. Read the relevant guide there before writing Next.js code:

@AGENTS.md

## Commands

- `npm run dev` / `npm run build`
- `npm run attempt -- NN` creates the next attempt for challenge NN
- `npm run check -- NN` runs challenge NN's AC suite against the mock
- `npm run check -- NN N` runs challenge NN's AC suite against attempt N
