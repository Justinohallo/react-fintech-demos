import Link from "next/link";
import { InlineCode } from "@/components/shell/InlineCode";
import { LOOKUP_CATEGORIES, type Lookup } from "@/lib/lookups";

// SPEC.md §3: every question asked during the rep, in order.
export function HelpLog({ lookups }: { lookups: Lookup[] }) {
  return (
    <section className="mt-12" aria-labelledby="help-log-heading">
      <h2 id="help-log-heading" className="text-2xl font-semibold tracking-tight">
        Help log
      </h2>
      <p className="mt-1 text-sm text-stone-600">
        {lookups.length} {lookups.length === 1 ? "question" : "questions"} asked during the rep, logged as they were
        answered.
      </p>
      <ol className="mt-4 space-y-3">
        {lookups.map((l, i) => (
          <li key={i} className="rounded-xl border border-stone-200 bg-white p-4">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
              <span className="font-mono text-stone-600 tabular-nums">{l.time ?? "–:–"}</span>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-700">
                {LOOKUP_CATEGORIES[l.category]}
              </span>
              <span className="font-medium text-stone-900">{l.topic}</span>
            </p>
            <p className="mt-2 text-stone-700">
              <span className="font-medium text-stone-900">Asked: </span>
              <InlineCode text={l.asked} />
            </p>
            <p className="mt-1 text-stone-700">
              <span className="font-medium text-stone-900">Answer: </span>
              <InlineCode text={l.answer} />
            </p>
            {l.guide && (
              <p className="mt-2 text-sm">
                <Link href={l.guide.href} className="text-teal-800 underline underline-offset-4 hover:text-teal-950">
                  Guide: {l.guide.title}
                </Link>
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
