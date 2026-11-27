"use client";

import { PRODUCT, formatPrice } from "@/lib/product";
import { SALE_DEAL_LINE } from "@/lib/sale";
import { useSaleLive } from "@/lib/useSaleLive";

/**
 * The price on a "Shop the jar" call to action: the everyday one, or the
 * sale's headline deal while the sale is running.
 *
 * It's a client component so these buttons can't be left quoting $24.99 on a
 * page that was cached mid-sale, or quoting the deal after the sale closed.
 * `saleOn` comes from the server that rendered the page, so the first paint
 * matches the markup exactly.
 */
export function ShopPrice({ saleOn }: { saleOn: boolean }) {
  const on = useSaleLive(saleOn);
  return <>{on ? SALE_DEAL_LINE : formatPrice(PRODUCT.priceCents)}</>;
}
