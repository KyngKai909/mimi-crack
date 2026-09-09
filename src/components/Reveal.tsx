"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-triggered reveal.
 *
 * IntersectionObserver rather than a scroll library: the motion here is a
 * short snap on arrival, not continuous choreography, so there's nothing to
 * gain from tying it to scroll position. Unobserves after firing — these
 * never animate out.
 *
 * `clip` wraps children in a masked wipe; the child must be a block element.
 */
export function Reveal({
  children,
  delay = 0,
  clip = false,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  /** Milliseconds. */
  delay?: number;
  clip?: boolean;
  as?: "div" | "span" | "li" | "section";
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (or an old browser): show it and move on.
    if (typeof IntersectionObserver === "undefined") {
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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
      className={`${clip ? "reveal-clip overflow-hidden" : "reveal"} ${className}`}
    >
      {children}
    </Tag>
  );
}
