import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { getChallenge, type ChallengeNumber } from "@/content/challenges";
import { listAttempts } from "@/lib/attempts";

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
          {attempts.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/challenges/${c.number}/deliverable/${a.slug}`}
                className="block px-4 py-3 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-teal-600"
              >
                <span className="flex items-baseline justify-between gap-4">
                  <span className="font-medium">Attempt {a.n}</span>
                  <span className="text-sm text-stone-500">
                    {a.date ?? "No date"}
                    {a.repMinutes ? ` · ${a.repMinutes} min` : ""}
                  </span>
                </span>
                {a.firstLine && <span className="mt-1 block truncate text-sm text-stone-600">{a.firstLine}</span>}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </Shell>
  );
}
