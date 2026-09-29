import Link from "next/link";

/** Full-bleed wrapper for a reference mock: no chrome except a small floating "← Brief" link. */
export function MockFrame({ challenge, children }: { challenge: string; children: React.ReactNode }) {
  return (
    <>
      {children}
      <Link
        href={`/challenges/${challenge}`}
        className="fixed bottom-3 left-3 z-[1000] rounded-full bg-black/70 px-3 py-1.5 font-sans text-xs font-medium text-white shadow-md backdrop-blur hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >
        ← Brief
      </Link>
    </>
  );
}
