-- 1. Bookings: close PII leak + dedupe policies
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin can update bookings" ON public.bookings;

CREATE POLICY "Users can view own bookings"
ON public.bookings FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Owners can update bookings for their accommodations"
ON public.bookings FOR UPDATE TO authenticated
USING (item_type = 'accommodation' AND item_id IN (
  SELECT id FROM public.accommodations WHERE owner_id = auth.uid()
))
WITH CHECK (item_type = 'accommodation' AND item_id IN (
  SELECT id FROM public.accommodations WHERE owner_id = auth.uid()
));

-- 2. Contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a contact message"
ON public.contact_messages FOR INSERT TO anon, authenticated
WITH CHECK (status = 'new');
CREATE POLICY "Admins can view contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact messages"
ON public.contact_messages FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete contact messages"
ON public.contact_messages FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_contact_messages_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe"
ON public.newsletter_subscribers FOR INSERT TO anon, authenticated
WITH CHECK (is_active = true);
CREATE POLICY "Admins can view subscribers"
ON public.newsletter_subscribers FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update subscribers"
ON public.newsletter_subscribers FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete subscribers"
ON public.newsletter_subscribers FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_newsletter_subscribers_updated_at
BEFORE UPDATE ON public.newsletter_subscribers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();