"use client";

import { useEffect, useRef, useState } from "react";
import { Shot } from "./Shot";

type Benefit = { title: string; body: string };

/**
 * Pinned product, scrolling copy.
 *
 * The frame holds still on the left while the claims move past it, and the
 * picture inside it changes with them — one per claim, cross-faded on the
 * same 700ms as the copy either side so the whole scene moves as one thing.
 * Pinning is plain `position: sticky` — no scroll hijacking, so the page
 * still scrolls at its natural rate and keyboard navigation is unaffected.
 *
 * All four layers are mounted and stacked; only opacity changes. Swapping the
 * visible one by index would unmount the outgoing picture mid-fade, and with
 * real photography it would also mean a fresh network request on every scroll
 * past.
 */

/** One frame per claim, in the order the claims appear. */
const SCENES = [
  { label: "Fingertip along the part — scalp, soft daylight", tone: "pistachio" },
  { label: "Strand drawn between two fingers — sheen, close", tone: "warm" },
  { label: "Comb passing through the ends, no snag", tone: "clay" },
  { label: "Finished protective style — braids or twists", tone: "pistachio" },
] as const;
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

  // Flex, not grid, below lg: a sticky grid item is confined to its own grid
  // area — one row here — so the frame would unstick the moment its row ended,
  // which is exactly when the claims start scrolling past it.
  return (
    <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
      {/* On a phone the frame is an overlay, so it needs a ground of its
          own: without one, claims scroll visibly under its rounded corners.
          The negative margin pulls that ground out to the screen edges, past
          the section's gutter, and it sits flush under the header — a gap
          between the two is a letterbox for headings to show through. */}
      <div className="sticky top-16 z-10 -mx-[clamp(1.25rem,5vw,5rem)] bg-shell px-[clamp(1.25rem,5vw,5rem)] pt-3 pb-6 sm:top-20 sm:pt-4 lg:top-0 lg:mx-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-0">
        <div className="relative">
          {/* Shorter on a phone, where a 4:5 frame stuck to the top would
              leave no room for the claim it belongs to. */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.75rem] sm:aspect-[3/2] lg:aspect-[4/5]">
            {SCENES.map((scene, i) => (
              <div
                key={scene.label}
                aria-hidden={active !== i}
                className={`absolute inset-0 transition-all duration-700 ease-soft ${
                  active === i ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"
                }`}
              >
                <Shot
                  label={scene.label}
                  ratio="4 / 5"
                  tone={scene.tone}
                  className="h-full rounded-[1.75rem]"
                />
              </div>
            ))}
          </div>
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
