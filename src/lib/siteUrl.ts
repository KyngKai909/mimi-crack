/**
 * Absolute origin for this deployment.
 *
 * The resolution order matters, and so does the *kind* of check:
 *
 *  1. NEXT_PUBLIC_SITE_URL, when it's actually non-empty. The check is
 *     truthiness rather than `??` on purpose — an environment variable set to
 *     an empty string is still a string, so `??` sails straight past it and
 *     hands `new URL("")` an empty value. That throws ERR_INVALID_URL during
 *     Next's page-data collection and fails the whole build, which is exactly
 *     how this broke on Vercel.
 *  2. VERCEL_URL — the per-deployment host. Preview builds get their own
 *     absolute URLs this way instead of pointing at production. It arrives
 *     without a protocol, so one gets added.
 *  3. The incoming request's own origin, where we have one.
 *  4. Local dev.
 */
export function siteUrl(request?: Request): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalize(explicit);

  // On production, prefer the project's canonical domain. VERCEL_URL is the
  // immutable per-deployment host — correct for previews, but it changes on
  // every deploy, so using it in production would churn og:url and canonical
  // links against a hostname nobody shares.
  if (process.env.VERCEL_ENV === "production") {
    const canonical = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
    if (canonical) return normalize(canonical);
  }

  const vercel =
    process.env.VERCEL_URL?.trim() || process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (vercel) return normalize(vercel);

  if (request) {
    try {
      return new URL(request.url).origin;
    } catch {
      // Fall through to the local default.
    }
  }

  return "http://localhost:3310";
}

/** Add a protocol if the value is a bare host, and drop any trailing slash. */
function normalize(value: string): string {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}
