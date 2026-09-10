import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/**
 * Shop chrome.
 *
 * This is a route group, so it adds no path segment — but it does mean the
 * header and footer are attached structurally to the shop pages rather than
 * decided at render time.
 *
 * That distinction matters: the pre-launch gate *rewrites* to /soon rather
 * than redirecting, so the browser URL stays whatever the visitor typed. Any
 * approach that asked `usePathname()` whether to draw the chrome saw "/" and
 * drew it — over the teaser. Nesting solves it regardless of the URL.
 */
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
