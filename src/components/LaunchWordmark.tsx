"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const WORD = "MiMi Crack";

/**
 * The wordmark, full width, alive.
 *
 * Fraunces is a variable font, so each letter can be animated along its own
 * axes rather than faked with transforms: letters thicken and soften as the
 * pointer nears them (`wght` and `SOFT`), and lift very slightly.
 *
 * A slow wave runs through the letters when nothing is happening. That matters
 * more than the pointer effect — on a phone there is no hover, and a static
 * wordmark on a page whose whole job is waiting would feel dead.
 *
 * Letters are per-span for animation, so the real word is exposed once to
 * assistive tech and the spans are hidden from it.
 */
export function LaunchWordmark({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);

  const fit = useCallback(() => {
    const h = host.current;
    const s = line.current;
    if (!h || !s) return;
    const target = h.clientWidth;
    if (!target) return;

    // Measure at the heaviest the animation can reach. `wght` changes glyph
    // widths, so a line fitted at rest grows past its container the moment a
    // letter thickens under the pointer.
    const spans = letters.current.filter(Boolean) as HTMLSpanElement[];
    const saved = spans.map((el) => el.style.fontVariationSettings);
    for (const el of spans) el.style.fontVariationSettings = '"wght" 900, "SOFT" 100';

    // Iterate: Fraunces has an optical-size axis too, so width is not linear
    // in font-size and a single ratio overshoots.
    let size = 100;
    for (let pass = 0; pass < 3; pass++) {
      s.style.fontSize = `${size}px`;
      const width = s.getBoundingClientRect().width;
      if (!width) break;
      size = size * (target / width);
    }
    s.style.fontSize = `${size}px`;

    spans.forEach((el, i) => { el.style.fontVariationSettings = saved[i]; });
  }, []);

  useIsoLayoutEffect(() => {
    fit();
  }, [fit]);

  useEffect(() => {
    document.fonts?.ready.then(fit).catch(() => {});
    const ro = new ResizeObserver(fit);
    if (host.current) ro.observe(host.current);
    return () => ro.disconnect();
  }, [fit]);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) return;

    const nodes = letters.current.filter(Boolean) as HTMLSpanElement[];
    if (!nodes.length) return;

    const state = nodes.map(() => ({ w: 400, s: 0, y: 0 }));
    const pointer = { x: -1, y: -1, active: false };
    let raf = 0;
    let t = 0;

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };

    const loop = () => {
      t += 0.02;
      nodes.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        // Idle wave, always running, so the mark breathes without input.
        const wave = Math.sin(t - i * 0.55);
        let targetW = 430 + wave * 90;
        let targetS = 22 + wave * 18;
        let targetY = wave * 0.012;

        if (pointer.active) {
          const d = Math.hypot(pointer.x - cx, pointer.y - cy);
          const R = Math.max(180, r.width * 3);
          if (d < R) {
            const near = 1 - d / R;
            targetW += near * 420;
            targetS += near * 70;
            targetY -= near * 0.055;
          }
        }

        const st = state[i];
        st.w += (targetW - st.w) * 0.09;
        st.s += (targetS - st.s) * 0.09;
        st.y += (targetY - st.y) * 0.09;

        el.style.fontVariationSettings = `"wght" ${st.w.toFixed(0)}, "SOFT" ${st.s.toFixed(1)}`;
        el.style.transform = `translateY(${st.y.toFixed(4)}em)`;
      });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={host} className={`w-full ${className}`} role="img" aria-label={WORD}>
      <span
        ref={line}
        aria-hidden="true"
        className="display block w-max whitespace-nowrap pb-[0.26em] leading-[0.84]"
        style={{ fontSize: "clamp(2.5rem, 12vw, 14rem)" }}
      >
        {WORD.split("").map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            ref={(el) => {
              letters.current[i] = el;
            }}
            className="inline-block will-change-transform"
            style={{ whiteSpace: ch === " " ? "pre" : undefined }}
          >
            {ch}
          </span>
        ))}
      </span>
    </div>
  );
}
