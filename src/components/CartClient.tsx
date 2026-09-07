"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MAX_QUANTITY, PRODUCT, formatPrice } from "@/lib/product";
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
  "w-full rounded-xl border border-ink/15 bg-parchment px-4 py-3 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink-faint/70 focus:border-botanical focus:ring-2 focus:ring-botanical/20";
const labelCls = "block text-[0.7rem] tracking-label-sm text-ink-faint uppercase";

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
    return (
      <div className="py-24 text-center text-ink-faint">Loading your cart…</div>
    );
  }

  if (quantity === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-4xl font-semibold text-ink">
          Your cart is empty
        </h1>
        <p className="mt-4 text-ink-soft">
          There&rsquo;s only one thing to put in it.
        </p>
        <Link
          href="/product"
          className="mt-8 inline-block rounded-full bg-ink px-8 py-3.5 text-[0.78rem] tracking-label-sm text-cream uppercase transition-colors hover:bg-botanical-deep"
        >
          Shop the jar
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
      {/* ------------------------------------------------- left column */}
      <div>
        <h1 className="font-display text-4xl font-semibold text-ink">Cart</h1>

        {/* line item */}
        <div className="mt-8 flex gap-5 border-y border-ink/10 py-6">
          <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-parchment ring-1 ring-ink/10">
            <Image
              src="/product/jar-front.webp"
              alt=""
              fill
              sizes="6rem"
              className="object-contain"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                {PRODUCT.shortName}
              </h2>
              <p className="text-sm text-ink-faint">{PRODUCT.size.label}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2.5 text-sm text-ink-soft">
                <span className="sr-only">Quantity</span>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="rounded-lg border border-ink/15 bg-parchment px-3 py-2 text-ink"
                >
                  {Array.from({ length: MAX_QUANTITY }, (_, i) => i + 1).map(
                    (n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ),
                  )}
                </select>
                <button
                  type="button"
                  onClick={remove}
                  className="text-ink-faint underline underline-offset-4 hover:text-terracotta"
                >
                  Remove
                </button>
              </label>
              <p className="font-display text-lg text-ink tabular-nums">
                {formatPrice(subtotalCents)}
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ ship to */}
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">
            Ship to
          </h2>
          <p className="mt-1.5 text-sm text-ink-soft">
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
            className="mt-6 rounded-full border border-ink/25 px-7 py-3 text-[0.75rem] tracking-label-sm text-ink uppercase transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loadingRates ? "Checking carriers…" : "Get shipping rates"}
          </button>
        </section>

        {/* ------------------------------------------------- rates */}
        {quotes && quotes.length > 0 && (
          <fieldset className="mt-10">
            <legend className="font-display text-xl font-semibold text-ink">
              Shipping method
            </legend>
            <div className="mt-5 space-y-3">
              {quotes.map((q) => (
                <label
                  key={q.rateId}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-colors ${
                    chosen === q.rateId
                      ? "border-botanical bg-pistachio-light/30"
                      : "border-ink/15 hover:border-ink/30"
                  }`}
                >
                  <span className="flex items-center gap-3.5">
                    <input
                      type="radio"
                      name="rate"
                      value={q.rateId}
                      checked={chosen === q.rateId}
                      onChange={() => setChosen(q.rateId)}
                      className="h-4 w-4 accent-botanical"
                    />
                    <span>
                      <span className="block text-[0.95rem] text-ink">
                        {q.provider} · {q.service}
                      </span>
                      <span className="block text-sm text-ink-faint">
                        {q.estimatedDays
                          ? `About ${q.estimatedDays} business ${
                              q.estimatedDays === 1 ? "day" : "days"
                            }`
                          : (q.durationTerms ?? "Delivery estimate unavailable")}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-[0.95rem] text-ink tabular-nums">
                    {formatPrice(q.amountCents, q.currency)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {/* ------------------------------------------------ right column */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[1.75rem] border border-ink/10 bg-parchment p-7">
          <h2 className="font-display text-xl font-semibold text-ink">
            Order summary
          </h2>

          <dl className="mt-6 space-y-3 text-[0.95rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">
                {PRODUCT.shortName} × {quantity}
              </dt>
              <dd className="text-ink tabular-nums">
                {formatPrice(subtotalCents)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Shipping</dt>
              <dd className="text-right text-ink tabular-nums">
                {selected ? (
                  formatPrice(selected.amountCents, selected.currency)
                ) : (
                  <span className="text-ink-faint">Calculated above</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Taxes</dt>
              <dd className="text-ink-faint">Shown at payment</dd>
            </div>
          </dl>

          <div className="mt-5 flex justify-between gap-4 border-t border-ink/10 pt-5">
            <span className="font-display text-lg text-ink">Total</span>
            <span className="font-display text-lg text-ink tabular-nums">
              {formatPrice(totalCents)}
            </span>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={checkout}
            disabled={!selected || !email || submitting}
            className="mt-6 w-full rounded-full bg-ink px-8 py-4 text-[0.78rem] tracking-label-sm text-cream uppercase transition-colors hover:bg-botanical-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Redirecting…" : "Continue to payment"}
          </button>

          <p className="mt-4 text-center text-xs leading-relaxed text-ink-faint">
            {!selected
              ? "Add your address and pick a shipping method to continue."
              : "You'll pay securely on Stripe. Card details never touch this site."}
          </p>

          <Link
            href="/product"
            className="mt-5 block text-center text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Keep shopping
          </Link>
        </div>
      </aside>
    </div>
  );
}
