
-- Add image_url column to destinations
ALTER TABLE public.destinations ADD COLUMN IF NOT EXISTS image_url text;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('fshati-images', 'fshati-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view fshati images"
ON storage.objects FOR SELECT
USING (bucket_id = 'fshati-images');

CREATE POLICY "Authenticated users can upload fshati images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'fshati-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update fshati images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'fshati-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete fshati images"
ON storage.objects FOR DELETE
USING (bucket_id = 'fshati-images' AND auth.role() = 'authenticated');
