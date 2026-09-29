// Money is integer cents everywhere; it becomes a string only here, at render.

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdSigned = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", signDisplay: "always" });
const pctSigned = new Intl.NumberFormat("en-US", {
  style: "percent",
  signDisplay: "always",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const day = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const formatUSD = (cents: number) => usd.format(cents / 100);

/** Leading "+" or "-", never parentheses. */
export const formatSignedUSD = (cents: number) => usdSigned.format(cents / 100);

/** Signed percentage to one decimal. Undefined when the base is zero. */
export function formatChangePercent(currentCents: number, previousCents: number): string | null {
  if (previousCents === 0) return null;
  return pctSigned.format((currentCents - previousCents) / previousCents);
}

export const formatDate = (iso: string) => day.format(new Date(`${iso}T00:00:00Z`));
