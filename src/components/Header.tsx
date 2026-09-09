"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { PRODUCT, formatPrice } from "@/lib/product";

const links = [
  { href: "/product", label: "The Jar" },
  { href: "/#uses", label: "Directions" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const { quantity, ready } = useCart();
  const [open, setOpen] = useState(false);

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink bg-bone">
        <div className="grid grid-cols-[1fr_auto] items-stretch md:grid-cols-[auto_1fr_auto]">
          <Link
            href="/"
            className="invert-hover flex items-center gap-3 border-r border-ink px-4 py-3 md:px-6"
          >
            <span className="display text-xl leading-none md:text-2xl">MIMI CRACK</span>
            <span className="mono-micro hidden text-ink/50 sm:inline">®</span>
          </Link>

          <nav className="hidden items-stretch md:flex" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="invert-hover mono-label flex items-center border-r border-ink px-6"
              >
                {l.label}
              </Link>
            ))}
            <span className="mono-micro flex flex-1 items-center px-6 text-ink/45">
              {PRODUCT.size.label} · {PRODUCT.badge}
            </span>
          </nav>

          <div className="flex items-stretch">
            <Link
              href="/cart"
              className="invert-hover mono-label flex items-center gap-2 border-l border-ink px-4 md:px-6"
            >
              Cart
              <span
                className={`grid h-5 min-w-5 place-items-center px-1 text-[0.625rem] ${
                  ready && quantity > 0 ? "bg-acid text-ink" : "text-ink/40"
                }`}
              >
                {ready ? quantity : 0}
              </span>
            </Link>

            <Link
              href="/product"
              className="mono-label hidden items-center border-l border-ink bg-ink px-6 text-bone transition-colors duration-[120ms] hover:bg-acid hover:text-ink sm:flex"
            >
              Buy {formatPrice(PRODUCT.priceCents)}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="invert-hover mono-label flex items-center border-l border-ink px-4 md:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* mobile sheet */}
      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-bone pt-[3.25rem] md:hidden">
          <nav className="flex flex-col border-t border-ink" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="invert-hover display display-lg border-b border-ink px-4 py-6"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="invert-hover display display-lg border-b border-ink px-4 py-6"
            >
              Cart [{ready ? quantity : 0}]
            </Link>
          </nav>
          <div className="mt-auto border-t border-ink p-4">
            <p className="font-script text-4xl text-ink">{PRODUCT.scriptLine}</p>
          </div>
        </div>
      )}
    </>
  );
}
