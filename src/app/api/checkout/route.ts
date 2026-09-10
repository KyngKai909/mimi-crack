import { NextResponse } from "next/server";
import { z } from "zod";
import { MAX_QUANTITY, PRODUCT } from "@/lib/product";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { siteUrl } from "@/lib/siteUrl";

export const runtime = "nodejs";

const Body = z.object({
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
  email: z.string().email().max(160),
  address: z.object({
    name: z.string().min(1).max(120),
    street1: z.string().min(1).max(160),
    street2: z.string().max(160).optional(),
    city: z.string().min(1).max(80),
    state: z.string().min(1).max(40),
    zip: z.string().min(3).max(16),
    country: z.string().length(2),
    phone: z.string().max(40).optional(),
  }),
  shipping: z.object({
    rateId: z.string().min(1).max(120),
    label: z.string().min(1).max(120),
    amountCents: z.number().int().min(0).max(100_000),
    estimatedDays: z.number().int().min(0).max(90).nullable(),
  }),
});

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Set STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "That order didn't look right." }, { status: 400 });
  }
  const { quantity, email, address, shipping } = parsed.data;

  const origin = siteUrl(request);

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      // The price is built here from server-side product data. Nothing about
      // the amount comes from the browser, so a tampered request can't buy a
      // jar for a dollar.
      line_items: [
        {
          quantity,
          price_data: {
            currency: PRODUCT.currency,
            unit_amount: PRODUCT.priceCents,
            product_data: {
              name: PRODUCT.name,
              description: `${PRODUCT.tagline} — ${PRODUCT.size.label}`,
              images: [`${origin}/product/jar-front.webp`],
            },
          },
        },
      ],
      // The customer already picked a live Shippo rate for their address on
      // the cart page, so it goes in as the single available option rather
      // than asking Stripe to guess at shipping.
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: shipping.label,
            fixed_amount: {
              amount: shipping.amountCents,
              currency: PRODUCT.currency,
            },
            ...(shipping.estimatedDays !== null && {
              delivery_estimate: {
                minimum: { unit: "business_day" as const, value: Math.max(1, shipping.estimatedDays) },
                maximum: { unit: "business_day" as const, value: Math.max(1, shipping.estimatedDays) + 2 },
              },
            }),
          },
        },
      ],
      payment_intent_data: {
        shipping: {
          name: address.name,
          phone: address.phone,
          address: {
            line1: address.street1,
            line2: address.street2,
            city: address.city,
            state: address.state,
            postal_code: address.zip,
            country: address.country,
          },
        },
      },
      // Carried through to the webhook so fulfilment knows which rate was
      // quoted and can buy exactly that label.
      metadata: {
        sku: PRODUCT.id,
        quantity: String(quantity),
        shippo_rate_id: shipping.rateId,
        ship_to: JSON.stringify(address),
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json(
      { error: "We couldn't start checkout. Please try again." },
      { status: 502 },
    );
  }
}
