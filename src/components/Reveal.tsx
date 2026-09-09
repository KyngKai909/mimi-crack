"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-triggered reveal — a slow rise, or a masked line wipe.
 *
 * IntersectionObserver rather than a scroll library: these fire once on
 * arrival and never animate out, so there's nothing to gain from tying them
 * to scroll position. Unobserves after firing.
 */
export function Reveal({
  children,
  delay = 0,
  line = false,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  /** Milliseconds. */
  delay?: number;
  /** Masked line wipe. The child must be a block-level element. */
  line?: boolean;
  as?: "div" | "span" | "li" | "section" | "p";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Old browser, or a non-DOM environment: just show it.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }

    // Anything already on screen at mount is shown immediately. Without this,
    // an element whose height is still being computed (fitted display type,
    // for one) has zero area, can never cross a non-zero threshold, and stays
    // masked forever.
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
      className={`${line ? "reveal-line overflow-hidden" : "reveal"} ${className}`}
    >
      {children}
    </Tag>
  );
}
