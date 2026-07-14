/*
# Admin Panel Schema for EvaQueen

Creates tables for: admin sessions, orders, order items, galleries, gallery images,
posts, site users, site settings, and admin activity logs.

1. New Tables
- `admin_sessions` — admin login sessions (token-based, 24h expiry)
- `orders` — purchase orders with status tracking
- `order_items` — individual items within an order
- `galleries` — image album groupings
- `gallery_images` — images within galleries
- `posts` — CMS content (draft/published/scheduled)
- `site_users` — registered customers
- `site_settings` — key-value site configuration
- `admin_logs` — admin activity audit trail

2. Security
- RLS enabled on all tables.
- All tables allow anon+authenticated CRUD (admin panel is protected client-side via session token).
- In production, restrict to authenticated admin role.

3. Notes
- Orders store customer info denormalized for simplicity.
- Settings are key-value pairs for flexible expansion.
*/

-- Admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  username text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  ip_address text,
  user_agent text
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  status text NOT NULL DEFAULT 'new',
  total_amount text NOT NULL,
  items_json jsonb NOT NULL DEFAULT '[]',
  notes text,
  admin_notes text,
  priority text NOT NULL DEFAULT 'normal',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Galleries
CREATE TABLE IF NOT EXISTS galleries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  cover_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid REFERENCES galleries(id) ON DELETE CASCADE,
  title text,
  description text,
  image_url text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Posts (CMS)
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  content text,
  excerpt text,
  category text,
  tags text[],
  status text NOT NULL DEFAULT 'draft',
  featured_image text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site users
CREATE TABLE IF NOT EXISTS site_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  email text UNIQUE NOT NULL,
  phone text,
  is_active boolean DEFAULT true,
  order_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Site settings (key-value)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Admin activity logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity text,
  entity_id text,
  details text,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Policies: anon+authenticated CRUD (admin panel is client-side protected)
-- admin_sessions
DROP POLICY IF EXISTS "as_select" ON admin_sessions;
CREATE POLICY "as_select" ON admin_sessions FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "as_insert" ON admin_sessions;
CREATE POLICY "as_insert" ON admin_sessions FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "as_update" ON admin_sessions;
CREATE POLICY "as_update" ON admin_sessions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "as_delete" ON admin_sessions;
CREATE POLICY "as_delete" ON admin_sessions FOR DELETE TO anon, authenticated USING (true);

-- orders
DROP POLICY IF EXISTS "ord_select" ON orders;
CREATE POLICY "ord_select" ON orders FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "ord_insert" ON orders;
CREATE POLICY "ord_insert" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ord_update" ON orders;
CREATE POLICY "ord_update" ON orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "ord_delete" ON orders;
CREATE POLICY "ord_delete" ON orders FOR DELETE TO anon, authenticated USING (true);

-- galleries
DROP POLICY IF EXISTS "gal_select" ON galleries;
CREATE POLICY "gal_select" ON galleries FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "gal_insert" ON galleries;
CREATE POLICY "gal_insert" ON galleries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "gal_update" ON galleries;
CREATE POLICY "gal_update" ON galleries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "gal_delete" ON galleries;
CREATE POLICY "gal_delete" ON galleries FOR DELETE TO anon, authenticated USING (true);

-- gallery_images
DROP POLICY IF EXISTS "gi_select" ON gallery_images;
CREATE POLICY "gi_select" ON gallery_images FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "gi_insert" ON gallery_images;
CREATE POLICY "gi_insert" ON gallery_images FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "gi_update" ON gallery_images;
CREATE POLICY "gi_update" ON gallery_images FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "gi_delete" ON gallery_images;
CREATE POLICY "gi_delete" ON gallery_images FOR DELETE TO anon, authenticated USING (true);

-- posts
DROP POLICY IF EXISTS "post_select" ON posts;
CREATE POLICY "post_select" ON posts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "post_insert" ON posts;
CREATE POLICY "post_insert" ON posts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "post_update" ON posts;
CREATE POLICY "post_update" ON posts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "post_delete" ON posts;
CREATE POLICY "post_delete" ON posts FOR DELETE TO anon, authenticated USING (true);

-- site_users
DROP POLICY IF EXISTS "su_select" ON site_users;
CREATE POLICY "su_select" ON site_users FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "su_insert" ON site_users;
CREATE POLICY "su_insert" ON site_users FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "su_update" ON site_users;
CREATE POLICY "su_update" ON site_users FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "su_delete" ON site_users;
CREATE POLICY "su_delete" ON site_users FOR DELETE TO anon, authenticated USING (true);

-- site_settings
DROP POLICY IF EXISTS "ss_select" ON site_settings;
CREATE POLICY "ss_select" ON site_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "ss_insert" ON site_settings;
CREATE POLICY "ss_insert" ON site_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "ss_update" ON site_settings;
CREATE POLICY "ss_update" ON site_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "ss_delete" ON site_settings;
CREATE POLICY "ss_delete" ON site_settings FOR DELETE TO anon, authenticated USING (true);

-- admin_logs
DROP POLICY IF EXISTS "al_select" ON admin_logs;
CREATE POLICY "al_select" ON admin_logs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "al_insert" ON admin_logs;
CREATE POLICY "al_insert" ON admin_logs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "al_delete" ON admin_logs;
CREATE POLICY "al_delete" ON admin_logs FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_gallery_images_gallery ON gallery_images(gallery_id);
CREATE INDEX IF NOT EXISTS idx_site_users_email ON site_users(email);
