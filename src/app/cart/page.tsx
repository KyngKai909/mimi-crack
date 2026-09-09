import type { Metadata } from "next";
import { CartClient } from "@/components/CartClient";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your order and check out.",
  robots: { index: false },
};

export default function CartPage() {
  return <CartClient />;
}
