# SPEC.md — Kestrel practice set

**Owner:** Architect · **Status:** Ready for T-1 · **As of:** 2026-09-28

## 1. Outcome

A public site on Vercel where a timed rep runs end to end:

1. Read the method.
2. Open a challenge.
3. Analyse the mock using the worksheet.
4. Start the timer.
5. Build an attempt in `.jsx`.
6. Grade it against the same acceptance suite that grades the reference.
7. Log the rep.

Attempts persist and deploy, so progress is visible over time. It must be usable tonight and support about twenty reps over two weeks.

## 2. Stack

- Next.js, latest stable, App Router, `src/` layout. TypeScript for everything except attempt pages. `allowJs: true`.
- Tailwind, latest stable, configured CSS-first. Used for mocks, shell, and attempts.
- Fonts through `next/font` only. Each mock may choose its own font as part of its visual direction.
- Playwright, dev dependency only (ADR-001).
- No other runtime or dev dependencies. No component libraries, icon packages, chart libraries, or state libraries. Icons are inline SVG. Charts are hand-drawn SVG.
- Deployed on Vercel from `main`.

## 3. Routes

| Route | Language | Purpose |
|---|---|---|
| `/` | TS | Index. Kestrel practice set title. The ten challenges as a list with number, title, concept, difficulty 1–10, and attempt count. Link to `/framework`. Footer: "Kestrel is a fictional company. Designs and data are invented for practice." |
| `/framework` | TS | The method (§5). Readable in two minutes. Linked from every page header. |
| `/challenges/NN` | TS | Challenge brief (§4). |
| `/challenges/NN/mock` | TS | The reference implementation, full-bleed, no app chrome except a small floating "← Brief" link in a corner. |
| `/challenges/NN/deliverable` | TS | Attempt index: every attempt folder for NN, newest first, with date, rep minutes if recorded, and the first line of its notes. Links to each attempt. Shows the command to create the next one. Reads the filesystem at build time. |
| `/challenges/NN/deliverable/attempt-N` | **JSX** | An attempt. Its layout (TS) supplies only the floating timer and a "← Attempts" link. The page itself is the human's. |

`NN` is zero-padded, `01`–`10`. Use static folders per challenge, not a dynamic segment, so attempt folders can sit under them.

## 4. Challenge brief page

Built from `src/content/challenges.ts`. It has five sections, in this order:

1. **Header:** number, title, difficulty, concept in one line.
2. **What this tests:** the skills, from the challenge spec.
3. **Requirements:** the acceptance criteria, listed with IDs.
4. **Actions:**
   - "Open mock" (new tab)
   - "Start rep", which starts the timer and shows the command `npm run attempt -- NN`
   - "Attempts", linking to the attempt index
5. **Reference analysis:** collapsed by default behind a button labelled "Reveal reference analysis". On click, a confirm step reads "Finish your own 5-minute analysis first. Reveal anyway?" The analysis contains the component tree, tokens, state model, and traps from the challenge spec. Comparing your plan to this is the learning loop.

## 5. `/framework` content

Render this content faithfully. Styling is the Builder's call within the shell's look: calm, readable, one column, maximum width about 720px.

### The rep, in five phases

| Minutes | Phase | Done when |
|---|---|---|
| 0–5 | **Read and plan** | Regions named, component tree said out loud, tokens pulled, questions asked |
| 5–15 | **Skeleton** | Every region on screen as a box, layout correct at the target width |
| 15–40 | **Components and data** | Real content rendered from data, not hard-coded strings |
| 40–50 | **Interaction and states** | The one core interaction works; hover, focus, empty, error states exist |
| 50–60 | **Polish and walkthrough** | Largest visual gaps closed; closing statement given |

### Analysing a view (the 5-minute worksheet)

1. **Regions.** Draw boxes over the image. Name each box as a component. Nest them. That list is your file plan.
2. **Tokens.**
   - Background and surface colours, text colours (primary, muted), one accent, and status colours.
   - Spacing: find the base unit, then check that the gaps are multiples of it.
   - Type: count distinct sizes and weights. It is usually three or four.
   - Radius and shadow.
   - Map each to a Tailwind value before writing markup.
3. **Data shape.** What repeats? The repeating thing is an array, and its fields are your props. Write the shape before the JSX.
4. **State.** What changes when the user acts? Name each piece of state and who owns it. Derive everything else.
5. **States the image does not show.** Empty, loading, error, overflow, long names, negative amounts, zero.
6. **Questions to ask out loud.**
   - Is this responsive, or fixed width?
   - Which interactions matter most?
   - Is the data static or should I model it?
   - Can I use the platform's native controls?

### Narration cues

Say the decision, then the reason. For example: "Grid here because the columns align across rows." "I'm deriving the total rather than storing it, so it can't drift." When you skip something, say you are skipping it and what it would take.

### Closing statement (last two minutes)

1. What is done, measured against the brief.
2. What is not done, and in what order you would do it.
3. What you would add before this shipped: accessibility pass, tests, error states, feature flag and progressive rollout.

### Traps

- Starting with the most detailed region.
- Hard-coding strings that are clearly data.
- Pixel-pushing before every region exists.
- Silence for more than a minute.
- Storing derived values as state.

## 6. Timer, attempts, rep log

**Timer.** A floating panel on brief pages and attempt pages.

- Controls: Start, Pause, Reset.
- Shows elapsed time as mm:ss and the current phase name from §5.
- A thin progress bar with ticks at 5, 15, 40, 50 and 60.
- At each phase boundary it shows a brief visual cue and plays a short tone through the Web Audio API. The tone can be muted.
- It persists its start timestamp and paused state in `localStorage`, so a reload or hot refresh does not reset it. Access is wrapped so it fails safe.
- It keeps running past 60 minutes, showing overtime in a warning colour.
- It can be collapsed to a small pill.

**Attempt script (`npm run attempt -- NN`).** A plain Node script, no dependencies.

1. Copy `src/app/challenges/_template/attempt/page.jsx` to the next free `attempt-N` folder under challenge NN.
2. Write a `notes.md` there from the notes template.
3. Print the local URL.

The page template is a single `'use client'` component. It has an empty `<main>`, imports the challenge's data JSON, and contains a one-line comment naming the challenge. Nothing else.

**Notes template (`notes.md`).** Headings, in order:

- Date
- Rep minutes
- Phase reached at 60:00
- 5-minute analysis: regions, tokens, data shape, state
- Where time went
- Stalls
- Lookups (what I had to search or ask)
- What I'd do next

**Check script (`npm run check -- NN [N]`).** Runs `tests/challenges/NN.spec.ts` with a base-path variable pointing at `/challenges/NN/mock`, or at `/challenges/NN/deliverable/attempt-N` when N is given. Prints pass/fail per AC ID.

**`REPS.md`.** At the repository root. A table with columns:

| Date | Challenge | Attempt | Minutes | Phase at 60 | ACs passed | Top lookup |
|---|---|---|---|---|---|---|

The human fills it in. The Builder only creates the header.

## 7. Tests

- `tests/smoke.spec.ts` (T-1):
  - every route in §3 returns 200 and renders its heading
  - the timer starts, persists across a reload, and resets
  - the reveal on a brief page requires the confirm step
- `tests/challenges/NN.spec.ts` (T-2 … T-11):
  - one `test()` per AC, titled with its ID, e.g. `C03-AC2 freeze disables reveal`
  - base path comes from the environment variable
  - selectors are role, label and text only (CLAUDE.md)
  - ACs marked `(manual)` in `CHALLENGES.md` are listed in a comment block at the top of the file, not tested
- **Screenshots.** Each mock is captured at 1440×900 and 375×812 into `docs/screenshots/NN/`, via a Playwright project that is not part of `check`.

## 8. Tasks

| ID | Task | Depends on |
|---|---|---|
| T-1 | Scaffold, shell, framework page, timer, attempt and check scripts, content transcription, placeholders, smoke tests | — |
| T-2 … T-11 | Mock, data, and AC suite for challenge 01 … 10 (T-n builds challenge n−1) | T-1 |
| T-12 | QA pass in a fresh session: every AC suite passes against its mock, screenshots match Visual directions, no forbidden branding, no dependency drift | T-2 … T-11 |

## 9. Not in scope

- Authentication, databases, or server-side persistence.
- Saving attempts from the browser. Attempts are files in the repo.
- A CMS. Content lives in `challenges.ts`.
- Dark-mode toggles beyond what a mock's own design calls for.
- Real brands, logos, or card networks.
- Any dependency not listed in §2.
