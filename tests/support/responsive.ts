/**
 * Responsive standard helpers (SPEC.md §2, §7).
 *
 * Layout ACs measure, they don't locate (CLAUDE.md): find elements by role,
 * label or text, then compare their bounding boxes with these helpers.
 */
import { expect, type Locator, type Page } from "@playwright/test";

export const TIERS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
} as const;

export type Tier = keyof typeof TIERS;
export const TIER_NAMES = Object.keys(TIERS) as Tier[];

/** Sub-pixel rounding and borders shouldn't fail a layout check. */
const TOLERANCE = 2;

/** Resize to a tier's test viewport. Call before `page.goto`, or reload after. */
export async function setTier(page: Page, tier: Tier) {
  await page.setViewportSize(TIERS[tier]);
}

/** The page itself never scrolls sideways; inner panels may (e.g. C09's chart). */
export async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, `page is ${scrollWidth}px wide in a ${clientWidth}px viewport`).toBeLessThanOrEqual(
    clientWidth,
  );
}

async function box(locator: Locator, name: string) {
  await expect(locator, `${name} should be visible`).toBeVisible();
  const b = await locator.boundingBox();
  if (!b) throw new Error(`${name} has no bounding box`);
  return b;
}

/** `a` ends before `b` starts, top to bottom. */
export async function expectAbove(a: Locator, b: Locator) {
  const [ba, bb] = [await box(a, "upper element"), await box(b, "lower element")];
  expect(ba.y + ba.height, "upper element should end above the lower one").toBeLessThanOrEqual(bb.y + TOLERANCE);
}

/** `a` ends before `b` starts, left to right. */
export async function expectLeftOf(a: Locator, b: Locator) {
  const [ba, bb] = [await box(a, "left element"), await box(b, "right element")];
  expect(ba.x + ba.width, "left element should end before the right one starts").toBeLessThanOrEqual(
    bb.x + TOLERANCE,
  );
}

/** Every element shares one line: their vertical extents overlap. */
export async function expectSameRow(...locators: Locator[]) {
  const boxes = await Promise.all(locators.map((l, i) => box(l, `element ${i + 1}`)));
  const top = Math.max(...boxes.map((b) => b.y));
  const bottom = Math.min(...boxes.map((b) => b.y + b.height));
  expect(bottom - top, "elements should overlap vertically, i.e. sit on one row").toBeGreaterThan(-TOLERANCE);
}

/** Elements appear top to bottom in the given order, each below the last. */
export async function expectStackedInOrder(...locators: Locator[]) {
  for (let i = 1; i < locators.length; i++) await expectAbove(locators[i - 1], locators[i]);
}

/** Elements share a left edge, i.e. one column. */
export async function expectSameColumn(...locators: Locator[]) {
  const boxes = await Promise.all(locators.map((l, i) => box(l, `element ${i + 1}`)));
  const lefts = boxes.map((b) => b.x);
  expect(Math.max(...lefts) - Math.min(...lefts), "elements should share a left edge").toBeLessThanOrEqual(
    TOLERANCE,
  );
}

/** Width of an element as rendered, e.g. to compare a drawer with the viewport. */
export async function widthOf(locator: Locator): Promise<number> {
  return (await box(locator, "element")).width;
}
