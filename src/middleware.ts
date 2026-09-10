import { NextResponse, type NextRequest } from "next/server";
import { hasLaunched } from "@/lib/launch";

/**
 * Pre-launch gate.
 *
 * Everything is rewritten to the teaser until the launch moment passes, at
 * which point the gate lifts on its own — no deploy needed.
 *
 * A rewrite rather than a redirect, so the URL a visitor typed is preserved
 * and links they've been sent still work the moment the shop opens.
 *
 * To see the real site before launch, visit any page with `?preview=<token>`,
 * where the token is LAUNCH_PREVIEW_TOKEN. That sets a cookie for 30 days.
 * With no token configured, `?preview=1` works — set a token to close that.
 */
const COOKIE = "mimi-preview";

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

  const token = process.env.LAUNCH_PREVIEW_TOKEN;
  const offered = searchParams.get("preview");
  const grants = token ? offered === token : offered === "1";

  if (grants) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("preview");
    const res = NextResponse.redirect(url);
    res.cookies.set(COOKIE, token ?? "1", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return res;
  }

  if (request.cookies.get(COOKIE)?.value === (token ?? "1")) {
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
