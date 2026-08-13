-- CMS Seeding for Pratik Tedarik Yapı
-- Routes: /, /hakkimizda, /teklif, /iletisim, /urunler, /kataloglar, /bayiliklerimiz

DO $$
DECLARE
    home_page_id UUID;
    about_page_id UUID;
    quote_page_id UUID;
    contact_page_id UUID;
    
    hero_section_id UUID;
    trust_section_id UUID;
    cta_section_id UUID;
    mission_section_id UUID;
    vision_section_id UUID;
    form_header_section_id UUID;
BEGIN
    -- 1. SITE PAGES
    INSERT INTO public.site_pages (route, internal_name, status)
    VALUES 
        ('/', 'Ana Sayfa', 'published'),
        ('/hakkimizda', 'Hakkımızda', 'published'),
        ('/teklif', 'Teklif Talep', 'published'),
        ('/iletisim', 'İletişim', 'published'),
        ('/urunler', 'Ürün Kategorileri', 'published'),
        ('/kataloglar', 'Kataloglarımız', 'published'),
        ('/bayiliklerimiz', 'Bayiliklerimiz', 'published')
    ON CONFLICT (route) DO UPDATE SET internal_name = EXCLUDED.internal_name, status = EXCLUDED.status;

    SELECT id INTO home_page_id FROM public.site_pages WHERE route = '/';
    SELECT id INTO about_page_id FROM public.site_pages WHERE route = '/hakkimizda';
    SELECT id INTO quote_page_id FROM public.site_pages WHERE route = '/teklif';
    SELECT id INTO contact_page_id FROM public.site_pages WHERE route = '/iletisim';

    -- 2. HOME PAGE SECTIONS
    INSERT INTO public.page_sections (page_id, section_key, section_type, internal_label, display_order)
    VALUES 
        (home_page_id, 'hero', 'hero', 'Ana Kahraman (Hero)', 0),
        (home_page_id, 'trust_stats', 'stats', 'Güven İstatistikleri', 1),
        (home_page_id, 'cta_banner', 'cta', 'Eylem Çağrısı (CTA)', 5)
    ON CONFLICT (page_id, section_key) DO UPDATE SET internal_label = EXCLUDED.internal_label;

    SELECT id INTO hero_section_id FROM public.page_sections WHERE page_id = home_page_id AND section_key = 'hero';
    
    -- Home Hero Content
    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text, link_url)
    VALUES 
        (hero_section_id, 'title', 'text', 'Başlık', 'İşinize güç katan\nprofesyonel hırdavat çözümleri.', NULL),
        (hero_section_id, 'description', 'textarea', 'Açıklama', 'Elektrikli el aletlerinden bağlantı elemanlarına, iş güvenliğinden endüstriyel makinelere; sanayi tesisleri ve şantiyeler için yetkili distribütör güvencesiyle tek noktadan tedarik.', NULL),
        (hero_section_id, 'primary_cta_text', 'text', 'Birincil Buton Yazısı', 'Ürün Gruplarını İncele', NULL),
        (hero_section_id, 'primary_cta_url', 'link', 'Birincil Buton Linki', NULL, '/urunler'),
        (hero_section_id, 'secondary_cta_text', 'text', 'İkincil Buton Yazısı', 'Teklif Talep Et', NULL),
        (hero_section_id, 'secondary_cta_url', 'link', 'İkincil Buton Linki', NULL, '/teklif')
    ON CONFLICT (section_id, field_key) DO UPDATE SET value_text = EXCLUDED.value_text, link_url = EXCLUDED.link_url;

    -- 3. ABOUT PAGE SECTIONS
    INSERT INTO public.page_sections (page_id, section_key, section_type, internal_label, display_order)
    VALUES 
        (about_page_id, 'mission', 'content', 'Misyonumuz', 0),
        (about_page_id, 'vision', 'content', 'Vizyonumuz', 1)
    ON CONFLICT (page_id, section_key) DO UPDATE SET internal_label = EXCLUDED.internal_label;

    SELECT id INTO mission_section_id FROM public.page_sections WHERE page_id = about_page_id AND section_key = 'mission';
    SELECT id INTO vision_section_id FROM public.page_sections WHERE page_id = about_page_id AND section_key = 'vision';

    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text)
    VALUES 
        (mission_section_id, 'title', 'text', 'Başlık', 'Misyonumuz'),
        (mission_section_id, 'content', 'textarea', 'İçerik', 'Üretim ve şantiyelerin ihtiyacı olan her kalem endüstriyel donanımı zamanında, doğru ürünle ve rekabetçi maliyetle tedarik etmek; sahada ekipman verimliliğini teknik destekle sürekli iyileştirmek.'),
        (vision_section_id, 'title', 'text', 'Başlık', 'Vizyonumuz'),
        (vision_section_id, 'content', 'textarea', 'İçerik', 'Türkiye’de endüstriyel donanım tedarikinin dijital ve saha destekli standardını belirleyen; müşterileri için en güvenilir tek adres olarak tanınan çözüm ortağı olmak.')
    ON CONFLICT (section_id, field_key) DO UPDATE SET value_text = EXCLUDED.value_text;

    -- 4. QUOTE PAGE SECTIONS
    INSERT INTO public.page_sections (page_id, section_key, section_type, internal_label, display_order)
    VALUES 
        (quote_page_id, 'form_header', 'header', 'Form Başlığı ve Bilgi', 0)
    ON CONFLICT (page_id, section_key) DO UPDATE SET internal_label = EXCLUDED.internal_label;

    SELECT id INTO form_header_section_id FROM public.page_sections WHERE page_id = quote_page_id AND section_key = 'form_header';

    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text)
    VALUES 
        (form_header_section_id, 'title', 'text', 'Başlık', 'İhtiyacınıza Özel Teklif Alın'),
        (form_header_section_id, 'description', 'textarea', 'Açıklama', 'İhtiyacınız olan ürün grubunu ve iletişim bilgilerinizi paylaşın. Uzman ekibimiz talebinizi inceleyerek sizinle en kısa sürede iletişime geçsin.')
    ON CONFLICT (section_id, field_key) DO UPDATE SET value_text = EXCLUDED.value_text;

END $$;
