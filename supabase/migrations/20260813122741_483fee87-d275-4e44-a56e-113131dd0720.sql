-- Ensure all requested CMS pages exist
INSERT INTO public.site_pages (route, internal_name, status)
VALUES 
  ('global_settings', 'Genel İçerikler', 'published'),
  ('/', 'Ana Sayfa', 'published'),
  ('hero_slider', 'Hero Slider', 'published'),
  ('top_bar', 'Üst Bilgi Çubuğu', 'published'),
  ('header_nav', 'Header ve Navigasyon', 'published'),
  ('/kurumsal', 'Kurumsal Sayfası', 'published'),
  ('/urunler', 'Ürün Kategorileri Sayfası', 'published'),
  ('/kataloglar', 'Kataloglarımız Sayfası', 'published'),
  ('/bayiliklerimiz', 'Bayiliklerimiz Sayfası', 'published'),
  ('/teklif', 'Teklif Talep Sayfası', 'published'),
  ('/iletisim', 'İletişim Sayfası', 'published'),
  ('footer', 'Footer', 'published'),
  ('/kvkk', 'Yasal Sayfalar', 'published'),
  ('/sistem', 'Sistem Mesajları', 'published')
ON CONFLICT (route) DO UPDATE 
SET internal_name = EXCLUDED.internal_name;

-- Seed sections for Home Page if they don't exist
DO $$
DECLARE
    home_id UUID;
    kurumsal_id UUID;
    teklif_id UUID;
    iletisim_id UUID;
BEGIN
    SELECT id INTO home_id FROM public.site_pages WHERE route = '/';
    SELECT id INTO kurumsal_id FROM public.site_pages WHERE route = '/kurumsal';
    SELECT id INTO teklif_id FROM public.site_pages WHERE route = '/teklif';
    SELECT id INTO iletisim_id FROM public.site_pages WHERE route = '/iletisim';
    
    -- Home Sections
    INSERT INTO public.page_sections (page_id, section_key, internal_label, section_type, display_order)
    VALUES 
      (home_id, 'hero', 'Ana Kahraman (Hero)', 'hero', 10),
      (home_id, 'categories_intro', 'Ürün Grupları Başlık', 'text_block', 20),
      (home_id, 'value_props', 'Kurumsal Yetkinlik (İstatistikler)', 'features', 30),
      (home_id, 'sectors', 'Uygulama Sektörleri', 'tabs', 40),
      (home_id, 'why_choose', 'Neden Pratik (Liste)', 'list', 50),
      (home_id, 'contact_cta', 'İletişim Çağrısı (CTA)', 'cta', 60)
    ON CONFLICT (page_id, section_key) DO NOTHING;

    -- Kurumsal Sections
    INSERT INTO public.page_sections (page_id, section_key, internal_label, section_type, display_order)
    VALUES 
      (kurumsal_id, 'hero', 'Sayfa Başlığı', 'hero', 10),
      (kurumsal_id, 'mission_vision', 'Misyon & Vizyon', 'split_text', 20),
      (kurumsal_id, 'history', 'Şirket Tarihçesi', 'text_block', 30),
      (kurumsal_id, 'values', 'Değerlerimiz', 'grid', 40)
    ON CONFLICT (page_id, section_key) DO NOTHING;

    -- Teklif Sections
    INSERT INTO public.page_sections (page_id, section_key, internal_label, section_type, display_order)
    VALUES 
      (teklif_id, 'intro', 'Giriş ve Güven Alanı', 'text_block', 10),
      (teklif_id, 'form_labels', 'Form Etiketleri ve Mesajlar', 'form_config', 20)
    ON CONFLICT (page_id, section_key) DO NOTHING;

    -- Iletisim Sections
    INSERT INTO public.page_sections (page_id, section_key, internal_label, section_type, display_order)
    VALUES 
      (iletisim_id, 'hero', 'Sayfa Başlığı', 'hero', 10),
      (iletisim_id, 'contact_info', 'İletişim Bilgileri Başlıkları', 'text_block', 20),
      (iletisim_id, 'form_config', 'Form Etiketleri', 'form_config', 30)
    ON CONFLICT (page_id, section_key) DO NOTHING;

END $$;