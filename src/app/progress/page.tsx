import type { Metadata } from "next";
import Link from "next/link";
import { ProgressChart } from "@/components/progress/ProgressChart";
import { InlineCode } from "@/components/shell/InlineCode";
import { Shell } from "@/components/shell/Shell";
import { REVIEW_TAGS, type ReviewTag } from "@/content/reviewTags";
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
            <div className="mt-4 relative overflow-x-auto rounded-xl border border-stone-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-100 text-stone-600">
                  <tr>
                    {["Date", "Challenge", "Attempt", "ACs", "A11y", "Phase at 60", "Analysis", "Review"].map((h) => (
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

          <section className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">Recurring issues</h2>
            {tags.length === 0 ? (
              <p className="mt-3 text-stone-600">No issues tagged yet.</p>
            ) : (
              <div className="mt-4 relative overflow-x-auto rounded-xl border border-stone-200 bg-white">
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
