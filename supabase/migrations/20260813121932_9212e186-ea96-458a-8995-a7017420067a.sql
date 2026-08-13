-- Seed Site Pages
INSERT INTO public.site_pages (route, internal_name, status)
VALUES 
  ('/', 'Ana Sayfa', 'published'),
  ('/kurumsal', 'Kurumsal', 'published'),
  ('/urunler', 'Ürün Kategorileri', 'published'),
  ('/kataloglar', 'Kataloglarımız', 'published'),
  ('/bayiliklerimiz', 'Bayiliklerimiz', 'published'),
  ('/teklif', 'Teklif Talep', 'published'),
  ('/iletisim', 'İletişim', 'published'),
  ('/kvkk', 'Yasal Sayfalar', 'published'),
  ('/sistem', 'Sistem Mesajları', 'published')
ON CONFLICT (route) DO NOTHING;

-- Seed Sections for Home Page
DO $$
DECLARE
    home_id UUID;
    kurumsal_id UUID;
BEGIN
    SELECT id INTO home_id FROM public.site_pages WHERE route = '/';
    SELECT id INTO kurumsal_id FROM public.site_pages WHERE route = '/kurumsal';
    
    -- Home Sections
    INSERT INTO public.page_sections (page_id, section_key, internal_label, section_type, display_order)
    VALUES 
      (home_id, 'hero', 'Hero Alanı', 'hero', 10),
      (home_id, 'categories_intro', 'Ürün Grupları Başlık', 'text_block', 20),
      (home_id, 'value_props', 'Kurumsal Yetkinlik', 'features', 30),
      (home_id, 'sectors', 'Uygulama Sektörleri', 'tabs', 40),
      (home_id, 'why_choose', 'Neden Pratik', 'list', 50),
      (home_id, 'contact_cta', 'İletişim CTA', 'cta', 60)
    ON CONFLICT (page_id, section_key) DO NOTHING;

    -- Home Hero Content
    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text)
    SELECT id, 'title', 'text', 'Ana Başlık', 'İşinize güç katan\nprofesyonel hırdavat çözümleri.'
    FROM public.page_sections WHERE section_key = 'hero' AND page_id = home_id
    ON CONFLICT (section_id, field_key) DO NOTHING;

    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text)
    SELECT id, 'description', 'textarea', 'Açıklama Metni', 'Elektrikli el aletlerinden bağlantı elemanlarına, iş güvenliğinden endüstriyel makinelere; sanayi tesisleri ve şantiyeler için yetkili distribütör güvencesiyle tek noktadan tedarik.'
    FROM public.page_sections WHERE section_key = 'hero' AND page_id = home_id
    ON CONFLICT (section_id, field_key) DO NOTHING;
    
    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text)
    SELECT id, 'primary_cta_text', 'text', 'Birincil Buton Metni', 'Ürün Gruplarını İncele'
    FROM public.page_sections WHERE section_key = 'hero' AND page_id = home_id
    ON CONFLICT (section_id, field_key) DO NOTHING;

    INSERT INTO public.section_content (section_id, field_key, field_type, label, link_url)
    SELECT id, 'primary_cta_url', 'link', 'Birincil Buton Linki', '/urunler'
    FROM public.page_sections WHERE section_key = 'hero' AND page_id = home_id
    ON CONFLICT (section_id, field_key) DO NOTHING;

    -- Categories Intro Content
    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text)
    SELECT id, 'title', 'text', 'Bölüm Başlığı', 'Tek tedarikçiden, altı ana grup.'
    FROM public.page_sections WHERE section_key = 'categories_intro' AND page_id = home_id
    ON CONFLICT (section_id, field_key) DO NOTHING;

    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text)
    SELECT id, 'description', 'textarea', 'Bölüm Açıklaması', 'Sanayi, şantiye ve teknik servis operasyonlarınızın ihtiyaç duyduğu profesyonel donanımı, kategori uzmanı ekibimizle tek noktadan sunuyoruz.'
    FROM public.page_sections WHERE section_key = 'categories_intro' AND page_id = home_id
    ON CONFLICT (section_id, field_key) DO NOTHING;
END $$;