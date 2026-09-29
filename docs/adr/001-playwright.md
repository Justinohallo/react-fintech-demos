# ADR-001 — Playwright as the only added dependency

**Status:** Accepted · **Date:** 2026-09-28

## Context

The brief says no libraries beyond Next.js and Tailwind. Two requirements cannot be met without a browser driver:

- Principle 4: a criterion is not met until a test names it.
- The Builder must check its own mocks visually, because the human must not see the designs before practising against them.

## Decision

Add `@playwright/test` as a dev dependency. It never ships to the browser bundle.

## Build versus buy

**Build:** hand-roll checks with Node and `fetch` against rendered HTML. That catches markup but cannot click, type, or check focus and aria state after an interaction, and those are what the ACs mostly describe. It also cannot take screenshots.

**Buy:** Playwright does all of that, supports role- and label-based queries natively, and adds no runtime weight.

The same suite also grades the human's attempts, which turns the test suite into the learning tool rather than overhead.

## What would flip this

- If the interview environment turns out to require graded tests in a specific runner, add that runner's equivalent and revisit.
- If the practice set drops self-grading, screenshots alone would not justify the dependency. Deleting it would be acceptable, with the Builder's visual verification done manually.
