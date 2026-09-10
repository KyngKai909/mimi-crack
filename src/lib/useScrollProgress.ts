"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * How far the viewport has travelled through an element, 0 → 1.
 *
 * 0 when the element's top reaches the top of the viewport, 1 when its bottom
 * does. Used to drive pinned scroll scenes.
 *
 * Returns a *callback* ref rather than an object ref on purpose: the element
 * it measures is conditionally rendered (the pinned branch only mounts on
 * large viewports, and only when motion is allowed). With an object ref the
 * effect runs once at mount, finds `.current` still null, and never attaches
 * its listeners when the element does appear.
 *
 * Reads layout inside rAF and only commits when the value actually moves, so
 * scrolling doesn't thrash React.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [progress, setProgress] = useState(0);

  const ref = useCallback((el: T | null) => setNode(el), []);

  useEffect(() => {
    if (!node) return;

    let raf = 0;
    let last = -1;

    const measure = () => {
      raf = 0;
      const rect = node.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / travel));
      // Ignore sub-pixel churn.
      if (Math.abs(p - last) < 0.0015) return;
      last = p;
      setProgress(p);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [node]);

  return { ref, progress };
}
