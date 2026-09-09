"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MAX_QUANTITY, PRODUCT, formatPrice } from "@/lib/product";
import { Slot } from "./Slot";
import { useCart } from "@/lib/cart";

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
  "w-full border border-ink bg-bone px-3 py-3 text-sm text-ink outline-none transition-colors duration-[120ms] placeholder:text-ink/35 focus:bg-acid focus:placeholder:text-ink/50";
const labelCls = "mono-micro block text-ink/45";

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
    return <div className="mono-label px-4 py-24 text-ink/45">Loading cart…</div>;
  }

  if (quantity === 0) {
    return (
      <div className="border-b border-ink">
        <div className="overflow-hidden">
          <h1 className="display display-mega -mb-[0.09em] whitespace-nowrap px-2">
            Empty
          </h1>
        </div>
        <div className="flex flex-col justify-between gap-5 border-t border-ink p-4 sm:flex-row sm:items-center">
          <p className="mono-label text-ink/60">
            There&rsquo;s only one thing to put in it.
          </p>
          <Link
            href="/product"
            className="mono-label inline-flex items-center justify-between gap-8 border border-ink bg-ink px-7 py-4 text-bone transition-colors duration-[120ms] hover:bg-acid hover:text-ink"
          >
            <span>Shop the jar</span>
            <span>{formatPrice(PRODUCT.priceCents)} →</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr]">
      {/* ------------------------------------------------- left column */}
      <div className="border-ink lg:border-r">
        <div className="overflow-hidden border-b border-ink">
          <h1 className="display display-mega -mb-[0.09em] whitespace-nowrap px-2">
            Cart
          </h1>
        </div>

        {/* line item */}
        <div className="flex gap-4 border-b border-ink p-4 md:gap-6 md:p-6">
          <div className="w-24 shrink-0 md:w-32">
            <Slot label="Packshot" ratio="4 / 5" />
          </div>
          <div className="flex flex-1 flex-col justify-between gap-4">
            <div>
              <h2 className="display text-2xl leading-[0.95] md:text-3xl">
                {PRODUCT.shortName}
              </h2>
              <p className="mono-micro mt-2 text-ink/50">{PRODUCT.size.label}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-stretch border border-ink">
                <label className="sr-only" htmlFor="qty">Quantity</label>
                <select
                  id="qty"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mono-label appearance-none bg-bone px-3 py-2 pr-6"
                >
                  {Array.from({ length: MAX_QUANTITY }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{String(n).padStart(2, "0")}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={remove}
                  className="invert-hover mono-label border-l border-ink px-3"
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

        {/* ------------------------------------------------ ship to */}
        <section className="border-b border-ink p-4 md:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="display text-2xl leading-none">Ship to</h2>
            <span className="mono-micro text-ink/45">[ Live rates ]</span>
          </div>
          <p className="mono-micro mt-3 text-ink/55">
            We quote live carrier rates for your address before you pay.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`mt-2 ${field}`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="name">
                Full name
              </label>
              <input
                id="name"
                autoComplete="name"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
                className={`mt-2 ${field}`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="street1">
                Address
              </label>
              <input
                id="street1"
                autoComplete="address-line1"
                value={address.street1}
                onChange={(e) =>
                  setAddress({ ...address, street1: e.target.value })
                }
                className={`mt-2 ${field}`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="street2">
                Apartment, suite, etc. <span className="normal-case">(optional)</span>
              </label>
              <input
                id="street2"
                autoComplete="address-line2"
                value={address.street2}
                onChange={(e) =>
                  setAddress({ ...address, street2: e.target.value })
                }
                className={`mt-2 ${field}`}
              />
            </div>

            <div>
              <label className={labelCls} htmlFor="city">
                City
              </label>
              <input
                id="city"
                autoComplete="address-level2"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className={`mt-2 ${field}`}
              />
            </div>

            <div>
              <label className={labelCls} htmlFor="state">
                State / Province
              </label>
              <input
                id="state"
                autoComplete="address-level1"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                placeholder="CA"
                className={`mt-2 ${field}`}
              />
            </div>

            <div>
              <label className={labelCls} htmlFor="zip">
                ZIP / Postal code
              </label>
              <input
                id="zip"
                autoComplete="postal-code"
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                className={`mt-2 ${field}`}
              />
            </div>

            <div>
              <label className={labelCls} htmlFor="country">
                Country code
              </label>
              <input
                id="country"
                autoComplete="country"
                maxLength={2}
                value={address.country}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    country: e.target.value.toUpperCase().slice(0, 2),
                  })
                }
                className={`mt-2 ${field} uppercase`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="phone">
                Phone <span className="normal-case">(optional, helps couriers)</span>
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                className={`mt-2 ${field}`}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={getRates}
            disabled={!addressComplete || loadingRates}
            className="invert-hover mono-label mt-6 w-full border border-ink px-7 py-4 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink sm:w-auto"
          >
            {loadingRates ? "Checking carriers…" : "Get shipping rates"}
          </button>
        </section>

        {/* ------------------------------------------------- rates */}
        {quotes && quotes.length > 0 && (
          <fieldset className="border-b border-ink p-4 md:p-6">
            <legend className="display text-2xl leading-none">Shipping method</legend>
            <div className="mt-5">
              {quotes.map((q) => (
                <label
                  key={q.rateId}
                  className={`mt-[-1px] flex cursor-pointer items-center justify-between gap-4 border border-ink px-4 py-4 transition-colors duration-[120ms] ${
                    chosen === q.rateId ? "bg-acid" : "hover:bg-bone-dim"
                  }`}
                >
                  <span className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="rate"
                      value={q.rateId}
                      checked={chosen === q.rateId}
                      onChange={() => setChosen(q.rateId)}
                      className="h-3.5 w-3.5 accent-ink"
                    />
                    <span>
                      <span className="mono-label block normal-case tracking-normal">
                        {q.provider} · {q.service}
                      </span>
                      <span className="mono-micro block text-ink/50">
                        {q.estimatedDays
                          ? `About ${q.estimatedDays} business ${
                              q.estimatedDays === 1 ? "day" : "days"
                            }`
                          : (q.durationTerms ?? "Delivery estimate unavailable")}
                      </span>
                    </span>
                  </span>
                  <span className="mono-label shrink-0 tabular-nums">
                    {formatPrice(q.amountCents, q.currency)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {/* ------------------------------------------------ right column */}
      <aside className="lg:sticky lg:top-14 lg:h-fit">
        <p className="mono-micro border-b border-ink px-4 py-3 text-ink/45">
          [ Order summary ]
        </p>

        <dl className="px-4 pt-4 md:px-6">
          <div className="flex justify-between gap-4 border-b border-ink/15 py-2.5">
            <dt className="mono-micro text-ink/55">
              {PRODUCT.shortName} × {String(quantity).padStart(2, "0")}
            </dt>
            <dd className="mono-micro tabular-nums">{formatPrice(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-ink/15 py-2.5">
            <dt className="mono-micro text-ink/55">Shipping</dt>
            <dd className="mono-micro text-right tabular-nums">
              {selected ? (
                formatPrice(selected.amountCents, selected.currency)
              ) : (
                <span className="text-ink/35">Calculated left</span>
              )}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-ink/15 py-2.5">
            <dt className="mono-micro text-ink/55">Taxes</dt>
            <dd className="mono-micro text-ink/35">Shown at payment</dd>
          </div>
        </dl>

        <div className="flex items-end justify-between gap-4 px-4 py-5 md:px-6">
          <span className="mono-micro text-ink/45">Total</span>
          <span className="display text-4xl tabular-nums">
            {formatPrice(totalCents)}
          </span>
        </div>

        {error && (
          <p role="alert" className="mono-micro border-y border-ink bg-ink px-4 py-3 text-bone md:px-6">
            ✳ {error}
          </p>
        )}

        <button
          type="button"
          onClick={checkout}
          disabled={!selected || !email || submitting}
          className="mono-label flex w-full items-center justify-between gap-6 border-y border-ink bg-ink px-4 py-5 text-bone transition-colors duration-[120ms] hover:bg-acid hover:text-ink disabled:cursor-not-allowed disabled:bg-bone-dim disabled:text-ink/35 md:px-6"
        >
          <span>{submitting ? "Redirecting…" : "Continue to payment"}</span>
          <span aria-hidden="true">→</span>
        </button>

        <p className="mono-micro px-4 py-4 text-ink/50 md:px-6">
          {!selected
            ? "Add your address and pick a shipping method to continue."
            : "You'll pay securely on Stripe. Card details never touch this site."}
        </p>

        <Link
          href="/product"
          className="invert-hover mono-label block border-t border-ink px-4 py-4 md:px-6"
        >
          ← Keep shopping
        </Link>
      </aside>
    </div>
  );
}
