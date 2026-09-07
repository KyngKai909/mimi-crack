import type { Metadata } from "next";
import { Fraunces, Inter, Parisienne } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PRODUCT } from "@/lib/product";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Matches the "Stimulates Scalp" script on the jar.
const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${PRODUCT.name} — ${PRODUCT.tagline}`,
    template: "%s · MiMi Crack",
  },
  description:
    "A scalp-first conditioning grease. Castor, olive and rosemary oils in a shea butter base — 9.5 oz of the stuff that keeps parts soft and ends intact.",
  openGraph: {
    title: `${PRODUCT.name}`,
    description: PRODUCT.tagline,
    url: siteUrl,
    siteName: "MiMi Crack",
    images: [{ url: "/product/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT.name,
    description: PRODUCT.tagline,
    images: ["/product/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables go on <html>, not <body>: Tailwind resolves
    // --default-font-family at the root element, so variables scoped to <body>
    // are undefined exactly where the base font-family is computed.
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${parisienne.variable}`}
    >
      <body className="antialiased">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:text-cream"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
