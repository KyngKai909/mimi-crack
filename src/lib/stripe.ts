import Stripe from "stripe";

/**
 * Server-side Stripe client.
 *
 * Constructed lazily so that importing this module — which happens during
 * `next build` while it renders pages — doesn't hard-fail on a machine that
 * has no keys yet. The throw lands at request time instead, where it's
 * actionable.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Copy .env.example to .env.local and add your Stripe secret key.",
    );
  }
  cached = new Stripe(key);
  return cached;
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
