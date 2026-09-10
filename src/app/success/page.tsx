import type { Metadata } from "next";
import Link from "next/link";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";
import { FitText } from "@/components/FitText";
import { Reveal } from "@/components/Reveal";
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

      <section className="pt-10">
        <div className="shell-x">
          <Reveal>
            <p className="eyebrow">Order received</p>
          </Reveal>
        </div>
        <div className="mt-8 px-[2vw]">
          <Reveal line delay={80}>
            <FitText className="display">Thank you.</FitText>
          </Reveal>
        </div>
      </section>

      <section className="shell-x section-y">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div>
            <Reveal>
              <p className="prose-airy max-w-lg text-[1.15rem]">
                Your order is in.{" "}
                {summary?.paid && summary.email && (
                  <>
                    A receipt is on its way to{" "}
                    <span className="text-ink">{summary.email}</span>.{" "}
                  </>
                )}
                We pack and hand off to the carrier within 1–2 business days,
                and you&rsquo;ll get tracking by email as soon as the label is
                made.
              </p>
            </Reveal>

            {summary?.total != null && (
              <Reveal delay={120}>
                <p className="display mt-10 text-5xl tabular-nums">
                  {formatPrice(summary.total, summary.currency)}
                </p>
              </Reveal>
            )}

            <Reveal delay={200}>
              <Link href="/" className="pill pill-quiet mt-12">
                Back to the shop
              </Link>
            </Reveal>
          </div>

          <Reveal delay={160} className="rounded-[1.75rem] bg-pistachio-soft p-8 sm:p-10">
            <p className="eyebrow">While you wait</p>
            <ol className="mt-7 space-y-7">
              {PRODUCT.howToUse.slice(0, 3).map((s, i) => (
                <li key={s.step} className="flex gap-5">
                  <span className="display text-xl text-pistachio-deep tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="display display-md">{s.step}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>
    </>
  );
}
