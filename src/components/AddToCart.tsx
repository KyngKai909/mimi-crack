"use client";

import Link from "next/link";
import { useState } from "react";
import { MAX_QUANTITY, PRODUCT, formatPrice } from "@/lib/product";
import { useCart } from "@/lib/cart";

export function AddToCart({ withQuantity = true }: { withQuantity?: boolean }) {
  const { add, justAdded } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-stretch gap-3">
        {withQuantity && (
          <div className="flex items-center rounded-full border border-ink/20">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="grid h-12 w-12 place-items-center rounded-l-full text-xl text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span
              className="w-10 text-center text-base tabular-nums"
              aria-live="polite"
              aria-label={`Quantity: ${qty}`}
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(MAX_QUANTITY, q + 1))}
              disabled={qty >= MAX_QUANTITY}
              className="grid h-12 w-12 place-items-center rounded-r-full text-xl text-ink transition-colors hover:bg-ink/5 disabled:opacity-30"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => add(qty)}
          className="flex-1 rounded-full bg-ink px-8 py-3.5 text-[0.78rem] tracking-label-sm text-cream uppercase transition-colors hover:bg-botanical-deep"
        >
          Add to cart — {formatPrice(PRODUCT.priceCents * qty)}
        </button>
      </div>

      <p
        className="min-h-5 text-sm text-botanical"
        role="status"
        aria-live="polite"
      >
        {justAdded && (
          <>
            Added.{" "}
            <Link href="/cart" className="underline underline-offset-4">
              Go to cart
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
