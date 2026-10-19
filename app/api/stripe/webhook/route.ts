import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminClient } from "@/lib/supabase";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !webhookSecret || !signature) return NextResponse.json({ error: "Webhook configuration missing." }, { status: 400 });
  const stripe = new Stripe(secret);
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret); }
  catch { return NextResponse.json({ error: "Invalid signature." }, { status: 400 }); }
  if (event.type !== "checkout.session.completed") return NextResponse.json({ received: true });
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") return NextResponse.json({ received: true });
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100, expand: ["data.price.product"] });
    const items = lineItems.data.map(line => { const product = line.price?.product; return { product_id: product && typeof product !== "string" && !product.deleted ? product.metadata.product_id : null, name: line.description, quantity: line.quantity, amount_total_cents: line.amount_total }; });
    const { error } = await adminClient().from("orders").upsert({ stripe_session_id: session.id, stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null, customer_email: session.customer_details?.email ?? null, amount_total_cents: session.amount_total ?? 0, currency: session.currency ?? "usd", status: "paid", shipping_name: session.collected_information?.shipping_details?.name ?? null, shipping_address: session.collected_information?.shipping_details?.address ?? null, items }, { onConflict: "stripe_session_id", ignoreDuplicates: true });
    if (error) throw error;
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: "Order could not be recorded." }, { status: 500 }); }
}
