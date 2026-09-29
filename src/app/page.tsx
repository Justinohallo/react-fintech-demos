import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { challenges } from "@/content/challenges";
import { countAttempts } from "@/lib/attempts";

export default function Home() {
  return (
    <Shell footer>
      <h1 className="text-3xl font-semibold tracking-tight">Kestrel practice set</h1>
      <p className="mt-3 leading-relaxed text-stone-600">
        Ten one-hour image-to-app reps in React, rising in difficulty. Read the{" "}
        <Link href="/framework" className="text-teal-800 underline underline-offset-4 hover:text-teal-950">
          framework
        </Link>{" "}
        first, then pick a challenge.
      </p>

      <ol className="mt-8 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
        {challenges.map((c) => {
          const attempts = countAttempts(c.number);
          return (
            <li key={c.number}>
              <Link
                href={`/challenges/${c.number}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-teal-600"
              >
                <span className="w-7 font-mono text-sm text-stone-400">{c.number}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{c.title}</span>
                  <span className="block truncate text-sm text-stone-500">{c.concept}</span>
                </span>
                <span className="shrink-0 text-right text-sm text-stone-500">
                  <span className="block">Difficulty {c.difficulty}</span>
                  <span className="block">
                    {attempts} {attempts === 1 ? "attempt" : "attempts"}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </Shell>
  );
}
