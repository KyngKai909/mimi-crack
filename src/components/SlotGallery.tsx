"use client";

import { useState } from "react";
import { Slot } from "./Slot";

export type Shot = { label: string; ratio?: string };

/**
 * Product gallery over placeholder slots.
 *
 * Same shape it will have once real photography exists — swapping <Slot/> for
 * <Image/> is the only change needed.
 */
export function SlotGallery({ shots }: { shots: Shot[] }) {
  const [active, setActive] = useState(0);
  const current = shots[active];

  return (
    <div>
      <Slot
        label={current.label}
        ratio={current.ratio ?? "4 / 5"}
        index={`[ ${String(active + 1).padStart(2, "0")} / ${String(shots.length).padStart(2, "0")} ]`}
      />

      <ul className="mt-[-1px] grid grid-cols-4">
        {shots.map((shot, i) => (
          <li key={shot.label} className="min-w-0">
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View shot ${i + 1}: ${shot.label}`}
              aria-current={i === active}
              className={`mono-micro flex aspect-square w-full items-end justify-start border border-ink p-2 text-left transition-colors duration-[120ms] ${
                i === active ? "bg-ink text-bone" : "bg-bone-dim hover:bg-acid"
              } ${i > 0 ? "ml-[-1px]" : ""}`}
            >
              {String(i + 1).padStart(2, "0")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
