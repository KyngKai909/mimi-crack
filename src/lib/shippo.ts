import { Shippo } from "shippo";
import { PRODUCT } from "./product";

/**
 * Shippo client + the two operations this store needs: quote live rates for a
 * destination, and buy a label once an order is paid.
 */
let cached: Shippo | null = null;

export function getShippo(): Shippo {
  if (cached) return cached;
  const key = process.env.SHIPPO_API_KEY;
  if (!key) {
    throw new Error(
      "SHIPPO_API_KEY is not set. Copy .env.example to .env.local and add your Shippo token.",
    );
  }
  cached = new Shippo({ apiKeyHeader: `ShippoToken ${key}` });
  return cached;
}

export function isShippoConfigured() {
  return Boolean(process.env.SHIPPO_API_KEY);
}

/**
 * Shippo cannot quote anything without a real origin — it returns a shipment
 * with zero rates and a pile of carrier messages, which reaches the customer
 * as a 502 and tells them nothing. Checked up front so a missing address is
 * reported as what it is: the shop isn't finished being set up.
 */
export function isShipFromConfigured() {
  const from = shipFromAddress();
  return Boolean(from.street1 && from.city && from.state && from.zip && from.country);
}

/**
 * Re-read a rate from Shippo by id.
 *
 * The cart posts back the rate the customer chose, amount included, and the
 * browser is not a trustworthy source for an amount that's about to be
 * charged. Checkout fetches the rate again and bills what the carrier says.
 */
export async function getRate(rateId: string) {
  return getShippo().rates.get(rateId);
}

export type ShipAddress = {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
};

/** Where parcels leave from. Set these in the environment before going live. */
export function shipFromAddress(): ShipAddress {
  return {
    name: process.env.SHIP_FROM_NAME ?? "MiMi Crack",
    street1: process.env.SHIP_FROM_STREET1 ?? "",
    street2: process.env.SHIP_FROM_STREET2 || undefined,
    city: process.env.SHIP_FROM_CITY ?? "",
    state: process.env.SHIP_FROM_STATE ?? "",
    zip: process.env.SHIP_FROM_ZIP ?? "",
    country: process.env.SHIP_FROM_COUNTRY ?? "US",
    phone: process.env.SHIP_FROM_PHONE || undefined,
    email: process.env.SHIP_FROM_EMAIL || undefined,
  };
}

/**
 * Parcel for `quantity` jars.
 *
 * Jars are packed side by side in one box up to four, then the box steps up a
 * size. This is deliberately a rough model — it only has to be close enough
 * that the quoted rate covers the real one. Re-measure against real packed
 * orders before you lean on it hard.
 */
export function parcelFor(quantity: number) {
  const { lengthIn, widthIn, heightIn, weightLb } = PRODUCT.parcel;
  const tier = Math.ceil(quantity / 4);
  const scale = Math.cbrt(tier);
  return {
    length: (lengthIn * scale).toFixed(2),
    width: (widthIn * scale).toFixed(2),
    height: (heightIn * scale).toFixed(2),
    distanceUnit: "in" as const,
    weight: (weightLb * quantity + 0.3).toFixed(2),
    massUnit: "lb" as const,
  };
}

export type ShippingQuote = {
  rateId: string;
  provider: string;
  service: string;
  amountCents: number;
  currency: string;
  estimatedDays: number | null;
  durationTerms: string | null;
};

/** Live rates from every carrier connected to the Shippo account. */
export async function quoteRates(
  to: ShipAddress,
  quantity: number,
): Promise<ShippingQuote[]> {
  const shippo = getShippo();
  const shipment = await shippo.shipments.create({
    addressFrom: shipFromAddress(),
    addressTo: to,
    parcels: [parcelFor(quantity)],
    async: false,
  });

  const rates = shipment.rates ?? [];
  return rates
    .map((r) => ({
      rateId: r.objectId,
      provider: r.provider,
      service: r.servicelevel?.name ?? r.servicelevel?.token ?? "Shipping",
      amountCents: Math.round(Number(r.amount) * 100),
      currency: (r.currency ?? "USD").toUpperCase(),
      estimatedDays: r.estimatedDays ?? null,
      durationTerms: r.durationTerms ?? null,
    }))
    .filter((r) => Number.isFinite(r.amountCents) && r.amountCents > 0)
    .sort((a, b) => a.amountCents - b.amountCents);
}

/**
 * Buy the label for a rate.
 *
 * This spends real money on the Shippo account, so nothing calls it
 * automatically unless SHIPPO_AUTO_BUY_LABEL is explicitly turned on.
 */
export async function buyLabel(rateId: string) {
  const shippo = getShippo();
  return shippo.transactions.create({
    rate: rateId,
    labelFileType: "PDF_4x6",
    async: false,
  });
}
