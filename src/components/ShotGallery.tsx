"use client";

import { useState } from "react";
import { Shot } from "./Shot";

export type ShotSpec = {
  label: string;
  src?: string;
  tone?: "clay" | "pistachio" | "warm";
};

/**
 * Product gallery. Square main frame, four square thumbnails under it.
 *
 * Every frame is a <Shot/>, so a slot without a photograph yet stays a
 * captioned panel and the gallery keeps working around it.
 */
export function ShotGallery({ shots }: { shots: ShotSpec[] }) {
  const [active, setActive] = useState(0);
  const current = shots[active];

  return (
    <div>
      <Shot
        label={current.label}
        src={current.src}
        tone={current.tone ?? "pistachio"}
        ratio="1 / 1"
        className="rounded-[1.75rem]"
        priority
        sizes="(min-width: 1024px) 45vw, 100vw"
      />

      <ul className="mt-4 grid grid-cols-4 gap-3">
        {shots.map((shot, i) => (
          <li key={shot.label}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View shot ${i + 1}: ${shot.label}`}
              aria-current={i === active}
              className={`w-full overflow-hidden rounded-2xl transition-all duration-500 ${
                i === active
                  ? "ring-2 ring-forest ring-offset-4 ring-offset-shell"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Shot
                label=""
                src={shot.src}
                tone={shot.tone ?? "clay"}
                ratio="1 / 1"
                sizes="(min-width: 1024px) 11vw, 22vw"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
