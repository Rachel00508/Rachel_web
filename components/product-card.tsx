import Link from "next/link";
import { ProductVisual } from "@/components/product-visual";
import { AddToCart } from "@/components/add-to-cart";
import { formatPrice } from "@/lib/supabase";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) { return <article className="product-card"><Link href={`/shop/${product.slug}`} aria-label={`View ${product.name}`}><ProductVisual product={product} /></Link><div className="product-card-info"><div><p className="eyebrow">{product.category} · {product.size_ml} ml</p><Link href={`/shop/${product.slug}`}><h3>{product.name}</h3></Link><p className="product-subtitle">{product.subtitle}</p></div><span className="price">{formatPrice(product.price_cents)}</span></div><AddToCart productId={product.id} full /></article>; }
