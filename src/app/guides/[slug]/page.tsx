import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/shell/Markdown";
import { Shell } from "@/components/shell/Shell";
import { REVIEW_TAGS } from "@/content/reviewTags";
import { getGuide, listGuides, listUnits, neighbours } from "@/lib/guides";

// One page per guide file, generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return listGuides().map((g) => ({ slug: g.slug }));
}

async function load(params: PageProps<"/guides/[slug]">["params"]) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  return guide;
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const guide = await load(params);
  return { title: guide.title, description: guide.summary };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const guide = await load(params);
  const { previous, next } = neighbours(guide.slug);
  const unitNumber = listUnits().findIndex((u) => u.name === guide.unit) + 1;

  return (
    <Shell>
      <p className="text-sm text-stone-500">
        <Link href="/guides" className="underline-offset-4 hover:text-teal-800 hover:underline">
          ← Guides
        </Link>
        <span aria-hidden> · </span>
        Unit {unitNumber}: {guide.unit}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{guide.title}</h1>
      <p className="mt-2 text-lg text-stone-600">{guide.summary}</p>

      {guide.addresses.length > 0 && (
        <div className="mt-4 text-sm text-stone-600">
          <p>Helps with these review issues:</p>
          <ul aria-label="Review issues this guide addresses" className="mt-2 flex flex-wrap gap-2">
            {guide.addresses.map((t) => (
              <li
                key={t}
                title={REVIEW_TAGS[t]}
                className="rounded-full bg-stone-100 px-2.5 py-0.5 font-mono text-xs text-stone-700"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <Markdown source={guide.body} />
      </div>

      <nav aria-label="Guide sequence" className="mt-12 flex flex-col gap-3 border-t border-stone-200 pt-6 tablet:flex-row tablet:justify-between">
        {previous ? (
          <Link href={`/guides/${previous.slug}`} className="text-teal-800 underline underline-offset-4 hover:text-teal-950">
            ← {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/guides/${next.slug}`} className="text-teal-800 underline underline-offset-4 hover:text-teal-950 tablet:text-right">
            {next.title} →
          </Link>
        )}
      </nav>
    </Shell>
  );
}
