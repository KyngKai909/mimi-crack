import Link from "next/link";
import { CAUTIONS, PRODUCT, formatPrice } from "@/lib/product";

export function Footer() {
  return (
    <footer className="bg-forest text-shell">
      <div className="shell-x py-20 sm:py-24">
        <div className="grid gap-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="display display-lg">MiMi Crack</p>
            <p className="font-script mt-2 text-4xl text-pistachio">
              {PRODUCT.scriptLine}
            </p>
            <p className="mt-7 max-w-xs leading-relaxed text-shell/60">
              One jar, made properly. {PRODUCT.size.label} of scalp-first
              conditioning grease.
            </p>
          </div>

          <nav aria-label="Shop">
            <p className="eyebrow text-shell/45">Shop</p>
            <ul className="mt-4 sm:mt-6 sm:space-y-3.5">
              {[
                { href: "/product", label: "The Jar" },
                { href: "/cart", label: "Cart" },
                { href: "/#commitment", label: "The Commitment" },
                { href: "/about", label: "About" },
                { href: "/#faq", label: "FAQ" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="link-draw inline-flex min-h-11 items-center text-shell/80 hover:text-shell sm:min-h-0"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-shell/45">Good to know</p>
            <p className="mt-6 text-sm leading-relaxed text-shell/60">
              {CAUTIONS}
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-shell/15 pt-10">
          <Link
            href="/product"
            className="display display-lg group inline-flex min-h-11 flex-wrap items-baseline gap-x-4 gap-y-1 text-shell"
          >
            Get the jar
            <span className="text-pistachio">{formatPrice(PRODUCT.priceCents)}</span>
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-2">
              →
            </span>
          </Link>
        </div>

        <div className="mt-14 flex flex-col gap-3 text-xs text-shell/40 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} MiMi Crack</span>
            {/* Internal reference, noindex — linked so the team can find it. */}
            <Link href="/style" className="link-draw hover:text-shell/70">
              Brand guide
            </Link>
          </p>
          <p className="max-w-md sm:text-right">
            Cosmetic product. Not evaluated by the FDA and not intended to
            diagnose, treat or prevent any condition.
          </p>
        </div>
      </div>
    </footer>
  );
}
