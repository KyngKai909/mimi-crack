"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Shop chrome, except on the pre-launch teaser.
 *
 * A nested layout can't remove its parent's chrome, and putting every shop
 * page into a route group just to exclude one page is a lot of churn for one
 * exception — so the teaser opts out here instead.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/soon") ?? false;

  if (bare) return <>{children}</>;

  return (
    <>
      <a
        href="#main"
        className="eyebrow sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-ink focus:px-6 focus:py-3 focus:text-shell"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
