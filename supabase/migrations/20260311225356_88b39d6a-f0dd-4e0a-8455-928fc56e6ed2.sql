
-- Create destinations table
CREATE TABLE public.destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  type text,
  zone text,
  price numeric,
  price_unit text DEFAULT 'natë',
  description text,
  emoji text DEFAULT '🏔️',
  badge text,
  rating numeric DEFAULT 4.8,
  review_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  status text DEFAULT 'active',
  image_gradient text
);

ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Destinations viewable by everyone" ON public.destinations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert destinations" ON public.destinations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update destinations" ON public.destinations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete destinations" ON public.destinations FOR DELETE TO authenticated USING (true);

-- Create events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  title text NOT NULL,
  type text,
  start_date date NOT NULL,
  end_date date,
  location text NOT NULL,
  zone text,
  description text,
  emoji text DEFAULT '🎉',
  price numeric DEFAULT 0,
  price_note text DEFAULT 'Falas',
  featured boolean DEFAULT false,
  status text DEFAULT 'upcoming'
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events viewable by everyone" ON public.events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authenticated can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update events" ON public.events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete events" ON public.events FOR DELETE TO authenticated USING (true);

-- Add featured and status to existing tours table
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Add columns to bookings for public form submissions
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS destination_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS message text;

-- Make some bookings columns nullable for public submissions
ALTER TABLE public.bookings ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN item_id DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN item_name DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN item_type DROP NOT NULL;
ALTER TABLE public.bookings ALTER COLUMN total_price DROP NOT NULL;

-- Add policy for public booking insertions
CREATE POLICY "Anyone can insert bookings" ON public.bookings FOR INSERT TO anon WITH CHECK (true);
