import { NextResponse, type NextRequest } from "next/server";
import { hasLaunched } from "@/lib/launch";
import { PREVIEW_COOKIE, PREVIEW_MAX_AGE, holdsPreview, previewSecret } from "@/lib/preview";

/**
 * Pre-launch gate.
 *
 * Everything is rewritten to the teaser until the launch moment passes, at
 * which point the gate lifts on its own — no deploy needed.
 *
 * A rewrite rather than a redirect, so the URL a visitor typed is preserved
 * and links they've been sent still work the moment the shop opens. Note that
 * this means the browser URL stays "/" while the teaser is showing: nothing
 * may decide what to render by reading the pathname. The shop's header and
 * footer live in the (shop) route group's layout for exactly that reason.
 *
 * Two ways through the gate before launch: type the site password on the
 * teaser, or open any page with ?preview=<password>. Both set the same cookie
 * for 30 days.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Never gate the teaser itself, Next internals, or static files.
  if (
    pathname.startsWith("/soon") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (hasLaunched()) return NextResponse.next();

  if (searchParams.get("preview") === previewSecret()) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("preview");
    const res = NextResponse.redirect(url);
    res.cookies.set(PREVIEW_COOKIE, previewSecret(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: PREVIEW_MAX_AGE,
      path: "/",
    });
    return res;
  }

  if (holdsPreview(request.cookies.get(PREVIEW_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/soon";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
