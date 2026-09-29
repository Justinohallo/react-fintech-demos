import fs from "node:fs";
import path from "node:path";
import {
  DIMENSION_KEYS,
  isDimension,
  isSeverity,
  type CodeDimension,
  type Severity,
} from "@/content/codeReview";
import { parseFrontMatter, toNumber } from "./frontMatter";

// Code reviews: reviews/NN/attempt-N.code.md (SPEC.md §6). Read at build time.

export type CodeComment = {
  file: string;
  start: number;
  end: number;
  severity: Severity;
  category: CodeDimension;
  body: string;
};

export type CodeReview = {
  challenge: string;
  attempt: number;
  rubric: Partial<Record<CodeDimension, number>>;
  comments: CodeComment[];
};

const REVIEWS_DIR = path.join(process.cwd(), "reviews");

/** `### page.jsx:24-29 · should · structure` (a single line is `page.jsx:24`). */
const COMMENT_HEADING = /^###\s+([\w.-]+):(\d+)(?:\s*[-–]\s*(\d+))?\s*·\s*(\w+)\s*·\s*(\w+)\s*$/;

export function parseCodeReview(challenge: string, attempt: number, text: string): CodeReview {
  const { meta, body } = parseFrontMatter(text);
  const rubric: CodeReview["rubric"] = {};
  for (const key of DIMENSION_KEYS) {
    const score = toNumber(meta[key]);
    if (score !== null && score >= 0 && score <= 3) rubric[key] = score;
  }

  const comments: CodeComment[] = [];
  let current: CodeComment | null = null;
  for (const line of body.split(/\r?\n/)) {
    const heading = COMMENT_HEADING.exec(line.trim());
    if (heading) {
      const [, file, start, end, severity, category] = heading;
      current =
        isSeverity(severity) && isDimension(category)
          ? { file, start: Number(start), end: Number(end ?? start), severity, category, body: "" }
          : null;
      if (current) comments.push(current);
    } else if (current) {
      current.body += `${line}\n`;
    }
  }
  for (const c of comments) c.body = c.body.trim();
  return { challenge, attempt, rubric, comments };
}

export function getCodeReview(challenge: string, attempt: number): CodeReview | null {
  const file = path.join(REVIEWS_DIR, challenge, `attempt-${attempt}.code.md`);
  try {
    return parseCodeReview(challenge, attempt, fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** The attempt's source, read-only, for the annotated view. */
export function readAttemptSource(challenge: string, attempt: number, file = "page.jsx"): string | null {
  try {
    return fs.readFileSync(
      path.join(process.cwd(), "src/app/challenges", challenge, "deliverable", `attempt-${attempt}`, file),
      "utf8",
    );
  } catch {
    return null;
  }
}
