-- 1. media_library tablosu RLS politikalarını güncelle
DROP POLICY IF EXISTS "Admins have full access to media_library" ON public.media_library;
CREATE POLICY "Admins have full access to media_library"
ON public.media_library
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public can read media_library" ON public.media_library;
CREATE POLICY "Public can read media_library"
ON public.media_library
FOR SELECT
TO anon, authenticated
USING (true);

-- 2. catalogs tablosu RLS politikalarını güncelle
DROP POLICY IF EXISTS "Admins have full access to catalogs" ON public.catalogs;
CREATE POLICY "Admins have full access to catalogs"
ON public.catalogs
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. homepage_brochures tablosuna public read yetkisi ekle
DROP POLICY IF EXISTS "Public can read homepage_brochures" ON public.homepage_brochures;
CREATE POLICY "Public can read homepage_brochures"
ON public.homepage_brochures
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- 4. homepage_brochures tablosunu slider verileriyle doldur
INSERT INTO public.homepage_brochures (
  title, eyebrow, subtitle, description, image_desktop, image_alt, 
  primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href, 
  accent_color, overlay_style, text_theme, display_order, is_active
) 
SELECT 
  'Endüstriyel Donanımda Güvenilir Tedarik', 'PROFESYONEL ÇÖZÜMLER', 
  'Bosch · Makita · DeWalt · Hilti yetkili tedariki', 
  'Tesis, şantiye ve üretim hatlarınız için elektrikli el aletlerinden bağlantı elemanlarına uçtan uca profesyonel donanım çözümleri.',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1920&q=80',
  'Endüstriyel donanım tedariki', 'Kategorileri İncele', '/urunler', 'Teklif Talep Et', '/teklif',
  '#F5D311', 'left-navy', 'light', 1, true
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_brochures LIMIT 1);

INSERT INTO public.homepage_brochures (
  title, eyebrow, subtitle, description, image_desktop, image_alt, 
  primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href, 
  accent_color, overlay_style, text_theme, display_order, is_active
) 
SELECT 
  'Elektrikli El Aletleri Kampanyası', 'YENİ SEZON', 
  'Profesyonel ekipler için özel kurumsal fiyat', 
  'Akülü matkap, kırıcı, taşlama ve daha fazlasında geniş stok, hızlı sevkiyat ve teknik danışmanlık.',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1920&q=80',
  'Elektrikli el aletleri', 'Kategorileri İncele', '/urunler', 'Teklif Talep Et', '/teklif',
  '#F5D311', 'right-navy', 'light', 2, true
WHERE (SELECT COUNT(*) FROM public.homepage_brochures) < 2;
