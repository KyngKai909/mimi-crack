"use client";

/**
 * The site's one way of showing a clock: a digit column that rolls to its
 * value rather than swapping in place.
 *
 * Shared by the pre-launch teaser and the sale countdown so both read as the
 * same instrument at different sizes. It takes its type size and colour from
 * whatever wraps it, so a caller sets `display` and a font size on the span
 * around it and nothing here needs to know.
 */
function Digit({ value }: { value: number }) {
  return (
    <span
      className="relative inline-block overflow-hidden align-baseline tabular-nums"
      style={{ width: "0.62em", height: "1em" }}
      aria-hidden="true"
    >
      <span
        className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(${-value * 10}%)` }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="flex h-[1em] items-center justify-center leading-none">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

/** A two-digit number, zero-padded, on rolling columns. */
export function RollingNumber({ value }: { value: number }) {
  const [tens, ones] = String(Math.min(99, Math.max(0, value)))
    .padStart(2, "0")
    .split("")
    .map(Number);

  return (
    <>
      <Digit value={tens} />
      <Digit value={ones} />
    </>
  );
}
