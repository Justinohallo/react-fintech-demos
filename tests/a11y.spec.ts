/*
 * Universal accessibility checks A11Y-1 … A11Y-6 (SPEC.md §2, ADR-002).
 * Bonus points: `npm run check` reports them beside the ACs, and they never
 * fail a rep. Runs against KESTREL_BASE_PATH, the same page as the AC suite.
 *
 * Controls are found by role. Two things read the DOM directly, as tooling
 * rather than locators: axe (the audit engine), and grouping radios by their
 * native `name` or nearest radiogroup/tablist so each group counts as one Tab stop.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type ElementHandle, type Locator, type Page } from "@playwright/test";
import { AXE_TAGS } from "../src/content/a11y";
import { TIERS, expectNoHorizontalScroll } from "./support/responsive";

const base = process.env.KESTREL_BASE_PATH;
test.skip(!base, "Run through `npm run check -- NN [N]`, which sets KESTREL_BASE_PATH.");

const CONTROL_ROLES = [
  "button",
  "link",
  "textbox",
  "searchbox",
  "combobox",
  "listbox",
  "checkbox",
  "switch",
  "slider",
  "spinbutton",
  "radio",
  "tab",
] as const;

// The Next.js dev badge is tooling, not part of the page under test.
const HIDE_DEV_BADGE = "nextjs-portal { display: none !important; }";

async function open(page: Page, viewport: { width: number; height: number } = TIERS.desktop) {
  await page.setViewportSize(viewport);
  await page.goto(base!);
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: HIDE_DEV_BADGE });
  // On attempt pages, collapse our floating timer so it can't cover controls.
  const collapse = page.getByRole("button", { name: "Collapse timer" });
  if (await collapse.isVisible()) await collapse.click();
}

async function expectNoAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags([...AXE_TAGS]).exclude("nextjs-portal").analyze();
  const report = violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help} → ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`,
  );
  expect(report, "axe violations").toEqual([]);
}

type Control = { handle: ElementHandle; label: string; role: string; group: string | null };

async function describe(locator: Locator, role: string): Promise<string> {
  const text = await locator.evaluate(
    (el) =>
      el.getAttribute("aria-label") ??
      (el as HTMLInputElement).labels?.[0]?.textContent ??
      el.textContent ??
      "",
  );
  return `${role} "${text.trim().replace(/\s+/g, " ").slice(0, 40)}"`;
}

/** Visible, enabled controls. Radios and tabs carry a group key: one Tab stop per group. */
async function controls(page: Page): Promise<Control[]> {
  const found: Control[] = [];
  for (const role of CONTROL_ROLES) {
    for (const locator of await page.getByRole(role).all()) {
      if (!(await locator.isVisible()) || !(await locator.isEnabled())) continue;
      const group =
        role === "radio" || role === "tab"
          ? await locator.evaluate((el, r) => {
              const name = el.getAttribute("name");
              if (r === "radio" && name) return `radio:${name}`;
              const container = el.closest(r === "radio" ? "[role=radiogroup], fieldset" : "[role=tablist]");
              if (!container) return `${r}:ungrouped`;
              const all = Array.from(document.querySelectorAll(r === "radio" ? "[role=radiogroup], fieldset" : "[role=tablist]"));
              return `${r}:${all.indexOf(container)}`;
            }, role)
          : null;
      found.push({ handle: (await locator.elementHandle())!, label: await describe(locator, role), role, group });
    }
  }
  return found;
}

/** Where a control's focus indicator would show: its box plus a margin, inside the viewport. */
async function clipFor(page: Page, handle: ElementHandle) {
  const box = await handle.boundingBox();
  const vp = page.viewportSize()!;
  if (!box) return null;
  const pad = 6;
  const x = Math.max(0, box.x - pad);
  const y = Math.max(0, box.y - pad);
  const width = Math.min(vp.width, box.x + box.width + pad) - x;
  const height = Math.min(vp.height, box.y + box.height + pad) - y;
  return width > 0 && height > 0 ? { x, y, width, height } : null;
}

async function shot(page: Page, handle: ElementHandle) {
  await handle.scrollIntoViewIfNeeded();
  const clip = await clipFor(page, handle);
  return clip ? page.screenshot({ clip, animations: "disabled", caret: "hide" }) : null;
}

/**
 * Presses Tab from the top of the page until focus cycles, returning the
 * index into `list` of each control that received focus, in order.
 */
async function tabThrough(page: Page, list: Control[], onStop?: (index: number) => Promise<void>) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  const reached = new Set<number>();
  let first: number | null = null;
  const maxStops = list.length * 2 + 10;
  for (let i = 0; i < maxStops; i++) {
    await page.keyboard.press("Tab");
    const active = await page.evaluateHandle(() => document.activeElement);
    const index = await page.evaluate(
      ([handles, el]) => (handles as Element[]).indexOf(el as Element),
      [list.map((c) => c.handle), active] as const,
    );
    if (index === -1) continue;
    if (index === first) break;
    first ??= index;
    reached.add(index);
    await onStop?.(index);
  }
  return reached;
}

test("A11Y-1 axe finds no WCAG A/AA violations at 1280×800", async ({ page }) => {
  await open(page, TIERS.desktop);
  await expectNoAxeViolations(page);
});

test("A11Y-2 axe finds no WCAG A/AA violations at 375×812", async ({ page }) => {
  await open(page, TIERS.mobile);
  await expectNoAxeViolations(page);
});

test("A11Y-3 every control can be reached with Tab", async ({ page }) => {
  await open(page);
  const list = await controls(page);
  const reached = await tabThrough(page, list);

  const unreached: string[] = [];
  const groups = new Map<string, { labels: string[]; hit: boolean }>();
  list.forEach((c, i) => {
    if (c.group) {
      const g = groups.get(c.group) ?? { labels: [], hit: false };
      g.labels.push(c.label);
      g.hit ||= reached.has(i);
      groups.set(c.group, g);
    } else if (!reached.has(i)) {
      unreached.push(c.label);
    }
  });
  for (const g of groups.values()) if (!g.hit) unreached.push(`group of ${g.labels.join(", ")}`);
  expect(unreached, "controls Tab never reaches").toEqual([]);
});

test("A11Y-4 every control visibly changes on keyboard focus", async ({ page }) => {
  await open(page);
  const list = await controls(page);

  // Unfocused appearance first, with nothing focused.
  const before = new Map<number, Buffer | null>();
  for (const [i, c] of list.entries()) before.set(i, await shot(page, c.handle));
  await page.evaluate(() => window.scrollTo(0, 0));

  const invisible: string[] = [];
  await tabThrough(page, list, async (i) => {
    const after = await shot(page, list[i].handle);
    const was = before.get(i);
    if (was && after && was.equals(after)) invisible.push(list[i].label);
  });
  expect(invisible, "controls with no visible focus indicator").toEqual([]);
});

test("A11Y-5 one main landmark, one h1, no skipped heading levels", async ({ page }) => {
  await open(page);
  await expect(page.getByRole("main"), "exactly one main landmark").toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 }), "exactly one level-1 heading").toHaveCount(1);

  const snapshot = await page.locator("body").ariaSnapshot();
  const levels = [...snapshot.matchAll(/- heading\b.*\[level=(\d)\]/g)].map((m) => Number(m[1]));
  const skips = levels
    .map((level, i) => (i > 0 && level > levels[i - 1] + 1 ? `h${levels[i - 1]} → h${level}` : null))
    .filter(Boolean);
  expect(skips, "heading levels skipped").toEqual([]);
});

test("A11Y-6 no horizontal scroll at 320×640 (reflow)", async ({ page }) => {
  await open(page, { width: 320, height: 640 });
  await expectNoHorizontalScroll(page);
});
