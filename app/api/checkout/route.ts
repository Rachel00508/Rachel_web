import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { adminClient } from "@/lib/supabase";

const schema = z.object({ items: z.array(z.object({ productId: z.uuid(), quantity: z.number().int().min(1).max(10) })).min(1).max(20) });
export async function POST(request: Request) {
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ error: "Invalid bag items." }, { status: 400 });
  const ids = parsed.data.items.map(item => item.productId);
  if (new Set(ids).size !== ids.length) return NextResponse.json({ error: "Duplicate bag items." }, { status: 400 });
  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_SITE_URL) return NextResponse.json({ error: "Checkout is not configured." }, { status: 503 });
  try {
    const { data, error } = await adminClient().from("products").select("id,name,price_cents,size_ml,is_active").in("id", ids);
    if (error) throw error;
    const products = new Map((data ?? []).filter(p => p.is_active).map(p => [p.id, p]));
    if (products.size !== ids.length) return NextResponse.json({ error: "A product is no longer available. Please update your bag." }, { status: 409 });
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL);
    const session = await stripe.checkout.sessions.create({ mode: "payment", payment_method_types: ["card"], billing_address_collection: "required", shipping_address_collection: { allowed_countries: ["US"] }, customer_creation: "always", line_items: parsed.data.items.map(({ productId, quantity }) => { const p = products.get(productId)!; return { price_data: { currency: "usd", unit_amount: p.price_cents, product_data: { name: `${p.name} · ${p.size_ml} ml`, metadata: { product_id: p.id } } }, quantity }; }), success_url: `${siteUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${siteUrl.origin}/checkout/cancel`, metadata: { item_ids: ids.join(",") } });
    return NextResponse.json({ url: session.url });
  } catch { return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 }); }
}
