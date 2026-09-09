/**
 * An image slot standing in for photography we don't have yet.
 *
 * Designed to look deliberate rather than broken: hard rule, corner ticks,
 * a survey cross and a mono spec caption. Brutalism likes visible scaffolding,
 * so an empty slot reads as part of the system instead of a hole in it.
 *
 * Replacing one is a two-line change — swap <Slot/> for <Image/> and keep the
 * wrapper classes. Every slot on the site is listed in README under
 * "Art direction / shot list".
 */
export function Slot({
  label,
  ratio = "4 / 5",
  index,
  accent = false,
  className = "",
}: {
  /** What shot belongs here, e.g. "HERO PACKSHOT". */
  label: string;
  /** CSS aspect-ratio string. */
  ratio?: string;
  /** Optional shot number, printed top-right. */
  index?: string;
  /** Fill with acid instead of bone. */
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative w-full overflow-hidden border border-ink ${
        accent ? "bg-acid" : "bg-bone-dim"
      } ${className}`}
      role="img"
      aria-label={`Placeholder for ${label.toLowerCase()} photography`}
    >
      {/* survey cross */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full text-ink/25"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* corner ticks */}
      <span aria-hidden="true" className="absolute left-2 top-2 h-3 w-3 border-l border-t border-ink" />
      <span aria-hidden="true" className="absolute right-2 top-2 h-3 w-3 border-r border-t border-ink" />
      <span aria-hidden="true" className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-ink" />
      <span aria-hidden="true" className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-ink" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3">
        <span className="mono-micro bg-ink px-2 py-1 text-bone">IMG · {label}</span>
        <span className="mono-micro text-ink/60">{ratio.replace(/\s/g, "")}</span>
      </div>

      {index && (
        <span className="mono-micro absolute right-3 top-3 text-ink/60">{index}</span>
      )}
    </div>
  );
}
