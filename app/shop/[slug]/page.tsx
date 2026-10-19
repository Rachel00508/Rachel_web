import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductVisual } from "@/components/product-visual";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { catalogProducts, formatPrice, getProduct } from "@/lib/catalog";

export function generateStaticParams() {
  return catalogProducts.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product?.name ?? "Fragrance", description: product?.description };
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = catalogProducts.filter(p => p.id !== product.id).slice(0, 3);
  const illustrative = product.image_key.startsWith("/products/");
  const scentProfile = [...new Set([...product.notes_top, ...product.notes_heart, ...product.notes_base])];

  return <>
    <section className="container detail-section">
      <div className="breadcrumbs"><Link href="/">Home</Link><ChevronRight size={13}/><Link href="/shop">Shop</Link><ChevronRight size={13}/><span>{product.name}</span></div>
      <div className="detail-grid">
        <ProductVisual product={product} className="detail-art" />
        <div className="detail-copy">
          <p className="eyebrow">FRAGRANCE · {product.category.toUpperCase()}</p>
          <h1>{product.name}</h1>
          <p className="detail-subtitle">{product.subtitle}</p>
          <div className="detail-rule" />
          <p className="detail-description">{product.description}</p>
          <p className="detail-price">{formatPrice(product.price_cents)} <span> / {product.size_ml} ml</span></p>
          <AddToCart productId={product.id} full />
          <p className="detail-benefit">Catalog preview · Online checkout is not available.</p>
          {illustrative && <p className="detail-illustration-note">Image is an original scent illustration, not the branded bottle or packaging. Confirm product details before purchase.</p>}
          <div className="notes">
            {illustrative ? <><h2>SCENT PROFILE</h2><div><span>NOTES</span><p>{scentProfile.join(" · ")}</p></div></> : <><h2>THE NOTES</h2><div><span>TOP</span><p>{product.notes_top.join(" · ")}</p></div><div><span>HEART</span><p>{product.notes_heart.join(" · ")}</p></div><div><span>BASE</span><p>{product.notes_base.join(" · ")}</p></div></>}
          </div>
        </div>
      </div>
    </section>
    <section className="section container related-section"><div className="section-heading"><div><p className="eyebrow">KEEP EXPLORING</p><h2>You may also love.</h2></div></div><div className="product-grid">{related.map(p => <ProductCard key={p.id} product={p}/>)}</div></section>
  </>;
}
