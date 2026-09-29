/*
 * Challenge 01 — Treasury balance. One test per AC, titled with its ID.
 *
 * Manual, judged from a screenshot and not tested here:
 *   C01-AC7 (manual): two-column split and serif/sans pairing match the mock.
 *
 * Grades the mock, or an attempt via `npm run check -- 01 N`. Queries use role,
 * label and visible text only.
 */
import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { basePath } from "../support/base-path";

type Treasury = {
  account: { name: string; last4: string; balanceCents: number; previousBalanceCents: number };
  accounts: { id: string; name: string; balanceCents: number }[];
  transactions: { id: string; merchant: string; category: string; date: string; amountCents: number }[];
};
const data: Treasury = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/01-treasury.json"), "utf8"));

const usd = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
const signedUsd = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", signDisplay: "always" }).format(cents / 100);
const signedPct = (ratio: number) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    signDisplay: "always",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(ratio);

test.beforeEach(async ({ page }) => {
  await page.goto(basePath("01"));
});

test("C01-AC1 heading Operating account is visible", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Operating account" })).toBeVisible();
});

test("C01-AC2 balance is formatted as USD with separator and two decimals", async ({ page }) => {
  const formatted = usd(data.account.balanceCents);
  expect(formatted).toMatch(/^\$\d{1,3}(,\d{3})*\.\d{2}$/);
  await expect(page.getByText(formatted, { exact: true }).first()).toBeVisible();
});

test("C01-AC3 change is a signed amount and signed percentage, not stored in data", async ({ page }) => {
  const { balanceCents, previousBalanceCents } = data.account;
  const change = balanceCents - previousBalanceCents;
  await expect(page.getByText(signedUsd(change))).toBeVisible();
  await expect(page.getByText(signedPct(change / previousBalanceCents))).toBeVisible();

  const stored = JSON.stringify(data);
  expect(stored).not.toContain("change");
  expect(stored).not.toContain("percent");
  expect(Object.keys(data.account).sort()).toEqual(["balanceCents", "last4", "name", "previousBalanceCents"]);
});

test("C01-AC4 Recent activity lists 6 items, each with its merchant", async ({ page }) => {
  expect(data.transactions).toHaveLength(6);
  const items = page.getByRole("list", { name: "Recent activity" }).getByRole("listitem");
  await expect(items).toHaveCount(6);
  for (const t of data.transactions) {
    await expect(items.filter({ hasText: t.merchant })).toHaveCount(1);
  }
});

test("C01-AC5 negative amounts have a leading minus, not parentheses", async ({ page }) => {
  const negatives = data.transactions.filter((t) => t.amountCents < 0);
  expect(negatives.length).toBeGreaterThanOrEqual(2);
  const items = page.getByRole("list", { name: "Recent activity" }).getByRole("listitem");
  for (const t of negatives) {
    const item = items.filter({ hasText: t.merchant });
    await expect(item).toContainText(usd(t.amountCents));
    expect(usd(t.amountCents)).toMatch(/^-\$/);
    await expect(item).not.toContainText("(");
  }
});

test("C01-AC6 Accounts total equals the sum of the three balances", async ({ page }) => {
  expect(data.accounts).toHaveLength(3);
  const total = data.accounts.reduce((sum, a) => sum + a.balanceCents, 0);
  await expect(page.getByRole("heading", { name: "Accounts" })).toBeVisible();
  await expect(page.getByText("Total", { exact: true })).toBeVisible();
  await expect(page.getByText(usd(total), { exact: true })).toBeVisible();
});
