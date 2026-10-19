"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types";

const KEY = "rachel-cart-v1";
type CartContextValue = { items: CartItem[]; ready: boolean; count: number; add: (productId: string) => void; update: (productId: string, quantity: number) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);

function normalize(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter((item): item is CartItem => typeof item?.productId === "string" && item.productId.length > 0 && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 10 && !seen.has(item.productId) && (seen.add(item.productId), true));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { try { setItems(normalize(JSON.parse(localStorage.getItem(KEY) || "[]"))); } catch { setItems([]); } setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, ready]);
  const add = useCallback((productId: string) => setItems((current) => {
    const existing = current.find((item) => item.productId === productId);
    return existing ? current.map((item) => item.productId === productId ? { ...item, quantity: Math.min(10, item.quantity + 1) } : item) : [...current, { productId, quantity: 1 }];
  }), []);
  const update = useCallback((productId: string, quantity: number) => setItems((current) => quantity <= 0 ? current.filter((item) => item.productId !== productId) : current.map((item) => item.productId === productId ? { ...item, quantity: Math.min(10, Math.max(1, Math.floor(quantity))) } : item)), []);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, ready, count: items.reduce((sum, item) => sum + item.quantity, 0), add, update, clear }), [items, ready, add, update, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const context = useContext(CartContext); if (!context) throw new Error("CartProvider is missing"); return context; }
