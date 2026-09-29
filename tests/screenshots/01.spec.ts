// Mock screenshots (SPEC.md §7). Run with `npm run screenshots`; not part of `check`.
import { test } from "@playwright/test";

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 375, height: 812 },
];

for (const viewport of VIEWPORTS) {
  test(`01 mock at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/challenges/01/mock");
    await page.evaluate(() => document.fonts.ready);
    // The dev-server badge is not part of the design.
    await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
    await page.screenshot({ path: `docs/screenshots/01/${viewport.width}.png`, fullPage: true });
  });
}
