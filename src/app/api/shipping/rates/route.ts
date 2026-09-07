import { NextResponse } from "next/server";
import { z } from "zod";
import { MAX_QUANTITY } from "@/lib/product";
import { isShippoConfigured, quoteRates } from "@/lib/shippo";

export const runtime = "nodejs";

const Body = z.object({
  quantity: z.number().int().min(1).max(MAX_QUANTITY),
  address: z.object({
    name: z.string().min(1).max(120),
    street1: z.string().min(1).max(160),
    street2: z.string().max(160).optional(),
    city: z.string().min(1).max(80),
    state: z.string().min(1).max(40),
    zip: z.string().min(3).max(16),
    country: z.string().length(2),
    phone: z.string().max(40).optional(),
    email: z.string().email().max(160).optional(),
  }),
});

export async function POST(request: Request) {
  if (!isShippoConfigured()) {
    return NextResponse.json(
      { error: "Shipping is not configured yet. Set SHIPPO_API_KEY." },
      { status: 503 },
    );
  }

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the address fields and try again." },
      { status: 400 },
    );
  }

  try {
    const rates = await quoteRates(parsed.data.address, parsed.data.quantity);
    if (!rates.length) {
      return NextResponse.json(
        {
          error:
            "No carrier could quote that address. Double-check it, or get in touch and we'll sort it out.",
        },
        { status: 422 },
      );
    }
    return NextResponse.json({ rates });
  } catch (err) {
    console.error("[shipping/rates]", err);
    return NextResponse.json(
      { error: "We couldn't reach the shipping carriers just now." },
      { status: 502 },
    );
  }
}
