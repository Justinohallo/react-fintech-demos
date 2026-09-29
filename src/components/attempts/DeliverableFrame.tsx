"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { RepTimer } from "@/components/timer/RepTimer";
import { shellSans } from "@/lib/fonts";

/**
 * Wraps /challenges/NN/deliverable/*. On an attempt page it adds only the
 * floating timer and a "← Attempts" link; the page itself belongs to the human.
 * The attempt index passes through untouched.
 */
export function DeliverableFrame({ challenge, children }: { challenge: string; children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  if (!segment?.startsWith("attempt-")) return <>{children}</>;

  return (
    <>
      {children}
      <Link
        href={`/challenges/${challenge}/deliverable`}
        className={`${shellSans.className} fixed bottom-4 left-4 z-[1000] rounded-full bg-stone-900 px-3 py-1.5 text-xs font-medium text-white shadow-md hover:bg-stone-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600`}
      >
        ← Attempts
      </Link>
      <RepTimer challenge={challenge} />
    </>
  );
}
