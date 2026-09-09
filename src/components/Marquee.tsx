/**
 * Full-bleed infinite marquee band.
 *
 * The track holds the run twice and animates to -50%, so the loop lands
 * exactly on the seam. Pauses on hover; static under prefers-reduced-motion.
 */
export function Marquee({
  items,
  duration = 28,
  accent = false,
  reverse = false,
}: {
  items: string[];
  /** Seconds for one full pass. */
  duration?: number;
  accent?: boolean;
  reverse?: boolean;
}) {
  const run = [...items, ...items];

  return (
    <div
      aria-hidden="true"
      className={`marquee overflow-hidden border-y border-ink py-3 ${
        accent ? "bg-acid text-ink" : "bg-ink text-bone"
      }`}
    >
      <div
        className="marquee-track"
        style={{
          ["--marquee-duration" as string]: `${duration}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {run.map((item, i) => (
          <span key={i} className="mono-label flex shrink-0 items-center gap-8 px-5">
            {item}
            <span className={accent ? "text-ink/40" : "text-bone/40"}>✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
