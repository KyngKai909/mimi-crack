import type { Metadata } from "next";
import { Anton, Archivo, Parisienne, Space_Mono } from "next/font/google";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Cursor } from "@/components/Cursor";
import { PRODUCT } from "@/lib/product";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// The delicate script off the jar, kept as a deliberate counterpoint to all
// the condensed shouting. Used two or three times on the whole site.
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
    template: "%s · MIMI CRACK",
  },
  description:
    "A scalp-first conditioning grease. Castor, olive and rosemary in a shea butter base. 9.5 oz.",
  openGraph: {
    title: PRODUCT.name,
    description: PRODUCT.tagline,
    url: siteUrl,
    siteName: "MIMI CRACK",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PRODUCT.name,
    description: PRODUCT.tagline,
    images: ["/og.png"],
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
      className={`${anton.variable} ${archivo.variable} ${spaceMono.variable} ${parisienne.variable}`}
    >
      <body className="grain antialiased">
        <a
          href="#main"
          className="mono-label sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:bg-ink focus:px-5 focus:py-3 focus:text-bone"
        >
          Skip to content
        </a>
        <CartProvider>
          <Cursor />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
