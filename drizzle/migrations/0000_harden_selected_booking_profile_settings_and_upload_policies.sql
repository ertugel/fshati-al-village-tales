ALTER POLICY "Users can create own bookings" ON public.bookings TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending');
ALTER POLICY "Users can cancel own bookings" ON public.bookings TO authenticated USING (auth.uid() = user_id AND status = 'pending') WITH CHECK (auth.uid() = user_id AND status = 'cancelled');

DROP POLICY "Profile display fields are public" ON public.profiles;
CREATE POLICY "Users and admins can read profiles" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public reviewer display profiles" ON public.profiles FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.reviews r WHERE r.user_id = profiles.user_id));

ALTER POLICY "Anyone can select site settings" ON public.site_settings USING (key IN ('hero_headline', 'hero_sub', 'subscriber_count', 'whatsapp', 'email', 'online_label', 'show_events', 'show_guides', 'maintenance_message'));

ALTER POLICY "Anyone can submit a partner application" ON public.partner_applications WITH CHECK (
  status = 'pending'
  AND char_length(btrim(name)) BETWEEN 1 AND 200
  AND char_length(btrim(business_name)) BETWEEN 1 AND 200
  AND property_type IN ('Guesthouse', 'Agritourism', 'Boutique Hotel', 'Camping', 'Villa', 'Eco-Lodge', 'Other')
  AND char_length(btrim(location)) BETWEEN 1 AND 300
  AND char_length(btrim(phone)) BETWEEN 1 AND 50
  AND (message IS NULL OR char_length(message) <= 3000)
);

ALTER POLICY "Authenticated users can upload fshati images" ON storage.objects TO authenticated WITH CHECK (bucket_id = 'fshati-images' AND owner_id = (SELECT auth.uid()::text));