import { Shell } from "@/components/shell/Shell";
import { InlineCode } from "@/components/shell/InlineCode";
import { RepTimer } from "@/components/timer/RepTimer";
import { UNIVERSAL_A11Y } from "@/content/a11y";
import { getChallenge, type ChallengeNumber } from "@/content/challenges";
import { BriefActions } from "./BriefActions";
import { RevealAnalysis } from "./RevealAnalysis";

// SPEC.md §4: header, what this tests, requirements, actions, reference analysis.
export function ChallengeBrief({ number }: { number: ChallengeNumber }) {
  const c = getChallenge(number);
  const { tree, tokens, breakpoints, state, traps } = c.referenceAnalysis;

  return (
    <Shell>
      <header>
        <p className="text-sm text-stone-500">
          Challenge {c.number} · Difficulty {c.difficulty}/10
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">{c.title}</h1>
        <p className="mt-2 text-lg text-stone-600">{c.concept}</p>
      </header>

      <Section title="What this tests">
        <p className="leading-relaxed text-stone-700">
          <InlineCode text={c.whatThisTests} />
        </p>
      </Section>

      <Section title="Requirements">
        <RequirementList items={c.acceptanceCriteria} />
        <h3 className="mt-8 font-semibold text-stone-900">Accessibility bonus</h3>
        <p className="mt-1 text-sm text-stone-600">
          Bonus points, scored beside the ACs by <code className="font-mono">npm run check</code>. They never fail a
          rep.
        </p>
        <div className="mt-3">
          <RequirementList items={[...UNIVERSAL_A11Y, ...c.a11yBonus]} />
        </div>
      </Section>

      <Section title="Actions">
        <BriefActions challenge={c.number} />
      </Section>

      <Section title="Reference analysis">
        <RevealAnalysis>
          <div className="space-y-5 rounded-xl border border-stone-200 bg-white p-5 leading-relaxed text-stone-800">
            <AnalysisItem title="Tree">
              <InlineCode text={tree} />
            </AnalysisItem>
            <AnalysisItem title="Tokens">
              <InlineCode text={tokens} />
            </AnalysisItem>
            <AnalysisItem title="Breakpoints">
              <InlineCode text={breakpoints} />
            </AnalysisItem>
            <AnalysisItem title="State">
              {state.summary && (
                <p>
                  <InlineCode text={state.summary} />
                </p>
              )}
              {state.points && (
                <ul className="mt-1 list-disc space-y-1 pl-5">
                  {state.points.map((p) => (
                    <li key={p}>
                      <InlineCode text={p} />
                    </li>
                  ))}
                </ul>
              )}
            </AnalysisItem>
            <AnalysisItem title="Traps">
              <ul className="list-disc space-y-1 pl-5">
                {traps.map((t) => (
                  <li key={t}>
                    <InlineCode text={t} />
                  </li>
                ))}
              </ul>
            </AnalysisItem>
          </div>
        </RevealAnalysis>
      </Section>

      <RepTimer challenge={c.number} />
    </Shell>
  );
}

function RequirementList({ items }: { items: { id: string; text: string; manual?: boolean }[] }) {
  return (
    <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
      {items.map((item) => (
        <li key={item.id} className="flex flex-col gap-1 px-4 py-3 tablet:flex-row tablet:gap-4">
          <span className="shrink-0 font-mono text-xs leading-6 text-stone-500 tablet:w-20">{item.id}</span>
          <span className="leading-relaxed text-stone-800">
            <InlineCode text={item.text} />
            {item.manual && (
              <span className="ml-2 rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">manual</span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-sm font-semibold tracking-wide text-stone-500 uppercase">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function AnalysisItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-stone-900">{title}</h3>
      <div className="mt-1">{children}</div>
    </div>
  );
}
