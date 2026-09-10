"use client";

import Link from "next/link";
import { useState } from "react";
import { MAX_QUANTITY, PRODUCT, formatPrice } from "@/lib/product";
import { useCart } from "@/lib/cart";

export function AddToCart({ withQuantity = true }: { withQuantity?: boolean }) {
  const { add, justAdded } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div>
      {/* Stacks on phones: the label plus the price is too long to sit
          beside the quantity picker at 375px and wraps inside the pill. */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        {withQuantity && (
          <div className="flex items-center justify-between gap-1 self-start rounded-full border border-hairline bg-paper px-2 py-1 sm:self-auto sm:justify-start">
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
              className="w-7 text-center text-[0.95rem] tabular-nums"
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

        <button
          type="button"
          onClick={() => add(qty)}
          className="pill pill-solid flex-1 whitespace-nowrap"
        >
          Add to cart
          <span aria-hidden="true" className="opacity-45">—</span>
          {formatPrice(PRODUCT.priceCents * qty)}
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
