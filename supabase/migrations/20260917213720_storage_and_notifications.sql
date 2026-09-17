/*
# Storage bucket + admin notifications table

1. Storage
- Create public bucket `admin-uploads` for images uploaded from the admin panel.
- Policies: anon+authenticated can read (public images); only authenticated can upload/update/delete.

2. New Table: admin_notifications
- Real notifications for the admin bell button (new orders, low stock, etc.)
- Columns: id, type (order/user/system), title, message, is_read, link, created_at
- RLS: anon+authenticated full CRUD (single-tenant admin app)

3. Trigger: auto-create notification on new order
- `notify_new_order` trigger fires AFTER INSERT on `orders`, inserts a row into `admin_notifications`.
*/

-- Bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('admin-uploads', 'admin-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "anon_read_uploads" ON storage.objects;
CREATE POLICY "anon_read_uploads" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'admin-uploads');

DROP POLICY IF EXISTS "auth_upload_uploads" ON storage.objects;
CREATE POLICY "auth_upload_uploads" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'admin-uploads');

DROP POLICY IF EXISTS "auth_update_uploads" ON storage.objects;
CREATE POLICY "auth_update_uploads" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'admin-uploads');

DROP POLICY IF EXISTS "auth_delete_uploads" ON storage.objects;
CREATE POLICY "auth_delete_uploads" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'admin-uploads');

-- Notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'system',
  title text NOT NULL,
  message text,
  is_read boolean NOT NULL DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notif_select" ON admin_notifications;
CREATE POLICY "notif_select" ON admin_notifications FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "notif_insert" ON admin_notifications;
CREATE POLICY "notif_insert" ON admin_notifications FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "notif_update" ON admin_notifications;
CREATE POLICY "notif_update" ON admin_notifications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "notif_delete" ON admin_notifications;
CREATE POLICY "notif_delete" ON admin_notifications FOR DELETE
  TO anon, authenticated USING (true);

-- Trigger: notify on new order
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (type, title, message, link)
  VALUES ('order', 'سفارش جدید', NEW.order_number || ' - ' || NEW.customer_name, 'orders');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_notify_new_order ON orders;
CREATE TRIGGER trg_notify_new_order
AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION notify_new_order();
