import { NextResponse } from "next/server";
import { PREVIEW_COOKIE, PREVIEW_MAX_AGE, previewSecret } from "@/lib/preview";

/**
 * Exchange the site password for the preview cookie.
 *
 * The cookie is httpOnly, so the password never lands anywhere a script on the
 * page can read it, and the middleware is the only thing that inspects it.
 *
 * The throttle below is per-instance and in-memory, which on serverless means
 * it resets whenever a new instance spins up. It isn't a wall — it's enough to
 * make guessing tedious rather than instant.
 */
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 8;
const attempts = new Map<string, { count: number; expires: number }>();

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  const key = clientKey(request);
  const now = Date.now();
  const seen = attempts.get(key);
  const live = seen && seen.expires > now ? seen : null;

  if (live && live.count >= LIMIT) {
    return NextResponse.json(
      { ok: false, error: "Too many tries. Give it a few minutes." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const password =
    body && typeof body === "object" && typeof (body as { password?: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  if (password !== previewSecret()) {
    attempts.set(key, { count: (live?.count ?? 0) + 1, expires: now + WINDOW_MS });
    return NextResponse.json({ ok: false, error: "That password isn't right." }, { status: 401 });
  }

  attempts.delete(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PREVIEW_COOKIE, previewSecret(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: PREVIEW_MAX_AGE,
    path: "/",
  });
  return res;
}
