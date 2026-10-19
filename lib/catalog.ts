import { demoProducts } from "@/lib/demo";
import type { Product } from "@/lib/types";

// GitHub Pages serves this catalog at build time. Update these entries and rebuild to change the site.
const publishedSlugs = new Set([
  "hermes-un-jardin-sur-le-nil",
  "jo-malone-wood-sage-sea-salt",
  "armani-prive-the-yulong",
  "versace-bright-crystal",
]);

export const catalogProducts: Product[] = demoProducts.filter(
  (product) => product.is_active && publishedSlugs.has(product.slug),
);

export function getProduct(slug: string): Product | null {
  return catalogProducts.find((product) => product.slug === slug) ?? null;
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
