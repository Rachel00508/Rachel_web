"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";

export function AddToCart({ productId, full = false }: { productId: string; full?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return <button className={`button button-dark ${full ? "button-full" : ""}`} onClick={() => { add(productId); setAdded(true); window.setTimeout(() => setAdded(false), 1800); }}>{added ? "Added to bag ✓" : "Add to bag"}</button>;
}
