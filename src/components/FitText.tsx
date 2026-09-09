"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

/** useLayoutEffect on the client, useEffect on the server (no SSR warning). */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Scales a single line of text so it fills its container's width exactly.
 *
 * This is what makes display type read as designed rather than merely large:
 * the line lands flush to both edges at every viewport width, instead of
 * being a clamp() guess that leaves a ragged gap on most screens.
 *
 * Measured once at a reference size and scaled by ratio, so it costs one
 * layout read per resize rather than a binary search.
 */
export function FitText({
  children,
  className = "",
  /** Fraction of container width to fill. */
  fill = 1,
  /** Never grow past this, in px — keeps a short word from becoming absurd. */
  max = 460,
}: {
  children: string;
  className?: string;
  fill?: number;
  max?: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const span = useRef<HTMLSpanElement>(null);

  const fit = useCallback(() => {
    const h = host.current;
    const s = span.current;
    if (!h || !s) return;

    const hostWidth = h.clientWidth;
    if (!hostWidth) return;
    const target = hostWidth * fill;

    // Iterate rather than scaling by a single ratio.
    //
    // Fraunces is a variable font with an optical-size axis, and browsers
    // apply `font-optical-sizing: auto` by default — so glyphs are genuinely
    // narrower at 100px than at 70px and width is *not* linear in font-size.
    // A one-shot ratio overshoots by 10-20% at small sizes, which pushes the
    // line past its container and gets it clipped. Three passes converge to
    // well under a pixel.
    let size = 100;
    for (let pass = 0; pass < 3; pass++) {
      s.style.fontSize = `${size}px`;
      // The span sizes to its own text (w-max). A block-level element would
      // report its *container's* width instead, collapsing the ratio to
      // exactly the reference size — the fit silently no-ops.
      const width = s.getBoundingClientRect().width;
      if (!width) return;
      size = Math.min(max, size * (target / width));
    }
    s.style.fontSize = `${size}px`;
  }, [fill, max]);

  // Before paint, so the reference size never flashes and the element has its
  // final height on the first frame — which also matters for the scroll
  // observers that measure it.
  useIsomorphicLayoutEffect(() => {
    fit();
  }, [fit]);

  useEffect(() => {
    // Refit once the display face actually lands — fitting against fallback
    // metrics and stopping there is the classic way this effect goes wrong.
    document.fonts?.ready.then(fit).catch(() => {});

    const ro = new ResizeObserver(fit);
    if (host.current) ro.observe(host.current);
    return () => ro.disconnect();
  }, [fit]);

  return (
    <div ref={host} className={`w-full ${className}`}>
      <span
        ref={span}
        className="block w-max whitespace-nowrap leading-[0.82]"
        // A sane pre-fit size so server markup and the first frame already
        // occupy roughly the right space.
        style={{ fontSize: "clamp(2.5rem, 11vw, 12rem)" }}
      >
        {children}
      </span>
    </div>
  );
}
