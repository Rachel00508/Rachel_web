export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  notes_top: string[];
  notes_heart: string[];
  notes_base: string[];
  price_cents: number;
  size_ml: number;
  image_key: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
};

export type CartItem = { productId: string; quantity: number };
