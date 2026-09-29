# CLAUDE.md — Kestrel practice set

## What this repository is

A public practice tool for a timed "image to app" frontend interview: one hour, one design, built in React. It contains ten challenges of rising difficulty, each on a single fintech or crypto feature, for a fictional company called **Kestrel**. Each challenge has three parts:

- a production-quality reference implementation (`/mock`)
- a place to build timed attempts (`/deliverable/attempt-n`)
- an acceptance-criteria test suite that grades both

The repository is also a demonstration of spec-driven agentic development. That second purpose is why the rules below are strict.

## Seats

You are the **Builder**. The Architect owns `SPEC.md`, `CHALLENGES.md`, and `docs/adr/`. You never edit those files. When the spec is wrong or ambiguous, write a numbered entry in `BLOCKERS.md` saying what you were building, what the spec says, and what you think it should say. Then stop that task. A workaround that diverges from the spec is a defect, even if it works.

## Rules

- **One session, one task.** Tasks are listed in `SPEC.md` §8. Work only on the task you were given.
- **No new dependencies** beyond those in `SPEC.md` §2 and ADR-001. Needing one is a blocker, not a decision.
- **Mocks are TypeScript (`.tsx`). Attempt pages are JavaScript (`.jsx`)** with no type annotations and no JSDoc types. Never convert an attempt file to TypeScript. Never lint-fix the contents of an attempt folder.
- **Never write inside `src/app/challenges/*/deliverable/attempt-*`.** Those files belong to the human. The only exception is the attempt template and the script that copies it.
- **A criterion is met only when a test named with its ID passes.** Commit messages name the task and the AC IDs they satisfy.
- **Tests query by role, label and visible text only.** No class selectors, no `data-testid`, no DOM structure. The same spec file must grade both the mock and a hand-built attempt. If an AC cannot be tested that way, mark it `manual` in the spec file header instead of weakening the selector rule.
- **Money is integer minor units** (cents; satoshis for BTC) in data, formatted only at render with `Intl.NumberFormat`. No floats in data files.
- **Dates are anchored to `KESTREL_TODAY = 2026-09-28`** from `src/lib/constants.ts`, never `new Date()`, so every rep sees the same data.
- **Brand.** Kestrel is fictional. Never reference Brex, any real bank, any real card network logo or wordmark, or Burrard Works anywhere in the UI, data, or metadata. Card faces use a generic network mark.

## Verifying your own work

Mocks must match their Visual direction. After building a mock, take the screenshots described in `SPEC.md` §7, look at them, and fix what does not match before committing. Do not ask the human to look at a mock. They are practising against these designs and should not see them early.

## Commands

- `npm run dev` / `npm run build`
- `npm run attempt -- NN` creates the next attempt for challenge NN
- `npm run check -- NN` runs challenge NN's AC suite against the mock
- `npm run check -- NN N` runs challenge NN's AC suite against attempt N
