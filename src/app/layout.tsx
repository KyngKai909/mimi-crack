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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3310";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${PRODUCT.name} — ${PRODUCT.tagline}`,
    template: "%s · MiMi Crack",
  },
  description:
    "A scalp-first conditioning grease. Castor, olive and rosemary in a shea butter base. 9.5 oz, made in small batches.",
  openGraph: {
    title: PRODUCT.name,
    description: PRODUCT.tagline,
    url: siteUrl,
    siteName: "MiMi Crack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT.name,
    description: PRODUCT.tagline,
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
        <a
          href="#main"
          className="eyebrow sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-ink focus:px-6 focus:py-3 focus:text-shell"
        >
          Skip to content
        </a>
        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
