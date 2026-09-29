#!/usr/bin/env node
// npm run attempt -- NN
// Copies the attempt template into the next free attempt-N folder for
// challenge NN, writes notes.md from the notes template, and prints the URL.
// Plain Node, no dependencies.

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const templateDir = path.join(root, "src/app/challenges/_template/attempt");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const arg = process.argv[2];
if (!arg || !/^\d{1,2}$/.test(arg) || Number(arg) < 1 || Number(arg) > 10) {
  fail("Usage: npm run attempt -- NN   (NN is 01–10)");
}
const nn = arg.padStart(2, "0");

// challenges.ts is the single source for the title and data file.
const content = fs.readFileSync(path.join(root, "src/content/challenges.ts"), "utf8");
const match = new RegExp(`number: "${nn}",\\s*title: "([^"]*)"[\\s\\S]*?dataFile: "([^"]*)"`).exec(content);
if (!match) fail(`Challenge ${nn} not found in src/content/challenges.ts`);
const [, title, dataFile] = match;

const deliverableDir = path.join(root, "src/app/challenges", nn, "deliverable");
if (!fs.existsSync(deliverableDir)) fail(`Missing ${path.relative(root, deliverableDir)}`);

const taken = fs
  .readdirSync(deliverableDir)
  .map((name) => /^attempt-(\d+)$/.exec(name))
  .filter(Boolean)
  .map((m) => Number(m[1]));
const n = taken.length ? Math.max(...taken) + 1 : 1;
const slug = `attempt-${n}`;
const attemptDir = path.join(deliverableDir, slug);

const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, the date of the rep
const page = fs
  .readFileSync(path.join(templateDir, "page.jsx"), "utf8")
  .replace("__CHALLENGE__", `Challenge ${nn} — ${title}`)
  .replace("__DATA_FILE__", dataFile);
const notes = fs.readFileSync(path.join(templateDir, "notes.md"), "utf8").replace("__DATE__", today);

fs.mkdirSync(attemptDir);
fs.writeFileSync(path.join(attemptDir, "page.jsx"), page);
fs.writeFileSync(path.join(attemptDir, "notes.md"), notes);

console.log(`✓ Created ${path.relative(root, attemptDir)}/page.jsx and notes.md`);
console.log(`  http://localhost:3000/challenges/${nn}/deliverable/${slug}   (run \`npm run dev\` if it isn't running)`);
console.log(`  Grade it: npm run check -- ${nn} ${n}`);
