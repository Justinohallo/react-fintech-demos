// T-1 smoke tests (SPEC.md §7): routes, timer persistence, reveal confirm.
import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { challenges } from "../src/content/challenges";

async function visit(page: Page, route: string) {
  const response = await page.goto(route);
  expect(response?.status(), `${route} status`).toBe(200);
}

test.describe("every route returns 200 and renders its heading", () => {
  test("/", async ({ page }) => {
    await visit(page, "/");
    await expect(page.getByRole("heading", { level: 1, name: "Kestrel practice set" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Framework" })).toBeVisible();
    for (const c of challenges) await expect(page.getByRole("link", { name: new RegExp(c.title) })).toBeVisible();
    await expect(
      page.getByText("Kestrel is a fictional company. Designs and data are invented for practice."),
    ).toBeVisible();
  });

  test("/framework", async ({ page }) => {
    await visit(page, "/framework");
    await expect(page.getByRole("heading", { level: 1, name: "The method" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "The rep, in five phases" })).toBeVisible();
  });

  for (const c of challenges) {
    const base = `/challenges/${c.number}`;

    test(`${base} brief`, async ({ page }) => {
      await visit(page, base);
      await expect(page.getByRole("heading", { level: 1, name: c.title })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Site" }).getByRole("link", { name: "Framework" })).toBeVisible();
      for (const ac of c.acceptanceCriteria) await expect(page.getByText(ac.id, { exact: true })).toBeVisible();
    });

    test(`${base}/mock`, async ({ page }) => {
      await visit(page, `${base}/mock`);
      await expect(page.getByRole("heading").first()).toBeVisible();
      await expect(page.getByRole("link", { name: "← Brief" })).toBeVisible();
    });

    test(`${base}/deliverable`, async ({ page }) => {
      await visit(page, `${base}/deliverable`);
      await expect(page.getByRole("heading", { level: 1, name: "Attempts" })).toBeVisible();
      await expect(page.getByText(`npm run attempt -- ${c.number}`)).toBeVisible();
    });

    // Attempt pages belong to the human, so only the layout's chrome is checked.
    const deliverableDir = path.join("src", "app", "challenges", c.number, "deliverable");
    const attempts = fs.readdirSync(deliverableDir).filter((name) => /^attempt-\d+$/.test(name));
    for (const slug of attempts) {
      test(`${base}/deliverable/${slug}`, async ({ page }) => {
        await visit(page, `${base}/deliverable/${slug}`);
        await expect(page.getByRole("link", { name: "← Attempts" })).toBeVisible();
        await expect(page.getByRole("region", { name: "Rep timer" })).toBeVisible();
      });
    }
  }
});

function seconds(clock: string): number {
  const [m, s] = clock.split(":").map(Number);
  return m * 60 + s;
}

test("the timer starts, persists across a reload, and resets", async ({ page }) => {
  await visit(page, "/challenges/01");
  const timer = page.getByRole("region", { name: "Rep timer" });
  const clock = timer.getByRole("timer");
  await expect(clock).toHaveText("00:00");

  await timer.getByRole("button", { name: "Start" }).click();
  await expect(timer.getByRole("button", { name: "Pause" })).toBeVisible();
  await expect.poll(async () => seconds(await clock.innerText()), { timeout: 5_000 }).toBeGreaterThanOrEqual(2);
  const beforeReload = seconds(await clock.innerText());

  await page.reload();
  await expect(timer.getByRole("button", { name: "Pause" })).toBeVisible();
  await expect.poll(async () => seconds(await clock.innerText())).toBeGreaterThanOrEqual(beforeReload);
  await expect(timer).toContainText("Read and plan");

  await timer.getByRole("button", { name: "Reset" }).click();
  await expect(clock).toHaveText("00:00");
  await expect(timer.getByRole("button", { name: "Start" })).toBeVisible();

  await page.reload();
  await expect(clock).toHaveText("00:00");
});

test("the reveal on a brief page requires the confirm step", async ({ page }) => {
  await visit(page, "/challenges/03");
  const traps = page.getByRole("heading", { name: "Traps" });
  const confirm = page.getByText("Finish your own 5-minute analysis first. Reveal anyway?");

  await expect(traps).toHaveCount(0);
  await page.getByRole("button", { name: "Reveal reference analysis" }).click();
  await expect(confirm).toBeVisible();
  await expect(traps).toHaveCount(0);

  await page.getByRole("button", { name: "Not yet" }).click();
  await expect(confirm).toBeHidden();
  await expect(traps).toHaveCount(0);

  await page.getByRole("button", { name: "Reveal reference analysis" }).click();
  await page.getByRole("button", { name: "Reveal anyway" }).click();
  await expect(traps).toBeVisible();
  await expect(page.getByText("Rendering the full number and hiding it with CSS")).toBeVisible();
});
