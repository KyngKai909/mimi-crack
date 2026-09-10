"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { Shot } from "./Shot";

type Step = { step: string; body: string };

/**
 * The commitment, as a pinned scene that scrolls sideways.
 *
 * Vertical scroll inside a tall spacer drives horizontal travel on a pinned
 * track. Two deliberate fallbacks, because this pattern is hostile to both
 * touch devices and anyone who gets motion sick:
 *
 *   - below lg, and under prefers-reduced-motion, it degrades to an ordinary
 *     swipeable rail with scroll-snap — same content, no hijacking.
 *
 * The section is also keyboard-reachable either way: the cards are plain
 * documents in source order, not transformed out of the tab sequence.
 */
export function CommitmentScroll({ steps }: { steps: readonly Step[] }) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const [pinned, setPinned] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  // Measure how far the track actually has to move, rather than guessing in
  // vw: a hard-coded guess leaves the last card clipped at some widths and
  // over-scrolls at others.
  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setTravel(Math.max(0, el.scrollWidth - el.clientWidth));
  }, []);

  useEffect(() => {
    if (!pinned) return;
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned, measure]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPinned(mq.matches && !still.matches);
    sync();
    mq.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  const cards = steps.map((s, i) => (
    <article
      key={s.step}
      className="flex w-[82vw] shrink-0 flex-col justify-between gap-8 rounded-[1.75rem] bg-shell p-8 sm:w-[58vw] lg:w-[38vw] lg:p-10"
      style={{ scrollSnapAlign: "center" }}
    >
      <div>
        <span className="display text-[3.5rem] leading-none text-pistachio-deep tabular-nums lg:text-[5rem]">
          {String(i + 1).padStart(2, "0")}
        </span>
        <h3 className="display display-lg mt-6">{s.step}</h3>
        <p className="prose-airy mt-5 max-w-sm">{s.body}</p>
      </div>
      <Shot label={`Step ${i + 1} — ${s.step}`} ratio="16 / 9" tone="warm" className="rounded-2xl" />
    </article>
  ));

  if (!pinned) {
    return (
      <div
        className="flex gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {cards}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ height: `${steps.length * 78}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div ref={track} className="w-full overflow-hidden">
          <div
            className="flex w-max gap-8 px-[6vw] will-change-transform"
            style={{ transform: `translate3d(${-progress * travel}px, 0, 0)` }}
          >
            {cards}
          </div>
        </div>

        {/* progress rule */}
        <div className="absolute bottom-14 left-[6vw] right-[6vw] h-px bg-ink/10">
          <div
            className="h-px bg-ink/50 transition-none"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
