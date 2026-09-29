"use client";

import { useState } from "react";

type Step = "hidden" | "confirming" | "revealed";

/** The analysis is not rendered until the confirm step is passed. */
export function RevealAnalysis({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("hidden");

  if (step === "revealed") return <div className="mt-4">{children}</div>;

  if (step === "confirming") {
    return (
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-amber-900">Finish your own 5-minute analysis first. Reveal anyway?</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setStep("revealed")}
            className="rounded-lg bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Reveal anyway
          </button>
          <button
            type="button"
            autoFocus
            onClick={() => setStep("hidden")}
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-stone-900 ring-1 ring-stone-300 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Not yet
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setStep("confirming")}
      className="mt-4 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-stone-900 ring-1 ring-stone-300 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
    >
      Reveal reference analysis
    </button>
  );
}
