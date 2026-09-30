// Money is integer cents everywhere; it becomes a string only here, at render.
// One currency (USD), so the names say what they do, not which currency.

// "auto" shows a minus only when negative; "never" would hide it.
const money = (signDisplay: "auto" | "always") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", signDisplay });

const plainMoney = money("auto");
const signedMoney = money("always");
const pctSigned = new Intl.NumberFormat("en-US", {
  style: "percent",
  signDisplay: "always",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const formatMoney = (cents: number) => plainMoney.format(cents / 100);

/** Leading "+" or "-", never parentheses. */
export const formatSignedMoney = (cents: number) => signedMoney.format(cents / 100);

/** Signed percentage to one decimal. Undefined when the base is zero. */
export function formatChangePercent(currentCents: number, previousCents: number): string | null {
  if (previousCents === 0) return null;
  return pctSigned.format((currentCents - previousCents) / previousCents);
}

export const formatDate = (iso: string) => day.format(new Date(`${iso}T00:00:00Z`));
