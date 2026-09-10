import type { Metadata } from "next";
import { LAUNCH_LABEL } from "@/lib/launch";
import { PRODUCT } from "@/lib/product";
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
        {/* 01 — the mark, edge to edge */}
        <div className="px-[2vw]">
          <LaunchWordmark />
        </div>

        {/* 02 — the clock, immediately beneath it */}
        <div className="mt-[clamp(0.9rem,3vh,2.25rem)] border-y border-hairline py-[clamp(0.9rem,2.7vh,2rem)]">
          <LaunchCountdown />
        </div>

        {/* 03 — everything else, one centred column */}
        <div className="shell-x mx-auto mt-[clamp(0.9rem,3vh,2.25rem)] flex w-full max-w-xl flex-col items-center gap-[clamp(0.65rem,2vh,1.25rem)] text-center">
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
        </div>
      </div>
    </div>
  );
}
