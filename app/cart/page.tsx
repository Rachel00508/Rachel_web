import { CartView } from "@/components/cart-view";
import { catalogProducts } from "@/lib/catalog";

export default function CartPage() {
  return <CartView products={catalogProducts} />;
}
