import type { Metadata } from "next";
import { LAUNCH_LABEL } from "@/lib/launch";
import { PRODUCT } from "@/lib/product";
import { BRAND } from "@/lib/brand";
import { LaunchWordmark } from "@/components/LaunchWordmark";
import { LaunchCountdown } from "@/components/LaunchCountdown";
import { NotifyForm } from "@/components/NotifyForm";
import { SeedField } from "@/components/SeedField";

export const metadata: Metadata = {
  title: "Coming soon",
  description: `${PRODUCT.name} — ${PRODUCT.tagline}. Launching ${LAUNCH_LABEL}.`,
  openGraph: {
    title: `${PRODUCT.name} — coming soon`,
    description: `Launching ${LAUNCH_LABEL}.`,
  },
};

export default function SoonPage() {
  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Bloom sits under the field so seeds drift over it, not through it. */}
      <div aria-hidden="true" className="launch-bloom pointer-events-none absolute inset-0" />
      <SeedField />

      {/* No header or footer here — the teaser is one composition, and
          chrome would only compete with it. Pointer events pass through to
          the canvas except on the form. */}
      <div className="pointer-events-none relative z-10 flex min-h-[100svh] w-full flex-col justify-center py-[clamp(1rem,3vh,2.5rem)]">
        {/* 01 — the mark, edge to edge, with the product line locked to it
            rather than floating in a bar of its own */}
        <div className="px-[2vw]">
          <LaunchWordmark />
        </div>
        <p className="eyebrow mt-[clamp(0.5rem,1.4vh,1rem)] text-center">
          {PRODUCT.shortName} · {PRODUCT.size.label}
        </p>

        {/* 02 — the clock, immediately beneath it */}
        <div className="mt-[clamp(0.9rem,3vh,2.25rem)] border-y border-hairline py-[clamp(0.8rem,2.5vh,1.9rem)]">
          <LaunchCountdown />
        </div>

        {/* 03 — everything else, one centred column */}
        <div className="shell-x mx-auto mt-[clamp(0.9rem,3vh,2.25rem)] flex w-full max-w-xl flex-col items-center gap-[clamp(0.6rem,1.9vh,1.2rem)] text-center">
          <div className="flex flex-col items-center gap-2">
            <p className="font-script text-[clamp(1.7rem,min(9vw,5vh),3.25rem)] leading-tight text-pistachio-deep">
              {PRODUCT.scriptLine}
            </p>
            <p className="display text-[clamp(1rem,min(3.4vw,2.5vh),1.6rem)] leading-snug">
              Opens {LAUNCH_LABEL}
            </p>
          </div>

          <div className="pointer-events-auto w-full">
            <NotifyForm />
          </div>

          <div className="flex flex-col items-center gap-[clamp(0.35rem,1vh,0.6rem)]">
            <ul className="pointer-events-auto flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
              {BRAND.socials.filter((s) => s.href).map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-draw text-[0.85rem] text-ink-soft hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="eyebrow text-[0.6rem]">
              © {new Date().getFullYear()} MiMi Crack
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
