"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MAX_QUANTITY, PRODUCT, formatPrice } from "@/lib/product";
import { useCart } from "@/lib/cart";
import { SALE_NAME, isSaleOn, salePricing } from "@/lib/sale";
import { useSaleLive } from "@/lib/useSaleLive";

export function AddToCart({
  withQuantity = true,
  /**
   * Render the headline price above the controls, reflecting the chosen
   * quantity. The price has to live in here rather than beside it on the page,
   * because the quantity is this component's state — a server-rendered price
   * further up the page can't react to it.
   */
  withPrice = false,
  /**
   * Whether the sale was running when the server rendered this page. Seeding
   * from the server keeps the first paint's price identical to the markup;
   * the hook then follows the clock, so a tab left open past the deadline
   * stops quoting a price checkout will no longer honour.
   */
  saleOn,
}: {
  withQuantity?: boolean;
  withPrice?: boolean;
  saleOn?: boolean;
}) {
  const { add, justAdded } = useCart();
  const [qty, setQty] = useState(1);
  const live = useSaleLive(saleOn ?? isSaleOn());
  const pricing = useMemo(
    () => salePricing(qty, PRODUCT.priceCents, live),
    [qty, live],
  );

  return (
    <div>
      {withPrice && (
        <div className="mb-8">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="display text-5xl tabular-nums" aria-live="polite">
              {formatPrice(pricing.totalCents)}
            </p>
            {/* The everyday price stays visible beside the sale one, struck
                through, so the discount is shown rather than asserted. */}
            {pricing.onSale && (
              <p className="text-xl tabular-nums text-ink-mute line-through">
                <span className="sr-only">Usually </span>
                {formatPrice(pricing.listTotalCents)}
              </p>
            )}
          </div>

          {pricing.onSale && (
            <p className="mt-3.5 inline-flex items-center rounded-full bg-ink px-3.5 py-1.5 text-[0.62rem] uppercase tracking-[0.16em] text-shell">
              {SALE_NAME} · save {formatPrice(pricing.savingsCents)}
            </p>
          )}

          {/* Only worth saying once the total stops matching the unit price. */}
          {qty > 1 && (
            <p className="mt-2.5 text-sm text-ink-mute">
              {qty} jars · {formatPrice(pricing.unitCents)} each
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 sm:gap-4">
        {withQuantity && (
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-hairline bg-paper px-2 py-1">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="grid h-10 w-10 place-items-center rounded-full text-lg text-ink transition-colors duration-300 hover:bg-shell-warm disabled:opacity-25 disabled:hover:bg-transparent"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span
              className="w-6 text-center text-[0.95rem] tabular-nums"
              aria-live="polite"
              aria-label={`Quantity: ${qty}`}
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(MAX_QUANTITY, q + 1))}
              disabled={qty >= MAX_QUANTITY}
              className="grid h-10 w-10 place-items-center rounded-full text-lg text-ink transition-colors duration-300 hover:bg-shell-warm disabled:opacity-25 disabled:hover:bg-transparent"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )}

        {/* Label stays short so it never wraps beside the quantity picker at
            phone widths — the price is shown above instead. */}
        <button
          type="button"
          onClick={() => add(qty)}
          className="pill pill-solid flex-1 whitespace-nowrap"
        >
          Add to cart
        </button>
      </div>

      <p className="mt-4 min-h-5 text-sm text-ink-soft" role="status" aria-live="polite">
        {justAdded && (
          <>
            Added.{" "}
            <Link href="/cart" className="link-draw text-ink">
              Go to cart
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
