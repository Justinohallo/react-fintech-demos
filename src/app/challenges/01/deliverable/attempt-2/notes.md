## Date

2026-09-29

## Rep minutes

60

> Minutes from "Start rep" to when you stopped. A number, e.g. 60.

## Phase reached at 60:00

Components and Data

> Where you were when the hour ended. Pick one: Read and plan · Skeleton · Components and data · Interaction and states · Polish and walkthrough

## 5-minute analysis: regions, tokens, data shape, state

> Five minutes, five-ish lines. Stop at the timer's 5:00 cue even if a line is incomplete; write `?` and move on. Guide: [The 5-minute read](/guides/the-5-minute-read)

Started at: 12:58
Finished at: 1:58

> Read the brief's Requirements before the mock. Count them: how many are layout, how many data, how many interaction?

Will we have this in a normal interview ? Should we be looking to build such a list based on questions / answers we have with the interviewer ?

Requirements:

> Name each box on the design as a component, nested with `>`.

Main > Header, OperatingAccount, Accounts, RecentActivity

Regions:

> One phrase per width: stack, two columns, main + sidebar, grid of N…

base : Stack => Header, Operating Account, Accounts, Recent Activity
768 : Grid => Row 1 Header, Row 2 (Operating Account / Accounts) ; Row 3 Recent Activity
1280 - Same as 786

Tiers:

> Colours by role · spacing base and classes · type sizes · radius and shadow. Guide: [Reading tokens](/guides/reading-tokens)

Tokens:

Page: slate-500
Card: white

> Open the data file now. Which arrays become `.map()`? Which values do you derive instead of reading?

Data:

> What changes when the user acts? Each piece and who owns it, or "none".

There is no change in the data. There is no interactivity. The data is static.

State:

> What would you ask the interviewer?

Questions:

I DO NOT UNDERSTAND HOW YOU ARE SUPPOSED TO DO THIS IN 5 MINUTES.

## Where time went

> Write the minute you reached each checkpoint (the timer shows it). Leave it blank if you never got there.

| Checkpoint                                | Target | Actual |
| ----------------------------------------- | ------ | ------ |
| Plan written                              | 5      | 4      |
| Every region on screen at all three tiers | 15     | 15     |
| All content rendered from data            | 40     | NA     |
| Core interaction and states working       | 50     | NA     |
| Closing statement given                   | 60     | NA     |

> Anything else about where the time went?

Messing around with decisions about component props - should a component receive a formatted piece of data ? In the case of the USD and percentages, initially i just sent in the formatted data. but it needed the value to determine if it should render positively or negatively. so we must pass in the raw data - however, this can be confusing when passing in cents. If you design the component from first princicples, you wouldnt call the value "amountCents" you would jsut call it amount. So how do you reconcilel this ?

## Stalls

> Log these as they happen: any moment you stopped making progress for more than a minute, and what got you moving again.

Getting hung up on data formatting.

-

## Lookups (what I had to search or ask)

> Every search or question, as you go. Put the one that cost the most time first.

Looking up data format methods.

-

## What I'd do next

> Self-check before running `/review`. Tick with [x].

- [X ] I read the Requirements before opening the mock
- [X ] Every value on the page comes from the data file
- [ ] I built all three tiers (375, 768, 1280)
- [ ] I ran `npm run check` before 60:00

> Closing statement, as you'd say it out loud (the method, step 5):

Done, measured against the brief:
Not done, and the order I'd do it in:
Before this shipped I'd add:
