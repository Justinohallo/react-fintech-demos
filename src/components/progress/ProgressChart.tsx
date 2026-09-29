import { formatScore, percent, type Review } from "@/lib/reviews";

// Hand-drawn SVG (SPEC.md §2: no chart libraries). AC and a11y percentage per
// rep, oldest to newest. The table on /progress is the data alternative.

const W = 640;
const H = 220;
const PAD = { top: 16, right: 16, bottom: 32, left: 40 };
const TICKS = [0, 25, 50, 75, 100];

export function ProgressChart({ reviews }: { reviews: Review[] }) {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (reviews.length === 1 ? innerW / 2 : (i / (reviews.length - 1)) * innerW);
  const y = (pct: number) => PAD.top + innerH - (pct / 100) * innerH;

  const series = [
    { key: "acs" as const, label: "ACs", stroke: "stroke-teal-600", fill: "fill-teal-600", dot: "bg-teal-600" },
    { key: "a11y" as const, label: "Accessibility", stroke: "stroke-amber-500", fill: "fill-amber-500", dot: "bg-amber-500" },
  ];

  const summary = reviews
    .map((r) => `${r.challenge} attempt ${r.attempt}: ${formatScore(r.acs)} ACs, ${formatScore(r.a11y)} accessibility`)
    .join("; ");

  return (
    <figure>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Scores by rep, oldest first. ${summary}.`}
      >
        {TICKS.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              className="stroke-stone-200"
              strokeDasharray={t === 0 ? undefined : "3 3"}
            />
            <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-stone-500 text-[20px] tablet:text-[13px] desktop:text-[11px]">
              {t}%
            </text>
          </g>
        ))}
        {reviews.map((r, i) => (
          <text
            key={`${r.challenge}-${r.attempt}`}
            x={x(i)}
            y={H - 10}
            textAnchor="middle"
            className="fill-stone-500 text-[20px] tablet:text-[13px] desktop:text-[11px]"
          >
            {r.challenge}·{r.attempt}
          </text>
        ))}
        {series.map((s) => {
          const points = reviews
            .map((r, i) => ({ i, pct: percent(r[s.key]) }))
            .filter((p): p is { i: number; pct: number } => p.pct !== null);
          return (
            <g key={s.key}>
              {points.length > 1 && (
                <polyline
                  points={points.map((p) => `${x(p.i)},${y(p.pct)}`).join(" ")}
                  fill="none"
                  strokeWidth={2}
                  className={s.stroke}
                />
              )}
              {points.map((p) => (
                <circle key={p.i} cx={x(p.i)} cy={y(p.pct)} r={4} className={s.fill} />
              ))}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 flex gap-4 text-sm text-stone-600">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            <span aria-hidden className={`size-2.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
