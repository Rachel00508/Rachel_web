import Image from "next/image";
import { Bottle } from "@/components/bottle";
import type { Product } from "@/lib/types";

export function ProductVisual({ product, className = "" }: { product: Product; className?: string }) {
  if (!product.image_key.startsWith("/products/")) return <Bottle variant={product.image_key} className={className} />;
  return <div className={`product-art product-photo ${className}`}>
    <Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}${product.image_key}`} alt={`Illustrative fragrance image for ${product.name}; not the actual branded packaging`} fill sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw" className="product-photo-image" />
    <span className="image-disclaimer">ILLUSTRATIVE IMAGE</span>
  </div>;
}
