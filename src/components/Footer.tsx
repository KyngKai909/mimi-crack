import Link from "next/link";
import { PRODUCT, formatPrice } from "@/lib/product";
import { Marquee } from "./Marquee";

export function Footer() {
  return (
    <footer className="border-t border-ink">
      <Marquee
        items={["MIMI CRACK", "HAIR FERTILIZER", PRODUCT.size.label, PRODUCT.badge]}
        duration={34}
        reverse
      />

      <div className="grid border-b border-ink md:grid-cols-[1.6fr_1fr_1fr]">
        <div className="border-b border-ink p-6 md:border-b-0 md:border-r md:p-10">
          <p className="display display-lg">MIMI<br />CRACK</p>
          <p className="font-script mt-2 text-4xl">{PRODUCT.scriptLine}</p>
          <p className="mono-label mt-8 max-w-xs text-ink/60">
            One jar, made properly. {PRODUCT.size.label} of scalp-first
            conditioning grease.
          </p>
        </div>

        <nav className="flex flex-col border-b border-ink md:border-b-0 md:border-r" aria-label="Shop">
          <p className="mono-micro border-b border-ink px-6 py-3 text-ink/45">[ Shop ]</p>
          {[
            { href: "/product", label: "The Jar" },
            { href: "/cart", label: "Cart" },
            { href: "/#uses", label: "Directions" },
            { href: "/#faq", label: "FAQ" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="invert-hover mono-label border-b border-ink px-6 py-4"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 md:p-8">
          <p className="mono-micro text-ink/45">[ Handling ]</p>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">{PRODUCT.cautions}</p>
        </div>
      </div>

      <Link
        href="/product"
        className="mono-label flex items-center justify-between gap-4 border-b border-ink bg-acid px-6 py-5 transition-colors duration-[120ms] hover:bg-ink hover:text-bone"
      >
        <span>Get the jar</span>
        <span>{formatPrice(PRODUCT.priceCents)} →</span>
      </Link>

      <div className="mono-micro flex flex-col gap-2 px-6 py-5 text-ink/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} MiMi Crack</p>
        <p className="max-w-md sm:text-right">
          Cosmetic product. Not evaluated by the FDA. Not intended to diagnose,
          treat or prevent any condition.
        </p>
      </div>
    </footer>
  );
}
