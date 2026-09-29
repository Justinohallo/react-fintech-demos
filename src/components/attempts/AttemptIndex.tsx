import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { getChallenge, type ChallengeNumber } from "@/content/challenges";
import { listAttempts } from "@/lib/attempts";
import { formatScore, getReview } from "@/lib/reviews";

// Reads the filesystem at build time (SPEC.md §3).
export function AttemptIndex({ number }: { number: ChallengeNumber }) {
  const c = getChallenge(number);
  const attempts = listAttempts(number);

  return (
    <Shell>
      <p className="text-sm text-stone-500">
        <Link href={`/challenges/${c.number}`} className="underline-offset-4 hover:text-teal-800 hover:underline">
          ← Challenge {c.number} · {c.title}
        </Link>
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Attempts</h1>

      <div className="mt-6 rounded-xl bg-stone-900 p-4 text-stone-100">
        <p className="text-sm text-stone-400">Create the next attempt:</p>
        <pre className="mt-1 overflow-x-auto font-mono text-sm">
          <code>npm run attempt -- {c.number}</code>
        </pre>
      </div>

      {attempts.length === 0 ? (
        <p className="mt-8 text-stone-600">No attempts yet.</p>
      ) : (
        <ol className="mt-8 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {attempts.map((a) => {
            const review = getReview(c.number, a.n);
            return (
              <li key={a.slug} className="px-4 py-3">
                <div className="flex items-baseline justify-between gap-4">
                  <Link
                    href={`/challenges/${c.number}/deliverable/${a.slug}`}
                    className="font-medium underline-offset-4 hover:text-teal-800 hover:underline"
                  >
                    Attempt {a.n}
                  </Link>
                  <span className="text-sm text-stone-500">
                    {a.date ?? "No date"}
                    {a.repMinutes ? ` · ${a.repMinutes} min` : ""}
                  </span>
                </div>
                {a.firstLine && <p className="mt-1 truncate text-sm text-stone-600">{a.firstLine}</p>}
                <p className="mt-2 text-sm">
                  {review ? (
                    <>
                      <span className="tabular-nums">
                        {formatScore(review.acs)} ACs · {formatScore(review.a11y)} a11y
                      </span>
                      {" · "}
                      <Link
                        href={`/progress/${c.number}/${a.n}`}
                        className="text-teal-800 underline underline-offset-4 hover:text-teal-950"
                      >
                        Review<span className="sr-only"> of attempt {a.n}</span>
                      </Link>
                    </>
                  ) : (
                    <span className="text-stone-500">
                      Not reviewed yet. Run <code className="font-mono">/review {c.number} {a.n}</code>
                    </span>
                  )}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </Shell>
  );
}
