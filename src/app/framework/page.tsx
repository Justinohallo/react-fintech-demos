import type { Metadata } from "next";
import Link from "next/link";
import { Shell } from "@/components/shell/Shell";
import { guidesForStep, type WorksheetStep } from "@/lib/guides";

export const metadata: Metadata = { title: "The method" };

// SPEC.md §5, rendered faithfully.

const PHASE_ROWS = [
  ["0–5", "Read and plan", "Regions named, component tree said out loud, tokens pulled, questions asked"],
  ["5–15", "Skeleton", "Every region on screen as a box, laid out at all three tiers"],
  ["15–40", "Components and data", "Real content rendered from data, not hard-coded strings"],
  ["40–50", "Interaction and states", "The one core interaction works by mouse and keyboard; hover, focus, empty, error states exist"],
  ["50–60", "Polish and walkthrough", "Largest visual gaps closed; closing statement given"],
] as const;

export default function FrameworkPage() {
  return (
    <Shell>
      <h1 className="text-3xl font-semibold tracking-tight">The method</h1>

      <H2>The rep, in five phases</H2>
      <div role="region" aria-label="The rep, in five phases" tabIndex={0} className="relative overflow-x-auto rounded-xl border border-stone-200 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-600">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">Minutes</th>
              <th scope="col" className="px-4 py-2 font-medium">Phase</th>
              <th scope="col" className="px-4 py-2 font-medium">Done when</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {PHASE_ROWS.map(([minutes, phase, done]) => (
              <tr key={phase} className="align-top">
                <td className="px-4 py-3 font-mono whitespace-nowrap text-stone-500 tabular-nums">{minutes}</td>
                <td className="px-4 py-3 font-semibold">{phase}</td>
                <td className="px-4 py-3 text-stone-700">{done}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2>Analysing a view (the 5-minute worksheet)</H2>
      <ol className="list-decimal space-y-3 pl-5 leading-relaxed text-stone-800 marker:text-stone-400">
        <li>
          <strong>Regions.</strong> Draw boxes over the image. Name each box as a component. Nest them. That list is
          your file plan.
          <StepGuides step="regions" />
        </li>
        <li>
          <strong>Tokens.</strong>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Background and surface colours, text colours (primary, muted), one accent, and status colours.</li>
            <li>Spacing: find the base unit, then check that the gaps are multiples of it.</li>
            <li>Type: count distinct sizes and weights. It is usually three or four.</li>
            <li>Radius and shadow.</li>
            <li>
              Breakpoints: what changes at <Code>tablet:</Code> (768) and at <Code>desktop:</Code> (1280)? Name the
              layout at each tier.
            </li>
            <li>Map each to a Tailwind value before writing markup.</li>
          </ul>
          <StepGuides step="tokens" />
        </li>
        <li>
          <strong>Data shape.</strong> What repeats? The repeating thing is an array, and its fields are your props.
          Write the shape before the JSX.
          <StepGuides step="data" />
        </li>
        <li>
          <strong>State.</strong> What changes when the user acts? Name each piece of state and who owns it. Derive
          everything else.
          <StepGuides step="state" />
        </li>
        <li>
          <strong>States the image does not show.</strong> Empty, loading, error, overflow, long names, negative
          amounts, zero.
          <StepGuides step="states" />
        </li>
        <li>
          <strong>Questions to ask out loud.</strong>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>What must work at each tier, and what can collapse or hide on mobile?</li>
            <li>Which interactions matter most?</li>
            <li>Is the data static or should I model it?</li>
            <li>Can I use the platform&rsquo;s native controls?</li>
          </ul>
          <StepGuides step="questions" />
        </li>
      </ol>

      <H2>Narration cues</H2>
      <p className="leading-relaxed text-stone-800">
        Say the decision, then the reason. For example: &ldquo;Grid here because the columns align across
        rows.&rdquo; &ldquo;I&rsquo;m deriving the total rather than storing it, so it can&rsquo;t drift.&rdquo; When
        you skip something, say you are skipping it and what it would take.
      </p>

      <H2>Closing statement (last two minutes)</H2>
      <ol className="list-decimal space-y-1 pl-5 leading-relaxed text-stone-800 marker:text-stone-400">
        <li>What is done, measured against the brief.</li>
        <li>What is not done, and in what order you would do it.</li>
        <li>
          What you would add before this shipped: accessibility pass, tests, error states, feature flag and progressive
          rollout.
        </li>
      </ol>

      <H2>Traps</H2>
      <ul className="list-disc space-y-1 pl-5 leading-relaxed text-stone-800 marker:text-stone-400">
        <li>Starting with the most detailed region.</li>
        <li>Hard-coding strings that are clearly data.</li>
        <li>Pixel-pushing before every region exists.</li>
        <li>Silence for more than a minute.</li>
        <li>Storing derived values as state.</li>
        <li>Building the desktop layout first and squeezing it down.</li>
        <li>
          Reaching for <Code>md:</Code> or <Code>lg:</Code>, which produce no CSS in this set.
        </li>
        <li>
          A clickable <Code>div</Code> where a <Code>button</Code> belongs.
        </li>
      </ul>
    </Shell>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 mb-3 text-xl font-semibold tracking-tight">{children}</h2>;
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[0.85em] text-stone-800">{children}</code>;
}

/** Links a worksheet step to the guides that expand it (SPEC.md §3). */
function StepGuides({ step }: { step: WorksheetStep }) {
  const guides = guidesForStep(step);
  if (guides.length === 0) return null;
  return (
    <span className="mt-1 block text-sm">
      {guides.map((g) => (
        <Link key={g.slug} href={`/guides/${g.slug}`} className="mr-4 text-teal-800 underline underline-offset-4 hover:text-teal-950">
          Guide: {g.title} →
        </Link>
      ))}
    </span>
  );
}
