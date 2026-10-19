import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { catalogProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Shop Fragrance" };
export default function Shop() { const products = catalogProducts; return <><div className="page-banner"><div className="container"><p className="eyebrow">THE RACHEL EDIT</p><h1>Find your <em>feeling.</em></h1><p>Discover the scent that feels unmistakably yours.</p></div></div><section className="container shop-section"><div className="shop-toolbar"><span>{products.length} fragrances</span><span>CURATED FRAGRANCES · USD</span></div><div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p}/>)}</div></section><p className="demo-note container">Catalog preview only; online checkout is not available. Images are original illustrations, not photographs of actual products or packaging. Confirm product identity and availability before purchase.</p></>; }
