import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { PRODUCT, formatPrice } from "@/lib/product";
import { Shot } from "@/components/Shot";
import { Reveal } from "@/components/Reveal";
import { FitText } from "@/components/FitText";

export const metadata: Metadata = {
  title: "About",
  description: `${BRAND.subtitle}. The story behind ${PRODUCT.name}.`,
};

/** Things about this shop that are literally true — no aspirational filler. */
const practices = [
  {
    k: "One product",
    v: "Not a range. There's a jar, and it does what it says. When there's a second thing worth making, there'll be a second thing.",
  },
  {
    k: "Small batches",
    v: "Made in quantities that get used, not warehoused.",
  },
  {
    k: "A jar that lasts",
    v: `${PRODUCT.size.label} is two to four months for most people. A brand built on repurchase would have made it smaller.`,
  },
  {
    k: "No upsells",
    v: "One price, live carrier rates at checkout, and nothing added to your bag that you didn't put there.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════ hero */}
      <section className="pt-8">
        <div className="shell-x">
          <Reveal>
            <p className="eyebrow">About</p>
          </Reveal>
        </div>
        <div className="mt-7 px-[2vw]">
          <Reveal line delay={80}>
            <FitText className="display">{`${BRAND.tagline}.`}</FitText>
          </Reveal>
        </div>
        <div className="shell-x mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal delay={200}>
            <p className="font-script text-4xl text-pistachio-deep sm:text-5xl">
              {BRAND.subtitle}
            </p>
          </Reveal>
          <Reveal delay={300}>
            <p className="prose-airy text-[1.15rem]">
              MiMi Crack came out of a simple idea: hair doesn&rsquo;t respond
              to intensity, it responds to being shown up for. Not a
              twelve-step routine you abandon in a fortnight — one jar, one
              honest step, kept twice a week.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═════════════════════════════════════════ mind / body / soul */}
      <section className="section-y">
        <div className="shell-x">
          <Reveal>
            <h2 className="display display-xl max-w-2xl">
              Mind, body, soul — in that order.
            </h2>
          </Reveal>
        </div>

        <div className="shell-x mt-14 grid gap-4 md:grid-cols-3 lg:gap-5">
          {BRAND.pillars.map((p, i) => (
            <Reveal
              key={p.name}
              delay={i * 110}
              className={`rounded-[1.5rem] p-8 lg:p-10 ${
                i === 1 ? "bg-forest text-shell" : "bg-shell-warm"
              }`}
            >
              <p
                className={`display text-6xl lg:text-7xl ${
                  i === 1 ? "text-pistachio" : "text-pistachio-deep"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="display display-lg mt-8">{p.name}</h3>
              <p
                className={`mt-5 leading-relaxed ${
                  i === 1 ? "text-shell/70" : "text-ink-soft"
                }`}
              >
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Where the three land. Full width on purpose — it reads as the
            destination rather than a fourth column. */}
        <div className="shell-x mt-4 lg:mt-5">
          <Reveal delay={140}>
            <div className="rounded-[1.5rem] bg-pistachio px-8 py-14 text-center lg:px-16 lg:py-20">
              {/* three strands resolving into one */}
              <svg
                aria-hidden="true"
                viewBox="0 0 180 64"
                className="mx-auto h-14 w-auto text-forest/45"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              >
                <path d="M4 8C60 8 96 32 176 32" />
                <path d="M4 32h172" />
                <path d="M4 56C60 56 96 32 176 32" />
                <circle cx="176" cy="32" r="3.25" fill="currentColor" stroke="none" />
              </svg>

              <h3 className="display display-xl mt-9 text-forest">
                {BRAND.alignment.name}
              </h3>
              <p className="mx-auto mt-6 max-w-xl leading-relaxed text-forest/75">
                {BRAND.alignment.body}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ founder note */}
      <section className="shell-x pb-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <Shot
              label="Portrait — Carmel, natural light"
              ratio="4 / 5"
              tone="clay"
              className="rounded-[1.75rem]"
            />
          </Reveal>

          <Reveal delay={140} className="lg:pt-8">
            <p className="eyebrow">In her words</p>

            {BRAND.founderStatement ? (
              <blockquote className="display display-lg mt-7 max-w-2xl">
                {BRAND.founderStatement}
              </blockquote>
            ) : (
              <div className="mt-7 max-w-xl rounded-[1.5rem] bg-pistachio-soft p-8">
                <p className="display display-md">
                  This is where your note goes, Carmel.
                </p>
                <p className="prose-airy mt-4">
                  A few sentences in your own voice — why you made this, who you
                  made it for, what commitment has meant for your own hair.
                  We&rsquo;ve deliberately left it blank rather than write a
                  founder story on your behalf.
                </p>
                <p className="mt-5 text-sm text-ink-mute">
                  Drop it into{" "}
                  <code className="rounded bg-ink/5 px-1.5 py-0.5">
                    src/lib/brand.ts
                  </code>{" "}
                  as{" "}
                  <code className="rounded bg-ink/5 px-1.5 py-0.5">
                    founderStatement
                  </code>{" "}
                  and this box is replaced by the quote.
                </p>
              </div>
            )}

            <p className="mt-8 text-[0.95rem] text-ink-soft">
              — {BRAND.founder}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════ what commitment looks like */}
      <section className="section-y">
        <div className="shell-x">
          <Reveal>
            <h2 className="display display-xl max-w-2xl">
              What that looks like here.
            </h2>
          </Reveal>

          <dl className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {practices.map((p, i) => (
              <Reveal key={p.k} delay={(i % 2) * 120} className="hairline pt-7">
                <dt className="display display-md">{p.k}</dt>
                <dd className="prose-airy mt-4 max-w-sm">{p.v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ socials */}
      <section className="shell-x pb-4">
        <Reveal>
          <p className="eyebrow">Walk with her</p>
        </Reveal>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {BRAND.socials.filter((s) => s.href).map((s, i) => (
            <Reveal as="li" key={s.label} delay={i * 90}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-hairline px-6 py-6 transition-colors duration-500 hover:border-forest hover:bg-pistachio-soft"
              >
                <span>
                  <span className="display display-md block">{s.label}</span>
                  <span className="mt-1 block text-sm text-ink-mute">
                    {s.handle}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-ink-mute transition-transform duration-500 group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ══════════════════════════════════════════════════════ cta */}
      <section className="pb-24 pt-24 sm:pb-32">
        <div className="px-[2vw]">
          <Reveal line>
            <FitText className="display">Start the commitment.</FitText>
          </Reveal>
        </div>
        <div className="shell-x mt-12 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Reveal>
            <p className="prose-airy max-w-sm">
              One jar. Four steps. Twice a week.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <Link href="/product" className="pill pill-solid">
              Shop the jar — {formatPrice(PRODUCT.priceCents)}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
