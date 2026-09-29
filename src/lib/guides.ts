import fs from "node:fs";
import path from "node:path";
import { isReviewTag, type ReviewTag } from "@/content/reviewTags";
import { parseFrontMatter, toList, toNumber } from "./frontMatter";

// The curriculum: guides/<slug>.md (SPEC.md §6). Adding a guide is adding a
// file. Read at build time by server components.

export const WORKSHEET_STEPS = ["regions", "tokens", "data", "state", "states", "questions"] as const;
export type WorksheetStep = (typeof WORKSHEET_STEPS)[number];

export type Guide = {
  slug: string;
  title: string;
  unit: string;
  unitOrder: number;
  order: number;
  summary: string;
  addresses: ReviewTag[];
  worksheet: WorksheetStep | null;
  body: string;
};

export type Unit = { name: string; order: number; guides: Guide[] };

const GUIDES_DIR = path.join(process.cwd(), "guides");
const GUIDE_FILE = /^([a-z0-9-]+)\.md$/;

const isStep = (value?: string): value is WorksheetStep =>
  (WORKSHEET_STEPS as readonly string[]).includes(value ?? "");

/** Every guide in curriculum order: by unit, then by order within the unit. */
export function listGuides(): Guide[] {
  let files: string[];
  try {
    files = fs.readdirSync(GUIDES_DIR);
  } catch {
    return [];
  }
  return files
    .map((file) => GUIDE_FILE.exec(file))
    .filter((m): m is RegExpExecArray => m !== null)
    .map(([file, slug]) => {
      const { meta, body } = parseFrontMatter(fs.readFileSync(path.join(GUIDES_DIR, file), "utf8"));
      return {
        slug,
        title: meta.title ?? slug,
        unit: meta.unit ?? "Other",
        unitOrder: toNumber(meta.unit_order) ?? 99,
        order: toNumber(meta.order) ?? 99,
        summary: meta.summary ?? "",
        addresses: toList(meta.addresses, ",").filter(isReviewTag),
        worksheet: isStep(meta.worksheet) ? meta.worksheet : null,
        body,
      };
    })
    .sort((a, b) => a.unitOrder - b.unitOrder || a.order - b.order || a.title.localeCompare(b.title));
}

export function listUnits(): Unit[] {
  const units = new Map<string, Unit>();
  for (const g of listGuides()) {
    const unit = units.get(g.unit) ?? { name: g.unit, order: g.unitOrder, guides: [] };
    unit.guides.push(g);
    units.set(g.unit, unit);
  }
  return [...units.values()].sort((a, b) => a.order - b.order);
}

export function getGuide(slug: string): Guide | null {
  return listGuides().find((g) => g.slug === slug) ?? null;
}

/** The guides before and after `slug` in curriculum order, for reading straight through. */
export function neighbours(slug: string): { previous: Guide | null; next: Guide | null } {
  const all = listGuides();
  const i = all.findIndex((g) => g.slug === slug);
  return { previous: all[i - 1] ?? null, next: all[i + 1] ?? null };
}

export function guidesForStep(step: WorksheetStep): Guide[] {
  return listGuides().filter((g) => g.worksheet === step);
}

export function guidesForTag(tag: ReviewTag): Guide[] {
  return listGuides().filter((g) => g.addresses.includes(tag));
}
