"use client";

import { useEffect, useState } from "react";
import { isSaleOn } from "./sale";

/**
 * Whether the sale is live, right now, on the client.
 *
 * `initial` is what the server decided when it rendered the HTML. These pages
 * are static and revalidate on a timer, so the markup can be minutes behind
 * the clock — long enough for a page to still be offering sale prices after
 * the sale has closed. Seeding from the server keeps hydration honest, and
 * the effect corrects it within half a minute.
 *
 * Checkout prices the order again on the server either way, so this governs
 * what a visitor is shown, never what they are charged.
 */
export function useSaleLive(initial: boolean) {
  const [on, setOn] = useState(initial);

  useEffect(() => {
    const tick = () => setOn(isSaleOn());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return on;
}
