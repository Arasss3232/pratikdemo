-- Ensure Kurumsal page exists
INSERT INTO public.site_pages (route, internal_name, status)
VALUES ('/kurumsal', 'Kurumsal Sayfası', 'published')
ON CONFLICT (route) DO UPDATE SET internal_name = EXCLUDED.internal_name;

-- 1. HERO SECTION
DO $$
DECLARE
    v_page_id uuid;
    v_section_id uuid;
BEGIN
    SELECT id INTO v_page_id FROM public.site_pages WHERE route = '/kurumsal';

    INSERT INTO public.page_sections (page_id, section_key, section_type, internal_label, display_order, is_active)
    VALUES (v_page_id, 'hero', 'hero', 'Sayfa Üst Alanı (Hero)', 0, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET internal_label = EXCLUDED.internal_label, is_active = true
    RETURNING id INTO v_section_id;

    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text, display_order)
    VALUES 
        (v_section_id, 'eyebrow', 'text', 'Üst Başlık', 'HAKKIMIZDA', 0),
        (v_section_id, 'title', 'text', 'Ana Başlık', 'Kurumsal', 1),
        (v_section_id, 'description', 'text', 'Açıklama', 'Endüstriyel tedarikte güvenilir çözüm ortağınız olarak hikâyemizi ve değerlerimizi keşfedin.', 2)
    ON CONFLICT (section_id, field_key) DO UPDATE SET value_text = EXCLUDED.value_text;
END $$;

-- 2. INTRODUCTION SECTION
DO $$
DECLARE
    v_page_id uuid;
    v_section_id uuid;
BEGIN
    SELECT id INTO v_page_id FROM public.site_pages WHERE route = '/kurumsal';

    INSERT INTO public.page_sections (page_id, section_key, section_type, internal_label, display_order, is_active)
    VALUES (v_page_id, 'introduction', 'text_image', 'Şirket Tanıtımı', 1, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET internal_label = EXCLUDED.internal_label, is_active = true
    RETURNING id INTO v_section_id;

    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text, display_order)
    VALUES 
        (v_section_id, 'eyebrow', 'text', 'Üst Başlık', 'PRATİK TEDARİK YAPI', 0),
        (v_section_id, 'title', 'text', 'Ana Başlık', 'Endüstriyel Tedarikte Güvenilir Çözüm Ortağınız', 1),
        (v_section_id, 'description', 'text', 'Açıklama', 'Pratik Tedarik Yapı olarak işletmelerin ihtiyaç duyduğu ürün gruplarını güvenilir tedarik ağı, hızlı teklif süreci ve çözüm odaklı yaklaşımımızla buluşturuyoruz.', 2),
        (v_section_id, 'content', 'text', 'İçerik Metni', 'Kurumsal tedarik ihtiyaçlarını anlayan, sadece ürün satan değil, çözüm üreten bir yapı ile sanayinin yanındayız. Projeleriniz, tesisleriniz ve atölyeleriniz için en doğru ürün gruplarını, global markaların güvencesiyle sunuyoruz.', 3),
        (v_section_id, 'image', 'image', 'Görsel', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80', 4)
    ON CONFLICT (section_id, field_key) DO UPDATE SET value_text = EXCLUDED.value_text;
END $$;

-- 3. MISSION & VISION SECTION
DO $$
DECLARE
    v_page_id uuid;
    v_section_id uuid;
BEGIN
    SELECT id INTO v_page_id FROM public.site_pages WHERE route = '/kurumsal';

    INSERT INTO public.page_sections (page_id, section_key, section_type, internal_label, display_order, is_active)
    VALUES (v_page_id, 'mission_vision', 'cards', 'Misyon & Vizyon', 2, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET internal_label = EXCLUDED.internal_label, is_active = true
    RETURNING id INTO v_section_id;

    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text, display_order)
    VALUES 
        (v_section_id, 'mission_title', 'text', 'Misyon Başlığı', 'Misyonumuz', 0),
        (v_section_id, 'mission_desc', 'text', 'Misyon Açıklaması', 'Güvenilir, hızlı ve ihtiyaca odaklı teklif ve tedarik çözümleriyle sanayinin verimliliğine katkıda bulunmak.', 1),
        (v_section_id, 'vision_title', 'text', 'Vizyon Başlığı', 'Vizyonumuz', 2),
        (v_section_id, 'vision_desc', 'text', 'Vizyon Açıklaması', 'Endüstriyel tedarik süreçlerinde Türkiye''nin en güvenilen ve tercih edilen kurumsal çözüm ortağı olmak.', 3)
    ON CONFLICT (section_id, field_key) DO UPDATE SET value_text = EXCLUDED.value_text;
END $$;

-- 4. VALUES SECTION
DO $$
DECLARE
    v_page_id uuid;
    v_section_id uuid;
BEGIN
    SELECT id INTO v_page_id FROM public.site_pages WHERE route = '/kurumsal';

    INSERT INTO public.page_sections (page_id, section_key, section_type, internal_label, display_order, is_active)
    VALUES (v_page_id, 'values', 'cards', 'Değerlerimiz', 3, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET internal_label = EXCLUDED.internal_label, is_active = true
    RETURNING id INTO v_section_id;

    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text, display_order)
    VALUES 
        (v_section_id, 'title', 'text', 'Bölüm Başlığı', 'Değerlerimiz', 0),
        (v_section_id, 'value_1_title', 'text', 'Değer 1 Başlık', 'Güvenilirlik', 1),
        (v_section_id, 'value_1_desc', 'text', 'Değer 1 Açıklama', 'Tüm süreçlerimizde dürüstlük ve şeffaflığı esas alarak iş ortaklarımıza güven veriyoruz.', 2),
        (v_section_id, 'value_2_title', 'text', 'Değer 2 Başlık', 'Çözüm Odaklılık', 3),
        (v_section_id, 'value_2_desc', 'text', 'Değer 2 Açıklama', 'Sadece ürün temin etmiyor, teknik ihtiyaçlarınıza yönelik en doğru çözümleri üretiyoruz.', 4),
        (v_section_id, 'value_3_title', 'text', 'Değer 3 Başlık', 'Hızlı Geri Dönüş', 5),
        (v_section_id, 'value_3_desc', 'text', 'Değer 3 Açıklama', 'Zamanın değerini biliyor, teklif ve tedarik taleplerinizi en kısa sürede yanıtlıyoruz.', 6),
        (v_section_id, 'value_4_title', 'text', 'Değer 4 Başlık', 'Sürdürülebilir İş Birliği', 7),
        (v_section_id, 'value_4_desc', 'text', 'Değer 4 Açıklama', 'Uzun soluklu güvene dayalı ilişkiler kurarak sürekli gelişim ve destek sağlıyoruz.', 8)
    ON CONFLICT (section_id, field_key) DO UPDATE SET value_text = EXCLUDED.value_text;
END $$;

-- 5. PROCESS SECTION
DO $$
DECLARE
    v_page_id uuid;
    v_section_id uuid;
BEGIN
    SELECT id INTO v_page_id FROM public.site_pages WHERE route = '/kurumsal';

    INSERT INTO public.page_sections (page_id, section_key, section_type, internal_label, display_order, is_active)
    VALUES (v_page_id, 'process', 'steps', 'Nasıl Çalışıyoruz?', 4, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET internal_label = EXCLUDED.internal_label, is_active = true
    RETURNING id INTO v_section_id;

    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text, display_order)
    VALUES 
        (v_section_id, 'title', 'text', 'Bölüm Başlığı', 'Nasıl Çalışıyoruz?', 0),
        (v_section_id, 'step_1_title', 'text', 'Adım 1 Başlık', 'İhtiyacınızı Belirleyin', 1),
        (v_section_id, 'step_1_desc', 'text', 'Adım 1 Açıklama', 'İşletmenizin veya projenizin ihtiyaç duyduğu teknik donanım ve ekipmanları listeyin.', 2),
        (v_section_id, 'step_2_title', 'text', 'Adım 2 Başlık', 'Ürün Grubunu Seçin', 3),
        (v_section_id, 'step_2_desc', 'text', 'Adım 2 Açıklama', 'Kategorilerimiz arasından size uygun olanları belirleyerek talebinizi oluşturun.', 4),
        (v_section_id, 'step_3_title', 'text', 'Adım 3 Başlık', 'Teklif Talebini İletin', 5),
        (v_section_id, 'step_3_desc', 'text', 'Adım 3 Açıklama', 'Teklif formumuz aracılığıyla veya doğrudan bizimle iletişime geçerek talebinizi gönderin.', 6),
        (v_section_id, 'step_4_title', 'text', 'Adım 4 Başlık', 'Size Özel Çözümü Hazırlayalım', 7),
        (v_section_id, 'step_4_desc', 'text', 'Adım 4 Açıklama', 'Uzman ekibimiz en kısa sürede stok ve fiyat çalışması yaparak teklifinizi sunsun.', 8)
    ON CONFLICT (section_id, field_key) DO UPDATE SET value_text = EXCLUDED.value_text;
END $$;

-- 6. ADVANTAGES SECTION
DO $$
DECLARE
    v_page_id uuid;
    v_section_id uuid;
BEGIN
    SELECT id INTO v_page_id FROM public.site_pages WHERE route = '/kurumsal';

    INSERT INTO public.page_sections (page_id, section_key, section_type, internal_label, display_order, is_active)
    VALUES (v_page_id, 'advantages', 'list', 'Neden Pratik Tedarik Yapı?', 5, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET internal_label = EXCLUDED.internal_label, is_active = true
    RETURNING id INTO v_section_id;

    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text, display_order)
    VALUES 
        (v_section_id, 'title', 'text', 'Bölüm Başlığı', 'Neden Pratik Tedarik Yapı?', 0),
        (v_section_id, 'item_1', 'text', 'Madde 1', 'Geniş ürün grubu yaklaşımı ve teknik uzmanlık', 1),
        (v_section_id, 'item_2', 'text', 'Madde 2', 'İhtiyaca göre özelleştirilmiş teklif hazırlama süreci', 2),
        (v_section_id, 'item_3', 'text', 'Madde 3', 'Dünya markalarından oluşan güvenilir tedarik ağı', 3),
        (v_section_id, 'item_4', 'text', 'Madde 4', 'Kurumsal iletişim ve kesintisiz profesyonel destek', 4),
        (v_section_id, 'image', 'image', 'Bölüm Görseli', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80', 5)
    ON CONFLICT (section_id, field_key) DO UPDATE SET value_text = EXCLUDED.value_text;
END $$;

-- 7. CTA SECTION
DO $$
DECLARE
    v_page_id uuid;
    v_section_id uuid;
BEGIN
    SELECT id INTO v_page_id FROM public.site_pages WHERE route = '/kurumsal';

    INSERT INTO public.page_sections (page_id, section_key, section_type, internal_label, display_order, is_active)
    VALUES (v_page_id, 'cta', 'cta', 'Alt Çağrı Alanı (CTA)', 6, true)
    ON CONFLICT (page_id, section_key) DO UPDATE SET internal_label = EXCLUDED.internal_label, is_active = true
    RETURNING id INTO v_section_id;

    INSERT INTO public.section_content (section_id, field_key, field_type, label, value_text, display_order)
    VALUES 
        (v_section_id, 'title', 'text', 'Bölüm Başlığı', 'İhtiyacınıza Uygun Ürün Grubu İçin Teklif Alın', 0),
        (v_section_id, 'description', 'text', 'Açıklama', 'Ürün kategorilerimizi inceleyin veya talebinizi doğrudan ekibimize iletin. İhtiyacınıza uygun çözüm ve teklif çalışmasını birlikte hazırlayalım.', 1),
        (v_section_id, 'primary_btn', 'text', 'Birincil Buton Metni', 'Ürün Kategorilerini İncele', 2),
        (v_section_id, 'primary_url', 'text', 'Birincil Buton URL', '/urunler', 3),
        (v_section_id, 'secondary_btn', 'text', 'İkincil Buton Metni', 'Teklif Talep Et', 4),
        (v_section_id, 'secondary_url', 'text', 'İkincil Buton URL', '/teklif', 5)
    ON CONFLICT (section_id, field_key) DO UPDATE SET value_text = EXCLUDED.value_text;
END $$;
