import fs from "node:fs";
import path from "node:path";
import { isReviewTag, type ReviewTag } from "@/content/reviewTags";

// Reads the Coach's reviews from reviews/NN/attempt-N.md (SPEC.md §6). Called
// only from server components that prerender at build time.

export type Score = { passed: number; total: number };

export type Review = {
  challenge: string;
  attempt: number;
  date: string;
  minutes: number | null;
  phase: string;
  acs: Score | null;
  a11y: Score | null;
  analysisMinutes: number | null;
  tags: ReviewTag[];
  focus: string[];
  body: string;
};

const REVIEWS_DIR = path.join(process.cwd(), "reviews");
const REVIEW_FILE = /^attempt-(\d+)\.md$/;

/** Front matter is one `key: value` per line between `---` fences, by design (no YAML parser). */
function parse(text: string): { meta: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) return { meta: {}, body: text };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: match[2].trim() };
}

const toNumber = (value?: string) => (value && /^\d+(\.\d+)?$/.test(value) ? Number(value) : null);

function toScore(value?: string): Score | null {
  const m = value ? /^(\d+)\s*\/\s*(\d+)$/.exec(value) : null;
  return m ? { passed: Number(m[1]), total: Number(m[2]) } : null;
}

function read(challenge: string, file: string): Review | null {
  const attempt = REVIEW_FILE.exec(file);
  if (!attempt) return null;
  const { meta, body } = parse(fs.readFileSync(path.join(REVIEWS_DIR, challenge, file), "utf8"));
  return {
    challenge,
    attempt: Number(attempt[1]),
    date: meta.date ?? "",
    minutes: toNumber(meta.minutes),
    phase: meta.phase ?? "",
    acs: toScore(meta.acs),
    a11y: toScore(meta.a11y),
    analysisMinutes: toNumber(meta.analysis_minutes),
    tags: (meta.tags ?? "").split(",").map((t) => t.trim()).filter(isReviewTag),
    focus: (meta.focus ?? "").split("|").map((f) => f.trim()).filter(Boolean),
    body,
  };
}

/** Every review, oldest first: by date, then challenge, then attempt. */
export function listReviews(): Review[] {
  let challenges: string[];
  try {
    challenges = fs.readdirSync(REVIEWS_DIR).filter((d) => /^\d\d$/.test(d));
  } catch {
    return [];
  }
  return challenges
    .flatMap((c) => fs.readdirSync(path.join(REVIEWS_DIR, c)).map((f) => read(c, f)))
    .filter((r): r is Review => r !== null)
    .sort((a, b) => a.date.localeCompare(b.date) || a.challenge.localeCompare(b.challenge) || a.attempt - b.attempt);
}

export function getReview(challenge: string, attempt: number): Review | null {
  return listReviews().find((r) => r.challenge === challenge && r.attempt === attempt) ?? null;
}

export const formatScore = (score: Score | null) => (score ? `${score.passed}/${score.total}` : "–");

export const percent = (score: Score | null) => (score && score.total ? (score.passed / score.total) * 100 : null);
