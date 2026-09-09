"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A small square that trails the pointer and snaps open over anything
 * interactive.
 *
 * Deliberately additive: the real cursor is never hidden, so nothing breaks if
 * this fails to mount. Skipped entirely on touch and for anyone who has asked
 * for reduced motion.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;
    setEnabled(true);

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const el = e.target as HTMLElement | null;
      const hot = el?.closest("a, button, input, select, summary, [data-cursor]");
      dot.current?.classList.toggle("is-hot", Boolean(hot));
    };

    const tick = () => {
      // Lag the follower slightly behind the pointer; enough to feel alive,
      // little enough to still feel snappy.
      x += (tx - x) * 0.28;
      y += (ty - y) * 0.28;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[105] h-3 w-3 border border-ink bg-transparent mix-blend-difference transition-[width,height,background-color] duration-[120ms] [&.is-hot]:h-9 [&.is-hot]:w-9 [&.is-hot]:bg-acid"
    />
  );
}
