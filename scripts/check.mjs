#!/usr/bin/env node
// npm run check -- NN        grades challenge NN's mock
// npm run check -- NN N      grades attempt N of challenge NN
// Runs tests/challenges/NN.spec.ts with KESTREL_BASE_PATH pointing at the
// target, then prints pass/fail per AC ID. Plain Node, no dependencies.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const [nnArg, nArg] = process.argv.slice(2);
if (!nnArg || !/^\d{1,2}$/.test(nnArg) || Number(nnArg) < 1 || Number(nnArg) > 10) {
  fail("Usage: npm run check -- NN [N]   (NN is 01–10, N is an attempt number)");
}
if (nArg !== undefined && !/^\d+$/.test(nArg)) fail(`Attempt number must be a whole number, got "${nArg}"`);
const nn = nnArg.padStart(2, "0");

const spec = path.join("tests", "challenges", `${nn}.spec.ts`);
if (!fs.existsSync(path.join(root, spec))) {
  fail(`No AC suite for challenge ${nn} yet (${spec}). It is written in T-${Number(nn) + 1}.`);
}

let basePath = `/challenges/${nn}/mock`;
let target = "mock";
if (nArg !== undefined) {
  const slug = `attempt-${Number(nArg)}`;
  if (!fs.existsSync(path.join(root, "src/app/challenges", nn, "deliverable", slug))) {
    fail(`No ${slug} for challenge ${nn}. Create one with: npm run attempt -- ${nn}`);
  }
  basePath = `/challenges/${nn}/deliverable/${slug}`;
  target = slug;
}

const jsonOut = path.join(os.tmpdir(), `kestrel-check-${nn}-${process.pid}.json`);
console.log(`Challenge ${nn} · ${target} · ${basePath}\n`);

const run = spawnSync(
  "npx",
  ["playwright", "test", spec, "--project=challenges", "--reporter=line,json"],
  {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, KESTREL_BASE_PATH: basePath, PLAYWRIGHT_JSON_OUTPUT_NAME: jsonOut },
  },
);

let report;
try {
  report = JSON.parse(fs.readFileSync(jsonOut, "utf8"));
  fs.rmSync(jsonOut, { force: true });
} catch {
  fail("Playwright produced no report. See the output above.");
}

const results = [];
(function walk(suites = []) {
  for (const suite of suites) {
    for (const s of suite.specs ?? []) {
      const status = s.tests.every((t) => t.status === "skipped")
        ? "SKIP"
        : s.tests.every((t) => t.status === "expected" || t.status === "flaky")
          ? "PASS"
          : "FAIL";
      results.push({ title: s.title, status });
    }
    walk(suite.suites);
  }
})(report.suites);

// Manual ACs are listed in the spec file's header comment, not tested.
const header = /^\s*\/\*[\s\S]*?\*\//.exec(fs.readFileSync(path.join(root, spec), "utf8"))?.[0] ?? "";
const manual = [...new Set(header.match(/C\d\d-AC\d+/g) ?? [])].filter(
  (id) => !results.some((r) => r.title.startsWith(id)),
);

const byId = (a, b) => a.title.localeCompare(b.title, "en", { numeric: true });
console.log("\nAcceptance criteria");
for (const r of results.sort(byId)) console.log(`  ${r.status}    ${r.title}`);
for (const id of manual) console.log(`  MANUAL  ${id}`);

const passed = results.filter((r) => r.status === "PASS").length;
console.log(`\n${passed}/${results.length} passed${manual.length ? `, ${manual.length} manual` : ""}`);
process.exit(run.status === 0 && passed === results.length ? 0 : 1);
