import type { Metadata } from "next";
import Link from "next/link";
import { LAUNCH_LABEL } from "@/lib/launch";
import { gateMetadata } from "@/lib/seo";
import { LaunchWordmark } from "@/components/LaunchWordmark";
import { SeedField } from "@/components/SeedField";
import { UnlockForm } from "@/components/UnlockForm";

/**
 * This page is what a shared deep link actually resolves to before launch, so
 * it carries the same counting-down card as the teaser rather than falling
 * back to the plain site one. Hourly, for the same reason the teaser is.
 */
export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return { ...gateMetadata(), robots: { index: false, follow: false } };
}

/**
 * The prompt someone gets when they follow a link into the shop before it
 * opens — a product link they were sent, say — rather than arriving at the
 * front door.
 *
 * The teaser answers "what is this and when"; this page answers "you're in the
 * right place, you just need the password". Sending deep links to the teaser
 * instead would silently swallow the page they asked for.
 *
 * `to` is the path they were after. The middleware sets it from the request's
 * own pathname, so it is ours rather than a visitor's — but it still arrives
 * as a query string, so it is validated as a same-site path before anything
 * navigates to it.
 */
function safePath(value: string | string[] | undefined): string {
  if (typeof value !== "string") return "/";
  // Single leading slash only: "//evil.com" is a protocol-relative URL.
  if (!/^\/(?!\/)[\w\-./]*$/.test(value)) return "/";
  return value;
}

export default async function LockedPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string | string[] }>;
}) {
  const { to } = await searchParams;
  const next = safePath(to);

  return (
    <div className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden="true" className="launch-bloom pointer-events-none absolute inset-0" />
      <SeedField />

      <div className="pointer-events-none relative z-10 flex min-h-[100svh] w-full flex-col justify-center py-[clamp(1rem,3vh,2.5rem)]">
        <div className="mx-auto w-full max-w-3xl px-[6vw]">
          <LaunchWordmark />
        </div>

        <div className="shell-x mx-auto mt-[clamp(1.4rem,4vh,2.75rem)] flex w-full max-w-xl flex-col items-center gap-[clamp(0.8rem,2.2vh,1.4rem)] text-center">
          <div className="flex flex-col items-center gap-[clamp(0.4rem,1.2vh,0.7rem)]">
            <p className="eyebrow">Not open yet</p>
            <h1 className="display text-[clamp(1.4rem,min(5.5vw,4vh),2.4rem)] leading-snug">
              The shop opens {LAUNCH_LABEL}
            </h1>
            <p className="prose-airy text-[0.95rem]">
              If you have the password, you can look around early.
            </p>
          </div>

          <UnlockForm expanded next={next} />

          <Link
            href="/"
            className="link-draw pointer-events-auto text-[0.78rem] tracking-[0.14em] text-ink-mute uppercase transition-colors hover:text-ink"
          >
            See the countdown
          </Link>
        </div>
      </div>
    </div>
  );
}
