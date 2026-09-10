import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  COLOR_GROUPS,
  LAYOUT,
  MOTION,
  TYPEFACES,
  TYPE_SCALE,
  VOICE,
} from "@/lib/designTokens";
import { BRAND } from "@/lib/brand";
import { PRODUCT } from "@/lib/product";
import { Swatch } from "@/components/Swatch";
import { TypeSpecimen } from "@/components/TypeSpecimen";
import { Shot } from "@/components/Shot";
import { FitText } from "@/components/FitText";
import { Reveal } from "@/components/Reveal";
import { teaserBanner } from "@/lib/seo";
import { LAUNCH_LABEL } from "@/lib/launch";

/** The example share card counts down, so don't bake it in at build time. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Brand guide",
  description:
    "Wordmark, colour, type, layout and voice for MiMi Crack. Reference for every other page, post and printed piece.",
  // An internal reference, not a shopfront page.
  robots: { index: false, follow: false },
};

const sections = [
  ["wordmark", "Wordmark"],
  ["colour", "Colour"],
  ["type", "Typography"],
  ["layout", "Layout"],
  ["components", "Components"],
  ["motion", "Motion"],
  ["photography", "Photography"],
  ["voice", "Voice"],
  ["assets", "Assets"],
] as const;

function SectionHead({ id, n, title, lead }: { id: string; n: string; title: string; lead: string }) {
  return (
    <div className="scroll-mt-28" id={id}>
      <Reveal>
        <p className="eyebrow">{n}</p>
      </Reveal>
      <Reveal delay={90}>
        <h2 className="display display-xl mt-5">{title}</h2>
      </Reveal>
      <Reveal delay={160}>
        <p className="prose-airy mt-6 max-w-xl">{lead}</p>
      </Reveal>
    </div>
  );
}

export default function StylePage() {
  return (
    <>
      {/* ══════════════════════════════════════════════════════ hero */}
      <section className="pt-8">
        <div className="shell-x">
          <Reveal>
            <p className="eyebrow">Brand guide · Internal reference</p>
          </Reveal>
        </div>
        <div className="mt-7 px-[2vw]">
          <Reveal line delay={80}>
            <FitText className="display">MiMi Crack</FitText>
          </Reveal>
        </div>
        <div className="shell-x mt-10 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal delay={200}>
            <p className="prose-airy text-[1.15rem]">
              Everything here is the working system, not a mock-up of one — the
              colour values are read off the live stylesheet, so this page and
              the site can never disagree. Use it when making anything else:
              another page, a blog post, a flyer, a social graphic.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <nav aria-label="Sections" className="grid grid-cols-2 gap-x-6 gap-y-2">
              {sections.map(([id, label], i) => (
                <Link
                  key={id}
                  href={`#${id}`}
                  className="link-draw flex items-baseline gap-3 text-[0.95rem] text-ink-soft"
                >
                  <span className="text-ink-mute tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </Link>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ wordmark */}
      <section className="shell-x section-y">
        <SectionHead
          id="wordmark"
          n="01"
          title="Wordmark"
          lead="Set in Fraunces 600 with the display tracking. It is type, not a logo file — so it stays sharp at any size and can be set fresh in any tool that has the font."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:gap-5">
          <Reveal className="flex min-h-56 items-center justify-center rounded-[1.5rem] bg-shell-warm p-10">
            <span className="display text-4xl">MiMi Crack</span>
          </Reveal>
          <Reveal delay={90} className="flex min-h-56 items-center justify-center rounded-[1.5rem] bg-forest p-10">
            <span className="display text-4xl text-shell">MiMi Crack</span>
          </Reveal>
          <Reveal delay={160} className="flex min-h-56 flex-col items-center justify-center gap-2 rounded-[1.5rem] bg-pistachio p-10">
            <span className="display text-3xl text-forest">MiMi Crack</span>
            <span className="font-script text-2xl text-forest/70">
              {PRODUCT.scriptLine}
            </span>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Reveal className="hairline pt-7">
            <h3 className="display display-md">Rules</h3>
            <ul className="prose-airy mt-4 space-y-2.5">
              <li>Clear space on all sides is at least the cap-height of the M.</li>
              <li>Minimum size is 90px wide on screen, 25mm in print.</li>
              <li>Ink on light grounds; Shell on Forest. Never on Pistachio at small sizes.</li>
              <li>The script line sits under the wordmark, never beside it.</li>
            </ul>
          </Reveal>
          <Reveal delay={120} className="hairline pt-7">
            <h3 className="display display-md">Never</h3>
            <ul className="prose-airy mt-4 space-y-2.5">
              <li>Don&rsquo;t set it in another face, or in Fraunces italic.</li>
              <li>Don&rsquo;t stretch, outline, or add a shadow.</li>
              <li>Don&rsquo;t set it all-caps or all-lowercase — it&rsquo;s <em>MiMi Crack</em>.</li>
              <li>Don&rsquo;t place it over a busy area of a photograph.</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ colour */}
      <section className="bg-shell-warm">
        <div className="shell-x section-y">
          <SectionHead
            id="colour"
            n="02"
            title="Colour"
            lead="Warm cream, espresso ink, and one green taken from the grease itself. Click any value to copy it — hex for the web, RGB for design and print tools."
          />

          {COLOR_GROUPS.map((group, gi) => (
            <div key={group.title} className="mt-16">
              <Reveal>
                <h3 className="display display-lg">{group.title}</h3>
                <p className="prose-airy mt-3 max-w-xl">{group.note}</p>
              </Reveal>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {group.tokens.map((token, i) => (
                  <Reveal key={token.variable} delay={(gi === 0 ? i : 0) * 80}>
                    <Swatch token={token} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════ typography */}
      <section className="shell-x section-y">
        <SectionHead
          id="type"
          n="03"
          title="Typography"
          lead="Three faces, all free from Google Fonts, so anyone making a flyer or a post can install them in a minute."
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {TYPEFACES.map((face, i) => (
            <Reveal key={face.name} delay={i * 90} className="rounded-[1.5rem] bg-shell-warm p-8">
              <p className="eyebrow">{face.role}</p>
              <p className="display display-lg mt-4">{face.name}</p>
              <p className={`mt-6 text-2xl leading-tight ${face.className}`}>
                {face.sample}
              </p>
              <p className="mt-6 text-sm leading-relaxed text-ink-soft">{face.detail}</p>
              <p className="mt-3 text-[0.8rem] text-ink-mute">{face.source}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16">
          <Reveal>
            <h3 className="display display-lg">The scale</h3>
            <p className="prose-airy mt-3 max-w-xl">
              Fluid — sizes shown are what they compute to at your current
              window width. Resize and they update.
            </p>
          </Reveal>
          <div className="mt-8">
            {TYPE_SCALE.map((t) => (
              <TypeSpecimen key={t.label} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ layout & components */}
      <section className="bg-shell-warm">
        <div className="shell-x section-y">
          <SectionHead
            id="layout"
            n="04"
            title="Layout"
            lead="Space does the work that borders and boxes would otherwise do. When something needs separating, add room before you add a line."
          />

          <dl className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {LAYOUT.map((l, i) => (
              <Reveal key={l.name} delay={(i % 3) * 80} className="hairline pt-6">
                <dt className="display display-md">{l.name}</dt>
                <dd className="mt-2 text-sm text-ink tabular-nums">
                  <code>{l.value}</code>
                </dd>
                <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{l.note}</dd>
              </Reveal>
            ))}
          </dl>

          <div id="components" className="mt-24 scroll-mt-28">
            <Reveal>
              <p className="eyebrow">05</p>
              <h2 className="display display-xl mt-5">Components</h2>
            </Reveal>

            <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-5">
              <Reveal className="rounded-[1.5rem] bg-shell p-8">
                <p className="eyebrow">Buttons</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <span className="pill pill-solid">Solid — primary</span>
                  <span className="pill pill-quiet">Quiet — secondary</span>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-ink-soft">
                  Pills only. One solid button per view — if two things look
                  equally primary, neither is.
                </p>
              </Reveal>

              <Reveal delay={90} className="rounded-[1.5rem] bg-shell p-8">
                <p className="eyebrow">Links</p>
                <p className="mt-6">
                  <span className="link-draw text-ink">An underline that draws itself</span>
                </p>
                <p className="mt-6 text-sm leading-relaxed text-ink-soft">
                  Inline links underline on hover over 460ms. Never blue, never
                  underlined at rest.
                </p>
              </Reveal>

              <Reveal delay={160} className="rounded-[1.5rem] bg-shell p-8">
                <p className="eyebrow">Tint panel</p>
                <div className="mt-6 rounded-2xl bg-pistachio-soft p-6">
                  <p className="display display-md">Pistachio Soft</p>
                  <p className="mt-2 text-sm text-ink-soft">
                    For quiet emphasis inside a section.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={230} className="rounded-[1.5rem] bg-shell p-8">
                <p className="eyebrow">Statistic</p>
                <div className="mt-6 rounded-2xl bg-forest p-6 text-shell">
                  <p className="display text-5xl">
                    9.5<span className="text-2xl"> oz</span>
                  </p>
                  <p className="eyebrow mt-3 text-shell/50">269g net</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ motion */}
      <section className="shell-x section-y">
        <SectionHead
          id="motion"
          n="06"
          title="Motion"
          lead="One easing curve, used for everything. Movement is slow and settles — nothing snaps, nothing bounces. All of it is disabled under prefers-reduced-motion."
        />
        <dl className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {MOTION.map((m, i) => (
            <Reveal key={m.name} delay={i * 80} className="hairline pt-6">
              <dt className="display display-md">{m.name}</dt>
              <dd className="mt-2 text-sm text-ink">
                <code>{m.value}</code>
              </dd>
              <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{m.note}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ═══════════════════════════════════════════════ photography */}
      <section className="bg-shell-warm">
        <div className="shell-x section-y">
          <SectionHead
            id="photography"
            n="07"
            title="Photography"
            lead="Soft daylight, warm surfaces, generous empty space around the jar. Hard flash, cold light and busy backgrounds are all off-brand — the product is pale green and gets lost against clutter."
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {[
              { label: "Packshot — jar upright", tone: "pistachio" as const },
              { label: "Texture — macro, raking light", tone: "warm" as const },
              { label: "In use — fingertip in the part", tone: "clay" as const },
              { label: "Portrait — Carmel, natural light", tone: "clay" as const },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <Shot label={s.label} ratio="4 / 5" tone={s.tone} className="rounded-[1.5rem]" />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="prose-airy mt-8 max-w-xl">
              Until real photography exists these slots ship as-is — captioned
              with the shot that belongs there rather than filled with
              something approximate.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════ voice */}
      <section className="shell-x section-y">
        <SectionHead
          id="voice"
          n="08"
          title="Voice"
          lead={`${BRAND.subtitle}. Warm and direct — a person who knows hair, not a brand doing a voice.`}
        />

        <ul className="mt-14 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {VOICE.principles.map((p, i) => (
            <Reveal as="li" key={p} delay={(i % 2) * 90} className="hairline pt-6">
              <p className="prose-airy">{p}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-16">
          <Reveal>
            <h3 className="display display-lg">Not this, this</h3>
          </Reveal>
          <div className="mt-8 grid gap-4 lg:gap-5">
            {VOICE.pairs.map((pair, i) => (
              <Reveal key={pair.good} delay={i * 80} className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <div className="rounded-2xl bg-clay-soft p-6">
                  <p className="eyebrow">Not this</p>
                  <p className="mt-3 text-ink-soft line-through decoration-ink-mute/50">
                    {pair.bad}
                  </p>
                </div>
                <div className="rounded-2xl bg-pistachio-soft p-6">
                  <p className="eyebrow">This</p>
                  <p className="display display-md mt-3">{pair.good}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={140}>
          <p className="prose-airy mt-14 max-w-2xl rounded-2xl bg-shell-warm p-7">
            <span className="text-ink">A legal note that is not optional:</span>{" "}
            MiMi Crack is a cosmetic product. Nothing written for it — on the
            site, on a flyer, in a caption — may claim it grows hair, treats
            hair loss, or does anything medical. &ldquo;Hair Fertilizer&rdquo;
            is the name and the metaphor; it is not a claim.
          </p>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════════════ assets */}
      <section className="bg-shell-warm">
        <div className="shell-x section-y">
          <SectionHead
            id="assets"
            n="09"
            title="Icons & share cards"
            lead="The icon is the wordmark reduced to one letter — its uppercase M, not a separate logo. The share card is what a link looks like in a text message, which before launch is most of where the brand appears at all."
          />

          <div className="mt-14 grid gap-12 lg:grid-cols-[auto_1fr] lg:gap-20">
            <Reveal className="flex items-end gap-6">
              {[96, 48, 32, 16].map((size) => (
                <figure key={size} className="flex flex-col items-center gap-3">
                  <Image
                    src="/icon.png"
                    alt={`MiMi Crack icon at ${size} pixels`}
                    width={size}
                    height={size}
                    className="rounded-[0.35rem] border border-hairline"
                  />
                  <figcaption className="eyebrow text-[0.6rem]">{size}</figcaption>
                </figure>
              ))}
            </Reveal>

            <Reveal delay={120} className="hairline pt-7">
              <h3 className="display display-md">Where they live</h3>
              <ul className="prose-airy mt-4 space-y-2.5">
                <li>
                  <code>src/app/favicon.ico</code> — 16, 32 and 48, for browser tabs.
                </li>
                <li>
                  <code>src/app/icon.png</code> — 512, for high-DPI and install prompts.
                </li>
                <li>
                  <code>src/app/apple-icon.png</code> — 180, the iOS home screen.
                </li>
                <li>
                  <code>public/og/</code> — the 1200 × 630 share cards.
                </li>
              </ul>
              <p className="prose-airy mt-5">
                Every icon size is drawn at its own size rather than shrunk from
                one large one, so Fraunces&rsquo; optical-size axis thickens the
                small ones instead of leaving hairlines that vanish in a tab.
                Above the tab, the M is never used alone — the full wordmark is.
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {[
              { file: "/og/default.png", use: "The site, the home page, and anything without its own" },
              { file: "/og/product.png", use: "Product" },
              { file: "/og/about.png", use: "About" },
              {
                file: `/og/${teaserBanner()}.png`,
                use: `The teaser — redrawn for every day of the countdown`,
              },
            ].map((card, i) => (
              <Reveal key={card.file} delay={i * 80}>
                <Image
                  src={card.file}
                  alt={`Share card — ${card.use}`}
                  width={1200}
                  height={630}
                  className="w-full rounded-[1.25rem] border border-hairline"
                />
                <p className="prose-airy mt-3 text-[0.95rem]">{card.use}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <p className="prose-airy mt-10 max-w-2xl">
              All of it is drawn by <code>node scripts/brand-assets.mjs</code> —
              run it, open the page it prints, press Generate. Before launch it
              also draws one card per remaining day, so a link shared today
              says how many days are left rather than repeating the date. The
              catch is that messaging apps cache link previews: the count is
              only as fresh as the last time the app fetched the page. After{" "}
              {LAUNCH_LABEL} the countdown cards go unused and the default one
              takes over.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
