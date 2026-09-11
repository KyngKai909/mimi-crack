import Link from "next/link";
import { BOTANICAL_OIL_COUNT, PRODUCT, formatPrice } from "@/lib/product";
import { AddToCart } from "@/components/AddToCart";
import { Shot } from "@/components/Shot";
import { Reveal } from "@/components/Reveal";
import { Highlights } from "@/components/Highlights";
import { Faq } from "@/components/Faq";
import { FitText } from "@/components/FitText";
import { PinnedBenefits } from "@/components/PinnedBenefits";
import { CommitmentScroll } from "@/components/CommitmentScroll";

export default function HomePage() {
  return (
    <>
      {/* ═══════════════════════════════════════════ hero — full bleed */}
      <section className="relative pb-10">
        <div className="shell-x flex flex-wrap items-end justify-between gap-6 pb-5 sm:pb-8">
          <Reveal>
            <p className="eyebrow">{PRODUCT.badge} · {PRODUCT.size.label}</p>
          </Reveal>
          {/* The strapline pairs with the eyebrow as a second column. There's
              no second column on a phone, so it moves below the headline
              instead of sitting right-aligned against nothing. */}
          <Reveal delay={120} className="hidden sm:block">
            <p className="prose-airy max-w-xs sm:text-right">
              Scalp-first conditioning grease, made in small batches.
            </p>
          </Reveal>
        </div>

        {/* Fitted display type. Matches the page gutter on phones and runs
            nearly edge to edge from sm up. */}
        <div className="px-[2vw]">
          <Reveal line>
            <h1 className="display">
              <FitText className="display">Feed the soil.</FitText>
            </h1>
          </Reveal>
        </div>

        <Reveal delay={140} className="shell-x mt-5 sm:hidden">
          <p className="prose-airy">
            Scalp-first conditioning grease, made in small batches.
          </p>
        </Reveal>

        <div className="shell-x mt-8 grid items-end gap-8 sm:mt-10 sm:gap-10 lg:mt-14 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <Reveal delay={200}>
              <p className="font-script text-5xl text-pistachio-deep sm:text-6xl">
                {PRODUCT.scriptLine}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="prose-airy mt-7 max-w-md">
                Jojoba, rosemary and peppermint in a pure mango butter base. Grease your
                parts, seal your ends, and let the scalp do what it already
                knows how to do.
              </p>
            </Reveal>
            <Reveal delay={400}>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link href="/product" className="pill pill-solid">
                  Shop the jar — {formatPrice(PRODUCT.priceCents)}
                </Link>
                <Link href="#commitment" className="link-draw text-[0.95rem] text-ink-soft">
                  See the commitment
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={260} className="order-1 lg:order-2">
            <Shot
              label="Hero — jar three-quarter, soft daylight, warm surface"
              ratio="16 / 10"
              tone="pistachio"
              className="rounded-[1.75rem]"
            />
          </Reveal>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════ ticker */}
      <section className="shell-x">
        <dl className="hairline grid grid-cols-2 gap-y-10 py-10 md:grid-cols-4">
          {[
            { k: "Net weight", v: PRODUCT.size.label },
            { k: "Batch", v: "Small" },
            { k: "Dispatch", v: "1–2 days" },
            { k: "Use", v: "Daily" },
          ].map((p, i) => (
            <Reveal key={p.k} delay={i * 90}>
              <dt className="eyebrow">{p.k}</dt>
              <dd className="display display-md mt-3">{p.v}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ══════════════════════════════════════ thesis — oversized quote */}
      <section className="section-y">
        <div className="shell-x">
          <Reveal>
            <p className="eyebrow">Why it works</p>
          </Reveal>
        </div>
        <div className="mt-8 px-5 sm:mt-10 sm:px-[2vw]">
          <Reveal line delay={100}>
            <h2 className="display">
              <FitText className="display">Don&rsquo;t polish the leaves.</FitText>
            </h2>
          </Reveal>
          <Reveal line delay={200}>
            <FitText className="display italic text-pistachio-deep">
              Feed the soil.
            </FitText>
          </Reveal>
        </div>
        <div className="shell-x mt-12 flex justify-end">
          <Reveal delay={300}>
            <p className="prose-airy max-w-md">
              Most of what gets sold for hair treats the strand. This treats the
              ground it comes out of — so the part stays soft, the ends stay
              conditioned, and length gets to hold on to what it&rsquo;s grown.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════ benefits — pinned product scene */}
      <section className="shell-x pb-24">
        <PinnedBenefits benefits={PRODUCT.benefits} />
      </section>

      {/* ═══════════════════════════════════════ formula — bento grid */}
      <section className="bg-shell-warm">
        <div className="shell-x section-y">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <h2 className="display display-xl max-w-xl">Seventeen oils and two butters.</h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="prose-airy max-w-sm">
                The green isn&rsquo;t a gimmick. It&rsquo;s what happens when you
                build a grease around mango butter, jojoba and rosemary rather
                than filler.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid auto-rows-[minmax(0,auto)] grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
            {/* texture, large */}
            <Reveal className="col-span-2 row-span-2 lg:col-span-2">
              <Shot
                label="Texture — grease surface, macro, raking light"
                ratio="1 / 1"
                tone="pistachio"
                className="h-full rounded-[1.5rem]"
              />
            </Reveal>

            {/* two stats */}
            <Reveal delay={90} className="rounded-[1.5rem] bg-shell p-7">
              <p className="display text-5xl lg:text-6xl">{BOTANICAL_OIL_COUNT}</p>
              <p className="eyebrow mt-4">Botanical oils</p>
            </Reveal>

            <Reveal delay={160} className="rounded-[1.5rem] bg-forest p-7 text-shell">
              <p className="display text-5xl lg:text-6xl">9.5<span className="text-2xl"> oz</span></p>
              <p className="eyebrow mt-4 text-shell/50">269g net</p>
            </Reveal>

            {/* script cell */}
            <Reveal delay={230} className="col-span-2 flex items-center justify-center rounded-[1.5rem] bg-pistachio px-6 py-10">
              <p className="font-script text-center text-4xl leading-tight text-forest lg:text-5xl">
                {PRODUCT.scriptLine}
              </p>
            </Reveal>

            {/* what's inside, wide */}
            <Reveal delay={300} className="col-span-2 flex flex-col rounded-[1.5rem] bg-shell p-7 lg:col-span-3 lg:p-9">
              <div className="flex items-baseline justify-between gap-4">
                <p className="eyebrow">What&rsquo;s inside</p>
                <Link
                  href="/product#ingredients"
                  className="link-draw eyebrow hover:text-ink"
                >
                  All {PRODUCT.ingredients.length}
                </Link>
              </div>
              <div className="mt-auto pt-10">
                <Highlights size="lg" />
              </div>
            </Reveal>

            {/* duration */}
            <Reveal delay={370} className="col-span-2 rounded-[1.5rem] bg-clay-soft p-7 lg:col-span-1">
              <p className="display text-5xl lg:text-6xl">4</p>
              <p className="eyebrow mt-4">Steps, every day</p>
            </Reveal>
          </div>

        </div>
      </section>

      {/* ════════════════════════ commitment — pinned horizontal scroll */}
      <section id="commitment" className="scroll-mt-0 pt-16 sm:pt-24 lg:pt-32">
        <div className="shell-x flex flex-col gap-4 pb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6 sm:pb-12">
          <Reveal>
            {/* Measure is capped in ch, not rem: the font size is fluid, so a
                fixed width would break differently at every viewport. Tuned
                for three lines at every width. */}
            <h2 className="display display-xl max-w-[16ch] sm:max-w-[14ch]">
              The whole commitment: four steps, every day.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">The commitment</p>
          </Reveal>
        </div>
        <CommitmentScroll steps={PRODUCT.howToUse} />
      </section>

      {/* ═══════════════════════════════════════════════════════ faq */}
      <section id="faq" className="shell-x section-y scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <p className="eyebrow">Questions</p>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="display display-xl mt-6">Good to know.</h2>
            </Reveal>
          </div>
          <Reveal delay={180}>
            <Faq items={PRODUCT.faqs} />
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════ closing — full bleed fitted */}
      <section className="pb-24 sm:pb-32">
        <div className="px-[2vw]">
          <Reveal line>
            <h2 className="display">
              <FitText className="display">One jar. Every day.</FitText>
            </h2>
          </Reveal>
        </div>
        <div className="shell-x mt-10 flex flex-col items-start justify-between gap-8 sm:mt-12 sm:flex-row sm:items-end sm:gap-10">
          <Reveal>
            <p className="prose-airy max-w-sm">
              {PRODUCT.size.label} of {PRODUCT.badge.toLowerCase()}, packed and
              shipped within two business days.
            </p>
          </Reveal>
          <Reveal delay={140} className="w-full max-w-sm">
            <AddToCart />
          </Reveal>
        </div>
      </section>
    </>
  );
}
