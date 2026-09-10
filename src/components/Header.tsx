"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/product", label: "The Jar" },
  { href: "/#commitment", label: "The Commitment" },
  { href: "/about", label: "About" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  const { quantity, ready } = useCart();
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-500 ${
          lifted ? "bg-shell/85 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="shell-x flex h-20 items-center justify-between gap-6 sm:h-24">
          <Link href="/" className="display text-xl leading-none sm:text-2xl">
            MiMi Crack
          </Link>

          <nav className="hidden items-center gap-10 md:flex" aria-label="Main">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="link-draw text-[0.9rem] text-ink-soft hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/cart" className="link-draw text-[0.9rem] text-ink-soft hover:text-ink">
              Cart{ready && quantity > 0 ? ` (${quantity})` : ""}
            </Link>
            <Link href="/product" className="pill pill-solid hidden sm:inline-flex">
              Shop
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="text-[0.9rem] text-ink-soft md:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-30 flex flex-col bg-shell pt-24 md:hidden">
          <nav className="shell-x flex flex-col gap-2" aria-label="Mobile">
            {[...links, { href: "/cart", label: "Cart" }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="display display-lg py-3 text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="shell-x mt-auto pb-12">
            <p className="font-script text-5xl text-pistachio-deep">Stimulates Scalp</p>
          </div>
        </div>
      )}
    </>
  );
}
