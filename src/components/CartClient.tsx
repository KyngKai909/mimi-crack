"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MAX_QUANTITY, PRODUCT, formatPrice } from "@/lib/product";
import { useCart } from "@/lib/cart";
import { Shot } from "./Shot";
import { FitText } from "./FitText";

type Quote = {
  rateId: string;
  provider: string;
  service: string;
  amountCents: number;
  currency: string;
  estimatedDays: number | null;
  durationTerms: string | null;
};

type Address = {
  name: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
};

const EMPTY: Address = {
  name: "",
  street1: "",
  street2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
  phone: "",
};

const field =
  "w-full rounded-xl border border-hairline bg-paper px-4 py-3.5 text-[0.95rem] text-ink outline-none transition-colors duration-300 placeholder:text-ink-mute/60 focus:border-forest";
const labelCls = "eyebrow block";

export function CartClient() {
  const { quantity, setQuantity, remove, subtotalCents, ready } = useCart();

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<Address>(EMPTY);
  const [quotes, setQuotes] = useState<Quote[] | null>(null);
  const [chosen, setChosen] = useState<string | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Any change to the destination or the parcel invalidates a quote that was
  // priced against the old one — better no rate than a stale one.
  useEffect(() => {
    setQuotes(null);
    setChosen(null);
  }, [address, quantity]);

  const selected = quotes?.find((q) => q.rateId === chosen) ?? null;
  const totalCents = subtotalCents + (selected?.amountCents ?? 0);

  const addressComplete =
    address.name.trim() &&
    address.street1.trim() &&
    address.city.trim() &&
    address.state.trim() &&
    address.zip.trim() &&
    address.country.trim().length === 2;

  async function getRates() {
    setError(null);
    setLoadingRates(true);
    try {
      const res = await fetch("/api/shipping/rates", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          quantity,
          address: {
            ...address,
            street2: address.street2 || undefined,
            phone: address.phone || undefined,
            email: email || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Couldn't fetch rates.");
      setQuotes(data.rates);
      setChosen(data.rates[0]?.rateId ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't fetch rates.");
    } finally {
      setLoadingRates(false);
    }
  }

  async function checkout() {
    if (!selected) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          quantity,
          email,
          address: {
            ...address,
            street2: address.street2 || undefined,
            phone: address.phone || undefined,
          },
          shipping: {
            rateId: selected.rateId,
            label: `${selected.provider} ${selected.service}`,
            amountCents: selected.amountCents,
            estimatedDays: selected.estimatedDays,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "Couldn't start checkout.");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't start checkout.");
      setSubmitting(false);
    }
  }

  if (!ready) {
    return <p className="shell-x py-32 text-ink-mute">Loading your cart…</p>;
  }

  if (quantity === 0) {
    return (
      <section className="pt-10">
        <div className="px-[2vw]">
          <FitText className="display">Nothing in the bag.</FitText>
        </div>
        <div className="shell-x mt-12 flex flex-col items-start gap-8 pb-32 sm:flex-row sm:items-center sm:justify-between">
          <p className="prose-airy max-w-sm">
            There&rsquo;s only one thing to put in it — and it lasts a couple of
            months.
          </p>
          <Link href="/product" className="pill pill-solid">
            Shop the jar — {formatPrice(PRODUCT.priceCents)}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pt-6">
        <div className="shell-x">
          <p className="eyebrow">Checkout</p>
        </div>
        <div className="mt-6 px-[2vw]">
          <FitText className="display">Your bag.</FitText>
        </div>
      </section>

      <div className="shell-x grid gap-14 pb-28 pt-16 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
        {/* ─────────────────────────────────────────────── left column */}
        <div>
          {/* line item */}
          <div className="flex gap-6 pb-10">
            <div className="w-28 shrink-0 sm:w-36">
              <Shot label="Packshot" ratio="4 / 5" tone="pistachio" className="rounded-2xl" />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-5">
              <div>
                <h2 className="display display-md">{PRODUCT.shortName}</h2>
                <p className="mt-2 text-sm text-ink-mute">{PRODUCT.size.label}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <label className="sr-only" htmlFor="qty">Quantity</label>
                  <select
                    id="qty"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="rounded-full border border-hairline bg-paper px-4 py-2 text-sm text-ink"
                  >
                    {Array.from({ length: MAX_QUANTITY }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={remove}
                    className="link-draw text-sm text-ink-mute hover:text-ink"
                  >
                    Remove
                  </button>
                </div>
                <p className="display text-2xl tabular-nums">
                  {formatPrice(subtotalCents)}
                </p>
              </div>
            </div>
          </div>

          {/* ship to */}
          <section className="hairline pt-12">
            <h2 className="display display-lg">Where it&rsquo;s going</h2>
            <p className="prose-airy mt-3 max-w-md">
              We quote live carrier rates for your address before you pay.
            </p>

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="email">Email</label>
                <input
                  id="email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className={`mt-2.5 ${field}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="name">Full name</label>
                <input
                  id="name" autoComplete="name" value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  className={`mt-2.5 ${field}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="street1">Address</label>
                <input
                  id="street1" autoComplete="address-line1" value={address.street1}
                  onChange={(e) => setAddress({ ...address, street1: e.target.value })}
                  className={`mt-2.5 ${field}`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="street2">
                  Apartment, suite <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="street2" autoComplete="address-line2" value={address.street2}
                  onChange={(e) => setAddress({ ...address, street2: e.target.value })}
                  className={`mt-2.5 ${field}`}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="city">City</label>
                <input
                  id="city" autoComplete="address-level2" value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className={`mt-2.5 ${field}`}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="state">State / Province</label>
                <input
                  id="state" autoComplete="address-level1" value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  placeholder="CA" className={`mt-2.5 ${field}`}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="zip">ZIP / Postal code</label>
                <input
                  id="zip" autoComplete="postal-code" value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className={`mt-2.5 ${field}`}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="country">Country code</label>
                <input
                  id="country" autoComplete="country" maxLength={2} value={address.country}
                  onChange={(e) =>
                    setAddress({ ...address, country: e.target.value.toUpperCase().slice(0, 2) })
                  }
                  className={`mt-2.5 ${field} uppercase`}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="phone">
                  Phone <span className="normal-case tracking-normal">(optional, helps couriers)</span>
                </label>
                <input
                  id="phone" type="tel" autoComplete="tel" value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className={`mt-2.5 ${field}`}
                />
              </div>
            </div>

            <button
              type="button" onClick={getRates}
              disabled={!addressComplete || loadingRates}
              className="pill pill-quiet mt-8 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:bg-transparent disabled:hover:text-ink"
            >
              {loadingRates ? "Checking carriers…" : "Get shipping rates"}
            </button>
          </section>

          {/* rates */}
          {quotes && quotes.length > 0 && (
            <fieldset className="hairline mt-12 pt-12">
              <legend className="display display-lg">Shipping method</legend>
              <div className="mt-7 space-y-3">
                {quotes.map((q) => (
                  <label
                    key={q.rateId}
                    className={`flex cursor-pointer items-center justify-between gap-5 rounded-2xl border px-6 py-5 transition-colors duration-300 ${
                      chosen === q.rateId
                        ? "border-forest bg-pistachio-soft"
                        : "border-hairline hover:border-ink/25"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <input
                        type="radio" name="rate" value={q.rateId}
                        checked={chosen === q.rateId}
                        onChange={() => setChosen(q.rateId)}
                        className="h-4 w-4 accent-forest"
                      />
                      <span>
                        <span className="block text-[0.95rem] text-ink">
                          {q.provider} · {q.service}
                        </span>
                        <span className="mt-0.5 block text-sm text-ink-mute">
                          {q.estimatedDays
                            ? `About ${q.estimatedDays} business ${q.estimatedDays === 1 ? "day" : "days"}`
                            : (q.durationTerms ?? "Delivery estimate unavailable")}
                        </span>
                      </span>
                    </span>
                    <span className="shrink-0 text-[0.95rem] tabular-nums">
                      {formatPrice(q.amountCents, q.currency)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
        </div>

        {/* ────────────────────────────────────────────── right column */}
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-[1.75rem] bg-shell-warm p-8">
            <p className="eyebrow">Summary</p>

            <dl className="mt-7 space-y-4 text-[0.95rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">
                  {PRODUCT.shortName} × {quantity}
                </dt>
                <dd className="tabular-nums">{formatPrice(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Shipping</dt>
                <dd className="text-right tabular-nums">
                  {selected ? (
                    formatPrice(selected.amountCents, selected.currency)
                  ) : (
                    <span className="text-ink-mute">Calculated left</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Taxes</dt>
                <dd className="text-ink-mute">Shown at payment</dd>
              </div>
            </dl>

            <div className="hairline mt-7 flex items-end justify-between gap-4 pt-7">
              <span className="eyebrow">Total</span>
              <span className="display text-3xl tabular-nums">
                {formatPrice(totalCents)}
              </span>
            </div>

            {error && (
              <p role="alert" className="mt-6 rounded-2xl bg-clay px-5 py-4 text-sm text-ink">
                {error}
              </p>
            )}

            <button
              type="button" onClick={checkout}
              disabled={!selected || !email || submitting}
              className="pill pill-solid mt-7 w-full disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
            >
              {submitting ? "Redirecting…" : "Continue to payment"}
            </button>

            <p className="mt-5 text-center text-xs leading-relaxed text-ink-mute">
              {!selected
                ? "Add your address and pick a shipping method to continue."
                : "You'll pay securely on Stripe. Card details never touch this site."}
            </p>

            <Link
              href="/product"
              className="link-draw mx-auto mt-6 block w-fit text-sm text-ink-soft"
            >
              Keep shopping
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
