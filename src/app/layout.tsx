import type { Metadata } from "next";
import { Fraunces, Inter, Parisienne } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { PRODUCT } from "@/lib/product";
import { siteUrl } from "@/lib/siteUrl";
import "./globals.css";

/** The banner every page falls back to. Pages with their own use share(). */
const OG_DEFAULT = {
  url: "/og/default.png",
  width: 1200,
  height: 630,
  alt: "MiMi Crack — Hair Fertilizer",
};

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// The script from the jar label, used two or three times on the whole site.
const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${PRODUCT.name} — ${PRODUCT.tagline}`,
    template: "%s · MiMi Crack",
  },
  description:
    "A scalp-first conditioning grease. Castor, olive and rosemary in a shea butter base. 9.5 oz, made in small batches.",
  openGraph: {
    title: PRODUCT.name,
    description: PRODUCT.tagline,
    url: siteUrl(),
    siteName: "MiMi Crack",
    type: "website",
    images: [OG_DEFAULT],
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT.name,
    description: PRODUCT.tagline,
    images: [OG_DEFAULT],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Font variables belong on <html>, not <body>: Tailwind resolves
    // --default-font-family at the root, so body-scoped variables are
    // undefined exactly where the base font-family is computed.
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${parisienne.variable}`}
    >
      <body className="antialiased">
        {/* Chrome lives in the (shop) route group, not here — see the note
            in src/app/(shop)/layout.tsx. */}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
