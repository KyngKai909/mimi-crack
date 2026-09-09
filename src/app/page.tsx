import Link from "next/link";
import { PRODUCT, formatPrice } from "@/lib/product";
import { AddToCart } from "@/components/AddToCart";
import { Slot } from "@/components/Slot";
import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { Faq } from "@/components/Faq";

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════ 00 · HERO */}
      <section className="border-b border-ink">
        <div className="mono-micro flex items-center justify-between border-b border-ink px-4 py-2 text-ink/50">
          <span>Est. small batch · {PRODUCT.size.label}</span>
          <span className="hidden sm:inline">{PRODUCT.subtitle}</span>
          <span>[ 01 / 01 ]</span>
        </div>

        <div className="grid lg:grid-cols-[1.35fr_1fr]">
          <div className="flex flex-col justify-between border-ink p-4 lg:border-r lg:p-8">
            <div>
              <Reveal clip>
                <h1 className="display display-xl">Feed the soil.</h1>
              </Reveal>
              <Reveal clip delay={80}>
                <p className="display display-xl text-ink/25">Grow the garden.</p>
              </Reveal>

              <Reveal delay={220}>
                <p className="font-script mt-4 text-4xl sm:text-5xl">
                  {PRODUCT.scriptLine}
                </p>
              </Reveal>
            </div>

            <Reveal delay={300} className="mt-10 max-w-lg">
              <p className="text-lg leading-snug">
                A scalp-first conditioning grease. Castor, olive and rosemary in
                a shea butter base. Grease your parts, seal your ends, and let
                the scalp do what it already knows how to do.
              </p>
              <div className="mt-7">
                <AddToCart />
              </div>
            </Reveal>
          </div>

          <div className="border-t border-ink p-4 lg:border-t-0 lg:p-8">
            <Reveal delay={140}>
              <Slot label="Hero packshot · jar upright, hard light" index="[ 01 ]" ratio="4 / 5" />
            </Reveal>
          </div>
        </div>

        {/* full-bleed poster line */}
        <div className="overflow-hidden border-t border-ink">
          <h2 className="display display-mega -mb-[0.09em] whitespace-nowrap px-2">
            Hair Fertilizer
          </h2>
        </div>
      </section>

      <Marquee
        accent
        items={[
          "Stimulates scalp",
          "Revitalizing",
          "Nourishing",
          PRODUCT.badge,
          formatPrice(PRODUCT.priceCents),
        ]}
      />

      {/* ═══════════════════════════════════════════════ 01 · THESIS */}
      <section className="border-b border-ink">
        <div className="grid md:grid-cols-[auto_1fr]">
          <p className="mono-micro border-b border-ink px-4 py-3 text-ink/45 md:border-b-0 md:border-r md:[writing-mode:vertical-rl] md:py-8">
            [ 01 ] Thesis
          </p>
          <div className="p-4 md:p-10">
            <Reveal>
              <p className="display display-lg max-w-4xl">
                You don&rsquo;t grow a garden by polishing the leaves. You feed
                the <span className="bg-acid px-2">soil</span>.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <p className="mono-label mt-8 max-w-md text-ink/60">
                Most of what gets sold for hair treats the strand. This treats
                the ground it comes out of.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ 02 · BENEFITS */}
      <section className="border-b border-ink">
        <p className="mono-micro border-b border-ink px-4 py-3 text-ink/45">
          [ 02 ] What it actually does — no miracle claims
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4">
          {PRODUCT.benefits.map((b, i) => (
            <Reveal
              key={b.title}
              delay={i * 70}
              className={`invert-hover invert-hover-acid group border-ink p-5 md:p-6 ${
                i < PRODUCT.benefits.length - 1 ? "border-b lg:border-b-0 lg:border-r" : ""
              } ${i === 0 ? "md:border-r" : ""} ${i === 2 ? "md:border-r lg:border-r" : ""}`}
            >
              <span className="mono-micro block text-ink/45 group-hover:text-ink/60">
                [ 0{i + 1} ]
              </span>
              <h3 className="display mt-7 text-3xl leading-[0.9]">{b.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink/75 group-hover:text-ink">
                {b.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ 03 · FORMULA RAIL */}
      <section className="border-b border-ink">
        <div className="flex items-center justify-between border-b border-ink px-4 py-3">
          <p className="mono-micro text-ink/45">[ 03 ] In the jar</p>
          <p className="mono-micro text-ink/45">Scroll →</p>
        </div>

        <div className="rail border-b border-ink">
          {PRODUCT.ingredients.map((ing, i) => (
            <article
              key={ing}
              className="invert-hover w-[78vw] border-r border-ink p-5 sm:w-[42vw] lg:w-[24vw]"
            >
              <span className="mono-micro text-ink/45">
                [ {String(i + 1).padStart(2, "0")} ]
              </span>
              <Slot label={`Ingredient ${i + 1}`} ratio="1 / 1" className="mt-4" />
              <h3 className="display mt-4 text-2xl leading-[0.95]">{ing}</h3>
            </article>
          ))}
          <div className="flex w-[78vw] flex-col justify-center gap-3 bg-acid p-5 sm:w-[42vw] lg:w-[24vw]">
            <p className="display text-3xl leading-[0.9]">Six oils and a butter.</p>
            <p className="mono-micro text-ink/70">
              The green isn&rsquo;t a gimmick. It&rsquo;s rosemary and olive.
            </p>
          </div>
        </div>

        {!PRODUCT.ingredientsAreComplete && (
          <p className="mono-micro border-b border-ink bg-ink px-4 py-3 text-bone">
            Owner note — this list is transcribed from product photography and is
            incomplete. Replace it in src/lib/product.ts before launch.
          </p>
        )}
      </section>

      {/* ═════════════════════════════════════════════ 04 · DIRECTIONS */}
      <section id="uses" className="scroll-mt-14 border-b border-ink">
        <p className="mono-micro border-b border-ink px-4 py-3 text-ink/45">
          [ 04 ] Directions — four steps, twice a week
        </p>

        <div className="grid lg:grid-cols-[1fr_1.1fr]">
          <div className="border-ink p-4 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:self-start lg:border-r lg:p-8">
            <Slot
              label="Application · fingertip in the part"
              index="[ 02 ]"
              ratio="1 / 1"
              className="lg:h-full"
            />
          </div>

          <ol>
            {PRODUCT.howToUse.map((s, i) => (
              <Reveal
                as="li"
                key={s.step}
                className="invert-hover flex gap-5 border-b border-ink p-5 last:border-b-0 md:gap-8 md:p-8"
              >
                <span className="display shrink-0 text-5xl leading-none text-ink/25 md:text-7xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="display text-2xl leading-[0.95] md:text-3xl">
                    {s.step}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/75">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <Marquee items={["Grease the part", "Massage the scalp", "Seal the ends", "Repeat"]} duration={24} />

      {/* ═══════════════════════════════════════════════════ 05 · FAQ */}
      <section id="faq" className="scroll-mt-14 border-b border-ink">
        <p className="mono-micro border-b border-ink px-4 py-3 text-ink/45">
          [ 05 ] Questions
        </p>
        <Faq items={PRODUCT.faqs} />
      </section>

      {/* ═══════════════════════════════════════════════════ CLOSING */}
      <section className="border-b border-ink bg-acid">
        <div className="overflow-hidden">
          <p className="display display-mega -mb-[0.09em] whitespace-nowrap px-2">
            One jar. Two months.
          </p>
        </div>
        <div className="flex flex-col justify-between gap-5 border-t border-ink p-4 sm:flex-row sm:items-center md:p-6">
          <p className="mono-label max-w-sm text-ink/70">
            {PRODUCT.size.label} of {PRODUCT.badge.toLowerCase()}, packed and
            shipped within two business days.
          </p>
          <Link
            href="/product"
            className="mono-label inline-flex items-center justify-between gap-8 border border-ink bg-ink px-7 py-4 text-bone transition-colors duration-[120ms] hover:bg-bone hover:text-ink"
          >
            <span>Shop the jar</span>
            <span>{formatPrice(PRODUCT.priceCents)} →</span>
          </Link>
        </div>
      </section>
    </>
  );
}
