"use client";

// Challenge 01 — Treasury balance
import data from "@data/01-treasury.json";
const Card = ({ children }) => (
  <div className="bg-white p-4 border rounded-xl h-full">{children}</div>
);
const Header = () => <>Header</>;
const AccountCard = ({ className }) => {
  const {
    account: { last4, balanceCents, previousBalanceCents },
  } = data;
  const amount = 0;
  const amountChangeCents = balanceCents - previousBalanceCents;
  const amountChangePercentage = amountChangeCents / previousBalanceCents;
  const title = "Operating Account";
  return (
    <section aria-labelledby={title} className={className}>
      <Card>
        <h1 className="text-lg">{title}</h1>
        <p className="text-3xl">{balanceCents}</p>
        <div>
          <p className="text-emerald-500">
            {amountChangeCents} ({amountChangePercentage})
            <span>vs last month</span>
          </p>
        </div>
        <p>Account Number **** {last4}</p>
      </Card>
    </section>
  );
};

const AccountsCard = ({ className }) => {
  const { accounts } = data;
  const hasAccounts = accounts.length > 0;
  const title = "Accounts";
  return (
    <section aria-labelledby={title} className={className}>
      <Card>
        <h2 className="text-lg">{title}</h2>
        {hasAccounts ? (
          <ul>
            {accounts.map((account) => (
              <li id={account.id}>
                <p>{account.name}</p>
                <p>{account.balanceCents}</p>
              </li>
            ))}
          </ul>
        ) : (
          <>No data to display</>
        )}
      </Card>
    </section>
  );
};

const ActivityCard = ({ className }) => {
  const { transactions } = data;
  const hasTransactions = transactions.length > 0;
  const title = "Recent Activity";
  return (
    <section aria-labelledby={title} className={className}>
      <Card>
        <h2 className="text-lg">{title}</h2>
        {hasTransactions ? (
          <ul>
            {transactions.map((transaction) => (
              <li id={transaction.id}>
                {transaction.merchant} {transaction.category}
                {transaction.date} {transaction.amountCents}
              </li>
            ))}
          </ul>
        ) : (
          <>No Transactions to display</>
        )}
      </Card>
    </section>
  );
};

export default function Attempt() {
  return (
    <body
      className="bg-gray-100 
                  mx-auto
                  max-w-7xl
                  p-4
                  tablet:p-6
                  desktop:p-8
                  "
    >
      <header>
        <Header />
      </header>
      <main
        className="grid 
              gap-4 p-4
              items-stretch
             tablet:grid-cols-2
             tablet:grid-rows-[auto_auto] 
             tablet:[grid-template-areas:'sec1_sec2'_'sec3_sec3']
            desktop:[grid-template-areas:'sec1_sec2'_'sec3_sec2']
            desktop:grid-cols-[2fr_1fr]
             "
      >
        <AccountCard className="tablet:[grid-area:sec1]" />

        <AccountsCard className="tablet:[grid-area:sec2] desktop:self-start" />

        <ActivityCard className="tablet:[grid-area:sec3]" />
      </main>
    </body>
  );
}
