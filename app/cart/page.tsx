"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartView } from "@/components/cart-view";
import type { Product } from "@/lib/types";

export default function CartPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/products", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load products");
        return response.json() as Promise<Product[]>;
      })
      .then(setProducts)
      .catch((cause) => { if (cause.name !== "AbortError") setError(true); });
    return () => controller.abort();
  }, []);

  if (error) return <section className="container cart-page"><p className="eyebrow">YOUR SELECTION</p><h1>Your bag</h1><p>We couldn&apos;t load the collection right now. Please try again.</p><Link href="/shop" className="button button-dark">Explore fragrances</Link></section>;
  if (!products) return <section className="container cart-page"><p className="eyebrow">YOUR SELECTION</p><h1>Your bag</h1><p>Loading your bag…</p></section>;
  return <CartView products={products}/>;
}
