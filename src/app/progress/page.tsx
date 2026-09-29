import type { Metadata } from "next";
import Link from "next/link";
import { ProgressChart } from "@/components/progress/ProgressChart";
import { InlineCode } from "@/components/shell/InlineCode";
import { Shell } from "@/components/shell/Shell";
import { REVIEW_TAGS, type ReviewTag } from "@/content/reviewTags";
import { CODE_DIMENSIONS, DIMENSION_KEYS, SEVERITY_KEYS } from "@/content/codeReview";
import { getCodeReview } from "@/lib/codeReviews";
import { guidesForTag } from "@/lib/guides";
import { LOOKUP_CATEGORIES, getLookups, type LookupCategory } from "@/lib/lookups";
import { formatScore, listReviews } from "@/lib/reviews";

export const metadata: Metadata = { title: "Progress" };

// SPEC.md §3: every reviewed rep, a chart, recurring issue tags, current focus.
// Reads reviews/ at build time.
export default function ProgressPage() {
  const reviews = listReviews();
  const latest = reviews.at(-1);

  const count = (subset: typeof reviews) => {
    const counts = new Map<ReviewTag, number>();
    for (const r of subset) for (const t of r.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return counts;
  };
  const recent = count(reviews.slice(-5));
  const allTime = count(reviews);
  const codeReviews = reviews
    .map((r) => ({ r, code: getCodeReview(r.challenge, r.attempt) }))
    .filter((x): x is { r: (typeof reviews)[number]; code: NonNullable<ReturnType<typeof getCodeReview>> } => x.code !== null);
  const commentCounts = DIMENSION_KEYS.map((d) => ({
    d,
    counts: SEVERITY_KEYS.map((s) =>
      codeReviews.reduce((n, { code }) => n + code.comments.filter((c) => c.category === d && c.severity === s).length, 0),
    ),
  }));
  const lookupsByRep = new Map(reviews.map((r) => [`${r.challenge}-${r.attempt}`, getLookups(r.challenge, r.attempt)]));
  const lookupCounts = (subset: typeof reviews) => {
    const counts = new Map<LookupCategory, number>();
    for (const r of subset)
      for (const l of lookupsByRep.get(`${r.challenge}-${r.attempt}`) ?? []) counts.set(l.category, (counts.get(l.category) ?? 0) + 1);
    return counts;
  };
  const recentLookups = lookupCounts(reviews.slice(-5));
  const allLookups = lookupCounts(reviews);
  const lookupCategories = [...allLookups.keys()].sort((a, b) => allLookups.get(b)! - allLookups.get(a)!);
  const tags = [...allTime.keys()].sort(
    (a, b) => (recent.get(b) ?? 0) - (recent.get(a) ?? 0) || allTime.get(b)! - allTime.get(a)!,
  );

  return (
    <Shell>
      <h1 className="text-3xl font-semibold tracking-tight">Progress</h1>

      {reviews.length === 0 ? (
        <p className="mt-4 leading-relaxed text-stone-600">
          No reviewed reps yet. After a rep, run <InlineCode text="`/review NN N`" /> in Claude Code. It grades the
          attempt, writes a review, and it appears here.
        </p>
      ) : (
        <>
          <p className="mt-3 text-stone-600">
            {reviews.length} {reviews.length === 1 ? "rep" : "reps"} reviewed. Latest: challenge {latest!.challenge},
            attempt {latest!.attempt}, {formatScore(latest!.acs)} ACs · {formatScore(latest!.a11y)} a11y.
          </p>

          {latest!.focus.length > 0 && (
            <section className="mt-8 rounded-xl border border-teal-200 bg-teal-50 p-5">
              <h2 className="font-semibold text-teal-950">Focus for the next rep</h2>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-teal-950 marker:text-teal-700">
                {latest!.focus.map((f) => (
                  <li key={f}>
                    <InlineCode text={f} />
                  </li>
                ))}
              </ol>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">Scores</h2>
            <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
              <ProgressChart reviews={reviews} />
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">Reps</h2>
            <div role="region" aria-label="Reps" tabIndex={0} className="mt-4 relative overflow-x-auto rounded-xl border border-stone-200 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-100 text-stone-600">
                  <tr>
                    {["Date", "Challenge", "Attempt", "ACs", "A11y", "Phase at 60", "Analysis", "Lookups", "Review"].map((h) => (
                      <th key={h} scope="col" className="px-3 py-2 font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 tabular-nums">
                  {[...reviews].reverse().map((r) => (
                    <tr key={`${r.challenge}-${r.attempt}`}>
                      <td className="px-3 py-2 whitespace-nowrap">{r.date}</td>
                      <td className="px-3 py-2">{r.challenge}</td>
                      <td className="px-3 py-2">{r.attempt}</td>
                      <td className="px-3 py-2">{formatScore(r.acs)}</td>
                      <td className="px-3 py-2">{formatScore(r.a11y)}</td>
                      <td className="px-3 py-2">{r.phase || "–"}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {r.analysisMinutes !== null ? `${r.analysisMinutes} min` : "–"}
                      </td>
                      <td className="px-3 py-2">{lookupsByRep.get(`${r.challenge}-${r.attempt}`)?.length ?? "–"}</td>
                      <td className="px-3 py-2">
                        <Link
                          href={`/progress/${r.challenge}/${r.attempt}`}
                          className="text-teal-800 underline underline-offset-4 hover:text-teal-950"
                        >
                          Read<span className="sr-only">
                            {" "}
                            review of challenge {r.challenge} attempt {r.attempt}
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {codeReviews.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold tracking-tight">Code rubric</h2>
              <p className="mt-2 text-sm text-stone-600">Each dimension scored 0–3 per rep, oldest first.</p>
              <div aria-label="Code rubric by rep" role="region" tabIndex={0} className="relative mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-100 text-stone-600">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">Dimension</th>
                      {codeReviews.map(({ r }) => (
                        <th key={`${r.challenge}-${r.attempt}`} scope="col" className="px-3 py-2 text-center font-medium whitespace-nowrap">
                          {r.challenge}·{r.attempt}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 tabular-nums">
                    {DIMENSION_KEYS.map((d) => (
                      <tr key={d}>
                        <th scope="row" className="px-3 py-2 font-medium whitespace-nowrap">{CODE_DIMENSIONS[d]}</th>
                        {codeReviews.map(({ r, code }) => (
                          <td key={`${r.challenge}-${r.attempt}`} className="px-3 py-2 text-center">
                            {code.rubric[d] ?? "–"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="mt-8 font-semibold text-stone-900">Code comments, all reps</h3>
              <div aria-label="Code comments by category and severity" role="region" tabIndex={0} className="relative mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-100 text-stone-600">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">Category</th>
                      {SEVERITY_KEYS.map((s) => (
                        <th key={s} scope="col" className="px-3 py-2 text-right font-medium">
                          {s}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 tabular-nums">
                    {commentCounts.map(({ d, counts }) => (
                      <tr key={d}>
                        <th scope="row" className="px-3 py-2 font-medium whitespace-nowrap">{CODE_DIMENSIONS[d]}</th>
                        {counts.map((n, i) => (
                          <td key={i} className="px-3 py-2 text-right">
                            {n}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {lookupCategories.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-semibold tracking-tight">What you look up</h2>
              <p className="mt-2 text-sm text-stone-600">
                Questions asked during reps, from the help logs. A category that shrinks is knowledge that stuck.
              </p>
              <div role="region" aria-label="Lookups by category" tabIndex={0} className="relative mt-4 overflow-x-auto rounded-xl border border-stone-200 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-100 text-stone-600">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">Category</th>
                      <th scope="col" className="px-3 py-2 text-right font-medium whitespace-nowrap">Last 5</th>
                      <th scope="col" className="px-3 py-2 text-right font-medium whitespace-nowrap">All time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 tabular-nums">
                    {lookupCategories.map((c) => (
                      <tr key={c}>
                        <th scope="row" className="px-3 py-2 font-medium">{LOOKUP_CATEGORIES[c]}</th>
                        <td className="px-3 py-2 text-right">{recentLookups.get(c) ?? 0}</td>
                        <td className="px-3 py-2 text-right">{allLookups.get(c)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">Recurring issues</h2>
            {tags.length === 0 ? (
              <p className="mt-3 text-stone-600">No issues tagged yet.</p>
            ) : (
              <div role="region" aria-label="Recurring issues" tabIndex={0} className="mt-4 relative overflow-x-auto rounded-xl border border-stone-200 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-100 text-stone-600">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Issue
                      </th>
                      <th scope="col" className="px-3 py-2 text-right font-medium whitespace-nowrap">
                        Last 5
                      </th>
                      <th scope="col" className="px-3 py-2 text-right font-medium whitespace-nowrap">
                        All time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {tags.map((t) => (
                      <tr key={t} className="align-top">
                        <td className="px-3 py-2">
                          <code className="font-mono text-xs text-stone-900">{t}</code>
                          <p className="mt-0.5 text-stone-600">
                            <InlineCode text={REVIEW_TAGS[t]} />
                          </p>
                          {guidesForTag(t).map((g) => (
                            <Link
                              key={g.slug}
                              href={`/guides/${g.slug}`}
                              className="mt-1 mr-3 inline-block text-teal-800 underline underline-offset-4 hover:text-teal-950"
                            >
                              Read: {g.title}
                            </Link>
                          ))}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{recent.get(t) ?? 0}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{allTime.get(t)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </Shell>
  );
}
