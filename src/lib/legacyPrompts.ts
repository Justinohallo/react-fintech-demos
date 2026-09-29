// Quote-line prompts from notes templates before SPEC.md §6 switched prompts to
// italic lines. In old notes, a `>` line is a prompt only if it matches one of
// these exactly; any other `>` line is an answer typed under a prompt.

export const LEGACY_QUOTE_PROMPTS: ReadonlySet<string> = new Set([
  "> A few words per width, e.g. `375 stack · 768 2 cols + full row · 1280 main + sidebar`.",
  "> A number.",
  "> Anything else about where the time went?",
  "> As they happen.",
  "> Closing statement, as you'd say it out loud (the method, step 5):",
  "> Colours by role · spacing base and classes · type sizes · radius and shadow. Guide: [Reading tokens](/guides/reading-tokens)",
  "> Costliest first.",
  "> Each box on the design as a component, nested with `>`.",
  "> Every search or question, as you go. Put the one that cost the most time first.",
  "> Five minutes, five-ish lines. Stop at the timer's 5:00 cue even if a line is incomplete; write `?` and move on. Guide: [The 5-minute read](/guides/the-5-minute-read)",
  "> Five minutes, five-ish lines. Write each answer **after the colon, on the same line**. Stop at the timer's 5:00 cue even if a line is incomplete; write `?` and move on. Guide: [The 5-minute read](/guides/the-5-minute-read)",
  "> Five minutes. Stop at the cue.",
  "> Five minutes. Stop at the cue. Answers after the colon; Started and Finished are minutes on the rep timer.",
  "> Log these as they happen: any moment you stopped making progress for more than a minute, and what got you moving again.",
  "> Minutes from \"Start rep\" to when you stopped. A number, e.g. 60.",
  "> Minutes on the rep timer, not the clock: usually `Started at: 0` and `Finished at: 5`.",
  "> Name each box on the design as a component, nested with `>`.",
  "> One phrase per width: stack, two columns, main + sidebar, grid of N…",
  "> One sentence each, after the colon.",
  "> Open the data file now. Which arrays become `.map()`? Which values do you derive instead of reading?",
  "> Read the brief's Requirements before the mock. Count them by kind, e.g. `4 layout · 5 data · 0 interaction · 2 a11y`.",
  "> Read the brief's Requirements before the mock. Count them: how many are layout, how many data, how many interaction?",
  "> Self-check before running `/review`. Tick with [x].",
  "> What changes when the user acts? Each piece and who owns it, or \"none\".",
  "> What would you ask the interviewer?",
  "> Where you were when the hour ended. Pick one: Read and plan · Skeleton · Components and data · Interaction and states · Polish and walkthrough",
  "> Which of the five phases.",
  "> Write the minute you reached each checkpoint (the timer shows it). Leave it blank if you never got there.",
  "> Your closing statement: done, not done, before shipping."
]);
