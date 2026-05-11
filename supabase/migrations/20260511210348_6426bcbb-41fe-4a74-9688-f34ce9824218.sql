
-- 1. Harden handle_new_user: safelist allowed signup roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _role app_role;
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  _role := CASE
    WHEN NEW.raw_user_meta_data->>'role' = 'owner' THEN 'owner'::app_role
    ELSE 'tourist'::app_role
  END;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  RETURN NEW;
END;
$function$;

-- 2. Lock down destinations writes to admins
DROP POLICY IF EXISTS "Authenticated can insert destinations" ON public.destinations;
DROP POLICY IF EXISTS "Authenticated can update destinations" ON public.destinations;
DROP POLICY IF EXISTS "Authenticated can delete destinations" ON public.destinations;

CREATE POLICY "Admins can manage destinations"
  ON public.destinations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Lock down events writes to admins
DROP POLICY IF EXISTS "Authenticated can insert events" ON public.events;
DROP POLICY IF EXISTS "Authenticated can update events" ON public.events;
DROP POLICY IF EXISTS "Authenticated can delete events" ON public.events;

CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Lock down site_settings writes to admins
DROP POLICY IF EXISTS "Authenticated can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated can update site settings" ON public.site_settings;

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
