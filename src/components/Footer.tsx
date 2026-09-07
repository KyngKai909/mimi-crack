import Link from "next/link";
import { PRODUCT } from "@/lib/product";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-cream-deep/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-semibold tracking-label text-ink">
            MIMI CRACK
          </p>
          <p className="mt-1 font-script text-2xl text-botanical">
            {PRODUCT.scriptLine}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            One jar, made properly. {PRODUCT.size.label} of scalp-first
            conditioning grease.
          </p>
        </div>

        <nav aria-label="Shop">
          <h2 className="text-[0.7rem] tracking-label-sm text-ink-faint uppercase">
            Shop
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
            <li><Link className="hover:text-ink" href="/product">The Jar</Link></li>
            <li><Link className="hover:text-ink" href="/cart">Cart</Link></li>
            <li><Link className="hover:text-ink" href="/#how-to-use">How to Use</Link></li>
            <li><Link className="hover:text-ink" href="/#faq">FAQ</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="text-[0.7rem] tracking-label-sm text-ink-faint uppercase">
            Good to know
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            {PRODUCT.cautions}
          </p>
        </div>
      </div>

      <div className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} MiMi Crack. All rights reserved.</p>
          <p>
            Cosmetic product. Not evaluated by the FDA and not intended to
            diagnose, treat or prevent any condition.
          </p>
        </div>
      </div>
    </footer>
  );
}
