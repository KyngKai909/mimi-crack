"use client";

import { useEffect, useState } from "react";
import { timeUntilLaunch } from "@/lib/launch";
import { RollingNumber } from "./RollingNumber";

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="display flex text-[clamp(1.9rem,min(10.5vw,12vh),7.5rem)] leading-none">
        <RollingNumber value={value} />
      </span>
      <span className="eyebrow mt-2.5 text-[0.55rem] tracking-[0.14em] sm:mt-3 sm:text-[0.7rem] sm:tracking-[0.22em]">
        {label}
      </span>
    </div>
  );
}

export function LaunchCountdown() {
  // null until mounted: the server has no idea what "now" is on the client,
  // and rendering a guess would be a hydration mismatch every single load.
  const [left, setLeft] = useState<ReturnType<typeof timeUntilLaunch> | null>(null);

  useEffect(() => {
    const tick = () => setLeft(timeUntilLaunch());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: left?.days ?? 0, label: "Days" },
    { value: left?.hours ?? 0, label: "Hours" },
    { value: left?.minutes ?? 0, label: "Minutes" },
    { value: left?.seconds ?? 0, label: "Seconds" },
  ];

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={
        left
          ? `${left.days} days, ${left.hours} hours, ${left.minutes} minutes and ${left.seconds} seconds until launch`
          : "Counting down to launch"
      }
      className={`flex items-start justify-center gap-3 transition-opacity duration-700 sm:gap-10 ${
        left ? "opacity-100" : "opacity-0"
      }`}
    >
      {units.map((u, i) => (
        <div key={u.label} className="flex items-start gap-2 sm:gap-8 lg:gap-12">
          {/* Separators stay at every width. They only fit on a phone
              because the gaps either side of them shrink to match — four
              units plus three colons at desktop spacing overflows 375px, and
              the page clips rather than scrolling, so it fails silently. */}
          {i > 0 && (
            <span
              aria-hidden="true"
              className="display select-none text-[clamp(1.9rem,min(10.5vw,12vh),7.5rem)] leading-none text-ink/20"
            >
              :
            </span>
          )}
          <Unit value={u.value} label={u.label} />
        </div>
      ))}
    </div>
  );
}
