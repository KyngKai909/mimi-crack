import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { buyLabel, isShippoConfigured } from "@/lib/shippo";

export const runtime = "nodejs";

/**
 * Stripe fulfilment webhook.
 *
 * Point Stripe at POST /api/webhooks/stripe and subscribe to
 * `checkout.session.completed`. Locally:
 *
 *   stripe listen --forward-to localhost:3000/api/webhooks/stripe
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // The raw body is required — the signature is computed over the exact bytes
  // Stripe sent, so parsing it first would invalidate the check.
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await onPaid(session);
  }

  return NextResponse.json({ received: true });
}

async function onPaid(session: Stripe.Checkout.Session) {
  const rateId = session.metadata?.shippo_rate_id;

  console.log("[order] paid", {
    sessionId: session.id,
    email: session.customer_details?.email,
    quantity: session.metadata?.quantity,
    total: session.amount_total,
    shippoRateId: rateId,
  });

  // TODO(owner): persist the order somewhere durable. Right now the record of
  // truth is the Stripe dashboard, which is workable at low volume but gives
  // you nothing to query and no way to show order history.

  // Buying a label debits the Shippo account for real, so it stays behind an
  // explicit opt-in rather than firing the first time a test order lands.
  if (process.env.SHIPPO_AUTO_BUY_LABEL !== "true") {
    console.log("[order] auto-buy disabled; buy the label from the Shippo dashboard");
    return;
  }
  if (!rateId || !isShippoConfigured()) {
    console.warn("[order] no Shippo rate on the session; skipping label purchase");
    return;
  }

  try {
    const tx = await buyLabel(rateId);
    if (tx.status === "SUCCESS") {
      console.log("[order] label bought", {
        tracking: tx.trackingNumber,
        label: tx.labelUrl,
      });
    } else {
      console.error("[order] label purchase failed", tx.messages);
    }
  } catch (err) {
    // Never 500 here: Stripe would retry the webhook and the customer's money
    // has already moved. Surface it in logs and fix the shipment by hand.
    console.error("[order] label purchase threw", err);
  }
}
