## Date

__DATE__

## Rep minutes

_Minutes from "Start rep" to when you stopped. A number, e.g. 60._

## Phase reached at 60:00

_Where you were when the hour ended. Pick one: Read and plan · Skeleton · Components and data · Interaction and states · Polish and walkthrough_

## 5-minute analysis: regions, tokens, data shape, state

_Five minutes, five-ish lines. Write each answer **after the colon, on the same line**. Stop at the timer's 5:00 cue even if a line is incomplete; write `?` and move on. Guide: [The 5-minute read](/guides/the-5-minute-read)_

Started at:
Finished at:
_Minutes on the rep timer, not the clock: usually `Started at: 0` and `Finished at: 5`._

Requirements:
_Read the brief's Requirements before the mock. Count them by kind, e.g. `4 layout · 5 data · 0 interaction · 2 a11y`._

Regions:
_Each box on the design as a component, nested with `>`._

Tiers:
_A few words per width, e.g. `375 stack · 768 2 cols + full row · 1280 main + sidebar`._

Tokens:
_Colours by role · spacing base and classes · type sizes · radius and shadow. Guide: [Reading tokens](/guides/reading-tokens)_

Data:
_Open the data file now. Which arrays become `.map()`? Which values do you derive instead of reading?_

State:
_What changes when the user acts? Each piece and who owns it, or "none"._

Questions:
_What would you ask the interviewer?_

## Where time went

_Write the minute you reached each checkpoint (the timer shows it). Leave it blank if you never got there._

| Checkpoint | Target | Actual |
|---|---|---|
| Plan written | 5 | |
| Every region on screen at all three tiers | 15 | |
| All content rendered from data | 40 | |
| Core interaction and states working | 50 | |
| Closing statement given | 60 | |

_Anything else about where the time went?_

## Stalls

_Log these as they happen: any moment you stopped making progress for more than a minute, and what got you moving again._

-

## Lookups (what I had to search or ask)

_Every search or question, as you go. Put the one that cost the most time first._

-

## What I'd do next

_Self-check before running `/review`. Tick with [x]._

- [ ] I read the Requirements before opening the mock
- [ ] Every value on the page comes from the data file
- [ ] I built all three tiers (375, 768, 1280)
- [ ] I ran `npm run check` before 60:00

_Closing statement, as you'd say it out loud (the method, step 5):_

Done, measured against the brief:
Not done, and the order I'd do it in:
Before this shipped I'd add:
_One sentence each, after the colon._
