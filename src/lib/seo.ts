import type { Metadata } from "next";

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
export type Banner = "default" | "product" | "about" | "soon";

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
