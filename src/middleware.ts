import { NextResponse, type NextRequest } from "next/server";
import { hasLaunched } from "@/lib/launch";
import { PREVIEW_COOKIE, PREVIEW_MAX_AGE, holdsPreview, previewSecret } from "@/lib/preview";

/**
 * Pre-launch gate.
 *
 * Two destinations before launch. The front door gets the teaser: a countdown
 * and a place to leave an email, which is what someone arriving cold should
 * see. Any deeper link — a product someone was sent — gets the password
 * prompt instead, carrying the path they asked for so unlocking lands them
 * there rather than dumping them on the home page.
 *
 * The gate lifts on its own once the launch moment passes — no deploy needed.
 *
 * Both destinations are reached by rewriting rather than redirecting, so the
 * URL a visitor typed is preserved and the link they were sent still works the
 * moment the shop opens. That means the browser URL stays whatever they asked
 * for while a gate page is showing: nothing may decide what to render by
 * reading the pathname. The shop's header and footer live in the (shop) route
 * group's layout for exactly that reason.
 *
 * Two ways through before launch: type the site password, on the prompt or on
 * the teaser, or open any page with ?preview=<password>. Both set the same
 * cookie for 30 days.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Never gate the two gate pages themselves, Next internals, or static files.
  if (
    pathname.startsWith("/soon") ||
    pathname.startsWith("/locked") ||
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
  url.search = "";
  if (pathname === "/") {
    url.pathname = "/soon";
  } else {
    url.pathname = "/locked";
    url.searchParams.set("to", pathname);
  }
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
