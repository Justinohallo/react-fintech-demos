import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import data from "@data/01-treasury.json";
import { formatChangePercent, formatDate, formatSignedUSD, formatUSD } from "./_lib/format";

export const metadata: Metadata = { title: "01 · Treasury balance · Mock" };

const fraunces = Fraunces({ subsets: ["latin"], display: "swap" });
const inter = Inter({ subsets: ["latin"], display: "swap" });

const card = "rounded-xl border border-stone-200 bg-white p-6";
const tone = (cents: number) => (cents < 0 ? "text-rose-700" : "text-emerald-700");

export default function Mock() {
  const { account, accounts, transactions } = data;

  // Derived, never stored.
  const changeCents = account.balanceCents - account.previousBalanceCents;
  const changePercent = formatChangePercent(account.balanceCents, account.previousBalanceCents);
  const totalCents = accounts.reduce((sum, a) => sum + a.balanceCents, 0);

  return (
    <div className={`${inter.className} min-h-screen min-w-[1280px] bg-stone-50 text-stone-900`}>
      <div className="mx-auto w-[1280px] p-8">
        <TopBar />

        <div className="mt-8 grid grid-cols-[2fr_1fr] items-start gap-6">
          <div className="flex flex-col gap-6">
            <section className={card}>
              <h1 className={`${fraunces.className} text-lg font-medium`}>{account.name}</h1>
              <p className={`${fraunces.className} mt-4 text-4xl font-medium tracking-tight tabular-nums`}>
                {formatUSD(account.balanceCents)}
              </p>
              <p className={`mt-2 text-sm tabular-nums ${tone(changeCents)}`}>
                {formatSignedUSD(changeCents)}
                {changePercent && ` (${changePercent})`}
                <span className="text-stone-500"> vs last month</span>
              </p>
              <p className="mt-6 text-xs text-stone-500">Account number •••• {account.last4}</p>
            </section>

            <section className={card}>
              <h2 className={`${fraunces.className} text-lg font-medium`}>Recent activity</h2>
              <ul aria-label="Recent activity" className="mt-4 divide-y divide-stone-200">
                {transactions.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium">{t.merchant}</p>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {t.category} · {formatDate(t.date)}
                      </p>
                    </div>
                    <p className={`text-sm font-medium tabular-nums ${tone(t.amountCents)}`}>
                      {formatSignedUSD(t.amountCents)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className={card} aria-labelledby="accounts-heading">
            <h2 id="accounts-heading" className={`${fraunces.className} text-lg font-medium`}>
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
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="flex items-center justify-between">
      <span className={`${fraunces.className} text-xl font-semibold tracking-tight`}>Kestrel</span>
      <span className="text-sm text-stone-500">Operating account</span>
      <span
        aria-label="Signed in as Priya Raman"
        role="img"
        className="grid size-9 place-items-center rounded-full bg-stone-200 text-xs font-medium text-stone-700"
      >
        PR
      </span>
    </header>
  );
}
