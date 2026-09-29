## Date

2026-09-29

## Rep minutes

> Minutes from "Start rep" to when you stopped. A number, e.g. 60.

## Phase reached at 60:00

> Where you were when the hour ended. Pick one: Read and plan · Skeleton · Components and data · Interaction and states · Polish and walkthrough

## 5-minute analysis: regions, tokens, data shape, state

> Five minutes, five-ish lines. Write each answer **after the colon, on the same line**. Stop at the timer's 5:00 cue even if a line is incomplete; write `?` and move on. Guide: [The 5-minute read](/guides/the-5-minute-read)

Started at:
Finished at:

> Minutes on the rep timer, not the clock: usually `Started at: 0` and `Finished at: 5`.

Requirements:

> Read the brief's Requirements before the mock. Count them by kind, e.g. `4 layout · 5 data · 0 interaction · 2 a11y`.
> layout -
> data -
> interaction
> accessibility

Regions:

> Each box on the design as a component, nested with `>`.

main > header, section(OperationAccountCard), section :AccountsCard, section: ActivityCard

> Tiers:
> 375- Stack
> 768 - Grid -> Row 1 / Header, Row 2 2 column, row 3 full width

> A few words per width, e.g. `375 stack · 768 2 cols + full row · 1280 main + sidebar`.

Tokens:

> Colours by role · spacing base and classes · type sizes · radius and shadow. Guide: [Reading tokens](/guides/reading-tokens)

page - gray-200
card - border gray-300
success - emerald-700
faulure - red-700
pararaph - gray-300

Data:

Derive amountChangeCents, percentageChangeCents from the data in the account object.

Accounts and transactions are mapped in their components.

> Open the data file now. Which arrays become `.map()`? Which values do you derive instead of reading?

State:

> What changes when the user acts? Each piece and who owns it, or "none".
> There is no state. Everything comes in as data.
> Questions:

> What would you ask the interviewer?
> Looks pretty straight forward to me.

## Where time went

> Write the minute you reached each checkpoint (the timer shows it). Leave it blank if you never got there.

| Checkpoint                                | Target | Actual |
| ----------------------------------------- | ------ | ------ |
| Plan written                              | 5      | 5      |
| Every region on screen at all three tiers | 15     | 15     |
| All content rendered from data            | 40     | 20     |
| Core interaction and states working       | 50     | 40     |
| Closing statement given                   | 60     | 60     |

> Anything else about where the time went?

## Stalls

> Log these as they happen: any moment you stopped making progress for more than a minute, and what got you moving again.

Looking up the css grid in tailwind.

-

## Lookups (what I had to search or ask)

> Every search or question, as you go. Put the one that cost the most time first.

You were supposed to fill this out.

-

## What I'd do next

> Self-check before running `/review`. Tick with [x].

- [ ] I read the Requirements before opening the mock
- [ ] Every value on the page comes from the data file
- [ ] I built all three tiers (375, 768, 1280)
- [ ] I ran `npm run check` before 60:00

> Closing statement, as you'd say it out loud (the method, step 5):

Done, measured against the brief:
Not done, and the order I'd do it in:
Before this shipped I'd add:

> One sentence each, after the colon.
