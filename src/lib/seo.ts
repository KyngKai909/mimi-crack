import type { Metadata } from "next";
import {
  LAUNCH_LABEL,
  MAX_COUNTDOWN_DAYS,
  daysUntilLaunch,
  hasLaunched,
} from "@/lib/launch";
import { PRODUCT } from "@/lib/product";

/**
 * Link-preview banners.
 *
 * Next merges metadata shallowly: a page that declares `openGraph` replaces
 * the layout's whole object rather than adding to it, so anything not
 * restated is simply lost. This builds the complete pair — Open Graph for
 * Facebook, iMessage, WhatsApp, Slack and the rest, Twitter's own tags for
 * X — from one call.
 *
 * The images themselves are static files under public/og, drawn by
 * scripts/brand-assets.html. Static matters: middleware skips anything with a
 * file extension, so a crawler can still fetch the banner while the shop is
 * behind the pre-launch gate.
 */
export type Banner =
  | "default"
  | "product"
  | "about"
  | "soon"
  | `soon-${number}`;

/**
 * Which banner the teaser shares.
 *
 * Before launch that's a dated one — "Opens in 12 days" — so the card in a
 * text message counts down with the page. A caveat worth knowing: platforms
 * cache link previews, so the count is only as fresh as the last time they
 * re-fetched the page. Changing the image URL each day is what lets a
 * re-fetch pick up the new number rather than reusing the cached picture.
 *
 * Past MAX_COUNTDOWN_DAYS no dated banner has been drawn, so it falls back to
 * the plain one, which names the date instead of counting.
 */
export function teaserBanner(now: number = Date.now()): Banner {
  if (hasLaunched(now)) return "default";
  const days = daysUntilLaunch(now);
  return days > MAX_COUNTDOWN_DAYS ? "soon" : (`soon-${days}` as Banner);
}

export function share({
  title,
  description,
  banner = "default",
  alt,
}: {
  /** Page title, without the site suffix — the suffix is added here. */
  title: string;
  description: string;
  banner?: Banner;
  alt?: string;
}): Metadata {
  const shared = `${title} · MiMi Crack`;
  const images = [
    { url: `/og/${banner}.png`, width: 1200, height: 630, alt: alt ?? shared },
  ];

  return {
    title,
    description,
    openGraph: {
      title: shared,
      description,
      siteName: "MiMi Crack",
      type: "website",
      images,
    },
    twitter: { card: "summary_large_image", title: shared, description, images },
  };
}

/**
 * What both gate pages share.
 *
 * The teaser and the password prompt are two doors onto the same closed shop,
 * so a link to either should look the same in a message — and count down the
 * same way. Defined once here because the prompt is what a *shared* deep link
 * resolves to: someone forwarding a product link before launch is sharing this
 * page whether they know it or not.
 *
 * Call it from generateMetadata, never from an exported constant: a constant
 * is evaluated once when the module loads, and the countdown would stop there.
 */
export function gateMetadata(): Metadata {
  return share({
    title: "Coming soon",
    description: `${PRODUCT.name} — ${PRODUCT.tagline}. Launching ${LAUNCH_LABEL}.`,
    banner: teaserBanner(),
    alt: `MiMi Crack — opens ${LAUNCH_LABEL}`,
  });
}
