"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const WORD = "MiMi Crack";

/**
 * The wordmark: full width, and then still.
 *
 * Letters rise into place once, staggered, from behind a mask — and after
 * that nothing moves. An earlier version animated each letter's weight under
 * the cursor, which read as fidgeting rather than presence. The scale and the
 * space around it do the work; the seed field carries the interactivity.
 */
export function LaunchWordmark({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  const fit = useCallback(() => {
    const h = host.current;
    const s = line.current;
    if (!h || !s) return;
    // Sub-pixel rounding across ten inline-block letters accumulates, so aim
    // a hair under the container rather than exactly at it.
    const target = h.clientWidth * 0.995;
    if (!target) return;
    // Iterate: Fraunces has an optical-size axis, so glyph width is not linear
    // in font-size and a single ratio overshoots.
    let size = 100;
    for (let pass = 0; pass < 3; pass++) {
      s.style.fontSize = `${size}px`;
      const width = s.getBoundingClientRect().width;
      if (!width) break;
      size = size * (target / width);
    }
    // Width is only half the constraint. On a short laptop screen a
    // width-fitted mark pushes the countdown and the form below the fold, so
    // cap it against viewport height too and let width win on tall screens.
    const LEADING = 0.86;
    const maxByHeight = (window.innerHeight * 0.24) / LEADING;
    s.style.fontSize = `${Math.min(size, maxByHeight)}px`;
  }, []);

  useIsoLayoutEffect(() => {
    fit();
  }, [fit]);

  useEffect(() => {
    document.fonts?.ready.then(fit).catch(() => {});
    const ro = new ResizeObserver(fit);
    if (host.current) ro.observe(host.current);
    // The height cap depends on the viewport, which a container observer
    // won't always see change (rotating a phone, opening dev tools).
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [fit]);

  return (
    <div ref={host} className={`w-full ${className}`} role="img" aria-label={WORD}>
      <span
        ref={line}
        aria-hidden="true"
        // mx-auto matters: when the height cap wins over the width fit — on a
        // wide, short screen — the line is narrower than its container, and a
        // w-max block would sit flush left with all the slack on the right.
        className="display mx-auto block w-max whitespace-nowrap leading-[0.86]"
        style={{ fontSize: "clamp(2.5rem, 12vw, 14rem)", fontWeight: 600 }}
      >
        {WORD.split("").map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            // Each letter gets its own mask so it can rise independently.
            // pb/-mb keeps descender room inside the mask without adding space.
            className="inline-block overflow-hidden pb-[0.26em] align-bottom -mb-[0.26em]"
            style={{ whiteSpace: ch === " " ? "pre" : undefined }}
          >
            <span
              className="wordmark-letter inline-block"
              style={{ animationDelay: `${120 + i * 65}ms` }}
            >
              {ch}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}
