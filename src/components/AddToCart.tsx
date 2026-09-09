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
      <div className="flex items-stretch border border-ink">
        {withQuantity && (
          <div className="flex items-stretch border-r border-ink">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="invert-hover mono-label w-11 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-ink"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span
              className="mono-label grid w-10 place-items-center border-x border-ink tabular-nums"
              aria-live="polite"
              aria-label={`Quantity: ${qty}`}
            >
              {String(qty).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(MAX_QUANTITY, q + 1))}
              disabled={qty >= MAX_QUANTITY}
              className="invert-hover mono-label w-11 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-ink"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => add(qty)}
          className="mono-label flex flex-1 items-center justify-between gap-6 bg-ink px-5 py-4 text-bone transition-colors duration-[120ms] hover:bg-acid hover:text-ink"
        >
          <span>Add to cart</span>
          <span className="tabular-nums">{formatPrice(PRODUCT.priceCents * qty)}</span>
        </button>
      </div>

      <p className="mono-micro mt-3 min-h-4 text-ink/60" role="status" aria-live="polite">
        {justAdded && (
          <>
            ✳ Added —{" "}
            <Link href="/cart" className="underline decoration-1 underline-offset-4 hover:bg-acid">
              go to cart
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
