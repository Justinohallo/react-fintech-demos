import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/shell/Markdown";
import { Shell } from "@/components/shell/Shell";
import { getChallenge, type ChallengeNumber, CHALLENGE_NUMBERS } from "@/content/challenges";
import { formatScore, getReview, listReviews } from "@/lib/reviews";

// One review per reviewed rep, generated at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return listReviews().map((r) => ({ challenge: r.challenge, attempt: String(r.attempt) }));
}

async function load(params: PageProps<"/progress/[challenge]/[attempt]">["params"]) {
  const { challenge, attempt } = await params;
  const review = getReview(challenge, Number(attempt));
  if (!review || !(CHALLENGE_NUMBERS as readonly string[]).includes(challenge)) notFound();
  return { review, title: getChallenge(challenge as ChallengeNumber).title };
}

export async function generateMetadata({ params }: PageProps<"/progress/[challenge]/[attempt]">): Promise<Metadata> {
  const { review } = await load(params);
  return { title: `Review · ${review.challenge} attempt ${review.attempt}` };
}

export default async function ReviewPage({ params }: PageProps<"/progress/[challenge]/[attempt]">) {
  const { review, title } = await load(params);

  return (
    <Shell>
      <p className="text-sm text-stone-500">
        <Link href="/progress" className="underline-offset-4 hover:text-teal-800 hover:underline">
          ← Progress
        </Link>
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Review · {review.challenge} {title}, attempt {review.attempt}
      </h1>
      <p className="mt-2 text-stone-600 tabular-nums">
        {review.date} · {formatScore(review.acs)} ACs · {formatScore(review.a11y)} a11y
        {review.phase && ` · reached ${review.phase}`}
      </p>
      {review.tags.length > 0 && (
        <ul aria-label="Issue tags" className="mt-3 flex flex-wrap gap-2">
          {review.tags.map((t) => (
            <li key={t} className="rounded-full bg-stone-100 px-2.5 py-0.5 font-mono text-xs text-stone-700">
              {t}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link
          href={`/challenges/${review.challenge}/deliverable/attempt-${review.attempt}`}
          className="text-teal-800 underline underline-offset-4 hover:text-teal-950"
        >
          Open the attempt
        </Link>
        <Link
          href={`/challenges/${review.challenge}`}
          className="text-teal-800 underline underline-offset-4 hover:text-teal-950"
        >
          Challenge brief
        </Link>
      </p>
      <div className="mt-8">
        <Markdown source={review.body} />
      </div>
    </Shell>
  );
}
