import type { Metadata } from "next";
import { share } from "@/lib/seo";
import {
  BOTANICAL_OIL_COUNT,
  GROUPED_INGREDIENTS,
  INGREDIENT_DECLARATION,
  PRODUCT,
} from "@/lib/product";
import { AddToCart } from "@/components/AddToCart";
import { ShotGallery, type ShotSpec } from "@/components/ShotGallery";
import { Shot } from "@/components/Shot";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { Highlights } from "@/components/Highlights";
import { FitText } from "@/components/FitText";

export const metadata: Metadata = share({
  title: PRODUCT.shortName,
  description: `${PRODUCT.tagline}. ${PRODUCT.size.label} of premium scalp-first hair grease.`,
  banner: "product",
});

const shots: ShotSpec[] = [
  { label: "Packshot — jar upright, soft daylight", tone: "pistachio" },
  { label: "Open jar — straight down, texture", tone: "warm" },
  { label: "Open jar — lid resting, top label", tone: "clay" },
  { label: "In use — fingertip in the part", tone: "warm" },
];

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

      {/* ══════════════════════════════════════════════ gallery + buy */}
      <section className="shell-x pb-8 pt-4">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <ShotGallery shots={shots} />
          </Reveal>

          <div className="lg:pt-6">
            <Reveal>
              <p className="eyebrow">{PRODUCT.badge} · {PRODUCT.size.label}</p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="display display-xl mt-6">{PRODUCT.shortName}</h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="font-script mt-3 text-4xl text-pistachio-deep">
                {PRODUCT.scriptLine}
              </p>
            </Reveal>
            <Reveal delay={260}>
              <p className="prose-airy mt-7 max-w-md">{PRODUCT.tagline}. Jojoba,
                rosemary and peppermint in a pure mango butter base — built to soften the
                part and keep ends conditioned between washes.
              </p>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-10 max-w-md">
                <AddToCart withPrice />
              </div>
            </Reveal>

            <Reveal delay={460}>
              <dl className="mt-12 grid grid-cols-2 gap-y-8">
                {[
                  ["Size", PRODUCT.size.label],
                  ["Formula", PRODUCT.subtitle],
                  ["Shipping", "Live carrier rates"],
                  ["Dispatch", "1–2 business days"],
                ].map(([k, v]) => (
                  <div key={k} className="hairline pt-5">
                    <dt className="eyebrow">{k}</dt>
                    <dd className="mt-2 text-[0.95rem] text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ fitted statement */}
      <section className="section-y">
        <div className="px-[2vw]">
          <Reveal line>
            <FitText className="display">Made for the scalp.</FitText>
          </Reveal>
        </div>
        <div className="shell-x mt-10 flex justify-end">
          <Reveal delay={160}>
            <p className="prose-airy max-w-md">
              Not a mask, not a serum. A grease you work into the part — the one
              step that most routines skip and most scalps miss.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ detail bento */}
      <section className="bg-shell-warm">
        <div className="shell-x section-y">
          <div className="grid auto-rows-[minmax(0,auto)] grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            <Reveal className="col-span-2 row-span-2">
              <Shot
                label="Texture — grease surface, macro"
                ratio="1 / 1"
                tone="pistachio"
                className="h-full rounded-[1.5rem]"
              />
            </Reveal>

            <Reveal delay={90} className="col-span-2 flex flex-col rounded-[1.5rem] bg-shell p-7 lg:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <p className="eyebrow">What&rsquo;s in it</p>
                <a href="#ingredients" className="link-draw eyebrow hover:text-ink">
                  All {PRODUCT.ingredients.length}
                </a>
              </div>
              <div className="mt-auto pt-8">
                <Highlights />
              </div>
            </Reveal>

            <Reveal delay={160} className="rounded-[1.5rem] bg-forest p-7 text-shell">
              <p className="display text-5xl">9.5<span className="text-2xl"> oz</span></p>
              <p className="eyebrow mt-4 text-shell/50">269g net</p>
            </Reveal>

            <Reveal delay={230} className="rounded-[1.5rem] bg-clay-soft p-7">
              <p className="display text-5xl">2–4</p>
              <p className="eyebrow mt-4">Months per jar</p>
            </Reveal>

            <Reveal delay={300} className="col-span-2 rounded-[1.5rem] bg-shell p-7">
              <p className="eyebrow">Handling</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                {PRODUCT.cautions}
              </p>
            </Reveal>
          </div>

          {/* The legal declaration. It reads like the back of the jar because
              that is what it is — every ingredient, in the order printed. */}
          <Reveal
            id="ingredients"
            delay={370}
            className="mt-4 scroll-mt-28 rounded-[1.5rem] bg-shell p-7 lg:mt-5 lg:p-9"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <p className="eyebrow">Full ingredients</p>
              <p className="eyebrow">
                {PRODUCT.ingredients.length} in all · {BOTANICAL_OIL_COUNT} botanical oils
              </p>
            </div>
            <div className="mt-9 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {GROUPED_INGREDIENTS.map((group) => (
                <div key={group.key}>
                  <div className="hairline flex items-baseline justify-between gap-3 pt-4">
                    <h3 className="display display-md">{group.label}</h3>
                    <span className="eyebrow text-[0.62rem]">{group.items.length}</span>
                  </div>
                  {/* Two-up on a phone, where the groups themselves stack:
                      thirty-seven names in one column is a lot of thumb. */}
                  <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-1">
                    {group.items.map((name) => (
                      <li key={name} className="text-[0.95rem] leading-snug text-ink-soft">
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Grouping is a reading aid. The declaration itself is an ordered
                thing, so it stays on the page in the order it's printed. */}
            <p className="mt-12 max-w-4xl text-xs leading-relaxed text-ink-mute">
              <span className="text-ink-soft">As printed on the jar:</span>{" "}
              {INGREDIENT_DECLARATION}.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ directions */}
      <section className="shell-x section-y">
        <Reveal>
          <h2 className="display display-xl max-w-xl">How to use it.</h2>
        </Reveal>
        <ol className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {PRODUCT.howToUse.map((s, i) => (
            <Reveal as="li" key={s.step} delay={i * 90} className="hairline pt-6">
              <span className="display text-3xl text-pistachio-deep tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display display-md mt-4">{s.step}</h3>
              <p className="prose-airy mt-3">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ═════════════════════════════════════════════════════════ faq */}
      <section className="shell-x pb-24 sm:pb-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <h2 className="display display-xl">Good to know.</h2>
            </Reveal>
          </div>
          <Reveal delay={140}>
            <Faq items={PRODUCT.faqs} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
