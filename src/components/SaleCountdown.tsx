"use client";

import { useEffect, useState } from "react";
import { timeUntilSaleEnds } from "@/lib/sale";
import { RollingNumber } from "./RollingNumber";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
] as const;

/**
 * How long the sale has left, in four cells, on the same rolling digits as
 * the pre-launch teaser's clock.
 *
 * Starts blank rather than guessing: the server has no idea what time it is
 * where the visitor is, and rendering its own clock would be a hydration
 * mismatch on every load. The cells hold their size while empty so nothing
 * jumps when the first tick lands.
 *
 * Only ever drawn on the dark cards, so it takes the forest surface for
 * granted and tints itself in shell.
 */
export function SaleCountdown({ className = "" }: { className?: string }) {
  const [left, setLeft] = useState<ReturnType<typeof timeUntilSaleEnds> | null>(null);

  useEffect(() => {
    const tick = () => setLeft(timeUntilSaleEnds());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={
        left
          ? `${left.days} days, ${left.hours} hours, ${left.minutes} minutes and ${left.seconds} seconds left in the sale`
          : "Counting down to the end of the sale"
      }
      className={`flex gap-2 transition-opacity duration-700 ${
        left ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {UNITS.map((u) => (
        <div
          key={u.key}
          className="flex flex-1 flex-col items-center rounded-2xl bg-shell/[0.07] px-1 py-3"
        >
          <span className="display flex text-[1.45rem] leading-none text-shell">
            <RollingNumber value={left?.[u.key] ?? 0} />
          </span>
          <span className="eyebrow mt-2 text-[0.55rem] tracking-[0.14em] text-shell/45">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
