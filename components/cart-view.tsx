"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { ProductVisual } from "@/components/product-visual";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export function CartView({ products }: { products: Product[] }) {
  const { items, ready, update } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const lines = useMemo(() => items.map(item => ({ item, product: products.find(p => p.id === item.productId) })).filter(line => line.product !== undefined), [items, products]);
  const unavailable = items.filter(item => !products.some(p => p.id === item.productId));
  const subtotal = lines.reduce((sum, line) => sum + line.product!.price_cents * line.item.quantity, 0);
  async function checkout() { setLoading(true); setError(""); try { const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: lines.map(line => line.item) }) }); const body = await response.json(); if (!response.ok || !body.url) throw new Error(body.error || "Checkout is unavailable."); window.location.assign(body.url); } catch (e) { setError(e instanceof Error ? e.message : "Checkout is unavailable."); setLoading(false); } }
  return <section className="container cart-page"><p className="eyebrow">YOUR SELECTION</p><h1>Your bag<span> ({ready ? items.reduce((s,i) => s+i.quantity,0) : 0})</span></h1>{!ready ? <p>Loading your bag…</p> : items.length === 0 ? <div className="cart-empty"><h2>Your bag is waiting.</h2><p>Something wonderful is just a scent away.</p><Link href="/shop" className="button button-dark">Explore fragrances <ArrowRight size={16}/></Link></div> : <div className="cart-grid"><div className="cart-lines">{lines.map(({ item, product }) => <div className="cart-line" key={item.productId}><Link href={`/shop/${product!.slug}`}><ProductVisual product={product!}/></Link><div className="cart-line-info"><p className="eyebrow">FRAGRANCE · {product!.size_ml} ML</p><Link href={`/shop/${product!.slug}`}><h2>{product!.name}</h2></Link><p>{formatPrice(product!.price_cents)}</p><div className="quantity"><button aria-label={`Decrease ${product!.name} quantity`} onClick={() => update(item.productId, item.quantity - 1)}><Minus size={14}/></button><span>{item.quantity}</span><button aria-label={`Increase ${product!.name} quantity`} onClick={() => update(item.productId, item.quantity + 1)} disabled={item.quantity >= 10}><Plus size={14}/></button></div></div><div className="cart-line-end"><strong>{formatPrice(product!.price_cents * item.quantity)}</strong><button onClick={() => update(item.productId, 0)} aria-label={`Remove ${product!.name}`}><Trash2 size={18}/></button></div></div>)}{unavailable.map(item => <div className="unavailable" key={item.productId}><p>An item in your bag is no longer available.</p><button onClick={() => update(item.productId, 0)}>Remove item</button></div>)}</div><aside className="cart-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div><span>U.S. shipping</span><strong>Complimentary</strong></div><div className="summary-total"><span>Total</span><strong>{formatPrice(subtotal)}</strong></div><p>Stripe test checkout. Tax is not calculated in this demo.</p><button className="button button-dark button-full" disabled={loading || lines.length === 0 || unavailable.length > 0} onClick={checkout}>{loading ? "Redirecting…" : "Checkout securely"} <ArrowRight size={16}/></button>{error && <p className="cart-error" role="alert">{error}</p>}<Link href="/shop" className="continue-link">Continue shopping</Link></aside></div>}</section>;
}
