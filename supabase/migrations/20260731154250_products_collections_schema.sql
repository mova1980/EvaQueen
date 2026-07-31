/*
# Products & Collections tables — connects admin to live site

Creates `products` and `collections` tables so the admin panel can manage
what appears on the live site. Seeded with existing hardcoded data.

- `products`: name, price, category, image, images[], description, sizes, colors, status (draft/published), sort_order
- `collections`: name, desc, image, images[], product_ids[], status, sort_order
- RLS enabled, anon+authenticated CRUD
*/

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text,
  price text NOT NULL,
  price_en text,
  category text NOT NULL,
  category_en text,
  image text NOT NULL,
  images text[] DEFAULT '{}',
  description text,
  description_en text,
  sizes text[] DEFAULT ARRAY['XS','S','M','L','XL','XXL'],
  colors jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'published',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Collections
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text,
  description text NOT NULL,
  description_en text,
  image text NOT NULL,
  images text[] DEFAULT '{}',
  product_ids int[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'published',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Products policies
DROP POLICY IF EXISTS "prod_select" ON products;
CREATE POLICY "prod_select" ON products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "prod_insert" ON products;
CREATE POLICY "prod_insert" ON products FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "prod_update" ON products;
CREATE POLICY "prod_update" ON products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "prod_delete" ON products;
CREATE POLICY "prod_delete" ON products FOR DELETE TO anon, authenticated USING (true);

-- Collections policies
DROP POLICY IF EXISTS "col_select" ON collections;
CREATE POLICY "col_select" ON collections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "col_insert" ON collections;
CREATE POLICY "col_insert" ON collections FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "col_update" ON collections;
CREATE POLICY "col_update" ON collections FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "col_delete" ON collections;
CREATE POLICY "col_delete" ON collections FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_sort ON products(sort_order);
CREATE INDEX IF NOT EXISTS idx_collections_status ON collections(status);
CREATE INDEX IF NOT EXISTS idx_collections_sort ON collections(sort_order);
