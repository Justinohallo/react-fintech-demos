import { Markdown } from "@/components/shell/Markdown";
import {
  CODE_DIMENSIONS,
  DIMENSION_KEYS,
  RUBRIC_SCALE,
  type Severity,
} from "@/content/codeReview";
import type { CodeComment, CodeReview } from "@/lib/codeReviews";

// SPEC.md §3: the rubric, then page.jsx with line numbers and each comment
// shown under the lines it refers to.

const SEVERITY_STYLE: Record<Severity, { chip: string; line: string; border: string }> = {
  must: { chip: "bg-rose-100 text-rose-900", line: "bg-rose-50", border: "border-rose-300" },
  should: { chip: "bg-amber-100 text-amber-900", line: "bg-amber-50", border: "border-amber-300" },
  nit: { chip: "bg-sky-100 text-sky-900", line: "bg-sky-50", border: "border-sky-300" },
  good: { chip: "bg-emerald-100 text-emerald-900", line: "bg-emerald-50", border: "border-emerald-300" },
};

const lines = (c: CodeComment) => (c.start === c.end ? `line ${c.start}` : `lines ${c.start}–${c.end}`);

export function CodeReviewView({ review, source }: { review: CodeReview; source: string | null }) {
  const sourceLines = source?.replace(/\n$/, "").split("\n") ?? [];
  const byEnd = new Map<number, CodeComment[]>();
  for (const c of review.comments) {
    const end = Math.min(c.end, Math.max(sourceLines.length, 1));
    byEnd.set(end, [...(byEnd.get(end) ?? []), c]);
  }
  const tint = (n: number) => {
    const covering = review.comments.filter((c) => n >= c.start && n <= c.end);
    const order: Severity[] = ["must", "should", "nit", "good"];
    const top = order.find((s) => covering.some((c) => c.severity === s));
    return top ? SEVERITY_STYLE[top].line : "";
  };

  return (
    <section className="mt-12" aria-labelledby="code-review-heading">
      <h2 id="code-review-heading" className="text-2xl font-semibold tracking-tight">
        Code review
      </h2>

      <h3 className="mt-6 font-semibold text-stone-900">Rubric</h3>
      <div
        role="region"
        aria-label="Rubric"
        tabIndex={0}
        className="relative mt-3 overflow-x-auto rounded-xl border border-stone-200 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-600">
            <tr>
              <th scope="col" className="px-3 py-2 font-medium">Dimension</th>
              <th scope="col" className="px-3 py-2 font-medium whitespace-nowrap">Score</th>
              <th scope="col" className="px-3 py-2 font-medium">Meaning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {DIMENSION_KEYS.map((d) => {
              const score = review.rubric[d];
              return (
                <tr key={d}>
                  <th scope="row" className="px-3 py-2 font-medium whitespace-nowrap">{CODE_DIMENSIONS[d]}</th>
                  <td className="px-3 py-2 whitespace-nowrap tabular-nums">
                    {score === undefined ? "–" : <ScoreDots score={score} />}
                  </td>
                  <td className="px-3 py-2 text-stone-600">{score === undefined ? "Not scored" : RUBRIC_SCALE[score]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 font-semibold text-stone-900">
        Comments on <code className="font-mono text-[0.9em]">page.jsx</code>
      </h3>
      <p className="mt-1 text-sm text-stone-600">
        {review.comments.length} {review.comments.length === 1 ? "comment" : "comments"}. Reply in Claude Code to
        discuss one; the exchange is added under it.
      </p>

      {source === null ? (
        <p className="mt-3 text-stone-600">The attempt’s source could not be read.</p>
      ) : (
        <div
          role="region"
          aria-label="page.jsx with review comments"
          tabIndex={0}
          className="relative mt-3 overflow-x-auto rounded-xl border border-stone-200 bg-white py-2 font-mono text-[13px] leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          {sourceLines.map((text, i) => {
            const n = i + 1;
            return (
              <div key={n}>
                <div className={`flex min-w-max ${tint(n)}`}>
                  <span aria-hidden className="w-12 shrink-0 pr-4 text-right text-stone-600 select-none">
                    {n}
                  </span>
                  <code className="pr-4 whitespace-pre text-stone-900">{text || " "}</code>
                </div>
                {byEnd.get(n)?.map((c, j) => (
                  <aside
                    key={j}
                    aria-label={`${c.severity} comment on ${lines(c)}: ${CODE_DIMENSIONS[c.category]}`}
                    className={`sticky left-0 my-2 ml-12 mr-4 max-w-[calc(100vw-7rem)] rounded-lg border-l-4 bg-white p-3 font-sans text-sm leading-relaxed shadow-sm ring-1 ring-stone-200 tablet:max-w-[600px] ${SEVERITY_STYLE[c.severity].border}`}
                  >
                    <p className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className={`rounded-full px-2 py-0.5 font-semibold uppercase ${SEVERITY_STYLE[c.severity].chip}`}>
                        {c.severity}
                      </span>
                      <span className="text-stone-600">
                        {CODE_DIMENSIONS[c.category]} · {lines(c)}
                      </span>
                    </p>
                    <Markdown source={c.body} />
                  </aside>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ScoreDots({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`size-2.5 rounded-full ${i <= score ? "bg-teal-600" : "bg-stone-200"}`} />
        ))}
      </span>
      {score} / 3
    </span>
  );
}
