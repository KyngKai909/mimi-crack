import type { Metadata } from "next";
import { PRODUCT, formatPrice } from "@/lib/product";
import { AddToCart } from "@/components/AddToCart";
import { Gallery, type Shot } from "@/components/Gallery";
import { Faq } from "@/components/Faq";
import { Sprig } from "@/components/Sprig";

export const metadata: Metadata = {
  title: PRODUCT.shortName,
  description: `${PRODUCT.tagline}. ${PRODUCT.size.label} of premium scalp-first hair grease.`,
};

const shots: Shot[] = [
  {
    src: "/product/jar-front.webp",
    alt: "The MiMi Crack jar upright, cream label and terracotta lid",
  },
  {
    src: "/product/jar-open.webp",
    alt: "The jar open with the lid resting in front, showing the pale green grease",
  },
  {
    src: "/product/jar-open-top.webp",
    alt: "Looking straight down into the open jar",
  },
  {
    src: "/product/jar-group.webp",
    alt: "Several jars of MiMi Crack together with one opened",
  },
];

export default function ProductPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT.name,
    description: PRODUCT.tagline,
    image: [`/product/jar-front.webp`],
    brand: { "@type": "Brand", name: "MiMi Crack" },
    offers: {
      "@type": "Offer",
      price: (PRODUCT.priceCents / 100).toFixed(2),
      priceCurrency: PRODUCT.currency.toUpperCase(),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Gallery shots={shots} />

          <div className="lg:pt-4">
            <p className="text-[0.7rem] tracking-label text-botanical uppercase">
              {PRODUCT.badge} · {PRODUCT.size.label}
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight font-semibold text-ink sm:text-5xl">
              {PRODUCT.shortName}
            </h1>
            <p className="mt-2 text-lg text-ink-soft">{PRODUCT.tagline}</p>
            <p className="mt-1 font-script text-3xl text-botanical">
              {PRODUCT.scriptLine}
            </p>

            <p className="mt-7 font-display text-3xl text-ink tabular-nums">
              {formatPrice(PRODUCT.priceCents)}
            </p>

            <div className="mt-7">
              <AddToCart />
            </div>

            <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10 text-sm">
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-ink-faint">Size</dt>
                <dd className="text-ink">{PRODUCT.size.label}</dd>
              </div>
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-ink-faint">Formula</dt>
                <dd className="text-ink">{PRODUCT.subtitle}</dd>
              </div>
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-ink-faint">Shipping</dt>
                <dd className="text-right text-ink">
                  Live carrier rates at checkout
                </dd>
              </div>
              <div className="flex justify-between gap-6 py-3">
                <dt className="text-ink-faint">Dispatch</dt>
                <dd className="text-ink">1–2 business days</dd>
              </div>
            </dl>

            <section className="mt-10">
              <h2 className="text-[0.7rem] tracking-label-sm text-ink-faint uppercase">
                Ingredients
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                {PRODUCT.ingredients.join(", ")}.
              </p>
              {!PRODUCT.ingredientsAreComplete && (
                <p className="mt-3 text-xs leading-relaxed text-terracotta">
                  Note for the shop owner: this list is transcribed from the
                  product photography and is incomplete. Replace it in
                  <code className="mx-1 rounded bg-ink/5 px-1.5 py-0.5">
                    src/lib/product.ts
                  </code>
                  with the full declaration from the jar before launch.
                </p>
              )}
            </section>

            <section className="mt-8">
              <h2 className="text-[0.7rem] tracking-label-sm text-ink-faint uppercase">
                Cautions
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {PRODUCT.cautions}
              </p>
            </section>
          </div>
        </div>

        {/* ------------------------------------------------ how to use */}
        <section className="mt-24 border-t border-ink/10 pt-16">
          <div className="flex flex-col items-center text-center">
            <Sprig className="h-6 w-28 text-ink-faint" />
            <h2 className="mt-5 font-display text-3xl font-semibold text-ink">
              How to use it
            </h2>
          </div>
          <ol className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCT.howToUse.map((s, i) => (
              <li key={s.step}>
                <span className="grid h-9 w-9 place-items-center rounded-full border border-botanical/30 text-sm text-botanical tabular-nums">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {s.step}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- faq */}
        <section className="mx-auto mt-24 max-w-3xl border-t border-ink/10 pt-16">
          <h2 className="text-center font-display text-3xl font-semibold text-ink">
            Questions
          </h2>
          <div className="mt-10">
            <Faq items={PRODUCT.faqs} />
          </div>
        </section>
      </div>
    </>
  );
}
