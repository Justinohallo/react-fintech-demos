# ADR-002 — axe-core for the accessibility bonus

**Status:** Accepted · **Date:** 2026-09-29

## Context

Reps earn bonus points for accessibility (`SPEC.md` §2). A score is only worth tracking if it catches the common failures: missing names, broken ARIA, low contrast, undersized targets. Role, label and text queries can check what a test already knows to look for, but they cannot audit a whole page for problems nobody anticipated.

## Decision

Add `@axe-core/playwright` as a dev dependency. It runs the axe-core rule engine inside the Playwright page, so it never ships to the browser bundle. It is used only in `tests/a11y.spec.ts`, limited to the tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and `wcag22aa`.

Axe inspects the whole DOM. That is the audit engine, not a selector: every locator a test writes still follows the role, label and text rule in `CLAUDE.md`.

## Build versus buy

**Build:** hand-written checks over Chromium's accessibility tree through Playwright's CDP session. That covers names, landmarks and headings, but not colour contrast, ARIA validity or the long tail of WCAG rules, and every rule would be ours to maintain and get wrong.

**Buy:** axe-core is the de facto standard engine behind most accessibility tooling. It reports by WCAG criterion, which makes a failed bonus point something to look up rather than something to argue with.

Axe finds roughly a third to a half of real accessibility issues and cannot judge keyboard use or focus. Those are covered by hand-written checks in the same suite (A11Y-3 to A11Y-6).

## What would flip this

- If the bonus is dropped, remove the dependency with it.
- If axe's false positives start costing reps more than they teach, pin a rule list rather than the tags.
