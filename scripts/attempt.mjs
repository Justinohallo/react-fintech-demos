#!/usr/bin/env node
// npm run attempt -- NN [--notes=guided|prompted|bare] [--dry-run]
// Copies the attempt template into the next free attempt-N folder for
// challenge NN, writes notes.md at the scaffolding level for this rep
// (SPEC.md §6), and prints the URL. --dry-run prints the notes and writes
// nothing. Plain Node, no dependencies.

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const templateDir = path.join(root, "src/app/challenges/_template/attempt");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

const USAGE = "Usage: npm run attempt -- NN [--notes=guided|prompted|bare] [--dry-run]   (NN is 01–10)";
const args = process.argv.slice(2);
const arg = args.find((a) => !a.startsWith("--"));
const notesFlag = args.find((a) => a.startsWith("--notes="))?.slice("--notes=".length);
const dryRun = args.includes("--dry-run");
const unknown = args.filter((a) => a.startsWith("--") && !a.startsWith("--notes=") && a !== "--dry-run");
if (unknown.length) fail(`Unknown option ${unknown.join(" ")}. ${USAGE}`);
if (!arg || !/^\d{1,2}$/.test(arg) || Number(arg) < 1 || Number(arg) > 10) fail(USAGE);
if (notesFlag !== undefined && !["guided", "prompted", "bare"].includes(notesFlag)) fail(`--notes must be guided, prompted or bare. ${USAGE}`);
const nn = arg.padStart(2, "0");

// Scaffolding fades with practice (SPEC.md §6). Rep number = attempt folders
// across every challenge, including the one about to be created.
const challengesDir = path.join(root, "src/app/challenges");
const repsSoFar = fs
  .readdirSync(challengesDir)
  .filter((d) => /^\d\d$/.test(d))
  .flatMap((d) => {
    const dir = path.join(challengesDir, d, "deliverable");
    return fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => /^attempt-\d+$/.test(n)) : [];
  }).length;
const rep = repsSoFar + 1;
const level = notesFlag ?? (rep <= 5 ? "guided" : rep <= 12 ? "prompted" : "bare");

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
const notes = fs.readFileSync(path.join(templateDir, `notes.${level}.md`), "utf8").replace("__DATE__", today);
const levelNote = notesFlag ? `${level} (chosen with --notes)` : `${level} (rep ${rep}; guided 1–5, prompted 6–12, bare 13+)`;

if (dryRun) {
  console.log(`Dry run: would create ${path.relative(root, attemptDir)} with ${levelNote} notes:\n`);
  console.log(notes);
  process.exit(0);
}

fs.mkdirSync(attemptDir);
fs.writeFileSync(path.join(attemptDir, "page.jsx"), page);
fs.writeFileSync(path.join(attemptDir, "notes.md"), notes);

console.log(`✓ Created ${path.relative(root, attemptDir)}/page.jsx and notes.md`);
console.log(`  Notes: ${levelNote}`);
console.log(`  http://localhost:3000/challenges/${nn}/deliverable/${slug}   (run \`npm run dev\` if it isn't running)`);
console.log(`  Grade it: npm run check -- ${nn} ${n}`);
