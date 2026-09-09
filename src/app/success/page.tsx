import type { Metadata } from "next";
import Link from "next/link";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";
import { Marquee } from "@/components/Marquee";
import { PRODUCT, formatPrice } from "@/lib/product";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

type Summary = {
  email: string | null;
  total: number | null;
  currency: string;
  paid: boolean;
};

async function loadSummary(sessionId: string | undefined): Promise<Summary | null> {
  if (!sessionId || !isStripeConfigured()) return null;
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    return {
      email: session.customer_details?.email ?? null,
      total: session.amount_total,
      currency: (session.currency ?? "usd").toUpperCase(),
      paid: session.payment_status === "paid",
    };
  } catch {
    // A bad or expired session id shouldn't blow up the thank-you page.
    return null;
  }
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const summary = await loadSummary(session_id);

  return (
    <>
      <ClearCartOnMount />

      <div className="mono-micro flex items-center justify-between border-b border-ink px-4 py-2 text-ink/50">
        <span>Order received</span>
        <span>[ ✳ ]</span>
      </div>

      <div className="overflow-hidden border-b border-ink bg-acid">
        <h1 className="display display-mega -mb-[0.09em] whitespace-nowrap px-2">
          Thank you
        </h1>
      </div>

      <div className="grid border-b border-ink md:grid-cols-2">
        <div className="border-b border-ink p-4 md:border-b-0 md:border-r md:p-8">
          <p className="text-lg leading-snug">
            Your order is in.{" "}
            {summary?.paid && summary.email && (
              <>
                A receipt is on its way to{" "}
                <span className="bg-acid px-1">{summary.email}</span>.{" "}
              </>
            )}
            We pack and hand off to the carrier within 1–2 business days, and
            you&rsquo;ll get tracking by email as soon as the label is made.
          </p>

          {summary?.total != null && (
            <p className="display mt-8 text-6xl tabular-nums">
              {formatPrice(summary.total, summary.currency)}
            </p>
          )}

          <p className="font-script mt-8 text-4xl">{PRODUCT.scriptLine}</p>
        </div>

        <div className="flex flex-col">
          <p className="mono-micro border-b border-ink px-4 py-3 text-ink/45 md:px-8">
            [ While you wait ]
          </p>
          <ol className="flex-1">
            {PRODUCT.howToUse.slice(0, 3).map((s, i) => (
              <li
                key={s.step}
                className="invert-hover flex gap-5 border-b border-ink px-4 py-4 md:px-8"
              >
                <span className="display shrink-0 text-3xl leading-none text-ink/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="display text-xl leading-none">{s.step}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            href="/"
            className="mono-label flex items-center justify-between gap-6 bg-ink px-4 py-5 text-bone transition-colors duration-[120ms] hover:bg-acid hover:text-ink md:px-8"
          >
            <span>Back to the shop</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <Marquee items={["Order received", "Packing", "Shipping in 1–2 days"]} duration={22} />
    </>
  );
}
