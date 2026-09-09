import type { Metadata } from "next";
import { PRODUCT, formatPrice } from "@/lib/product";
import { AddToCart } from "@/components/AddToCart";
import { SlotGallery, type Shot } from "@/components/SlotGallery";
import { Faq } from "@/components/Faq";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: PRODUCT.shortName,
  description: `${PRODUCT.tagline}. ${PRODUCT.size.label} of premium scalp-first hair grease.`,
};

const shots: Shot[] = [
  { label: "Packshot · jar upright, hard light" },
  { label: "Open jar · straight down, texture" },
  { label: "Open jar · lid resting, top label" },
  { label: "In use · fingertip in the part" },
];

const spec = [
  ["Size", PRODUCT.size.label],
  ["Formula", PRODUCT.subtitle],
  ["Grade", PRODUCT.badge],
  ["Shipping", "Live carrier rates at checkout"],
  ["Dispatch", "1–2 business days"],
] as const;

export default function ProductPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT.name,
    description: PRODUCT.tagline,
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

      <div className="mono-micro flex items-center justify-between border-b border-ink px-4 py-2 text-ink/50">
        <span>Index / The Jar</span>
        <span>{PRODUCT.size.label}</span>
      </div>

      <div className="grid border-b border-ink lg:grid-cols-2">
        {/* gallery */}
        <div className="border-b border-ink p-4 lg:border-b-0 lg:border-r lg:p-8">
          <div className="lg:sticky lg:top-20">
            <SlotGallery shots={shots} />
          </div>
        </div>

        {/* buy column */}
        <div className="p-4 lg:p-8">
          <Reveal clip>
            <h1 className="display display-xl">Hair<br />Fertilizer</h1>
          </Reveal>
          <p className="font-script mt-2 text-4xl">{PRODUCT.scriptLine}</p>
          <p className="mono-label mt-5 text-ink/60">{PRODUCT.tagline}</p>

          <p className="display mt-8 text-6xl tabular-nums">
            {formatPrice(PRODUCT.priceCents)}
          </p>

          <div className="mt-6 max-w-md">
            <AddToCart />
          </div>

          <dl className="mt-10 border-t border-ink">
            {spec.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 border-b border-ink py-3">
                <dt className="mono-micro text-ink/45">{k}</dt>
                <dd className="mono-micro text-right">{v}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-10">
            <h2 className="mono-micro text-ink/45">[ Ingredients ]</h2>
            <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
              {PRODUCT.ingredients.map((ing, i) => (
                <li key={ing} className="flex gap-3 border-b border-ink/15 py-2 text-sm">
                  <span className="mono-micro text-ink/35">{String(i + 1).padStart(2, "0")}</span>
                  {ing}
                </li>
              ))}
            </ul>
            {!PRODUCT.ingredientsAreComplete && (
              <p className="mono-micro mt-4 bg-ink px-3 py-2 text-bone">
                Owner note — incomplete list, transcribed from photography.
                Replace in src/lib/product.ts before launch.
              </p>
            )}
          </section>

          <section className="mt-8">
            <h2 className="mono-micro text-ink/45">[ Handling ]</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{PRODUCT.cautions}</p>
          </section>
        </div>
      </div>

      <Marquee accent items={["Stimulates scalp", PRODUCT.badge, PRODUCT.size.label]} />

      {/* directions */}
      <section className="border-b border-ink">
        <p className="mono-micro border-b border-ink px-4 py-3 text-ink/45">
          [ Directions ]
        </p>
        <ol className="grid md:grid-cols-2 lg:grid-cols-4">
          {PRODUCT.howToUse.map((s, i) => (
            <Reveal
              as="li"
              key={s.step}
              delay={i * 70}
              className={`invert-hover border-b border-ink p-5 lg:border-b-0 ${
                i < PRODUCT.howToUse.length - 1 ? "lg:border-r" : ""
              } ${i % 2 === 0 ? "md:border-r lg:border-r" : ""}`}
            >
              <span className="display block text-5xl leading-none text-ink/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display mt-5 text-2xl leading-[0.95]">{s.step}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* faq */}
      <section className="border-b border-ink">
        <p className="mono-micro border-b border-ink px-4 py-3 text-ink/45">
          [ Questions ]
        </p>
        <Faq items={PRODUCT.faqs} />
      </section>
    </>
  );
}
