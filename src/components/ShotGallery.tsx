"use client";

import { useState } from "react";
import { Shot } from "./Shot";

export type ShotSpec = { label: string; tone?: "clay" | "pistachio" | "warm" };

/**
 * Product gallery over placeholder slots.
 *
 * Same shape it will have once real photography exists — swapping <Shot/> for
 * <Image fill className="object-cover"/> is the only change needed.
 */
export function ShotGallery({ shots }: { shots: ShotSpec[] }) {
  const [active, setActive] = useState(0);
  const current = shots[active];

  return (
    <div>
      <Shot
        label={current.label}
        tone={current.tone ?? "pistachio"}
        ratio="1 / 1"
        className="rounded-[1.75rem]"
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
              <Shot label="" tone={shot.tone ?? "clay"} ratio="1 / 1" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
