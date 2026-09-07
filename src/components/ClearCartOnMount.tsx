"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

/** Empties the cart once payment has actually succeeded. */
export function ClearCartOnMount() {
  const { remove, ready, quantity } = useCart();

  useEffect(() => {
    if (ready && quantity > 0) remove();
  }, [ready, quantity, remove]);

  return null;
}
