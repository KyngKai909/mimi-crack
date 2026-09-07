"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/product", label: "The Jar" },
  { href: "/#how-to-use", label: "How to Use" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const { quantity, ready } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-[1.05rem] font-semibold tracking-label text-ink sm:text-[1.2rem]">
            MIMI CRACK
          </span>
          <span className="mt-[3px] text-[0.5rem] tracking-label-sm text-ink-faint sm:text-[0.55rem]">
            HAIR FERTILIZER
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[0.8rem] tracking-label-sm text-ink-soft uppercase transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative rounded-full border border-ink/15 px-4 py-2 text-[0.72rem] tracking-label-sm text-ink uppercase transition-colors hover:border-ink/40 hover:bg-ink/5"
            aria-label={
              ready && quantity > 0
                ? `Cart, ${quantity} ${quantity === 1 ? "jar" : "jars"}`
                : "Cart, empty"
            }
          >
            Cart
            {/* Hidden until the persisted cart is read, so the server and
                client markup match on first paint. */}
            {ready && quantity > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-botanical px-1 text-[0.65rem] font-semibold text-cream">
                {quantity}
              </span>
            )}
          </Link>
          {pathname !== "/cart" && (
            <Link
              href="/product"
              className="hidden rounded-full bg-ink px-5 py-2.5 text-[0.72rem] tracking-label-sm text-cream uppercase transition-colors hover:bg-botanical-deep sm:inline-block"
            >
              Shop
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
