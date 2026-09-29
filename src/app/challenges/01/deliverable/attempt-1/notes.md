## Date

2026-09-29

## Rep minutes

## Phase reached at 60:00

## 5-minute analysis: regions, tokens, data shape, state

I want this to be mobile first, so I am looking at the 375 breakpoint for responsiveness. I wonder if it would make more sense to use images for this to ensure consistency.

\*\* Should I look at the entire design set, or only mobile ?

There is a header, with a name and avatar on the right. So our nav component would be a row, justify content flex end. On the larger break points we may need to introduce additional information.

Then we have a column of cards. We would use display flex column on this breakpoint. There is space between the cards. So we would have a gap. We also have an issue with the mock - on 375 we can see the screen moving horizontally. This is an issue. The mock should have equal padding.

We then have a card component. Each card has a title, along with custom children.

Card 1 - Has a FinancialDisplay component that includes a Numeric value, along with a p underneath it. This does not need to be its own component, we can simply use dynamic values to showcase the positive and negative values.

As the bottom we have The Account Number, which again is a smaller looking P. The last 4 digits of the Account Number are blurred out.

Card 2 - Title, aloing with a list of accounts. This can just be an unordered list. Each list item would have a row layout and the items set apart from each other.

Card 3 - Similar to card 2, but with more details. So each row would essentially be an extension of the row from #2 but with some key differences.

- If a subTitle is passed in, the layout changes. If a displayColor prop is passed in, we will turn the color red or green.

Accessibility - I do not know how to approach this.

This analysis took me 12 mins. Starting the Mock up now.

## Where time went

I spent a log of time on the analysis, need to get better at that.

I also spent quite of bit time searching for the tailwind commands.

## Stalls

Looking up the tailwind commands.

## Lookups (what I had to search or ask)

Tailwid classes.

## What I'd do next

I was only able to get through the mobile view. Wasnt even close to getting anything more advanced. I am slow.
