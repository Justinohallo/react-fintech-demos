/*
 * Challenge 01 — Treasury balance. One test per AC and per accessibility item,
 * titled with its ID.
 *
 * Manual, judged from a screenshot and not tested here:
 *   C01-AC7 (manual): two-column split and serif/sans pairing match the mock.
 *
 * Grades the mock, or an attempt via `npm run check -- 01 N`. Queries use role,
 * label and visible text only; layout ACs measure the boxes of elements found
 * that way (CLAUDE.md). Runs at 1280×800 unless a test sets its own tier.
 */
import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { basePath } from "../support/base-path";
import {
  TIER_NAMES,
  expectAbove,
  expectLeftOf,
  expectNoHorizontalScroll,
  expectSameRow,
  expectStackedInOrder,
  setTier,
} from "../support/responsive";

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

// Each card is located by its heading; the layout ACs compare where those sit.
const cards = (page: Page) => ({
  balance: page.getByRole("heading", { name: "Operating account" }),
  accounts: page.getByRole("heading", { name: "Accounts" }),
  activity: page.getByRole("heading", { name: "Recent activity" }),
});

test("C01-AC8 the page does not scroll horizontally at 375, 768 and 1280", async ({ page }) => {
  for (const tier of TIER_NAMES) {
    await setTier(page, tier);
    await page.goto(basePath("01"));
    await expectNoHorizontalScroll(page);
  }
});

test("C01-AC9 at 375 the balance card, Accounts and Recent activity are stacked in that order", async ({ page }) => {
  await setTier(page, "mobile");
  const { balance, accounts, activity } = cards(page);
  await expectStackedInOrder(balance, accounts, activity);
});

test("C01-AC10 at 768 the balance card and Accounts sit side by side, with Recent activity below both", async ({
  page,
}) => {
  await setTier(page, "tablet");
  const { balance, accounts, activity } = cards(page);
  await expectSameRow(balance, accounts);
  await expectLeftOf(balance, accounts);
  await expectAbove(balance, activity);
  await expectAbove(accounts, activity);
});

test("C01-AC11 at 1280 Recent activity is below the balance card, and Accounts is right of both", async ({
  page,
}) => {
  await setTier(page, "desktop");
  const { balance, accounts, activity } = cards(page);
  await expectAbove(balance, activity);
  await expectLeftOf(balance, accounts);
  await expectLeftOf(activity, accounts);
});

test("C01-A11Y1 the masked account number reads as \"ending in 4821\", not a run of bullets", async ({ page }) => {
  const exposed = await page.locator("body").ariaSnapshot();
  expect(exposed).toContain(`ending in ${data.account.last4}`);
  expect(exposed).not.toMatch(/•{2,}/);
});

test("C01-A11Y2 the avatar has an accessible name with a full name, not only initials", async ({ page }) => {
  const avatar = page.getByRole("img", { name: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/ });
  await expect(avatar).toBeVisible();
  const name = (await avatar.getAttribute("aria-label")) ?? (await avatar.textContent()) ?? "";
  expect(name).not.toMatch(/^\s*[A-Z]{1,3}\s*$/);
});
