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
      <SeedField />

      {/* Everything above the field. Pointer events pass through to the
          canvas except on the things you actually need to touch. */}
      <div className="pointer-events-none relative z-10 flex min-h-[100svh] flex-col">
        <header className="shell-x flex items-center justify-between gap-4 pt-8">
          <p className="eyebrow">{PRODUCT.badge}</p>
          <p className="eyebrow">{PRODUCT.size.label}</p>
        </header>

        <main className="flex flex-1 flex-col justify-center gap-12 py-12 sm:gap-16">
          <div className="px-[2vw]">
            <LaunchWordmark />
          </div>

          <div className="shell-x flex flex-col items-center gap-3 text-center">
            <p className="font-script text-4xl text-pistachio-deep sm:text-5xl">
              {PRODUCT.scriptLine}
            </p>
            <p className="prose-airy max-w-md">
              {BRAND.subtitle}. The first jar opens {LAUNCH_LABEL}.
            </p>
          </div>

          <div className="shell-x">
            <LaunchCountdown />
          </div>

          <div className="shell-x pointer-events-auto">
            <NotifyForm />
          </div>
        </main>

        <footer className="shell-x flex flex-col items-center gap-4 pb-10 text-center sm:flex-row sm:justify-between sm:text-left">
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
