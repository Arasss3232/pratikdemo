DO $$
DECLARE
    kurumsal_id UUID;
    urunler_id UUID;
    kataloglar_id UUID;
    bayilikler_id UUID;
    iletisim_id UUID;
    kvkk_id UUID;
BEGIN
    SELECT id INTO kurumsal_id FROM public.site_pages WHERE route = '/kurumsal';
    SELECT id INTO urunler_id FROM public.site_pages WHERE route = '/urunler';
    SELECT id INTO kataloglar_id FROM public.site_pages WHERE route = '/kataloglar';
    SELECT id INTO bayilikler_id FROM public.site_pages WHERE route = '/bayiliklerimiz';
    SELECT id INTO iletisim_id FROM public.site_pages WHERE route = '/iletisim';
    SELECT id INTO kvkk_id FROM public.site_pages WHERE route = '/kvkk';

    -- Insert Sections
    INSERT INTO public.page_sections (page_id, section_key, internal_label, section_type, display_order)
    VALUES 
      (kurumsal_id, 'hero', 'Hero Alanı', 'hero', 10),
      (kurumsal_id, 'intro', 'Kurumsal Giriş', 'text_block', 20),
      (urunler_id, 'hero', 'Hero Alanı', 'hero', 10),
      (kataloglar_id, 'hero', 'Hero Alanı', 'hero', 10),
      (bayilikler_id, 'hero', 'Hero Alanı', 'hero', 10),
      (iletisim_id, 'hero', 'Hero Alanı', 'hero', 10),
      (kvkk_id, 'hero', 'Hero Alanı', 'hero', 10),
      (kvkk_id, 'content', 'İçerik Gövdesi', 'text_block', 20)
    ON CONFLICT (page_id, section_key) DO NOTHING;

    -- Update is_active
    UPDATE public.page_sections SET is_active = true;

    -- Seed Hero Content for each page
    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text)
    SELECT id, 'title', 'text', 'Başlık', 'Kurumsal' FROM public.page_sections WHERE section_key = 'hero' AND page_id = kurumsal_id
    UNION ALL
    SELECT id, 'title', 'text', 'Başlık', 'Ürün Kategorileri' FROM public.page_sections WHERE section_key = 'hero' AND page_id = urunler_id
    UNION ALL
    SELECT id, 'title', 'text', 'Başlık', 'Kataloglarımız' FROM public.page_sections WHERE section_key = 'hero' AND page_id = kataloglar_id
    UNION ALL
    SELECT id, 'title', 'text', 'Başlık', 'Bayiliklerimiz' FROM public.page_sections WHERE section_key = 'hero' AND page_id = bayilikler_id
    UNION ALL
    SELECT id, 'title', 'text', 'Başlık', 'İletişim' FROM public.page_sections WHERE section_key = 'hero' AND page_id = iletisim_id
    UNION ALL
    SELECT id, 'title', 'text', 'Başlık', 'KVKK' FROM public.page_sections WHERE section_key = 'hero' AND page_id = kvkk_id
    ON CONFLICT (section_id, field_key) DO NOTHING;
END $$;