/**
 * A photography slot.
 *
 * The site ships before the real photography exists, so every image is a
 * quiet tinted panel with a small caption naming the shot that belongs there.
 * Deliberately calm — it should read as considered empty space, not as a
 * broken image.
 *
 * Swapping one for a real photo is a one-line change: replace <Shot/> with
 * <Image fill className="object-cover"/> inside the same wrapper. The full
 * shot list lives in README under "Art direction".
 */
export function Shot({
  label,
  ratio = "4 / 5",
  tone = "clay",
  className = "",
}: {
  /** What belongs here, e.g. "Jar, three-quarter, soft daylight". */
  label: string;
  ratio?: string;
  tone?: "clay" | "pistachio" | "warm";
  className?: string;
}) {
  const tones = {
    clay: "bg-clay-soft",
    pistachio: "bg-pistachio-soft",
    warm: "bg-shell-warm",
  } as const;

  return (
    <div
      style={{ aspectRatio: ratio }}
      className={`relative w-full overflow-hidden ${tones[tone]} ${className}`}
      role="img"
      aria-label={`Placeholder for photography: ${label}`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 40 40"
          className="h-8 w-8 text-ink/20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <rect x="2.5" y="6.5" width="35" height="27" />
          <circle cx="13" cy="16" r="3" />
          <path d="M2.5 27l10-8 8 6 6-4 11 8" />
        </svg>
        <p className="max-w-[22ch] text-[0.72rem] leading-relaxed tracking-[0.16em] text-ink/35 uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}
