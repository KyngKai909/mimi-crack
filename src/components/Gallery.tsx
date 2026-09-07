"use client";

import Image from "next/image";
import { useState } from "react";

export type Shot = { src: string; alt: string };

export function Gallery({ shots }: { shots: Shot[] }) {
  const [active, setActive] = useState(0);
  const current = shots[active];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-parchment ring-1 ring-ink/10">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 1024px) 92vw, 34rem"
          className="object-contain"
        />
      </div>

      <ul className="grid grid-cols-4 gap-3">
        {shots.map((shot, i) => (
          <li key={shot.src}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}: ${shot.alt}`}
              aria-current={i === active}
              className={`relative block aspect-square w-full overflow-hidden rounded-xl bg-parchment ring-1 transition-all ${
                i === active
                  ? "ring-2 ring-botanical"
                  : "ring-ink/10 hover:ring-ink/30"
              }`}
            >
              <Image
                src={shot.src}
                alt=""
                fill
                sizes="8rem"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
