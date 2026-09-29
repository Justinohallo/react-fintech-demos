/**
 * Mock screenshots at the three test viewports (SPEC.md §7), into
 * docs/screenshots/NN/{375,768,1280}.png. A challenge's screenshot spec is:
 *
 *   import { captureMock } from "../support/screenshots";
 *   captureMock("01");
 */
import { test } from "@playwright/test";
import { TIERS, TIER_NAMES } from "./responsive";

export function captureMock(challenge: string) {
  for (const tier of TIER_NAMES) {
    const viewport = TIERS[tier];
    test(`${challenge} mock at ${tier} ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/challenges/${challenge}/mock`);
      await page.evaluate(() => document.fonts.ready);
      // The dev-server badge is not part of the design.
      await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
      await page.screenshot({ path: `docs/screenshots/${challenge}/${viewport.width}.png`, fullPage: true });
    });
  }
}
