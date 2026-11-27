"use client";

import {
  SALE_DEAL_LINE,
  SALE_END_LABEL,
  SALE_NAME,
  SALE_SINGLE_LINE,
  SALE_TIER_NOTE,
} from "@/lib/sale";
import { useSaleLive } from "@/lib/useSaleLive";
import { SaleCountdown } from "./SaleCountdown";

/**
 * The sale, stated on the product page directly above the buy controls.
 *
 * `saleOn` is what the server believed when it rendered; the hook takes over
 * after hydration so a page left open past the deadline puts itself away
 * rather than advertising a price checkout will no longer honour.
 */
export function SaleBanner({ saleOn }: { saleOn: boolean }) {
  const on = useSaleLive(saleOn);
  if (!on) return null;

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-ink px-6 py-6 text-shell sm:px-7">
      {/* The one spot of colour, kept soft so the type stays the loudest
          thing in the block. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-pistachio/25 blur-3xl"
      />

      <div className="relative">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6rem] uppercase tracking-[0.2em] text-pistachio">
          {SALE_NAME}
          <span aria-hidden="true" className="text-shell/25">
            ·
          </span>
          <span className="text-shell/55">One week only</span>
        </p>

        <p className="display mt-4 text-[clamp(1.9rem,8vw,2.6rem)] leading-none">
          {SALE_DEAL_LINE}
        </p>
        <p className="mt-2.5 text-[0.95rem] text-shell/65">
          {SALE_SINGLE_LINE}{" "}
          <span aria-hidden="true" className="text-shell/25">
            ·
          </span>{" "}
          {SALE_TIER_NOTE}
        </p>

        <SaleCountdown className="mt-6" />

        <p className="mt-4 text-xs text-shell/45">Ends {SALE_END_LABEL}.</p>
      </div>
    </div>
  );
}
