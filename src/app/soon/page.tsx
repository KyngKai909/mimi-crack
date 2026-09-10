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

      {/* Chrome passes pointer events through to the canvas; only the things
          you need to touch opt back in. */}
      <div className="pointer-events-none relative z-10 flex min-h-[100svh] flex-col">
        <header className="shell-x flex items-center justify-between gap-4 py-4 sm:py-5">
          <p className="eyebrow">{PRODUCT.shortName}</p>
          <p className="eyebrow">{PRODUCT.size.label}</p>
        </header>

        <main className="flex flex-1 flex-col justify-center">
          {/* 01 — the mark, edge to edge */}
          <div className="px-[2vw]">
            <LaunchWordmark />
          </div>

          {/* 02 — the clock, immediately beneath it */}
          <div className="mt-6 border-y border-hairline py-7 sm:mt-8 sm:py-8">
            <LaunchCountdown />
          </div>

          {/* 03 — everything else, one centred column */}
          <div className="shell-x mx-auto mt-6 flex w-full max-w-xl flex-col items-center gap-5 text-center sm:mt-8">
            <div className="flex flex-col items-center gap-2">
              <p className="font-script text-4xl text-pistachio-deep sm:text-5xl">
                {PRODUCT.scriptLine}
              </p>
              <p className="display display-md">Opens {LAUNCH_LABEL}</p>
            </div>

            <div className="pointer-events-auto w-full">
              <NotifyForm />
            </div>
          </div>
        </main>

        <footer className="shell-x flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-between sm:py-5">
          <p className="eyebrow">© {new Date().getFullYear()} MiMi Crack</p>
          <ul className="pointer-events-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {BRAND.socials.filter((s) => s.href).map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-draw text-sm text-ink-soft hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  );
}
