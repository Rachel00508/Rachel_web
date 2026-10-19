import { createClient } from "@supabase/supabase-js";
import { demoProducts } from "@/lib/demo";
import type { Product } from "@/lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isConfigured() { return Boolean(url && anonKey && serviceKey); }

export function adminClient() {
  if (!url || !serviceKey) throw new Error("Supabase server configuration is missing.");
  return createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function getProducts(): Promise<Product[]> {
  if (!url || !anonKey) return demoProducts;
  const db = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data, error } = await db.from("products").select("*").eq("is_active", true).order("sort_order");
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return data as Product[];
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}
