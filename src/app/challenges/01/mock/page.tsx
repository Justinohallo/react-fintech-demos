import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import data from "@data/01-treasury.json";
import { formatChangePercent, formatDate, formatSignedUSD, formatUSD } from "./_lib/format";

export const metadata: Metadata = { title: "01 · Treasury balance · Mock" };

const fraunces = Fraunces({ subsets: ["latin"], display: "swap" });
const inter = Inter({ subsets: ["latin"], display: "swap" });

const USER_NAME = "Priya Raman";

const card = "rounded-xl border border-stone-200 bg-white p-6";
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

export default function Mock() {
  const { account, accounts, transactions } = data;

  // Derived, never stored.
  const changeCents = account.balanceCents - account.previousBalanceCents;
  const changePercent = formatChangePercent(account.balanceCents, account.previousBalanceCents);
  const totalCents = accounts.reduce((sum, a) => sum + a.balanceCents, 0);

  return (
    <div className={`${inter.className} min-h-screen bg-stone-50 text-stone-900`}>
      <div className="mx-auto max-w-[1280px] p-4 tablet:p-6 desktop:p-8">
        <header className="flex items-center justify-between">
          <span className={`${fraunces.className} text-xl font-semibold tracking-tight`}>Kestrel</span>
          <span className="hidden text-sm text-stone-500 tablet:block">Operating account</span>
          <span
            role="img"
            aria-label={`Signed in as ${USER_NAME}`}
            className="grid size-9 place-items-center rounded-full bg-stone-200 text-xs font-medium text-stone-700"
          >
            {USER_NAME.split(" ").map((part) => part[0]).join("")}
          </span>
        </header>

        <main className={`mt-6 desktop:mt-8 ${grid}`}>
          <section className={`${card} [grid-area:balance]`} aria-labelledby="balance-heading">
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
          </section>

          <section className={`${card} [grid-area:accounts] desktop:self-start`} aria-labelledby="accounts-heading">
            <h2 id="accounts-heading" className={cardTitle}>
              Accounts
            </h2>
            <ul className="mt-4 divide-y divide-stone-200">
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
          </section>

          <section className={`${card} [grid-area:activity]`} aria-labelledby="activity-heading">
            <h2 id="activity-heading" className={cardTitle}>
              Recent activity
            </h2>
            <ul aria-label="Recent activity" className="mt-4 divide-y divide-stone-200">
              {transactions.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
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
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
