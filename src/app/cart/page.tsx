import type { Metadata } from "next";
import { CartClient } from "@/components/CartClient";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your order and check out.",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <CartClient />
    </div>
  );
}
