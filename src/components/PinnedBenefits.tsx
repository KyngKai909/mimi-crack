"use client";

import { useEffect, useRef, useState } from "react";
import { Shot } from "./Shot";

type Benefit = { title: string; body: string };

/**
 * Pinned product, scrolling copy.
 *
 * The jar holds still on the left while the claims move past it, and the
 * pinned side tracks which claim is in view. Pinning is plain `position:
 * sticky` — no scroll hijacking, so the page still scrolls at its natural
 * rate and keyboard navigation is unaffected.
 */
export function PinnedBenefits({ benefits }: { benefits: readonly Benefit[] }) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = items.current.indexOf(e.target as HTMLLIElement);
          if (i !== -1) setActive(i);
        }
      },
      // A narrow band across the middle of the viewport: whichever claim is
      // centred is the active one.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const el of items.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <div className="relative">
          <Shot
            label="Jar in hand — soft daylight"
            ratio="4 / 5"
            tone="pistachio"
            className="rounded-[1.75rem]"
          />
          {/* Active index, sitting over the corner of the image. */}
          <div className="absolute -bottom-5 -left-3 flex items-baseline gap-3 rounded-full bg-shell px-6 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <span className="display text-3xl tabular-nums">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="eyebrow">/ {String(benefits.length).padStart(2, "0")}</span>
          </div>
        </div>
      </div>

      <ol className="lg:py-[28vh]">
        {benefits.map((b, i) => (
          <li
            key={b.title}
            ref={(el) => {
              items.current[i] = el;
            }}
            className="hairline py-12 first:border-t-0 first:pt-0 lg:py-20"
          >
            <p
              className={`eyebrow transition-colors duration-700 ${
                active === i ? "text-pistachio-deep" : ""
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3
              className={`display display-xl mt-5 transition-opacity duration-700 ${
                active === i ? "opacity-100" : "lg:opacity-35"
              }`}
            >
              {b.title}
            </h3>
            <p
              className={`prose-airy mt-6 max-w-md transition-opacity duration-700 ${
                active === i ? "opacity-100" : "lg:opacity-35"
              }`}
            >
              {b.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
