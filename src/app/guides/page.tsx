import type { Metadata } from "next";
import Link from "next/link";
import { InlineCode } from "@/components/shell/InlineCode";
import { Shell } from "@/components/shell/Shell";
import { listUnits } from "@/lib/guides";

export const metadata: Metadata = { title: "Guides" };

// SPEC.md §3: the curriculum, grouped by unit. Reads guides/ at build time.
export default function GuidesPage() {
  const units = listUnits();

  return (
    <Shell>
      <h1 className="text-3xl font-semibold tracking-tight">Guides</h1>
      <p className="mt-3 leading-relaxed text-stone-600">
        The curriculum behind the reps. Each guide teaches one method with invented examples, so the challenges stay
        unspoiled. Read a unit in order, or follow the links from <Link href="/framework" className="text-teal-800 underline underline-offset-4 hover:text-teal-950">the method</Link> and{" "}
        <Link href="/progress" className="text-teal-800 underline underline-offset-4 hover:text-teal-950">your progress</Link>.
      </p>

      {units.length === 0 ? (
        <p className="mt-8 text-stone-600">
          No guides yet. Draft one with <InlineCode text="`/guide <topic>`" /> in Claude Code.
        </p>
      ) : (
        units.map((unit, u) => (
          <section key={unit.name} className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">
              <span className="mr-2 font-mono text-sm text-stone-500">{u + 1}</span>
              {unit.name}
            </h2>
            <ol className="mt-4 divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
              {unit.guides.map((g, i) => (
                <li key={g.slug}>
                  <Link
                    href={`/guides/${g.slug}`}
                    className="flex gap-4 px-4 py-3 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    <span className="w-8 shrink-0 font-mono text-sm leading-6 text-stone-500">
                      {u + 1}.{i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium">{g.title}</span>
                      <span className="mt-0.5 block text-sm text-stone-600">{g.summary}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </Shell>
  );
}
