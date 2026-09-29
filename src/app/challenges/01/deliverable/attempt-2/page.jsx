"use client";

// Challenge 01 — Treasury balance
import data from "@data/01-treasury.json";

const toUSD = (value) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
    value,
  );
const toPercentage = (num) =>
  new Intl.NumberFormat("en-CA", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(num);

const Header = () => (
  <div className="flex justify-between items-center">
    <p>Kestrel</p>
    <div className="flex justify-center items-center bg-gray-300 w-10 h-10 rounded-full ">
      <p className="text-center">PR</p>
    </div>
  </div>
);
const Card = ({ title, isPrimary = false, children }) => (
  <div className="border bg-white rounded">
    {isPrimary ? <h1>{title}</h1> : <h2>{title}</h2>}
    {children}
  </div>
);
const OperatingAccount = ({
  last4,
  amountChange,
  amount,
  percentageChange,
}) => {
  const isPositiveChange = amountChange > 0;
  const amountChangeDisplay =
    (isPositiveChange ? "+" : "-") + toUSD(amountChange);
  const percentageChangeDisplay =
    (isPositiveChange ? "+" : "-") + toPercentage(percentageChange);
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-bold">{amount} </p>
      <div className="flex flex-row">
        <p className={isPositiveChange ? "text-green-500" : "text-red-500"}>
          {amountChangeDisplay} ({percentageChangeDisplay})
        </p>
        <p className="text-grey-200">vs last month</p>
      </div>
      <div>
        <span class="sr-only">Account number ending in 4 8 2 1</span>
        <p aria-hidden="true">Account Number **** {last4}</p>
      </div>
    </div>
  );
};

const Accounts = () => <></>;
const RecentActivity = () => <></>;

export default function Attempt() {
  const {
    account: { balanceCents, previousBalanceCents, last4 },
    accounts,
    transactions,
  } = data;
  const amountChangeCents = balanceCents - previousBalanceCents;
  const percentageChange = amountChangeCents / balanceCents;

  return (
    <main className="grid grid-cols-1 gap-4 p-4 min-h-screen w-full bg-gray-200">
      <section>
        <Header />
      </section>
      <section>
        <Card title="Operating Account" isPrimary={true}>
          <OperatingAccount
            last4={last4}
            amountChange={amountChangeCents}
            percentageChange={percentageChange}
            amount={balanceCents}
          />
        </Card>
      </section>
      <section>
        <Card title="Acccounts">
          <Accounts />
        </Card>
      </section>
      <section>
        <Card title="Recent Activity">
          <RecentActivity />
        </Card>
      </section>
    </main>
  );
}
