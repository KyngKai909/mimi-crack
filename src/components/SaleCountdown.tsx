"use client";

import { useEffect, useState } from "react";
import { timeUntilSaleEnds } from "@/lib/sale";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
] as const;

/**
 * How long the sale has left, in four cells.
 *
 * Starts blank rather than guessing: the server has no idea what time it is
 * where the visitor is, and rendering its own clock would be a hydration
 * mismatch on every load. The cells hold their size while empty so nothing
 * jumps when the first tick lands.
 */
export function SaleCountdown({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const [left, setLeft] = useState<ReturnType<typeof timeUntilSaleEnds> | null>(null);

  useEffect(() => {
    const tick = () => setLeft(timeUntilSaleEnds());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const cell =
    tone === "dark"
      ? "bg-shell/10 text-shell"
      : "bg-ink/[0.045] text-ink";
  const caption = tone === "dark" ? "text-shell/45" : "text-ink-mute";

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={
        left
          ? `${left.days} days, ${left.hours} hours, ${left.minutes} minutes and ${left.seconds} seconds left in the sale`
          : "Counting down to the end of the sale"
      }
      className={`flex gap-1.5 transition-opacity duration-500 ${
        left ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {UNITS.map((u) => (
        <div
          key={u.key}
          className={`flex-1 rounded-xl px-1 py-2 text-center ${cell}`}
        >
          <span className="display block text-[1.3rem] leading-none tabular-nums sm:text-[1.5rem]">
            {String(left?.[u.key] ?? 0).padStart(2, "0")}
          </span>
          <span
            className={`mt-1.5 block text-[0.55rem] uppercase tracking-[0.16em] ${caption}`}
          >
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
