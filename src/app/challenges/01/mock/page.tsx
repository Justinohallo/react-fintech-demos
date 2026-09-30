import { Fraunces, Inter } from "next/font/google";
import { formatChangePercent, formatDate, formatSignedUSD, formatUSD } from "./_lib/format";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import data from "@data/01-treasury.json";

export const metadata: Metadata = { title: "01 · Treasury balance · Mock" };

const fraunces = Fraunces({ subsets: ["latin"], display: "swap" });
const inter = Inter({ subsets: ["latin"], display: "swap" });

const USER_NAME = "Priya Raman";

type Account = typeof data.account;
type AccountSummary = (typeof data.accounts)[number];
type Transaction = (typeof data.transactions)[number];

// Headings differ in level (h1, h2), so they share classes, not a component.
const cardTitle = `${fraunces.className} text-lg font-medium`;
const tone = (cents: number) => (cents < 0 ? "text-rose-700" : "text-emerald-700");

// One grid, three tiers: the areas move, the cards are rendered once.
//   mobile   balance / accounts / activity
//   tablet   balance accounts / activity activity           (1fr 1fr)
//   desktop  balance accounts / activity accounts           (2fr 1fr)
const grid = [
  "grid grid-cols-1 gap-6",
  "[grid-template-areas:'balance'_'accounts'_'activity']",
  "tablet:grid-cols-2 tablet:[grid-template-areas:'balance_accounts'_'activity_activity']",
  "desktop:grid-cols-[2fr_1fr] desktop:[grid-template-areas:'balance_accounts'_'activity_accounts']",
].join(" ");

// A plain box. It can't know whether it's a section, a list item or an article,
// so the component that uses it supplies the meaning. h-full fills its grid item.
function Card({ children }: { children: ReactNode }) {
  return <div className="h-full rounded-xl border border-stone-200 bg-white p-6">{children}</div>;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");
  return (
    <span
      role="img"
      aria-label={`Signed in as ${name}`}
      className="grid size-9 place-items-center rounded-full bg-stone-200 text-xs font-medium text-stone-700"
    >
      {initials}
    </span>
  );
}

function BalanceCard({ account, className }: { account: Account; className: string }) {
  // Derived, never stored.
  const changeCents = account.balanceCents - account.previousBalanceCents;
  const changePercent = formatChangePercent(account.balanceCents, account.previousBalanceCents);

  return (
    <section aria-labelledby="balance-heading" className={className}>
      <Card>
        <h1 id="balance-heading" className={cardTitle}>
          {account.name}
        </h1>
        <p className={`${fraunces.className} mt-4 text-4xl font-medium tracking-tight tabular-nums`}>
          {formatUSD(account.balanceCents)}
        </p>
        <p className={`mt-2 text-sm tabular-nums ${tone(changeCents)}`}>
          {formatSignedUSD(changeCents)}
          {changePercent && ` (${changePercent})`}
          <span className="text-stone-500"> vs last month</span>
        </p>
        <p className="mt-6 text-xs text-stone-500">
          <span aria-hidden>Account number •••• {account.last4}</span>
          <span className="sr-only">Account number ending in {account.last4}</span>
        </p>
      </Card>
    </section>
  );
}

function AccountsCard({ accounts, className }: { accounts: AccountSummary[]; className: string }) {
  const totalCents = accounts.reduce((sum, a) => sum + a.balanceCents, 0);

  return (
    <section aria-labelledby="accounts-heading" className={className}>
      <Card>
        <h2 id="accounts-heading" className={cardTitle}>
          Accounts
        </h2>
        <ul aria-labelledby="accounts-heading" className="mt-4 divide-y divide-stone-200">
          {accounts.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-4 py-3 first:pt-0">
              <span className="text-sm">{a.name}</span>
              <span className="text-sm font-medium tabular-nums">{formatUSD(a.balanceCents)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-4 border-t border-stone-200 pt-4">
          <span className="text-sm font-medium">Total</span>
          <span className="text-sm font-medium tabular-nums">{formatUSD(totalCents)}</span>
        </div>
      </Card>
    </section>
  );
}

function TransactionRow({ transaction: t }: { transaction: Transaction }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-sm font-medium">{t.merchant}</p>
        <p className="mt-0.5 text-xs text-stone-500">
          {t.category} · {formatDate(t.date)}
        </p>
      </div>
      <p className={`shrink-0 text-sm font-medium tabular-nums ${tone(t.amountCents)}`}>
        {formatSignedUSD(t.amountCents)}
      </p>
    </li>
  );
}

function ActivityCard({ transactions, className }: { transactions: Transaction[]; className: string }) {
  return (
    <section aria-labelledby="activity-heading" className={className}>
      <Card>
        <h2 id="activity-heading" className={cardTitle}>
          Recent activity
        </h2>
        <ul aria-labelledby="activity-heading" className="mt-4 divide-y divide-stone-200">
          {transactions.map((t) => (
            <TransactionRow key={t.id} transaction={t} />
          ))}
        </ul>
      </Card>
    </section>
  );
}

// The page reads the data once, owns the landmarks, and places each section.
export default function Mock() {
  const { account, accounts, transactions } = data;

  return (
    <div className={`${inter.className} min-h-screen bg-stone-50 text-stone-900`}>
      <div className="mx-auto max-w-7xl p-4 tablet:p-6 desktop:p-8">
        <header className="flex items-center justify-between">
          <span className={`${fraunces.className} text-xl font-semibold tracking-tight`}>Kestrel</span>
          <span className="hidden text-sm text-stone-500 tablet:block">Operating account</span>
          <Avatar name={USER_NAME} />
        </header>

        <main className={`mt-6 desktop:mt-8 ${grid}`}>
          <BalanceCard account={account} className="[grid-area:balance]" />
          <AccountsCard accounts={accounts} className="[grid-area:accounts] desktop:self-start" />
          <ActivityCard transactions={transactions} className="[grid-area:activity]" />
        </main>
      </div>
    </div>
  );
}
