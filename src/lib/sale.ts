/**
 * Black Friday pricing.
 *
 * TIERS: Carmel's deal is "2 for $40, 1 for $22". The per-jar rate at two
 * carries on up the quantity picker rather than stopping at two, so three is
 * $60 and four is $80. That's the reading that makes the picker behave: every
 * extra jar costs the same as the last one, and nobody is ever better off
 * removing a jar.
 *
 * TIME ZONE: southern California is back on PST (UTC-8) by late November, so
 * Black Friday 2026 starts 2026-11-27T00:00:00-08:00 and the week closes at
 * the end of Friday 2026-12-04.
 *
 * Everything on the page derives from the two ISO constants below, and the
 * only price that reaches Stripe is the one `salePricing` returns on the
 * server. Nothing about the amount comes from the browser.
 */

export const SALE_NAME = "Black Friday";

export const SALE_START_ISO =
  process.env.NEXT_PUBLIC_SALE_START_AT ?? "2026-11-27T00:00:00-08:00";

export const SALE_END_ISO =
  process.env.NEXT_PUBLIC_SALE_END_AT ?? "2026-12-04T23:59:00-08:00";

export const SALE_START = new Date(SALE_START_ISO);
export const SALE_END = new Date(SALE_END_ISO);

/**
 * Quantity tiers, richest discount first. A quantity matches the first row
 * whose `min` it reaches, so adding deeper tiers later is one line here and
 * nothing anywhere else.
 */
const TIERS: ReadonlyArray<{ min: number; unitCents: number }> = [
  { min: 2, unitCents: 2000 }, // 2 for $40 — and $20 a jar from there up
  { min: 1, unitCents: 2200 }, // one jar
];

export function isSaleOn(now: number = Date.now()): boolean {
  const [from, to] = [SALE_START.getTime(), SALE_END.getTime()];
  if (!Number.isFinite(from) || !Number.isFinite(to)) return false;
  return now >= from && now < to;
}

export type Pricing = {
  /** Whether the sale decided these numbers. */
  onSale: boolean;
  /** What one jar costs at this quantity. */
  unitCents: number;
  /** What the whole line costs. */
  totalCents: number;
  /** What the same line would cost at the everyday price. */
  listUnitCents: number;
  listTotalCents: number;
  /** Difference, floored at zero. */
  savingsCents: number;
  /** 0-100, rounded, off the list total. */
  savingsPercent: number;
};

/**
 * The one place a price is decided. Pass the everyday unit price in rather
 * than importing it, so this module stays free of the product and can be
 * reasoned about on its own.
 *
 * `onSale` is a flag rather than a clock because the components that price
 * things on screen already track the window themselves, and they need the
 * price to follow that tracked value rather than a second reading of the
 * clock. On the server it defaults to the clock, which is what checkout
 * wants.
 */
export function salePricing(
  quantity: number,
  listUnitCents: number,
  onSale: boolean = isSaleOn(),
): Pricing {
  const qty = Math.max(0, Math.floor(quantity));
  const listTotalCents = qty * listUnitCents;

  const tier = onSale ? TIERS.find((t) => qty >= t.min) : undefined;
  const unitCents = tier ? Math.min(tier.unitCents, listUnitCents) : listUnitCents;
  const totalCents = qty * unitCents;
  const savingsCents = Math.max(0, listTotalCents - totalCents);

  return {
    onSale: savingsCents > 0,
    unitCents,
    totalCents,
    listUnitCents,
    listTotalCents,
    savingsCents,
    savingsPercent:
      listTotalCents > 0 ? Math.round((savingsCents / listTotalCents) * 100) : 0,
  };
}

/** Whole days/hours/minutes/seconds until the sale closes, floored at zero. */
export function timeUntilSaleEnds(now: number = Date.now()) {
  const ms = Math.max(0, SALE_END.getTime() - now);
  const total = Math.floor(ms / 1000);
  return {
    done: ms === 0,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

const PACIFIC = { timeZone: "America/Los_Angeles" } as const;

/** "Friday, December 4" */
export const SALE_END_DATE = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  ...PACIFIC,
}).format(SALE_END);

/** "11:59 PM" */
export const SALE_END_TIME = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  ...PACIFIC,
}).format(SALE_END);

/** "PST" */
export const SALE_END_ZONE =
  new Intl.DateTimeFormat("en-US", { timeZoneName: "short", ...PACIFIC })
    .formatToParts(SALE_END)
    .find((part) => part.type === "timeZoneName")?.value ?? "";

/** "Friday, December 4 at 11:59 PM PST" */
export const SALE_END_LABEL =
  `${SALE_END_DATE} at ${SALE_END_TIME} ${SALE_END_ZONE}`.trim();

/**
 * Whole dollars read better on a sale badge than "$40.00", so the cents are
 * dropped when there are none to show.
 */
const usd = (cents: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);

const dealLine = (tier: { min: number; unitCents: number }) =>
  `${tier.min} for ${usd(tier.min * tier.unitCents)}`;

/** Every tier as copy, deepest first: ["2 for $40", "1 for $22"]. */
export const SALE_TIER_LINES = TIERS.map(dealLine);

/** "2 for $40" — the deal the ads lead with. */
export const SALE_DEAL_LINE = SALE_TIER_LINES[0];

/** "1 for $22" — the one-jar price, for the line underneath. */
export const SALE_SINGLE_LINE = SALE_TIER_LINES[SALE_TIER_LINES.length - 1];

/** "and $20 a jar after that" — what the picker does past the deepest tier. */
export const SALE_TIER_NOTE = `${usd(TIERS[0].unitCents)} a jar at two or more`;
