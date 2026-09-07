import Image from "next/image";
import Link from "next/link";
import { PRODUCT, formatPrice } from "@/lib/product";
import { AddToCart } from "@/components/AddToCart";
import { Sprig } from "@/components/Sprig";
import { Faq } from "@/components/Faq";

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-pistachio-light/50 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-2 lg:gap-8">
          <div className="order-2 lg:order-1">
            <p className="text-[0.7rem] tracking-label text-botanical uppercase">
              {PRODUCT.badge} · {PRODUCT.size.label}
            </p>
            <h1 className="mt-5 font-display text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance-tight text-ink sm:text-6xl">
              Feed the soil,
              <br />
              <span className="italic">grow the garden.</span>
            </h1>
            <p className="mt-3 font-script text-3xl text-botanical sm:text-4xl">
              {PRODUCT.scriptLine}
            </p>
            <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-ink-soft">
              MiMi Crack is a scalp-first conditioning grease — castor, olive
              and rosemary in a shea butter base. Grease your parts, seal your
              ends, and let the scalp do what it already knows how to do.
            </p>

            <div className="mt-9 max-w-md">
              <AddToCart />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-2 text-[0.72rem] tracking-label-sm text-ink-faint uppercase">
              <span>Ships in 1–2 days</span>
              <span aria-hidden="true">·</span>
              <span>Live carrier rates</span>
              <span aria-hidden="true">·</span>
              <span>{formatPrice(PRODUCT.priceCents)} a jar</span>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden rounded-[2rem] bg-parchment ring-1 ring-ink/10">
              <Image
                src="/product/jar-front.webp"
                alt={`A ${PRODUCT.size.label} jar of ${PRODUCT.name} with its cream label and terracotta lid`}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 30rem"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- texture */}
      <section aria-hidden="true" className="relative h-40 overflow-hidden sm:h-56">
        <Image
          src="/product/texture.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-transparent to-cream" />
      </section>

      {/* ------------------------------------------------------ benefits */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col items-center text-center">
          <Sprig className="h-6 w-28 text-ink-faint" />
          <h2 className="mt-5 font-display text-3xl font-semibold text-ink sm:text-4xl">
            What it actually does
          </h2>
          <p className="mt-4 max-w-lg text-ink-soft">
            No miracle claims. Just a well-built grease doing the four things a
            grease should do.
          </p>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {PRODUCT.benefits.map((b, i) => (
            <div key={b.title} className="flex gap-5">
              <span className="font-display text-2xl text-pistachio-deep tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-ink">
                  {b.title}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{b.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- how to use */}
      <section id="how-to-use" className="scroll-mt-24 bg-cream-deep/60 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-parchment ring-1 ring-ink/10">
            <Image
              src="/product/jar-open-top.webp"
              alt="An open jar of MiMi Crack showing the pale green grease"
              fill
              sizes="(max-width: 1024px) 90vw, 32rem"
              className="object-contain"
            />
          </div>

          <div>
            <p className="text-[0.7rem] tracking-label text-botanical uppercase">
              How to use
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Four steps, twice a week
            </h2>

            <ol className="mt-9 space-y-7">
              {PRODUCT.howToUse.map((s, i) => (
                <li key={s.step} className="flex gap-5">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-botanical/30 text-sm text-botanical tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {s.step}
                    </h3>
                    <p className="mt-1.5 leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- ingredients */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-[0.7rem] tracking-label text-botanical uppercase">
              In the jar
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Six oils and a butter
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-ink-soft">
              The green isn&rsquo;t a gimmick &mdash; it&rsquo;s what happens when you build a
              grease around rosemary and olive rather than around fragrance.
            </p>

            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {PRODUCT.ingredients.map((ing) => (
                <li
                  key={ing}
                  className="flex items-baseline gap-2.5 text-[0.95rem] text-ink-soft"
                >
                  <span className="text-pistachio-deep" aria-hidden="true">
                    ✦
                  </span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-parchment ring-1 ring-ink/10">
            <Image
              src="/product/jar-open.webp"
              alt="An open jar of MiMi Crack with its lid resting in front"
              fill
              sizes="(max-width: 1024px) 90vw, 28rem"
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- faq */}
      <section id="faq" className="scroll-mt-24 bg-cream-deep/60 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="flex flex-col items-center text-center">
            <Sprig className="h-6 w-28 text-ink-faint" />
            <h2 className="mt-5 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Questions
            </h2>
          </div>
          <div className="mt-12">
            <Faq items={PRODUCT.faqs} />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- final cta */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-botanical-deep px-6 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-pistachio/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold text-cream sm:text-5xl">
              One jar. Two months.
            </h2>
            <p className="mx-auto mt-5 max-w-md leading-relaxed text-cream/75">
              {PRODUCT.size.label} of {PRODUCT.badge.toLowerCase()}, packed and
              shipped within two business days.
            </p>
            <Link
              href="/product"
              className="mt-9 inline-block rounded-full bg-cream px-9 py-4 text-[0.78rem] tracking-label-sm text-ink uppercase transition-colors hover:bg-pistachio-light"
            >
              Shop the jar — {formatPrice(PRODUCT.priceCents)}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
