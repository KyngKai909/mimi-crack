import Image from "next/image";

/**
 * A photography slot.
 *
 * Give it a `src` and it renders the photograph. Leave `src` off and it is a
 * quiet tinted panel captioned with the shot that belongs there — the site
 * shipped before the photography existed and some slots are still waiting.
 * Deliberately calm either way: an empty slot should read as considered space,
 * not as a broken image.
 *
 * The photo is always object-cover inside the slot's own aspect ratio, so the
 * layout never moves when a real frame replaces a placeholder. The shot list
 * lives in README under "Art direction".
 */
export function Shot({
  label,
  src,
  ratio = "4 / 5",
  tone = "clay",
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  position,
}: {
  /** What belongs here, e.g. "Jar, three-quarter, soft daylight". */
  label: string;
  /** The photograph. Without it the slot renders as a captioned placeholder. */
  src?: string;
  ratio?: string;
  tone?: "clay" | "pistachio" | "warm";
  className?: string;
  /** Set on the one image above the fold, so it isn't lazy-loaded. */
  priority?: boolean;
  sizes?: string;
  /** CSS object-position, for a frame whose subject isn't centred. */
  position?: string;
}) {
  const tones = {
    clay: "bg-clay-soft",
    pistachio: "bg-pistachio-soft",
    warm: "bg-shell-warm",
  } as const;

  if (src) {
    return (
      <div
        style={{ aspectRatio: ratio }}
        className={`relative w-full overflow-hidden ${tones[tone]} ${className}`}
      >
        <Image
          src={src}
          alt={label}
          fill
          sizes={sizes}
          priority={priority}
          style={position ? { objectPosition: position } : undefined}
          className="object-cover"
        />
      </div>
    );
  }

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
