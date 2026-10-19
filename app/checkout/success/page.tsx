import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Stripe from "stripe";
import { ClearCart } from "@/components/clear-cart";
export const dynamic = "force-dynamic";
export default async function Success({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let paid = false;
  if (session_id?.startsWith("cs_test_") && process.env.STRIPE_SECRET_KEY) {
    try { const session = await new Stripe(process.env.STRIPE_SECRET_KEY).checkout.sessions.retrieve(session_id); paid = session.payment_status === "paid"; } catch { paid = false; }
  }
  return <section className="checkout-result container">{paid && <CheckCircle2 size={42} strokeWidth={1}/>}<p className="eyebrow">{paid ? "THANK YOU" : "PAYMENT STATUS"}</p><h1>{paid ? "Your order is in." : "Payment not confirmed."}</h1><p>{paid ? "Stripe has completed your test payment. Your order is recorded after webhook confirmation; this demo does not ship products or send email receipts." : "We couldn't verify a completed test payment. Your bag has been kept; please return to checkout or contact us if needed."}</p>{paid && <ClearCart/>}<Link href={paid ? "/shop" : "/cart"} className="button button-dark">{paid ? "Continue exploring" : "Return to bag"}</Link></section>;
}
