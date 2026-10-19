create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  subtitle text not null,
  description text not null,
  notes_top text[] not null default '{}',
  notes_heart text[] not null default '{}',
  notes_base text[] not null default '{}',
  price_cents integer not null check (price_cents > 0),
  size_ml integer not null check (size_ml > 0),
  image_key text not null,
  category text not null default 'Eau de Parfum',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  customer_email text,
  amount_total_cents integer not null check (amount_total_cents >= 0),
  currency text not null default 'usd',
  status text not null default 'paid' check (status in ('paid', 'refunded')),
  shipping_name text,
  shipping_address jsonb,
  items jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products
  for select to anon, authenticated using (is_active = true);

-- No public policies for orders or contact_messages. Server routes use the service role.

insert into public.products (slug, name, subtitle, description, notes_top, notes_heart, notes_base, price_cents, size_ml, image_key, category, is_featured, sort_order)
values
  ('santal-muse', 'Santal Muse', 'A quiet kind of magnetism.', 'Creamy sandalwood meets soft iris and a trace of amber. A close-to-skin signature for the moments that stay with you.', array['Cardamom', 'Bergamot'], array['Iris', 'Violet'], array['Sandalwood', 'Amber'], 12800, 50, 'santal', 'Woody', true, 1),
  ('fleur-noire', 'Fleur Noire', 'The art of leaving an impression.', 'A luminous floral with a darker edge. Jasmine blooms over black tea, wrapped in a velvety veil of musk.', array['Black Tea', 'Pink Pepper'], array['Jasmine', 'Rose'], array['Musk', 'Patchouli'], 14200, 50, 'fleur', 'Floral', true, 2),
  ('solstice', 'Solstice', 'Warmth, bottled.', 'Golden citrus, sunlit neroli and soft cedar evoke the last light of a long summer day.', array['Mandarin', 'Petitgrain'], array['Neroli', 'Orange Blossom'], array['Cedarwood', 'White Musk'], 11800, 50, 'solstice', 'Fresh', true, 3),
  ('afterglow', 'Afterglow', 'For the hours after sunset.', 'A warm, intimate composition of fig, saffron and vanilla. Unexpected, effortless, entirely yours.', array['Fig', 'Saffron'], array['Osmanthus', 'Jasmine'], array['Vanilla', 'Vetiver'], 13600, 50, 'afterglow', 'Amber', false, 4)
on conflict (slug) do nothing;

-- User-selected USD prices. Images are original concept illustrations, not brand packaging.
insert into public.products (id, slug, name, subtitle, description, notes_top, notes_heart, notes_base, price_cents, size_ml, image_key, category, is_featured, sort_order)
values
  ('11111111-1111-4111-8111-111111111101', 'hermes-un-jardin-sur-le-nil', '爱马仕尼罗河花园', 'Hermès · Un Jardin sur le Nil', 'A fresh, green and woody garden fragrance with green mango, lotus and sycamore. The image shown is an original illustration, not the actual product bottle.', array['Green mango', 'Lotus', 'Sycamore'], '{}', '{}', 25000, 50, '/products/hermes-nile.png', 'Fresh Green', true, -4),
  ('11111111-1111-4111-8111-111111111102', 'jo-malone-wood-sage-sea-salt', '祖·玛珑鼠尾草与海盐', 'Jo Malone London · Wood Sage & Sea Salt', 'A breezy woody scent inspired by the coast, with ambrette seed, sea salt and sage. The image shown is an original illustration, not the actual product bottle.', array['Ambrette seed', 'Sea salt', 'Sage'], '{}', '{}', 50000, 100, '/products/jo-malone-sea-salt.png', 'Woody Fresh', true, -3),
  ('11111111-1111-4111-8111-111111111103', 'armani-prive-the-yulong', '阿玛尼高定私藏御龙茶香', 'Armani Privé · Thé Yulong', 'An aromatic tea fragrance bringing together green mandarin, green tea and black tea. The image shown is an original illustration, not the actual product bottle.', array['Green mandarin', 'Green tea', 'Black tea'], '{}', '{}', 20000, 50, '/products/armani-the-yulong.png', 'Tea Aromatic', true, -2),
  ('11111111-1111-4111-8111-111111111104', 'versace-bright-crystal', '范思哲粉钻', 'Versace · Bright Crystal', 'A luminous fruity floral fragrance with pomegranate, peony, magnolia and lotus. The image shown is an original illustration, not the actual product bottle.', array['Pomegranate', 'Peony', 'Magnolia', 'Lotus'], '{}', '{}', 18800, 50, '/products/versace-bright-crystal.png', 'Fruity Floral', true, -1)
on conflict (slug) do update set
  name = excluded.name, subtitle = excluded.subtitle, description = excluded.description,
  notes_top = excluded.notes_top, notes_heart = excluded.notes_heart, notes_base = excluded.notes_base,
  price_cents = excluded.price_cents, size_ml = excluded.size_ml, image_key = excluded.image_key,
  category = excluded.category, is_featured = excluded.is_featured, sort_order = excluded.sort_order,
  is_active = true;
