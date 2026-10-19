"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { ProductVisual } from "@/components/product-visual";
import { useCart } from "@/components/cart-provider";
import { formatPrice } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export function CartView({ products }: { products: Product[] }) {
  const { items, ready, update } = useCart();
  const lines = useMemo(
    () => items.map((item) => ({ item, product: products.find((product) => product.id === item.productId) }))
      .filter((line): line is { item: typeof line.item; product: Product } => line.product !== undefined),
    [items, products],
  );
  const unavailable = items.filter((item) => !products.some((product) => product.id === item.productId));
  const subtotal = lines.reduce((sum, line) => sum + line.product.price_cents * line.item.quantity, 0);

  return <section className="container cart-page">
    <p className="eyebrow">YOUR SELECTION</p>
    <h1>Your bag<span> ({ready ? items.reduce((sum, item) => sum + item.quantity, 0) : 0})</span></h1>
    {!ready ? <p>Loading your bag…</p> : items.length === 0 ? <div className="cart-empty">
      <h2>Your bag is waiting.</h2>
      <p>Something wonderful is just a scent away.</p>
      <Link href="/shop" className="button button-dark">Explore fragrances <ArrowRight size={16}/></Link>
    </div> : <div className="cart-grid">
      <div className="cart-lines">
        {lines.map(({ item, product }) => <div className="cart-line" key={item.productId}>
          <Link href={`/shop/${product.slug}`}><ProductVisual product={product}/></Link>
          <div className="cart-line-info">
            <p className="eyebrow">FRAGRANCE · {product.size_ml} ML</p>
            <Link href={`/shop/${product.slug}`}><h2>{product.name}</h2></Link>
            <p>{formatPrice(product.price_cents)}</p>
            <div className="quantity">
              <button aria-label={`Decrease ${product.name} quantity`} onClick={() => update(item.productId, item.quantity - 1)}><Minus size={14}/></button>
              <span>{item.quantity}</span>
              <button aria-label={`Increase ${product.name} quantity`} onClick={() => update(item.productId, item.quantity + 1)} disabled={item.quantity >= 10}><Plus size={14}/></button>
            </div>
          </div>
          <div className="cart-line-end">
            <strong>{formatPrice(product.price_cents * item.quantity)}</strong>
            <button onClick={() => update(item.productId, 0)} aria-label={`Remove ${product.name}`}><Trash2 size={18}/></button>
          </div>
        </div>)}
        {unavailable.map((item) => <div className="unavailable" key={item.productId}>
          <p>An item in your bag is no longer in this catalog.</p>
          <button onClick={() => update(item.productId, 0)}>Remove item</button>
        </div>)}
      </div>
      <aside className="cart-summary">
        <h2>Selection summary</h2>
        <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
        <p>This is a catalog preview. Your selections stay in this browser; online checkout, payment, and shipping are not available.</p>
        <Link href="/shop" className="button button-dark button-full">Continue exploring <ArrowRight size={16}/></Link>
      </aside>
    </div>}
  </section>;
}
