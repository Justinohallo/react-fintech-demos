# SPEC.md — Kestrel practice set

**Owner:** Architect · **Status:** Ready for T-1 · **As of:** 2026-09-28

## 1. Outcome

A public site on Vercel where a timed rep runs end to end:

1. Read the method, and the guides it points to.
2. Open a challenge.
3. Analyse the mock using the worksheet.
4. Start the timer.
5. Build an attempt in `.jsx`.
6. Grade it against the same acceptance suite that grades the reference.
7. Review the rep: `/review NN N` grades it, writes a review, and logs it.

Attempts and their reviews persist and deploy, so progress is visible over time on `/progress`. It must be usable tonight and support about twenty reps over two weeks.

## 2. Stack

- Next.js, latest stable, App Router, `src/` layout. TypeScript for everything except attempt pages. `allowJs: true`.
- Tailwind, latest stable, configured CSS-first. Used for mocks, shell, and attempts.
- Fonts through `next/font` only. Each mock may choose its own font as part of its visual direction.
- Playwright, dev dependency only (ADR-001).
- `@axe-core/playwright`, dev dependency only, for the accessibility bonus (ADR-002).
- No other runtime or dev dependencies. No component libraries, icon packages, chart libraries, or state libraries. Icons are inline SVG. Charts are hand-drawn SVG.
- Deployed on Vercel from `main`.

### Responsive standard

Every page in the set (shell, mocks and attempts) is responsive and mobile-first, on one breakpoint system:

| Tier | Width | Tailwind variant | Test viewport |
|---|---|---|---|
| Mobile | 0–767px | none (base styles) | 375×812 |
| Tablet | 768–1279px | `tablet:` | 768×1024 |
| Desktop | 1280px and up | `desktop:` | 1280×800 |

- The breakpoints are defined once, in `src/app/globals.css`: `@theme { --breakpoint-*: initial; --breakpoint-tablet: 48rem; --breakpoint-desktop: 80rem; }`. Tailwind's default breakpoints are removed, so `sm:`, `md:`, `lg:`, `xl:` and `2xl:` produce no CSS.
- Write mobile styles first, then override upward with `tablet:` and `desktop:`. No `max-*` variants and no arbitrary `min-[…]:` queries.
- No page scrolls horizontally at any test viewport.
- Each challenge's Layout section has a **Responsive** list saying what changes at each tier, and its ACs grade it.

### Accessibility bonus

Every rep also earns accessibility bonus points. They are reported next to the AC result and never fail a rep.

**Universal checks** run on every challenge, from `tests/a11y.spec.ts`:

| ID | Check |
|---|---|
| A11Y-1 | axe finds no violations tagged `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` or `wcag22aa` at 1280×800 |
| A11Y-2 | The same at 375×812 |
| A11Y-3 | Every enabled button, link, form control, switch and tab can be reached with Tab (one stop per radio group or tablist) |
| A11Y-4 | Every such control visibly changes when it receives keyboard focus |
| A11Y-5 | One `main` landmark, one level-1 heading, and no skipped heading levels |
| A11Y-6 | At 320×640 (WCAG reflow), the page does not scroll horizontally |

**Challenge items** (`CNN-A11Yn` in `CHALLENGES.md`) go beyond the ACs: announcements, focus management and keyboard patterns specific to that feature.

The score is the checks and items passed, out of their total. Every mock scores full marks.

## 3. Routes

| Route | Language | Purpose |
|---|---|---|
| `/` | TS | Index. Kestrel practice set title. The ten challenges as a list with number, title, concept, difficulty 1–10, and attempt count. Link to `/framework`. Footer: "Kestrel is a fictional company. Designs and data are invented for practice." |
| `/framework` | TS | The method (§5). Readable in two minutes. Linked from every page header. Each worksheet step with a guide links to it. |
| `/challenges/NN` | TS | Challenge brief (§4). |
| `/challenges/NN/mock` | TS | The reference implementation, full-bleed, no app chrome except a small floating "← Brief" link in a corner. |
| `/challenges/NN/deliverable` | TS | Attempt index: every attempt folder for NN, newest first, with date, rep minutes if recorded, and the first non-empty line written under any notes heading other than Date and Rep minutes. When the attempt has a review, its score (`4/10 ACs · 5/8 a11y`) and a link to it. Links to each attempt. Shows the command to create the next one. Reads the filesystem at build time. |
| `/progress` | TS | Every reviewed rep in date order: challenge, attempt, AC and a11y scores, phase reached, analysis minutes. A hand-drawn SVG chart of AC and a11y percentages by rep. Issue tags counted across the last five reps and all time, each linking to the guides that address it. The latest review's focus list. Linked from every page header. Reads `reviews/` at build time. |
| `/progress/NN/N` | TS | One review, rendered. |
| `/guides` | TS | The curriculum: every guide, grouped by unit in unit order, each with its title and summary. Linked from every page header. Reads `guides/` at build time. |
| `/guides/<slug>` | TS | One guide, rendered, with links to the previous and next guide in the curriculum. |
| `/challenges/NN/deliverable/attempt-N` | **JSX** | An attempt. Its layout (TS) supplies only the floating timer and a "← Attempts" link. The page itself is the human's. |

`NN` is zero-padded, `01`–`10`. Use static folders per challenge, not a dynamic segment, so attempt folders can sit under them.

## 4. Challenge brief page

Built from `src/content/challenges.ts`. It has five sections, in this order:

1. **Header:** number, title, difficulty, concept in one line.
2. **What this tests:** the skills, from the challenge spec.
3. **Requirements:** the acceptance criteria, listed with IDs, then the accessibility bonus: the universal checks and the challenge's own items.
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
| 5–15 | **Skeleton** | Every region on screen as a box, laid out at all three tiers |
| 15–40 | **Components and data** | Real content rendered from data, not hard-coded strings |
| 40–50 | **Interaction and states** | The one core interaction works by mouse and keyboard; hover, focus, empty, error states exist |
| 50–60 | **Polish and walkthrough** | Largest visual gaps closed; closing statement given |

### Analysing a view (the 5-minute worksheet)

1. **Regions.** Draw boxes over the image. Name each box as a component. Nest them. That list is your file plan.
2. **Tokens.**
   - Background and surface colours, text colours (primary, muted), one accent, and status colours.
   - Spacing: find the base unit, then check that the gaps are multiples of it.
   - Type: count distinct sizes and weights. It is usually three or four.
   - Radius and shadow.
   - Breakpoints: what changes at `tablet:` (768) and at `desktop:` (1280)? Name the layout at each tier.
   - Map each to a Tailwind value before writing markup.
3. **Data shape.** What repeats? The repeating thing is an array, and its fields are your props. Write the shape before the JSX.
4. **State.** What changes when the user acts? Name each piece of state and who owns it. Derive everything else.
5. **States the image does not show.** Empty, loading, error, overflow, long names, negative amounts, zero.
6. **Questions to ask out loud.**
   - What must work at each tier, and what can collapse or hide on mobile?
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
- Building the desktop layout first and squeezing it down.
- Reaching for `md:` or `lg:`, which produce no CSS in this set.
- A clickable `div` where a `button` belongs.

## 6. Timer, attempts, rep log

**Timer.** A floating panel on brief pages and attempt pages.

- One timer per challenge: a challenge's brief page and its attempt pages share the same state.
- Controls: Start, Pause, Reset.
- Shows elapsed time as mm:ss and the current phase name from §5.
- A thin progress bar with ticks at 5, 15, 40, 50 and 60.
- At each phase boundary it shows a brief visual cue and plays a short tone through the Web Audio API. The tone can be muted.
- It persists its start timestamp and paused state in `localStorage`, so a reload or hot refresh does not reset it. Access is wrapped so it fails safe.
- It keeps running past 60 minutes, showing overtime in a warning colour.
- It can be collapsed to a small pill.

**Attempt script (`npm run attempt -- NN [--notes=guided|prompted|bare]`).** A plain Node script, no dependencies.

1. Copy `src/app/challenges/_template/attempt/page.jsx` to the next free `attempt-N` folder under challenge NN.
2. Write a `notes.md` there from the notes template, at the scaffolding level below.
3. Print the local URL and the notes level.

The page template is a single `'use client'` component. It has an empty `<main>`, imports the challenge's data JSON, and contains a one-line comment naming the challenge. Nothing else.

**Notes template (`notes.md`).** Headings, in order, at every level:

- Date
- Rep minutes
- Phase reached at 60:00
- 5-minute analysis: regions, tokens, data shape, state
- Where time went
- Stalls
- Lookups (what I had to search or ask)
- What I'd do next

**Scaffolding levels.** The notes give more support early and fade as the routine becomes habit. The level is chosen by rep number, which is the count of attempt folders across all challenges, including the new one. `--notes=` overrides it.

| Level | Reps | Under the headings |
|---|---|---|
| Guided | 1–5 | A prompt under every heading; fill-in slots for the plan; the checkpoint table; the self-check and closing statement |
| Prompted | 6–12 | One short prompt per heading; the plan slots; the checkpoint table |
| Bare | 13 and on | Headings only |

- **Prompts** are Markdown quote lines (`> …`) and may link a guide.
- **Plan slots** (under the analysis heading): `Started at:` and `Finished at:` (minutes into the rep); `Requirements:` as ACs by kind (layout, data, interaction) plus accessibility items; then one line each for `Regions:`, `Tiers:` (375 · 768 · 1280), `Tokens:`, `Data:`, `State:` and `Questions:`.
- **Checkpoint table** (under Where time went): the minute each checkpoint was reached against its target: plan written (5), every region at all three tiers (15), all content rendered from data (40), core interaction and states working (50), closing statement given (60).
- **Self-check** (under What I'd do next, Guided only): Requirements read before the mock; every value from the data file; all three tiers built; `npm run check` run before 60:00. Then the §5 closing statement: done, not done and in what order, and what you'd add before shipping.

When the attempt index and the review read notes, they ignore prompt lines, unfilled slots (a label ending in `:` with nothing after it), unchecked self-check boxes and empty table cells. So a blank never reads as content.
**Check script (`npm run check -- NN [N]`).** Runs `tests/challenges/NN.spec.ts` and `tests/a11y.spec.ts` with a base-path variable pointing at `/challenges/NN/mock`, or at `/challenges/NN/deliverable/attempt-N` when N is given. Prints pass/fail per AC ID, then the accessibility bonus per item, then one score line, e.g. `10/10 ACs · 7/8 a11y`. Only ACs affect the exit code.

When N is given, the check script also saves the result to `reviews/NN/attempt-N.check.json`: timestamp, and status per AC and accessibility ID. A later run overwrites it.

**`REPS.md`.** At the repository root. A table with columns:

| Date | Challenge | Attempt | Minutes | Phase at 60 | ACs passed | A11y | Top lookup |
|---|---|---|---|---|---|---|---|

The review writes one row per rep, replacing that rep's row if it is reviewed again. The human may edit any row.

**Review (`/review NN N`).** A Claude Code command, run after every rep, in the Coach seat (`CLAUDE.md`).

1. Run `npm run check -- NN N`.
2. Read the attempt's `page.jsx` and `notes.md`, the challenge's section of `CHALLENGES.md`, §5 of this spec, and every earlier review in `reviews/`.
3. Write `reviews/NN/attempt-N.md` in the format below, and the rep's `REPS.md` row.
4. Commit both with a message starting `Review NN attempt N:` and the score.

Front matter, one `key: value` per line, so the site can read it without a YAML parser:

```
---
challenge: 01
attempt: 1
date: 2026-09-29
minutes: 60
phase: Components and data
acs: 4/10
a11y: 5/8
analysis_minutes: 12
tags: hard-coded-data, analysis-overrun, missing-tier
focus: Read the Requirements before the mock | Open the data file in minute one
---
```

Sections, in order:

1. **Score**: the check result, one line.
2. **What landed**: the IDs that passed, grouped by what they show.
3. **What didn't, and why**: each failed or missing ID with its cause, citing the attempt's lines.
4. **Against the reference analysis**: tree, tokens, breakpoints, state; which traps were hit.
5. **Process**: time per phase against §5, from the notes; stalls and lookups.
6. **Accessibility**: the bonus result and what would raise it.
7. **Compared with earlier reps**: score trend, and tags that recur. On the first rep: "Baseline."
8. **Next rep**: at most three focus points, each specific enough to act on in the first ten minutes.

`minutes`, `phase` and `analysis_minutes` come from the notes. Where the notes leave one blank, the review estimates it from the attempt and says so.

**Issue tags.** A review tags only from this list, so recurrence can be counted:

| Tag | Meaning |
|---|---|
| `analysis-overrun` | Read and plan ran past 5 minutes |
| `hard-coded-data` | Values typed into the page that exist in the data file |
| `missing-derivation` | A derived value missing, wrong, or stored instead of computed |
| `money-formatting` | Money not in integer cents, or not formatted with `Intl.NumberFormat` |
| `missing-tier` | A tier's layout was not built |
| `desktop-first` | Built wide and squeezed down, or used variants outside the standard |
| `non-semantic-markup` | Headings for size, `div`s for buttons or lists, missing landmarks |
| `missing-keys` | List items without stable keys |
| `state-misuse` | Derived values held in state, or effects used to sync state |
| `interaction-unfinished` | The challenge's core interaction does not work |
| `a11y-item-skipped` | A challenge accessibility item was not attempted |
| `focus-management` | Focus lost, not moved, or not returned |

**Guides (`guides/<slug>.md`).** The curriculum. It grows over time: adding a guide is adding a file. Front matter, one `key: value` per line:

```
---
title: Reading tokens
unit: Analysis
unit_order: 1
order: 2
summary: Turn a picture into a short list of Tailwind classes before writing markup.
addresses: analysis-overrun, hard-coded-data
worksheet: tokens
---
```

- `unit` groups guides; `unit_order` orders units; `order` orders guides within a unit. Units are Analysis, Layout, Data and state, Interaction, and Accessibility, and more may be added.
- `addresses` lists the issue tags (above) the guide helps fix. `/progress` links each tag to its guides.
- `worksheet` (optional) names the §5 worksheet step the guide expands: `regions`, `tokens`, `data`, `state`, `states`, or `questions`. `/framework` links that step to it.
- The body is Markdown: `##` sections, lists, tables and code. Examples are invented; a guide never contains a challenge's reference analysis, tokens, layout or data.

**Guide command (`/guide <topic>`).** A Claude Code command that drafts a new guide in this format, from the conversation and the human's notes, for the human to review before committing.

## 7. Tests

- `tests/smoke.spec.ts` (T-1):
  - every route in §3 returns 200
  - shell routes (`/`, `/framework`, briefs, attempt indexes) render their `h1`; mocks render a heading and the "← Brief" link
  - attempt pages are checked only for the layout's timer and "← Attempts" link, because the page's own heading belongs to the human
  - the timer starts, persists across a reload, and resets
  - the reveal on a brief page requires the confirm step
- `tests/a11y.spec.ts` (T-1.2): the universal checks A11Y-1 to A11Y-6, one `test()` each, base path from the environment variable.
- `tests/challenges/NN.spec.ts` (T-2 … T-11):
  - one `test()` per AC, titled with its ID, e.g. `C03-AC2 freeze disables reveal`
  - base path comes from the environment variable
  - selectors are role, label and text only (CLAUDE.md)
  - responsive ACs set the viewport to the tier they grade (375×812, 768×1024, 1280×800) and may measure bounding boxes and scroll width; all other ACs run at 1280×800
  - ACs marked `(manual)` in `CHALLENGES.md` are listed in a comment block at the top of the file, not tested
  - the challenge's accessibility items are tests in the same file, titled with their `CNN-A11Yn` ID
- **Screenshots.** Each mock is captured at 375×812, 768×1024 and 1280×800 into `docs/screenshots/NN/`, via a Playwright project that is not part of `check`.

## 8. Tasks

| ID | Task | Depends on |
|---|---|---|
| T-1 | Scaffold, shell, framework page, timer, attempt and check scripts, content transcription, placeholders, smoke tests | — |
| T-1.1 | Responsive standard: breakpoints in `globals.css`, shell and `/framework` on the standard, shared responsive test helpers, three-width screenshots | T-1 |
| T-1.2 | Accessibility bonus: install `@axe-core/playwright` (ADR-002), `tests/a11y.spec.ts`, bonus scoring in the check script, brief pages list the bonus, `REPS.md` A11y column | T-1.1 |
| T-1.3 | Rep reviews: the check script saves attempt results, the `/review` command, review scores and links on attempt indexes, `/progress` and `/progress/NN/N`, a Progress link in the page header; backfill the review of challenge 01 attempt 1 | T-1.2 |
| T-1.4 | Guides: `/guides` and `/guides/<slug>`, a Guides link in the page header, worksheet links on `/framework`, guide links beside recurring issues on `/progress`, the `/guide` command; first guides "The 5-minute read" and "Reading tokens" | T-1.3 |
| T-1.5 | Notes scaffolding: guided, prompted and bare notes templates, level selection and `--notes=` in the attempt script, the attempt index and `/review` read the new structure | T-1.4 |
| T-2 … T-11 | Mock, data, AC suite and accessibility items for challenge 01 … 10 (T-n builds challenge n−1). T-2 is rebuilt under the responsive standard. | T-1.2 |
| T-12 | QA pass in a fresh session: every AC suite passes against its mock, every mock scores full accessibility marks, screenshots match Visual directions, no forbidden branding, no dependency drift | T-2 … T-11 |

## 9. Not in scope

- Authentication, databases, or server-side persistence.
- Saving attempts from the browser. Attempts are files in the repo.
- A CMS. Content lives in `challenges.ts`.
- Dark-mode toggles beyond what a mock's own design calls for.
- Real brands, logos, or card networks.
- Any dependency not listed in §2.
