# Kickoff — Kestrel practice set

## The short version

From the repo root:

1. `claude`, then type `/t1`. This is one interactive session. Answer anything it asks, then link Vercel when it says it's ready.
2. `scripts/build-mocks.sh` builds challenges 01–10 headlessly, one fresh session each, and stops at the first blocker. Resume with `scripts/build-mocks.sh 4 10`.
3. For a single challenge, run `claude`, then `/challenge 04`.

The prompts live in `.claude/commands/t1.md` and `.claude/commands/challenge.md`. Permissions are in `.claude/settings.json`: the Builder can run npm, npx and git commit, but is denied edits to `SPEC.md`, `CHALLENGES.md` and `docs/adr/`, and denied `git push`. The seat separation is enforced by the harness, not just by the prompt.

The full prompt text is kept below for reference.


The repo is already laid out: `CLAUDE.md`, `SPEC.md` and `CHALLENGES.md` at the root, `docs/adr/001-playwright.md`, and this file at `docs/KICKOFF.md`. Open Claude Code in the repo root and paste everything below the line.

---

You are the Builder on this repository. The specification is complete and lives in four files: `CLAUDE.md`, `SPEC.md`, `CHALLENGES.md`, and `docs/adr/001-playwright.md`. Read all four in full before running any command.

This session is task **T-1** from `SPEC.md` §8, and only T-1. Do not start any challenge mock (T-2 onward). Each of those runs in its own session.

T-1 in summary:

1. The repo root is not empty, so `create-next-app` will refuse to run in place. Scaffold into a temporary sibling directory, then move its contents into the repo root without overwriting the spec files, and delete the temporary directory. Scaffold with the latest stable `create-next-app`: TypeScript, App Router, Tailwind, ESLint, `src/` directory. Do not pin versions from memory. Install `@latest`, then check the current Next.js and Tailwind documentation for configuration conventions. Tailwind v4 and later configure through CSS, not a JS config file. Enable `allowJs` so `.jsx` deliverables compile.
2. Install Playwright as a dev dependency, per ADR-001. Install nothing else.
3. Build the app shell from `SPEC.md` §3–§6:
   - index
   - `/framework`
   - challenge brief pages
   - the 60-minute timer
   - attempt index pages
   - the attempt template
   - the `npm run attempt` and `npm run check` scripts
   - `REPS.md`
4. Transcribe all ten challenges from `CHALLENGES.md` into `src/content/challenges.ts` as typed data: brief, acceptance criteria, reference analysis. Transcribe; do not rewrite. If a challenge is ambiguous, stop and write a blocker to `BLOCKERS.md`.
5. Every `/mock` route gets a placeholder page reading "Mock not built yet — T-n". Every challenge gets its `data/*.json` file stubbed as an empty array or object.
6. Write the T-1 smoke tests from `SPEC.md` §7 and make them pass.
7. Run `npm run build` clean. Commit with a message that names T-1.
8. Stop and tell me when it is ready to deploy. I will link the Vercel project myself. After that, pushing to `main` deploys.

When T-1 is done, report three things:

- what was built
- any spec amendment you think is needed (proposed, not made)
- the exact command I run to start T-2

---

## Prompt for each challenge (T-2 … T-11)

Start a fresh session per challenge. Running them in parallel on separate worktrees is fine.

> You are the Builder. Read `CLAUDE.md`, `SPEC.md`, and the section of `CHALLENGES.md` for challenge **NN** only. This session is task **T-(NN+1)**: build the mock for challenge NN. Generate its mock data into `data/NN-*.json` per the challenge's Data section. Write its Playwright acceptance specs per `SPEC.md` §7, one test per AC, each test named with its AC ID. Run the suite against the mock until every AC passes. Capture screenshots at 1440 and 375 wide into `docs/screenshots/NN/`, inspect them yourself, and fix anything that contradicts the Visual direction. Commit naming the task and the AC IDs. Do not touch any other challenge. If the spec cannot be built as written, write a blocker and stop.
