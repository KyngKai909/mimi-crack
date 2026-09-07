import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";
import { Sprig } from "@/components/Sprig";
import { formatPrice } from "@/lib/product";

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
    <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8 sm:py-28">
      <ClearCartOnMount />

      <div className="relative mx-auto h-44 w-40">
        <Image
          src="/product/jar-front.webp"
          alt=""
          fill
          sizes="10rem"
          className="object-contain"
        />
      </div>

      <Sprig className="mx-auto mt-8 h-6 w-28 text-ink-faint" />

      <h1 className="mt-6 font-display text-4xl font-semibold text-ink sm:text-5xl">
        Thank you
      </h1>

      {summary?.paid ? (
        <p className="mt-5 leading-relaxed text-ink-soft">
          Your order is in.{" "}
          {summary.email && (
            <>
              A receipt is on its way to{" "}
              <span className="text-ink">{summary.email}</span>.{" "}
            </>
          )}
          We pack and hand off to the carrier within 1–2 business days, and
          you&rsquo;ll get tracking by email as soon as the label is made.
        </p>
      ) : (
        <p className="mt-5 leading-relaxed text-ink-soft">
          Your order is in. We pack and hand off to the carrier within 1–2
          business days, and you&rsquo;ll get tracking by email as soon as the
          label is made.
        </p>
      )}

      {summary?.total != null && (
        <p className="mt-6 font-display text-2xl text-ink tabular-nums">
          {formatPrice(summary.total, summary.currency)}
        </p>
      )}

      <Link
        href="/"
        className="mt-10 inline-block rounded-full bg-ink px-8 py-3.5 text-[0.78rem] tracking-label-sm text-cream uppercase transition-colors hover:bg-botanical-deep"
      >
        Back to the shop
      </Link>
    </div>
  );
}
