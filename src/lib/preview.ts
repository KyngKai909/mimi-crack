/**
 * The pre-launch gate's shared secret.
 *
 * One value, read by three places: the middleware that decides whether a
 * request sees the shop or the teaser, the /api/unlock route that hands out
 * the cookie, and nothing else. Keeping it here means the three can't drift.
 *
 * SITE_PASSWORD overrides the default. Middleware runs on the edge, where
 * Next inlines process.env at build time, so changing it in Vercel needs a
 * redeploy to take effect — it is not picked up live.
 */
export const PREVIEW_COOKIE = "mimi-preview";

/** Thirty days, so nobody has to keep re-entering it before launch. */
export const PREVIEW_MAX_AGE = 60 * 60 * 24 * 30;

const FALLBACK = "commitment123";

export function previewSecret(): string {
  const configured =
    process.env.SITE_PASSWORD?.trim() || process.env.LAUNCH_PREVIEW_TOKEN?.trim();
  return configured || FALLBACK;
}

export function holdsPreview(cookieValue: string | undefined): boolean {
  return typeof cookieValue === "string" && cookieValue === previewSecret();
}
