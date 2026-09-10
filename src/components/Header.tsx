"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { BagIcon, CloseIcon, JarIcon, MenuIcon } from "./Icons";

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

  const count = ready ? quantity : 0;
  const cartLabel = count > 0 ? `Cart, ${count} ${count === 1 ? "jar" : "jars"}` : "Cart, empty";

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-500 ${
          lifted ? "bg-shell/85 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="shell-x flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link href="/" className="display text-xl leading-none sm:text-2xl">
            MiMi Crack
          </Link>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
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

          {/* Three controls, all at least 44px tall so they're comfortable to
              hit, with real space between them. Icon-only on phones; the menu
              button keeps its word so the group doesn't read as a puzzle. */}
          <div className="flex items-center gap-0.5 lg:gap-2">
            <Link
              href="/product"
              aria-label="Shop the jar"
              className="icon-btn lg:hidden"
            >
              <JarIcon />
            </Link>

            <Link href="/cart" aria-label={cartLabel} className="icon-btn lg:hidden">
              <BagIcon />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full bg-forest px-1 text-[0.65rem] leading-none text-shell tabular-nums">
                  {count}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="icon-btn gap-1.5 px-2.5 text-[0.8rem] tracking-[0.08em] uppercase lg:hidden"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
              <span>{open ? "Close" : "Menu"}</span>
            </button>

            {/* Desktop keeps words — there's room for them. */}
            <Link
              href="/cart"
              aria-label={cartLabel}
              className="icon-btn hidden gap-2 px-4 text-[0.9rem] text-ink-soft hover:text-ink lg:inline-flex"
            >
              <BagIcon />
              <span>Cart{count > 0 ? ` (${count})` : ""}</span>
            </Link>

            <Link href="/product" className="pill pill-sm pill-solid hidden lg:inline-flex">
              <JarIcon />
              Shop
            </Link>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-shell pt-16 sm:pt-20 lg:hidden">
          <nav className="shell-x flex flex-col py-4" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="display display-lg border-b border-hairline py-5"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="display display-lg border-b border-hairline py-5"
            >
              Cart{count > 0 ? ` (${count})` : ""}
            </Link>
          </nav>
          <div className="shell-x mt-auto py-10">
            <Link
              href="/product"
              onClick={() => setOpen(false)}
              className="pill pill-solid w-full"
            >
              <JarIcon />
              Shop the jar
            </Link>
            <p className="font-script mt-8 text-4xl text-pistachio-deep">
              Stimulates Scalp
            </p>
          </div>
        </div>
      )}
    </>
  );
}
