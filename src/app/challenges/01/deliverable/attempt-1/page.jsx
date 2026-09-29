"use client";

// Challenge 01 — Treasury balance
import data from "@data/01-treasury.json";

const Header = () => {
  return (
    <div className="flex justify-between items-center ">
      <p>Kestrel</p>
      <div className="bg-gray-200 w-10 h-10 flex flex-col justify-center items-center rounded-full  ">
        <p className="text-center">PR</p>
      </div>
    </div>
  );
};

const Card = ({ children, title, isPrimary }) => {
  return (
    <div className="rounded-md border border-gray-300 p-6 bg-white">
      {isPrimary ? <h1>{title}</h1> : <h2>{title}</h2>}
      {children}
    </div>
  );
};

const OperatingAccount = () => {
  const performanceValue = 14_820.75;
  const performancePercentage = 0.87;
  const accountNumber = "12344821";
  const hiddenAccountNumber = accountNumber
    .split("")
    .map((item, index) => (index < 4 ? "*" : item))
    .join("");

  return (
    <div>
      <h3>$184,320.75</h3>
      <h4>
        {performanceValue} {performancePercentage} vs last Month
      </h4>
      <p>Account Number {hiddenAccountNumber}</p>
    </div>
  );
};

const Accounts = ({ accountList }) => {
  return (
    <div>
      <ul>
        {accountList.map((account) => {
          return (
            <li className="flex flex-row justify-between border-b border-gray-200 py-2">
              <p>{account.title}</p>
              <p>{account.amount}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const RecentActivity = ({ activities }) => {
  const hasActivities = activities.length > 0;
  if (!hasActivities) return <>No Activities</>;
  return (
    <ul>
      {activities.map((activity) => {
        return (
          <li>
            <div>
              {activity.name}
              {activity.description}
              {activity.date}
            </div>
            {activity.amount}
          </li>
        );
      })}
    </ul>
  );
};

export default function Attempt() {
  return (
    <main className="bg-gray-100 p-4 min-h-screen w-full">
      <div className="flex flex-col gap-2">
        <Header />
        <Card isPrimary={true} title="Operating Account">
          <OperatingAccount />
        </Card>
        <Card title="Accounts">
          <Accounts
            accountList={[{ title: "Operating", amount: 184_320.75 }]}
          />
        </Card>
        <Card title="Recent Activity">
          <RecentActivity
            activities={[
              {
                name: "Northwind Logistics",
                description: "Customer Payment",
                date: "Sep 27,2026",
                amount: 12_500,
              },
            ]}
          />
        </Card>
      </div>
    </main>
  );
}
