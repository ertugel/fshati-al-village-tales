-- Remove the security-definer view flagged by the linter
DROP VIEW IF EXISTS public.public_profiles;

-- Remove the restrictive profile SELECT policies created previously
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Private contact table holding sensitive phone numbers
CREATE TABLE public.profile_contact (
  user_id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile_contact TO authenticated;
GRANT ALL ON public.profile_contact TO service_role;

ALTER TABLE public.profile_contact ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contact"
ON public.profile_contact FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all contacts"
ON public.profile_contact FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own contact"
ON public.profile_contact FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contact"
ON public.profile_contact FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profile_contact_updated_at
BEFORE UPDATE ON public.profile_contact
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing phone data
INSERT INTO public.profile_contact (user_id, phone)
SELECT user_id, phone FROM public.profiles WHERE phone IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Drop phone from the public profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone;

-- Restore public read of non-sensitive profile display fields
CREATE POLICY "Profile display fields are public"
ON public.profiles FOR SELECT TO anon, authenticated
USING (true);