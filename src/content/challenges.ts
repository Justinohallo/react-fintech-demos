// Transcribed verbatim from CHALLENGES.md (Architect-owned). Do not rewrite;
// if the source changes, re-transcribe. Inline code is kept in backticks and
// rendered by the brief page.

export const CHALLENGE_NUMBERS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
] as const;

export type ChallengeNumber = (typeof CHALLENGE_NUMBERS)[number];

export type AcceptanceCriterion = {
  id: string;
  text: string;
  manual: boolean;
};

/** Bonus points, never a failure (SPEC.md §2). */
export type A11yItem = {
  id: string;
  text: string;
};

export type ReferenceAnalysis = {
  tree: string;
  tokens: string;
  breakpoints: string;
  state: { summary?: string; points?: string[] };
  traps: string[];
};

export type Challenge = {
  number: ChallengeNumber;
  title: string;
  difficulty: number;
  concept: string;
  target: string;
  dataFile: string;
  whatThisTests: string;
  acceptanceCriteria: AcceptanceCriterion[];
  a11yBonus: A11yItem[];
  referenceAnalysis: ReferenceAnalysis;
};

export const challenges: Challenge[] = [
  {
    number: "01",
    title: "Treasury balance",
    difficulty: 1,
    concept: "Static layout from data",
    target: "responsive, 375 / 768 / 1280",
    dataFile: "01-treasury.json",
    whatThisTests: "Region naming, a two-column grid, currency formatting with `Intl.NumberFormat`, and rendering a list from an array instead of hard-coding it.",
    acceptanceCriteria: [
      {
        id: "C01-AC1",
        text: "Given the page loads, then a heading \"Operating account\" is visible.",
        manual: false
      },
      {
        id: "C01-AC2",
        text: "Given the account data, then the balance is shown formatted as USD with a thousands separator and two decimals.",
        manual: false
      },
      {
        id: "C01-AC3",
        text: "Given the current and previous balances, then the change is shown as a signed USD amount and a signed percentage to one decimal. Neither value is stored in the data.",
        manual: false
      },
      {
        id: "C01-AC4",
        text: "Given 6 transactions, then a list named \"Recent activity\" contains exactly 6 items, each showing its merchant name.",
        manual: false
      },
      {
        id: "C01-AC5",
        text: "Given a negative transaction, then its amount renders with a leading minus sign, not in parentheses.",
        manual: false
      },
      {
        id: "C01-AC6",
        text: "Given 3 accounts, then the \"Accounts\" card shows a \"Total\" equal to the sum of the three balances, formatted as USD.",
        manual: false
      },
      {
        id: "C01-AC7",
        text: "The two-column split and the serif/sans pairing match the mock.",
        manual: true
      },
      {
        id: "C01-AC8",
        text: "At 375, 768 and 1280, the page does not scroll horizontally.",
        manual: false
      },
      {
        id: "C01-AC9",
        text: "Given a 375px viewport, then the balance card, the \"Accounts\" card and \"Recent activity\" are stacked in that order.",
        manual: false
      },
      {
        id: "C01-AC10",
        text: "Given a 768px viewport, then the balance card and the \"Accounts\" card sit side by side, with \"Recent activity\" below both.",
        manual: false
      },
      {
        id: "C01-AC11",
        text: "Given a 1280px viewport, then \"Recent activity\" is below the balance card, and the \"Accounts\" card is to the right of both.",
        manual: false
      }
    ],
    a11yBonus: [
      {
        id: "C01-A11Y1",
        text: "The masked account number is exposed as text that includes \"ending in 4821\", so it is not read out as a run of bullets."
      },
      {
        id: "C01-A11Y2",
        text: "The avatar has an accessible name with the user's full name, not only their initials."
      }
    ],
    referenceAnalysis: {
      tree: "`TopBar`, `BalanceCard`, `ActivityList > ActivityRow`, `AccountsCard > AccountRow`, `Total`.",
      tokens: "`bg-stone-50`, `bg-white`, `border-stone-200`, `rounded-xl`, text `stone-900` / `stone-500`, `emerald-700` / `rose-700`. Spacing base 8: gaps of 24 and 32. Four type sizes: 36 balance, 18 card title, 14 body, 12 meta.",
      breakpoints: "one grid whose areas change per tier: `balance / accounts / activity`, then `tablet:` `balance accounts / activity activity`, then `desktop:` `balance accounts / activity accounts` at `2fr 1fr`. Padding `p-4 tablet:p-6 desktop:p-8`.",
      state: {
        summary: "none. The change, the percentage, and the total are all derived."
      },
      traps: [
        "Formatting with `toFixed` and a hand-placed `$` breaks negatives and separators. Build one `formatMoney` helper first.",
        "Dividing by the previous balance without guarding zero.",
        "Rendering the Accounts card twice, once per tier, instead of moving one card with grid areas or `order`."
      ]
    }
  },
  {
    number: "02",
    title: "Plan picker",
    difficulty: 2,
    concept: "One piece of state, derived display",
    target: "responsive, 375 / 768 / 1280",
    dataFile: "02-plans.json",
    whatThisTests: "A segmented control, deriving displayed prices from a single billing-period state, responsive grid collapse, and a highlighted \"recommended\" card.",
    acceptanceCriteria: [
      {
        id: "C02-AC1",
        text: "Given the page loads, then a radio group or tablist named \"Billing period\" offers \"Monthly\" and \"Annual\", with Monthly selected.",
        manual: false
      },
      {
        id: "C02-AC2",
        text: "Given Monthly is selected, then each plan shows its monthly price, e.g. \"$49\" with \"/mo\".",
        manual: false
      },
      {
        id: "C02-AC3",
        text: "When the user selects Annual, then each paid plan's displayed per-month price drops by 20%, rounded to whole dollars, and the text \"Billed annually\" appears on the paid plans.",
        manual: false
      },
      {
        id: "C02-AC4",
        text: "Given a plan with a price of 0, then it shows \"Free\" instead of \"$0\", in both periods.",
        manual: false
      },
      {
        id: "C02-AC5",
        text: "Given the recommended plan, then its card contains the text \"Recommended\".",
        manual: false
      },
      {
        id: "C02-AC6",
        text: "Given each plan, then a button labelled \"Choose <plan name>\" is present.",
        manual: false
      },
      {
        id: "C02-AC7",
        text: "At 375, 768 and 1280, the page does not scroll horizontally.",
        manual: false
      },
      {
        id: "C02-AC8",
        text: "Given a 375px viewport, then the recommended plan's card is first, and all three cards are stacked in one column.",
        manual: false
      },
      {
        id: "C02-AC9",
        text: "Given a 768px viewport, then the recommended plan's card spans the full row above the other two, which sit side by side.",
        manual: false
      },
      {
        id: "C02-AC10",
        text: "Given a 1280px viewport, then the three plan names sit on one row in the order Starter, Growth, Scale.",
        manual: false
      }
    ],
    a11yBonus: [
      {
        id: "C02-A11Y1",
        text: "With focus on \"Monthly\", pressing the Right arrow key selects \"Annual\" and updates the prices."
      },
      {
        id: "C02-A11Y2",
        text: "The check icons in the feature lists are hidden from assistive tech; the feature text is the content."
      }
    ],
    referenceAnalysis: {
      tree: "`Header`, `PeriodToggle`, `PlanGrid > PlanCard > FeatureList`.",
      tokens: "`bg-zinc-950`, `bg-zinc-900`, `border-zinc-800`, `border-lime-400`, `text-zinc-50` / `zinc-400`, `rounded-2xl`. Spacing base 4: card padding 32, gaps 24.",
      breakpoints: "`grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3`. The recommended card takes `order-first tablet:col-span-2 desktop:order-none desktop:col-span-1`.",
      state: {
        summary: "`period: 'monthly' | 'annual'`, owned by the page. The displayed price is `deriveMonthly(plan, period)`."
      },
      traps: [
        "Storing two prices per plan in state.",
        "A toggle made of two `div`s with no role. Radio inputs styled as segments give keyboard support for free.",
        "Floats creeping in from `* 0.8`. Round once, at render.",
        "Reordering the plans array per tier instead of changing only the CSS."
      ]
    }
  },
  {
    number: "03",
    title: "Card controls",
    difficulty: 3,
    concept: "Interdependent toggles, masked data",
    target: "responsive, 375 / 768 / 1280",
    dataFile: "03-card.json",
    whatThisTests: "Composing a card visual with CSS, show/hide sensitive data, a switch with correct ARIA, and one control's state constraining another's.",
    acceptanceCriteria: [
      {
        id: "C03-AC1",
        text: "Given the page loads, then the card shows \"•••• 7314\" and does not show the full number anywhere in the document text.",
        manual: false
      },
      {
        id: "C03-AC2",
        text: "Given the card is frozen, then the \"Reveal details\" button is disabled.",
        manual: false
      },
      {
        id: "C03-AC3",
        text: "When the user activates \"Reveal details\", then the full number (grouped in fours), expiry as MM/YY, and CVC are visible, and the button's label becomes \"Hide details\".",
        manual: false
      },
      {
        id: "C03-AC4",
        text: "Given details are revealed, when the user turns on \"Freeze card\", then the details are hidden again and \"Frozen\" is visible on the card.",
        manual: false
      },
      {
        id: "C03-AC5",
        text: "Given the freeze control, then it is exposed as a switch named \"Freeze card\" whose checked state reflects the frozen state.",
        manual: false
      },
      {
        id: "C03-AC6",
        text: "Given spent and limit amounts, then the text \"<spent> of <limit>\" is shown in USD and a progressbar is present with the matching value.",
        manual: false
      },
      {
        id: "C03-AC7",
        text: "The card face uses no image files, and the grayscale frozen treatment matches the mock.",
        manual: true
      },
      {
        id: "C03-AC8",
        text: "At 375, 768 and 1280, the page does not scroll horizontally.",
        manual: false
      },
      {
        id: "C03-AC9",
        text: "Given a 375px viewport, then \"•••• 7314\" is above the \"Freeze card\" switch.",
        manual: false
      },
      {
        id: "C03-AC10",
        text: "Given a 768px or 1280px viewport, then \"•••• 7314\" is to the left of the \"Freeze card\" switch.",
        manual: false
      }
    ],
    a11yBonus: [
      {
        id: "C03-A11Y1",
        text: "When the user activates \"Copy number\", a status message \"Copied\" is announced."
      },
      {
        id: "C03-A11Y2",
        text: "The spend progressbar's value text reads \"<spent> of <limit>\", not a bare percentage."
      }
    ],
    referenceAnalysis: {
      tree: "`CardFace > (Chip, NetworkMark, Number, Meta)`, `ControlsPanel > (RevealButton, FreezeSwitch, CopyButton, SpendMeter)`.",
      tokens: "gradient `from-indigo-600 to-violet-500`, `bg-white/80`, `backdrop-blur`, `shadow-lg`, `rounded-2xl`, `grayscale` filter. Card aspect ratio 1.586.",
      breakpoints: "`flex flex-col tablet:flex-row`. The card is `w-full max-w-[340px] aspect-[1.586]`, so it shrinks with its column instead of overflowing.",
      state: {
        summary: "`revealed`, `frozen`. The invariant: frozen implies not revealed. Enforce it in the freeze handler, not with an effect."
      },
      traps: [
        "Rendering the full number and hiding it with CSS, so it is still in the DOM.",
        "A switch that is a checkbox with no `role=\"switch\"`.",
        "`useEffect` to un-reveal on freeze, which renders the revealed number for one frame.",
        "Fixing both width and height on the card, so it cannot shrink with its column."
      ]
    }
  },
  {
    number: "04",
    title: "Send a payment",
    difficulty: 4,
    concept: "Controlled form, validation, derived summary",
    target: "responsive, 375 / 768 / 1280",
    dataFile: "04-payment.json",
    whatThisTests: "Controlled inputs, parsing a money string into cents, field-level validation with accessible errors, a live summary derived from inputs, and a disabled-until-valid submit.",
    acceptanceCriteria: [
      {
        id: "C04-AC1",
        text: "Given the form loads, then fields labelled \"From account\", \"Recipient\", \"Amount\", \"Memo\" and a radio group \"Speed\" exist, and \"Review payment\" is disabled.",
        manual: false
      },
      {
        id: "C04-AC2",
        text: "When the user types \"1,250.5\" into Amount, then the summary shows an amount of \"$1,250.50\".",
        manual: false
      },
      {
        id: "C04-AC3",
        text: "When the user selects Instant with an amount of $50.00, then the fee shows \"$1.00\" (the minimum). With $500.00 it shows \"$5.00\".",
        manual: false
      },
      {
        id: "C04-AC4",
        text: "When the total debited exceeds the selected account's balance, then an error \"Exceeds available balance\" is shown, associated with the Amount field, and submit stays disabled.",
        manual: false
      },
      {
        id: "C04-AC5",
        text: "When the amount is 0 or not a number, then an error \"Enter an amount greater than $0\" is shown after the field loses focus.",
        manual: false
      },
      {
        id: "C04-AC6",
        text: "Given a memo, then a counter shows \"<n>/140\", and the input accepts no more than 140 characters.",
        manual: false
      },
      {
        id: "C04-AC7",
        text: "Given a valid form, when the user submits, then \"Payment scheduled\" is visible along with the recipient name and total debited, and \"Send another\" returns an empty form.",
        manual: false
      },
      {
        id: "C04-AC8",
        text: "At 375, 768 and 1280, the page does not scroll horizontally.",
        manual: false
      },
      {
        id: "C04-AC9",
        text: "Given a 375px viewport, then the \"Instant\" option is below the \"Standard\" option.",
        manual: false
      },
      {
        id: "C04-AC10",
        text: "Given a 768px viewport, then the \"Instant\" option is to the right of the \"Standard\" option.",
        manual: false
      },
      {
        id: "C04-AC11",
        text: "Given a 1280px viewport, then the summary's \"Total debited\" line is to the right of the \"Amount\" field.",
        manual: false
      }
    ],
    a11yBonus: [
      {
        id: "C04-A11Y1",
        text: "When an Amount error is shown, the Amount field is marked invalid (`aria-invalid=\"true\"`)."
      },
      {
        id: "C04-A11Y2",
        text: "After a valid submit, focus moves to the \"Payment scheduled\" heading."
      }
    ],
    referenceAnalysis: {
      tree: "`PaymentForm > (Field × 4, SpeedRadio, Summary, Submit)`, `Confirmation`.",
      tokens: "`border-2 border-neutral-900`, `shadow-[4px_4px_0_var(--color-neutral-900)]`, `rounded-none`, `bg-orange-50`, `text-red-600`. Spacing base 8.",
      breakpoints: "panel `max-w-[560px] desktop:max-w-[880px]`, body `grid desktop:grid-cols-[1fr_280px]`, Speed `flex flex-col tablet:flex-row`.",
      state: {
        points: [
          "`values` (strings as typed) and `touched` are state.",
          "`amountCents`, `feeCents`, `totalCents`, `errors`, and `canSubmit` are all derived.",
          "`submitted` is state."
        ]
      },
      traps: [
        "Storing the amount as a number in state, which loses what the user typed.",
        "`parseFloat(\"1,250.5\")` returns 1. Strip separators, then convert to cents with rounding.",
        "Errors shown on the first keystroke.",
        "An error message not linked with `aria-describedby`."
      ]
    }
  },
  {
    number: "05",
    title: "Bitcoin treasury",
    difficulty: 5,
    concept: "Unit conversion, denomination toggle, proportional bar",
    target: "responsive, 375 / 768 / 1280",
    dataFile: "05-treasury.json",
    whatThisTests: "Working in two units (sats and USD) from one source of truth, a denomination switch that changes every amount on the page, a proportional allocation bar drawn with CSS widths, and positive/negative change styling.",
    acceptanceCriteria: [
      {
        id: "C05-AC1",
        text: "Given the page loads with USD selected, then \"Total value\" shows the sum of all wallets converted at `btcPriceCents`, formatted as USD.",
        manual: false
      },
      {
        id: "C05-AC2",
        text: "When the user selects \"BTC\", then every amount on the page is shown in BTC to 8 decimal places with the \"₿\" symbol, and no USD amount remains in the holdings table.",
        manual: false
      },
      {
        id: "C05-AC3",
        text: "When the user selects \"sats\", then amounts are whole numbers with thousands separators followed by \"sats\".",
        manual: false
      },
      {
        id: "C05-AC4",
        text: "Given the 24h prices, then the 24h change tile shows a signed percentage to two decimals. It uses a \"▲\" glyph for a gain or \"▼\" for a loss, so colour is not the only signal.",
        manual: false
      },
      {
        id: "C05-AC5",
        text: "Given four wallets, then the allocation legend lists four names, each with a percentage to one decimal, and the percentages sum to 100.0 (±0.1).",
        manual: false
      },
      {
        id: "C05-AC6",
        text: "Given the holdings table at 1280px, then it is a table with column headers \"Wallet\", \"Balance\", \"Share\", \"24h\" and four body rows.",
        manual: false
      },
      {
        id: "C05-AC7",
        text: "Allocation segment widths are proportional to balances.",
        manual: true
      },
      {
        id: "C05-AC8",
        text: "At 375, 768 and 1280, the page does not scroll horizontally.",
        manual: false
      },
      {
        id: "C05-AC9",
        text: "Given a 375px viewport, then the three KPI tiles are stacked, and the \"Share\" and \"24h\" column headers are hidden.",
        manual: false
      },
      {
        id: "C05-AC10",
        text: "Given a 768px viewport, then \"Total value\", \"24h change\" and \"Cost basis\" sit on one row, and all four column headers are visible.",
        manual: false
      },
      {
        id: "C05-AC11",
        text: "Given a 1280px viewport, then the allocation legend is to the left of the holdings table.",
        manual: false
      }
    ],
    a11yBonus: [
      {
        id: "C05-A11Y1",
        text: "The allocation bar is exposed as an image whose accessible name lists each wallet and its share."
      },
      {
        id: "C05-A11Y2",
        text: "The \"▲\" / \"▼\" glyph is hidden from assistive tech, and the direction is given in words (\"up\" or \"down\")."
      }
    ],
    referenceAnalysis: {
      tree: "`Header > DenominationToggle`, `KpiRow > KpiTile × 3`, `AllocationBar > (Segment × 4, Legend)`, `HoldingsTable`.",
      tokens: "`bg-neutral-950` / `neutral-900`, `border-neutral-800`, `text-amber-400`, `text-green-400` / `red-400`, `rounded-sm`, `font-mono`, `tracking-widest uppercase text-[11px]` labels.",
      breakpoints: "KPIs `grid-cols-1 tablet:grid-cols-3`, legend `grid-cols-2 tablet:grid-cols-4`, hidden columns `hidden tablet:table-cell` on both `th` and `td`, page `desktop:grid-cols-[1fr_2fr]`.",
      state: {
        summary: "`denomination`. Everything else is derived from sats and prices through one `formatAmount(sats, denomination, price)` function."
      },
      traps: [
        "Converting sats to BTC as a float and then to cents, which accumulates rounding error. Use `sats * priceCents / 100_000_000` with one rounding.",
        "Per-component formatting logic, so the toggle misses one amount.",
        "Percentages that each round and sum to 99.9.",
        "Hiding a column's header but not its cells."
      ]
    }
  },
  {
    number: "06",
    title: "Budgets",
    difficulty: 6,
    concept: "Inline editing, threshold states",
    target: "responsive, 375 / 768 / 1280",
    dataFile: "06-budgets.json",
    whatThisTests: "A list of progress meters with three threshold states, inline edit-in-place with save/cancel and keyboard support, and validation on the edit.",
    acceptanceCriteria: [
      {
        id: "C06-AC1",
        text: "Given 6 budgets, then 6 progressbars are present, each named for its category.",
        manual: false
      },
      {
        id: "C06-AC2",
        text: "Given a budget at 85% of its limit, then its card shows \"Nearing limit\".",
        manual: false
      },
      {
        id: "C06-AC3",
        text: "Given a budget over its limit, then its card shows \"Over by <amount>\" in USD. The meter's visible fill is capped at 100%, while its value reports the true figure.",
        manual: false
      },
      {
        id: "C06-AC4",
        text: "When the user activates \"Edit limit\" on a card, then a field labelled \"<category> limit\" is focused, prefilled with the current limit in dollars.",
        manual: false
      },
      {
        id: "C06-AC5",
        text: "When the user enters a new valid limit and presses Enter (or Save), then the card shows the new limit, its status recalculates, and the header summary updates.",
        manual: false
      },
      {
        id: "C06-AC6",
        text: "When the user presses Escape (or Cancel) while editing, then the original limit is shown and focus returns to \"Edit limit\".",
        manual: false
      },
      {
        id: "C06-AC7",
        text: "When the user enters a negative or empty limit, then Save is disabled and \"Enter a limit of $0 or more\" is shown.",
        manual: false
      },
      {
        id: "C06-AC8",
        text: "Given a limit of 0 and spend above 0, then the card shows \"Over by <spent>\" without a divide-by-zero artifact (no \"Infinity\" or \"NaN\").",
        manual: false
      },
      {
        id: "C06-AC9",
        text: "At 375, 768 and 1280, the page does not scroll horizontally.",
        manual: false
      },
      {
        id: "C06-AC10",
        text: "Given a 375px viewport, then the six progressbars are stacked in one column.",
        manual: false
      },
      {
        id: "C06-AC11",
        text: "Given a 768px viewport, then the budget cards sit two per row. Given a 1280px viewport, three per row.",
        manual: false
      }
    ],
    a11yBonus: [
      {
        id: "C06-A11Y1",
        text: "Each progressbar's value text reads \"<spent> of <limit>\"."
      },
      {
        id: "C06-A11Y2",
        text: "After a new limit is saved, the card's new status is announced in a status message."
      }
    ],
    referenceAnalysis: {
      tree: "`Header > MonthSummary`, `BudgetGrid > BudgetCard > (CategoryIcon, Meter, StatusLine, LimitEditor)`.",
      tokens: "`bg-slate-50`, `bg-white`, `shadow-sm`, `rounded-3xl`, `rounded-full` buttons, fills `teal-500` / `amber-500` / `rose-500`, track `slate-100`.",
      breakpoints: "`grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3`. The editor is `flex flex-col tablet:flex-row`.",
      state: {
        points: [
          "`budgets` (limits are now editable) lives at the page level, because the header summary reads it.",
          "`editingId` and `draft` are local to the card being edited.",
          "Status is derived."
        ]
      },
      traps: [
        "Keeping limits in card-local state, so the header never updates.",
        "Forgetting focus management on enter and exit of edit mode.",
        "A `status` field stored alongside the limit."
      ]
    }
  },
  {
    number: "07",
    title: "Expense report",
    difficulty: 7,
    concept: "Dynamic list of form rows",
    target: "responsive, 375 / 768 / 1280",
    dataFile: "07-expenses.json",
    whatThisTests: "Adding and removing rows with stable keys, per-row validation, a totals block derived across rows with per-category subtotals, and a policy warning driven by data rules.",
    acceptanceCriteria: [
      {
        id: "C07-AC1",
        text: "Given 3 prefilled items, then 3 rows are present, each with a \"Remove\" button labelled with its merchant name.",
        manual: false
      },
      {
        id: "C07-AC2",
        text: "When the user activates \"Add line item\", then a new empty row appears and its Date field receives focus.",
        manual: false
      },
      {
        id: "C07-AC3",
        text: "When the user removes the second row, then the other two rows keep their entered values (stable identity, not index-keyed).",
        manual: false
      },
      {
        id: "C07-AC4",
        text: "Given items across categories, then a subtotal is shown per category in use and a \"Total\" equals the sum of all rows.",
        manual: false
      },
      {
        id: "C07-AC5",
        text: "Given a Meals item over its $75.00 limit, then the policy panel lists \"Meals over $75.00 limit: <merchant>\".",
        manual: false
      },
      {
        id: "C07-AC6",
        text: "Given an item over $25.00 without \"Receipt attached\" checked, then the policy panel lists \"Receipt required: <merchant>\", and it disappears once checked.",
        manual: false
      },
      {
        id: "C07-AC7",
        text: "Given any row with an empty merchant or an amount that is not greater than 0, then \"Submit for approval\" is disabled. When the user activates it with a valid form, then \"Report submitted\" is shown with the total.",
        manual: false
      },
      {
        id: "C07-AC8",
        text: "At 375, 768 and 1280, the page does not scroll horizontally.",
        manual: false
      },
      {
        id: "C07-AC9",
        text: "Given a 375px viewport, then in the first row the Merchant field is below the Date field.",
        manual: false
      },
      {
        id: "C07-AC10",
        text: "Given a 768px viewport, then in the first row Date and Merchant sit side by side, and Amount is below them.",
        manual: false
      },
      {
        id: "C07-AC11",
        text: "Given a 1280px viewport, then in the first row Date, Merchant, Category, Amount and \"Receipt attached\" are on one line.",
        manual: false
      }
    ],
    a11yBonus: [
      {
        id: "C07-A11Y1",
        text: "After a row is removed, focus moves to another control in the report (the next row's Date field, or \"Add line item\"), not to the page."
      },
      {
        id: "C07-A11Y2",
        text: "The policy panel is a status region, so a new violation is announced when it appears."
      }
    ],
    referenceAnalysis: {
      tree: "`ReportHeader`, `LineItemTable > LineItemRow × n`, `AddRowButton`, `Summary > (CategorySubtotals, Total)`, `PolicyPanel`, `SubmitBar`.",
      tokens: "`bg-gray-100`, `bg-white shadow-md`, `border-t-4 border-blue-700`, `divide-y divide-gray-200`, `bg-amber-50 text-amber-800`, `rounded-md`, 14px inputs.",
      breakpoints: "each row is `grid grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-[120px_1fr_160px_120px_auto_auto]`; field labels `desktop:sr-only`.",
      state: {
        points: [
          "`items: [{ id, ...fieldsAsStrings }]` and `submitted`.",
          "Subtotals, total, violations, and validity are all derived.",
          "New ids come from a counter or `crypto.randomUUID()`."
        ]
      },
      traps: [
        "`key={index}`, which fails AC3 visibly.",
        "Violations stored in state and computed in an effect.",
        "Forgetting to parse row amounts to cents before summing.",
        "Separate markup for mobile and desktop rows, which doubles every input."
      ]
    }
  },
  {
    number: "08",
    title: "Approvals queue",
    difficulty: 8,
    concept: "Optimistic actions, undo, bulk selection",
    target: "responsive, 375 / 768 / 1280",
    dataFile: "08-approvals.json",
    whatThisTests: "Selection state across a list, including select-all with an indeterminate checkbox. It also tests optimistic removal with an undo toast that restores the item to its original position, and a live region for announcements.",
    acceptanceCriteria: [
      {
        id: "C08-AC1",
        text: "Given 8 requests, then the header shows \"8 pending\" and 8 rows are listed.",
        manual: false
      },
      {
        id: "C08-AC2",
        text: "When the user selects the \"Bills\" tab, then only bill requests are listed, and the pending count still shows the total across all types.",
        manual: false
      },
      {
        id: "C08-AC3",
        text: "When the user checks one row, then a \"Select all\" checkbox is in the mixed (indeterminate) state and \"1 selected\" is shown. When all visible rows are checked, it is checked.",
        manual: false
      },
      {
        id: "C08-AC4",
        text: "When the user activates Approve on a row, then the row disappears, the count decrements, and a status message \"Approved <description>\" is announced with an \"Undo\" button.",
        manual: false
      },
      {
        id: "C08-AC5",
        text: "When the user activates Undo, then the row reappears in its original position (not at the end) and the count is restored.",
        manual: false
      },
      {
        id: "C08-AC6",
        text: "When the user selects 3 rows and activates \"Reject selected\", then all 3 are removed and the message reads \"Rejected 3 requests\", with one Undo that restores all 3 in their original positions.",
        manual: false
      },
      {
        id: "C08-AC7",
        text: "Given all requests are actioned, then an empty state \"You're all caught up\" is shown.",
        manual: false
      },
      {
        id: "C08-AC8",
        text: "The toast auto-dismisses after about 5 seconds; after dismissal the action is final.",
        manual: true
      },
      {
        id: "C08-AC9",
        text: "At 375, 768 and 1280, the page does not scroll horizontally.",
        manual: false
      },
      {
        id: "C08-AC10",
        text: "Given a 375px viewport, then the sidebar's \"Approvals\" link is hidden until the user activates \"Menu\".",
        manual: false
      },
      {
        id: "C08-AC11",
        text: "Given a 768px or 1280px viewport, then the sidebar navigation is visible and there is no \"Menu\" button.",
        manual: false
      },
      {
        id: "C08-AC12",
        text: "Given a 1280px viewport, then each row's Approve button is on the same line as its description. Given a 375px viewport, it is below it.",
        manual: false
      }
    ],
    a11yBonus: [
      {
        id: "C08-A11Y1",
        text: "After Approve or Reject on a row, focus moves to another row's control or to \"Undo\", not to the page."
      },
      {
        id: "C08-A11Y2",
        text: "While \"Undo\" has focus or the pointer is over the toast, it stays open past 5 seconds."
      }
    ],
    referenceAnalysis: {
      tree: "`Sidebar`, `Header > (CountBadge, FilterTabs)`, `BulkBar`, `RequestList > RequestRow`, `Toast` (live region), `EmptyState`.",
      tokens: "`bg-gray-50` sidebar, `text-[13px]`, `violet-600`, `emerald-600`, `border-gray-300`, toast `bg-gray-900 rounded-full`, `divide-y`.",
      breakpoints: "sidebar `hidden tablet:flex`, with a `menuOpen` state that only mobile uses; rows `grid tablet:grid-cols-[1fr_auto] desktop:grid-cols-[auto_1fr_auto_auto_auto]`.",
      state: {
        summary: "a reducer over `{ requests, selected: Set, lastAction: { kind, removed: [{ item, index }] } | null, filter }`.",
        points: [
          "Actions: `select`, `selectAll`, `act(ids, kind)`, `undo`, `expire`.",
          "The visible list, counts, and select-all state are derived."
        ]
      },
      traps: [
        "Undo that pushes restored items to the end, which fails AC5.",
        "Selection that persists ids of removed rows.",
        "The toast timer not cleared on undo or on a second action.",
        "A select-all that selects hidden (filtered-out) rows.",
        "Rendering the sidebar twice, once per tier."
      ]
    }
  },
  {
    number: "09",
    title: "Spend analytics",
    difficulty: 9,
    concept: "Hand-drawn SVG chart with accessible interaction",
    target: "responsive, 375 / 768 / 1280",
    dataFile: "09-spend.json",
    whatThisTests: "Scaling data into SVG coordinates by hand, a bar chart with axis ticks and gridlines, range tabs that re-aggregate data, a hover-and-keyboard tooltip, and KPIs derived from the same aggregation. No chart library.",
    acceptanceCriteria: [
      {
        id: "C09-AC1",
        text: "Given the page loads, then \"7D\" is the selected tab and the chart is an image with an accessible name containing \"Spend\".",
        manual: false
      },
      {
        id: "C09-AC2",
        text: "Given 7D, then 7 bars are exposed as focusable elements, each with an accessible label \"<date>: <amount>\".",
        manual: false
      },
      {
        id: "C09-AC3",
        text: "When the user selects \"30D\", then the number of bars equals the number of Monday-start weeks spanned by the last 30 days, and the KPIs change.",
        manual: false
      },
      {
        id: "C09-AC4",
        text: "When a bar is hovered or receives keyboard focus, then a tooltip shows its label, amount, and change vs the matching prior-period bar.",
        manual: false
      },
      {
        id: "C09-AC5",
        text: "Given the selected range, then \"Total spend\" equals the sum of the range's daily amounts, and \"Daily average\" equals the total divided by the number of days (not bars).",
        manual: false
      },
      {
        id: "C09-AC6",
        text: "Given the selected range, then the y-axis shows 5 tick labels in compact USD, the top tick is at least the tallest bar, and 0 is labelled \"$0\".",
        manual: false
      },
      {
        id: "C09-AC7",
        text: "Given the selected range, then \"Top merchants\" lists 5 merchant names ordered by total spend, descending.",
        manual: false
      },
      {
        id: "C09-AC8",
        text: "Gridlines align with ticks, and ghost bars sit behind the current bars.",
        manual: true
      },
      {
        id: "C09-AC9",
        text: "At 375, 768 and 1280, the page does not scroll horizontally.",
        manual: false
      },
      {
        id: "C09-AC10",
        text: "Given a 375px viewport, then the KPIs sit two per row, and the chart is wider than the viewport while the page does not scroll horizontally.",
        manual: false
      },
      {
        id: "C09-AC11",
        text: "Given a 768px viewport, then the four KPIs sit on one row.",
        manual: false
      },
      {
        id: "C09-AC12",
        text: "Given a 1280px viewport, then \"Top merchants\" is to the right of the chart.",
        manual: false
      }
    ],
    a11yBonus: [
      {
        id: "C09-A11Y1",
        text: "A table of the chart's data, one row per bar with its label and amount, is available visibly or to assistive tech."
      },
      {
        id: "C09-A11Y2",
        text: "With focus on a bar, the Left and Right arrow keys move focus to the previous and next bar."
      }
    ],
    referenceAnalysis: {
      tree: "`Header > RangeTabs`, `KpiRow`, `BarChart > (YAxis, Gridlines, BarGroup × n > (GhostBar, Bar), XAxis, Tooltip)`, `TopMerchants`.",
      tokens: "`bg-neutral-50`, `ring-1 ring-neutral-200`, `rounded-2xl`, `fill-blue-500` / `blue-700` / `neutral-300`, `stroke-neutral-200 stroke-dasharray`, `tabular-nums`.",
      breakpoints: "KPIs `grid-cols-2 tablet:grid-cols-4`; chart wrapper `overflow-x-auto` around an SVG `min-w-[640px] tablet:min-w-0 w-full`; page `desktop:grid-cols-[2fr_1fr]`.",
      state: {
        summary: "`range` and `activeIndex`. The buckets, prior buckets, KPIs, scale, ticks, and top merchants are all derived with `useMemo` from `range`."
      },
      traps: [
        "A y-scale max equal to the data max, leaving the top bar touching the frame. Use a nice-number ceiling.",
        "Forgetting SVG y is inverted.",
        "A tooltip on hover only, with no focus path.",
        "Daily average computed over bars instead of days.",
        "Timezone drift from `new Date(\"2026-09-28\")`. Parse the date parts manually or use UTC throughout.",
        "Letting the page, not the chart panel, scroll sideways at 375."
      ]
    }
  },
  {
    number: "10",
    title: "Transactions",
    difficulty: 10,
    concept: "Search, filter, sort, and a detail drawer, composed",
    target: "responsive, 375 / 768 / 1280",
    dataFile: "10-transactions.json",
    whatThisTests: "Composing derived views (search, then filter, then sort) over 200 rows. It also tests sortable column headers with `aria-sort`, a URL-free but complete state model, and a modal drawer with focus trap, Escape, and focus return. Plus an edit inside the drawer that flows back to the table. This is the full senior-level surface in one screen.",
    acceptanceCriteria: [
      {
        id: "C10-AC1",
        text: "Given the page loads, then a table shows \"Showing 200 of 200\", and the Date column header has `aria-sort=\"descending\"`.",
        manual: false
      },
      {
        id: "C10-AC2",
        text: "When the user types in the search field, then rows are filtered case-insensitively on merchant, cardholder, and memo, and the count updates.",
        manual: false
      },
      {
        id: "C10-AC3",
        text: "When the user checks only \"Declined\" in the Status filter, then every visible row's status is Declined. Combined with a search, both filters apply.",
        manual: false
      },
      {
        id: "C10-AC4",
        text: "When the user activates the Amount header, then rows sort ascending by amount with `aria-sort=\"ascending\"`. Activating it again sorts descending. Sorting applies after filtering.",
        manual: false
      },
      {
        id: "C10-AC5",
        text: "When filters match no rows, then \"No transactions match your filters\" is shown with a \"Clear filters\" button that restores all 200.",
        manual: false
      },
      {
        id: "C10-AC6",
        text: "When the user opens a row, then a dialog named after the merchant opens, focus moves inside it, and Tab cycles within the dialog.",
        manual: false
      },
      {
        id: "C10-AC7",
        text: "When the user presses Escape or activates \"Close\", then the dialog closes and focus returns to the row that opened it.",
        manual: false
      },
      {
        id: "C10-AC8",
        text: "When the user edits the memo in the dialog and activates \"Save\", then the dialog closes, and searching for a word from the new memo finds that row.",
        manual: false
      },
      {
        id: "C10-AC9",
        text: "The header stays visible while scrolling; long merchant names truncate with an ellipsis and show the full name in the dialog.",
        manual: true
      },
      {
        id: "C10-AC10",
        text: "At 375, 768 and 1280, the page does not scroll horizontally.",
        manual: false
      },
      {
        id: "C10-AC11",
        text: "Given a 375px viewport, then the \"Cardholder\", \"Category\" and \"Status\" column headers are hidden, and an opened dialog is as wide as the viewport.",
        manual: false
      },
      {
        id: "C10-AC12",
        text: "Given a 768px viewport, then the \"Status\" header is visible, \"Cardholder\" is hidden, and an opened dialog is 440px wide.",
        manual: false
      },
      {
        id: "C10-AC13",
        text: "Given a 1280px viewport, then every column header is visible.",
        manual: false
      }
    ],
    a11yBonus: [
      {
        id: "C10-A11Y1",
        text: "The results count (\"Showing n of 200\") is a status message, so each change is announced."
      },
      {
        id: "C10-A11Y2",
        text: "When the dialog closes after Save, a status message \"Memo saved\" is announced."
      }
    ],
    referenceAnalysis: {
      tree: "`TopNav`, `Toolbar > (SearchInput, StatusFilter > Popover, CategorySelect, ResultCount)`, `TransactionTable > (SortableHeader × 3, TransactionRow × n)`, `EmptyState`, `DetailDrawer > (Summary, MetaList, MemoForm)`.",
      tokens: "`bg-stone-950` nav, `max-w-7xl`, `h-12` rows, `divide-stone-200`, `hover:bg-stone-50`, badge pairs as listed, `w-[440px]` drawer, `bg-black/40` scrim, `sticky top-0` header.",
      breakpoints: "columns `hidden tablet:table-cell` (Status) and `hidden desktop:table-cell` (Cardholder, Category, receipt) on both `th` and `td`; toolbar `flex flex-col tablet:flex-row`; drawer `w-full tablet:w-[440px]`.",
      state: {
        points: [
          "`transactions` (memos are editable)",
          "`query`, `statuses: Set`, `category`, `sort: { key, dir }`",
          "`openId`, plus a ref to the opener",
          "The pipeline `transactions → search → filter → sort` is one `useMemo`, and the count comes from it.",
          "The drawer's memo draft is local to the drawer."
        ]
      },
      traps: [
        "Sorting the source array in place.",
        "Storing the filtered list in state.",
        "Using the native `<dialog>` without handling focus return, or hand-rolling a trap that misses Shift+Tab.",
        "Sort comparators that break on negative refunds or equal values (add a stable tiebreak on `postedAt`).",
        "Search that runs `toLowerCase` on a null memo."
      ]
    }
  }
];

export function getChallenge(number: ChallengeNumber): Challenge {
  const challenge = challenges.find((c) => c.number === number);
  if (!challenge) throw new Error(`Unknown challenge ${number}`);
  return challenge;
}

/** Challenge NN is built by task T-(NN+1). */
export function taskFor(number: ChallengeNumber): string {
  return `T-${Number(number) + 1}`;
}
