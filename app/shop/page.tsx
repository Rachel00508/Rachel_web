import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/supabase";

export const metadata: Metadata = { title: "Shop Fragrance" };
export const dynamic = "force-dynamic";
export default async function Shop() { const products = await getProducts(); return <><div className="page-banner"><div className="container"><p className="eyebrow">THE RACHEL EDIT</p><h1>Find your <em>feeling.</em></h1><p>Discover the scent that feels unmistakably yours.</p></div></div><section className="container shop-section"><div className="shop-toolbar"><span>{products.length} fragrances</span><span>CURATED FRAGRANCES · USD</span></div><div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p}/>)}</div>{products.length === 0 && <p className="empty-state">The collection is currently unavailable. Please check back soon.</p>}</section><p className="demo-note container">Images of the four branded fragrances are original illustrations, not photographs of actual products or packaging. Verify product identity and availability before a public launch.</p></>; }
