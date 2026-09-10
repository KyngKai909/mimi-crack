"use client";

import { useEffect, useState } from "react";
import { timeUntilLaunch } from "@/lib/launch";

/** A digit column that rolls to its value rather than swapping in place. */
function Digit({ value }: { value: number }) {
  return (
    <span
      className="relative inline-block overflow-hidden align-baseline tabular-nums"
      style={{ width: "0.62em", height: "1em" }}
      aria-hidden="true"
    >
      <span
        className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateY(${-value * 10}%)` }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="flex h-[1em] items-center justify-center leading-none">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  const [tens, ones] = String(value).padStart(2, "0").split("").map(Number);
  return (
    <div className="flex flex-col items-center">
      <span className="display flex text-[clamp(2.15rem,min(10.5vw,13vh),8rem)] leading-none">
        <Digit value={tens} />
        <Digit value={ones} />
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
        <div key={u.label} className="flex items-start gap-4 sm:gap-12">
          {/* The separators are the first thing to go on a phone: four units
              plus three colons plus their gaps do not fit 335px, and the
              overflow is invisible because the page clips rather than
              scrolling sideways. */}
          {i > 0 && (
            <span
              aria-hidden="true"
              className="display hidden select-none text-[clamp(2.15rem,min(10.5vw,13vh),8rem)] leading-none text-ink/15 sm:inline"
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
