-- 1. Ensure site_pages exist
INSERT INTO public.site_pages (route, internal_name, is_indexable, status)
VALUES 
  ('/', 'Ana Sayfa', true, 'published'),
  ('/hakkimizda', 'Kurumsal', true, 'published'),
  ('/urunler', 'Ürün Kategorileri', true, 'published'),
  ('/kataloglar', 'Kataloglarımız', true, 'published'),
  ('/bayiliklerimiz', 'Bayiliklerimiz', true, 'published'),
  ('/iletisim', 'İletişim', true, 'published')
ON CONFLICT (route) DO UPDATE SET internal_name = EXCLUDED.internal_name;

-- 2. Ensure sections for 'home' page exist
INSERT INTO public.page_sections (page_id, section_key, internal_label, section_type, display_order, is_active)
SELECT id, 'hero', 'Hero Tanıtım', 'hero', 10, true FROM public.site_pages WHERE route = '/'
ON CONFLICT (page_id, section_key) DO NOTHING;

-- 3. Populate content for 'home' -> 'hero'
DELETE FROM public.section_content 
WHERE section_id IN (
  SELECT s.id FROM public.page_sections s JOIN public.site_pages p ON s.page_id = p.id WHERE p.route = '/' AND s.section_key = 'hero'
);

INSERT INTO public.section_content (section_id, field_key, value_text, field_type, label)
SELECT s.id, 'title', 'İşinize güç katan\nprofesyonel hırdavat çözümleri.', 'text', 'Ana Başlık'
FROM public.page_sections s JOIN public.site_pages p ON s.page_id = p.id WHERE p.route = '/' AND s.section_key = 'hero';

INSERT INTO public.section_content (section_id, field_key, value_text, field_type, label)
SELECT s.id, 'description', 'Elektrikli el aletlerinden bağlantı elemanlarına, iş güvenliğinden endüstriyel makinelere; sanayi tesisleri ve şantiyeler için yetkili distribütör güvencesiyle tek noktadan tedarik.', 'text', 'Açıklama'
FROM public.page_sections s JOIN public.site_pages p ON s.page_id = p.id WHERE p.route = '/' AND s.section_key = 'hero';

INSERT INTO public.section_content (section_id, field_key, value_text, field_type, label)
SELECT s.id, 'primary_cta_text', 'Ürün Gruplarını İncele', 'text', 'Birincil Buton Yazısı'
FROM public.page_sections s JOIN public.site_pages p ON s.page_id = p.id WHERE p.route = '/' AND s.section_key = 'hero';

INSERT INTO public.section_content (section_id, field_key, link_url, field_type, label)
SELECT s.id, 'primary_cta_url', '/urunler', 'url', 'Birincil Buton Linki'
FROM public.page_sections s JOIN public.site_pages p ON s.page_id = p.id WHERE p.route = '/' AND s.section_key = 'hero';

INSERT INTO public.section_content (section_id, field_key, value_text, field_type, label)
SELECT s.id, 'secondary_cta_text', 'Teklif Talep Et', 'text', 'İkincil Buton Yazısı'
FROM public.page_sections s JOIN public.site_pages p ON s.page_id = p.id WHERE p.route = '/' AND s.section_key = 'hero';

INSERT INTO public.section_content (section_id, field_key, link_url, field_type, label)
SELECT s.id, 'secondary_cta_url', '/teklif', 'url', 'İkincil Buton Linki'
FROM public.page_sections s JOIN public.site_pages p ON s.page_id = p.id WHERE p.route = '/' AND s.section_key = 'hero';
