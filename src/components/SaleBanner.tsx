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
 * Built on the site's dark card — forest, 1.5rem corners, shell type — the
 * same one the net-weight panel uses further down the page, so it reads as
 * part of the page rather than something bolted onto it.
 *
 * `saleOn` is what the server believed when it rendered; the hook takes over
 * after hydration so a page left open past the deadline puts itself away
 * rather than advertising a price checkout will no longer honour.
 */
export function SaleBanner({ saleOn }: { saleOn: boolean }) {
  const on = useSaleLive(saleOn);
  if (!on) return null;

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] bg-forest p-7 text-shell">
      {/* The product's own green, thrown soft behind the type — the one
          flourish, and it stays under everything. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-pistachio/20 blur-3xl"
      />

      <div className="relative">
        <p className="eyebrow text-pistachio">
          {SALE_NAME}
          <span aria-hidden="true" className="px-2.5 text-shell/25">
            ·
          </span>
          <span className="text-shell/45">One week only</span>
        </p>

        <p className="display display-lg mt-5">{SALE_DEAL_LINE}</p>

        <p className="mt-3 text-[0.95rem] leading-relaxed text-shell/60">
          {SALE_SINGLE_LINE}
          <span aria-hidden="true" className="px-2 text-shell/25">
            ·
          </span>
          {SALE_TIER_NOTE}
        </p>

        <SaleCountdown className="mt-7" />

        <p className="mt-5 text-sm text-shell/40">Ends {SALE_END_LABEL}.</p>
      </div>
    </div>
  );
}
