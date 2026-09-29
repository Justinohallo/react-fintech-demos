import Link from "next/link";
import { shellSans } from "@/lib/fonts";

export const FICTION_NOTICE = "Kestrel is a fictional company. Designs and data are invented for practice.";

/** App chrome for the index, framework, brief and attempt-index pages. Mocks and attempts have none. */
export function Shell({ children, footer = false }: { children: React.ReactNode; footer?: boolean }) {
  return (
    <div className={`${shellSans.className} min-h-screen bg-stone-50 text-stone-900`}>
      <header className="border-b border-stone-200 bg-white/70">
        <nav aria-label="Site" className="mx-auto flex max-w-[720px] items-center justify-between px-5 py-4 text-sm">
          <Link href="/" className="font-semibold tracking-tight hover:text-teal-800">
            Kestrel practice set
          </Link>
          <span className="flex gap-4 tablet:gap-5">
            <Link href="/guides" className="text-stone-600 underline-offset-4 hover:text-teal-800 hover:underline">
              Guides
            </Link>
            <Link href="/progress" className="text-stone-600 underline-offset-4 hover:text-teal-800 hover:underline">
              Progress
            </Link>
            <Link href="/framework" className="text-stone-600 underline-offset-4 hover:text-teal-800 hover:underline">
              Framework
            </Link>
          </span>
        </nav>
      </header>
      <main className="mx-auto max-w-[720px] px-5 pt-10 pb-40">{children}</main>
      {footer && (
        <footer className="mx-auto max-w-[720px] border-t border-stone-200 px-5 py-6 text-sm text-stone-500">
          {FICTION_NOTICE}
        </footer>
      )}
    </div>
  );
}
