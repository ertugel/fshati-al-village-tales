
-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  username text NOT NULL,
  country_flag text DEFAULT '🌍',
  message text NOT NULL,
  is_admin boolean DEFAULT false,
  is_pinned boolean DEFAULT false,
  deleted boolean DEFAULT false
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can SELECT non-deleted messages
CREATE POLICY "Anyone can select chat messages" ON public.chat_messages
  FOR SELECT TO anon, authenticated USING (deleted = false);

-- Admin can select ALL messages including deleted
CREATE POLICY "Admin can select all chat messages" ON public.chat_messages
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can insert chat messages
CREATE POLICY "Anyone can insert chat messages" ON public.chat_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Authenticated can update (for admin pin/delete)
CREATE POLICY "Authenticated can update chat messages" ON public.chat_messages
  FOR UPDATE TO authenticated USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Create site_settings table
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select site settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated can insert site settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update site settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (true);
