-- ============ BOOKINGS ============
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow anyone to insert bookings" ON public.bookings;

CREATE POLICY "Guests and users can insert pending bookings"
ON public.bookings
FOR INSERT
TO anon, authenticated
WITH CHECK (user_id IS NULL AND status = 'pending');

-- ============ CHAT MESSAGES ============
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Authenticated can update chat messages" ON public.chat_messages;

CREATE POLICY "Anyone can post non-privileged chat messages"
ON public.chat_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  COALESCE(is_admin, false) = false
  AND COALESCE(is_pinned, false) = false
  AND COALESCE(deleted, false) = false
);

CREATE POLICY "Admins can update chat messages"
ON public.chat_messages
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============ PROFILES ============
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Safe public view: only non-sensitive display fields (no phone)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT user_id, full_name, avatar_url
FROM public.profiles;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- ============ STORAGE: fshati-images ============
DROP POLICY IF EXISTS "Authenticated users can delete fshati images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update fshati images" ON storage.objects;

CREATE POLICY "Admins can delete fshati images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'fshati-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update fshati images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'fshati-images' AND has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'fshati-images' AND has_role(auth.uid(), 'admin'::app_role));