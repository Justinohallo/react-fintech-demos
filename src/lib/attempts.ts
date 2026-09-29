import fs from "node:fs";
import path from "node:path";
import type { ChallengeNumber } from "@/content/challenges";
import { LEGACY_QUOTE_PROMPTS } from "./legacyPrompts";

// Reads attempt folders from disk. Called only from server components that
// prerender at build time, so the deployed site reflects committed attempts.

export type Attempt = {
  n: number;
  slug: string;
  date: string | null;
  repMinutes: string | null;
  firstLine: string | null;
};

const ATTEMPT_DIR = /^attempt-(\d+)$/;

function deliverableDir(number: ChallengeNumber): string {
  return path.join(process.cwd(), "src", "app", "challenges", number, "deliverable");
}

export function listAttempts(number: ChallengeNumber): Attempt[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(deliverableDir(number), { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isDirectory() && ATTEMPT_DIR.test(e.name))
    .map((e) => {
      const n = Number(ATTEMPT_DIR.exec(e.name)![1]);
      return { n, slug: e.name, ...readNotes(path.join(deliverableDir(number), e.name, "notes.md")) };
    })
    .sort((a, b) => b.n - a.n);
}

export function countAttempts(number: ChallengeNumber): number {
  return listAttempts(number).length;
}

function readNotes(file: string): Pick<Attempt, "date" | "repMinutes" | "firstLine"> {
  try {
    return summariseNotes(fs.readFileSync(file, "utf8"));
  } catch {
    return { date: null, repMinutes: null, firstLine: null };
  }
}

/**
 * True for a line the human actually wrote, false for template scaffolding
 * (SPEC.md §6): prompts (italic lines, or template `>` lines in old notes), unfilled slots (`Label:` with nothing after),
 * checkbox lines, table rows, and lone list bullets.
 */
export function isWritten(line: string): boolean {
  const l = line.trim();
  if (!l || l.startsWith("|") || l === "-" || l === "*") return false;
  if (/^_.+_$/.test(l)) return false; // prompt (italic line)
  if (l.startsWith(">")) return !LEGACY_QUOTE_PROMPTS.has(l); // old notes: prompt only if it's the template's
  if (/^[-*]\s*\[[ xX]\]/.test(l)) return false;
  if (/^[^:]{1,60}:$/.test(l)) return false;
  return true;
}

/** Date and Rep minutes from their sections, and the first line written under any other section. */
export function summariseNotes(text: string): Pick<Attempt, "date" | "repMinutes" | "firstLine"> {
  const sections = new Map<string, string[]>();
  let current: string | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const heading = /^#{1,6}\s+(.*)$/.exec(raw.trim());
    if (heading) {
      current = heading[1].trim();
      sections.set(current, []);
    } else if (current && isWritten(raw)) {
      sections.get(current)!.push(raw.trim());
    }
  }

  const first = (name: string) => sections.get(name)?.[0] ?? null;
  let firstLine: string | null = null;
  for (const [name, lines] of sections) {
    if (name === "Date" || name === "Rep minutes") continue;
    if (lines.length) {
      firstLine = lines[0];
      break;
    }
  }
  return { date: first("Date"), repMinutes: first("Rep minutes"), firstLine };
}
