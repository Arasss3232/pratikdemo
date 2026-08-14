-- Ensure seed data for missing sections exists
-- Top Bar
INSERT INTO public.site_content (page_section, field_key, content_value)
VALUES 
  ('top_bar', 'working_hours', 'Pzt - Cmt: 08:30 - 18:30'),
  ('top_bar', 'address', 'İvedik OSB, 1354. Cadde, No: 1 Ankara'),
  ('top_bar', 'phone', '0553 306 92 10'),
  ('top_bar', 'whatsapp_number', '0553 306 92 10')
ON CONFLICT (page_section, field_key) DO NOTHING;

-- Header
INSERT INTO public.site_content (page_section, field_key, content_value)
VALUES 
  ('header', 'nav_home', 'Ana Sayfa'),
  ('header', 'nav_corporate', 'Kurumsal'),
  ('header', 'nav_products', 'Ürünler'),
  ('header', 'nav_catalogs', 'Kataloglar'),
  ('header', 'nav_dealerships', 'Bayiliklerimiz'),
  ('header', 'nav_contact', 'İletişim'),
  ('header', 'cta_button_text', 'TEKLİF TALEP ET')
ON CONFLICT (page_section, field_key) DO NOTHING;

-- Footer
INSERT INTO public.site_content (page_section, field_key, content_value)
VALUES 
  ('footer', 'company_description', 'Sanayi, inşaat ve teknik servis ekiplerine profesyonel donanım tedariki. Doğru ürün, kurumsal süreç ve satış sonrası iletişim.'),
  ('footer', 'email', 'bilgi@pratiktedarik.com'),
  ('footer', 'facebook_url', '#'),
  ('footer', 'instagram_url', '#'),
  ('footer', 'linkedin_url', '#'),
  ('footer', 'copyright_text', '© 2026 Pratik Endüstri')
ON CONFLICT (page_section, field_key) DO NOTHING;

-- Home (Hero)
INSERT INTO public.site_content (page_section, field_key, content_value)
VALUES 
  ('hero', 'main_title', 'Endüstriyel Tedarikte Profesyonel Çözüm Ortağınız'),
  ('hero', 'about_text', 'İvedik OSB merkezli operasyonumuzla sanayi ve inşaat sektörüne yüksek kaliteli teknik hırdavat, makine ve ekipman desteği sağlıyoruz.'),
  ('hero', 'primary_cta_text', 'Ürünleri İncele'),
  ('hero', 'secondary_cta_text', 'Teklif İste')
ON CONFLICT (page_section, field_key) DO NOTHING;

-- Contact
INSERT INTO public.site_content (page_section, field_key, content_value)
VALUES 
  ('contact', 'page_title', 'İletişim'),
  ('contact', 'page_description', 'Projeleriniz için teklif almak veya teknik destek talepleriniz için bize ulaşın.'),
  ('contact', 'contact_subtitle', 'Bize Ulaşın'),
  ('contact', 'form_title', 'Hızlı İletişim Formu')
ON CONFLICT (page_section, field_key) DO NOTHING;
