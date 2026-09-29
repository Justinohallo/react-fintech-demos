import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: "list",
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    // T-1 shell checks.
    { name: "smoke", testMatch: "smoke.spec.ts", use: { ...devices["Desktop Chrome"] } },
    // AC suites, run by `npm run check -- NN [N]` against a mock or an attempt.
    // Desktop tier by default; responsive ACs set their own tier (SPEC.md §7).
    {
      name: "challenges",
      testMatch: "challenges/*.spec.ts",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
    },
    // Mock screenshots at 375, 768 and 1280 (SPEC.md §7). Not part of `check`.
    { name: "screenshots", testMatch: "screenshots/*.spec.ts", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
