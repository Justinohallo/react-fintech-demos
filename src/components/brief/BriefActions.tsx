"use client";

import Link from "next/link";
import { collapsedStore, startTimer, statusOf, useTimer } from "@/components/timer/timerStore";
import { primeAudio } from "@/components/timer/tone";

const actionClass =
  "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";

export function BriefActions({ challenge }: { challenge: string }) {
  const status = statusOf(useTimer(challenge));
  const command = `npm run attempt -- ${challenge}`;

  const startRep = () => {
    primeAudio();
    startTimer(challenge);
    collapsedStore.set(false);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <a
          href={`/challenges/${challenge}/mock`}
          target="_blank"
          rel="noopener"
          className={`${actionClass} bg-white text-stone-900 ring-1 ring-stone-300 hover:bg-stone-100`}
        >
          Open mock
          <span className="sr-only"> (opens in a new tab)</span>
          <svg aria-hidden viewBox="0 0 16 16" className="ml-1.5 size-3.5" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M6 3h7v7M13 3L4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <button type="button" onClick={startRep} className={`${actionClass} bg-teal-700 text-white hover:bg-teal-800`}>
          Start rep
        </button>
        <Link
          href={`/challenges/${challenge}/deliverable`}
          className={`${actionClass} bg-white text-stone-900 ring-1 ring-stone-300 hover:bg-stone-100`}
        >
          Attempts
        </Link>
      </div>
      {status !== "idle" && (
        <div className="mt-4 rounded-xl bg-stone-900 p-4 text-stone-100">
          <p className="text-sm text-stone-400">Rep started. Create your attempt:</p>
          <pre className="mt-1 overflow-x-auto font-mono text-sm">
            <code>{command}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
