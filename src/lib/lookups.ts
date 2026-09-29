import fs from "node:fs";
import path from "node:path";
import { CODE_DIMENSIONS, isDimension, type CodeDimension } from "@/content/codeReview";

// Help logs: reviews/NN/attempt-N.lookups.md (SPEC.md §6). Every question
// asked during a rep, appended as it's answered. Read at build time.

export type LookupCategory = CodeDimension | "method";

export const LOOKUP_CATEGORIES: Record<LookupCategory, string> = {
  ...CODE_DIMENSIONS,
  method: "Method",
};

export type Lookup = {
  time: string | null;
  category: LookupCategory;
  topic: string;
  asked: string;
  answer: string;
  guide: { title: string; href: string } | null;
};

/** `### 16:12 · styling · Grid items not filling the cell` (time may be `–:–`). */
const ENTRY_HEADING = /^###\s+(\d{1,2}:\d{2}|–:–|-:-)\s*·\s*(\w+)\s*·\s*(.+?)\s*$/;

export function parseLookups(text: string): Lookup[] {
  const entries: Lookup[] = [];
  let current: Lookup | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    const heading = ENTRY_HEADING.exec(line);
    if (heading) {
      const [, time, category, topic] = heading;
      current = {
        time: /\d/.test(time) ? time : null,
        category: category === "method" || isDimension(category) ? category : "method",
        topic,
        asked: "",
        answer: "",
        guide: null,
      };
      entries.push(current);
      continue;
    }
    if (!current) continue;
    const asked = /^\*\*Asked:\*\*\s*(.*)$/.exec(line);
    const answer = /^\*\*Answer:\*\*\s*(.*)$/.exec(line);
    const guide = /^Guide:\s*\[([^\]]+)\]\(([^)]+)\)/.exec(line);
    if (asked) current.asked = asked[1];
    else if (answer) current.answer = answer[1];
    else if (guide) current.guide = { title: guide[1], href: guide[2] };
    else if (line && current.answer) current.answer += ` ${line}`;
  }
  return entries;
}

export function getLookups(challenge: string, attempt: number): Lookup[] | null {
  try {
    return parseLookups(
      fs.readFileSync(path.join(process.cwd(), "reviews", challenge, `attempt-${attempt}.lookups.md`), "utf8"),
    );
  } catch {
    return null;
  }
}
