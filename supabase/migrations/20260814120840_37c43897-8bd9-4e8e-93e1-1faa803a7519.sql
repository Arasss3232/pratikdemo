-- 1. Create site_content table if it doesn't exist (resetting for restoration)
DROP TABLE IF EXISTS public.site_content;

CREATE TABLE public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_section TEXT NOT NULL,
    field_key TEXT NOT NULL,
    content_value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(page_section, field_key)
);

-- 2. Grant Access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT SELECT ON public.site_content TO anon;
GRANT ALL ON public.site_content TO service_role;

-- 3. Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
CREATE POLICY "Enable read access for all" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Enable all access for authenticated users" ON public.site_content FOR ALL TO authenticated USING (true);

-- 5. Seed Initial Data (Comprehensive Mapping)

-- Üst Bilgi Çubuğu (top_bar)
INSERT INTO public.site_content (page_section, field_key, content_value) VALUES
('top_bar', 'working_hours', 'Pzt - Cmt: 08:30 - 18:30'),
('top_bar', 'address', 'İkitelli OSB, İstanbul'),
('top_bar', 'phone', '+90 (212) 123 45 67'),
('top_bar', 'whatsapp_number', '+905000000000'),
('top_bar', 'whatsapp_link', 'https://wa.me/905000000000'),
('top_bar', 'cta_text', 'Teklif Talep Et');

-- Header (header)
INSERT INTO public.site_content (page_section, field_key, content_value) VALUES
('header', 'logo_url', ''),
('header', 'nav_home', 'Ana Sayfa'),
('header', 'nav_corporate', 'Kurumsal'),
('header', 'nav_products', 'Ürünler'),
('header', 'nav_catalogs', 'Kataloglarımız'),
('header', 'nav_dealerships', 'Bayiliklerimiz'),
('header', 'nav_contact', 'İletişim'),
('header', 'cta_button_text', 'Teklif Talep Et');

-- Footer (footer)
INSERT INTO public.site_content (page_section, field_key, content_value) VALUES
('footer', 'company_description', 'Sanayi, inşaat ve teknik servis ekiplerine profesyonel donanım tedariki. Doğru ürün, kurumsal süreç ve satış sonrası iletişim.'),
('footer', 'email', 'bilgi@pratiktedarik.com'),
('footer', 'facebook_url', 'https://facebook.com/pratiktedarik'),
('footer', 'instagram_url', 'https://instagram.com/pratiktedarik'),
('footer', 'linkedin_url', 'https://linkedin.com/company/pratiktedarik'),
('footer', 'copyright_text', '© 2026 Pratik Endüstriyel. Tüm hakları saklıdır.');

-- Ana Sayfa (hero)
INSERT INTO public.site_content (page_section, field_key, content_value) VALUES
('hero', 'main_title', 'İşinize güç katan\nprofesyonel hırdavat çözümleri.'),
('hero', 'about_text', 'Elektrikli el aletlerinden bağlantı elemanlarına, iş güvenliğinden endüstriyel makinelere; sanayi tesisleri ve şantiyeler için yetkili distribütör güvencesiyle tek noktadan tedarik.'),
('hero', 'primary_cta_text', 'Ürün Gruplarını İncele'),
('hero', 'secondary_cta_text', 'Teklif Talep Et'),
('hero', 'stat_1_label', 'Ürün Grupları'),
('hero', 'stat_1_value', '6 ana kategori'),
('hero', 'stat_2_label', 'Kurumsal Tedarik'),
('hero', 'stat_2_value', 'Sözleşmeli müşteri'),
('hero', 'cta_banner_text', 'Kurumsal tedarik ortağınız olarak sahadaki gücünüz olmaya adayız.');

-- Kurumsal (corporate)
INSERT INTO public.site_content (page_section, field_key, content_value) VALUES
('corporate', 'about_title', 'Pratik Tedarik Yapı: Sahayı Bilen Çözüm Ortağınız'),
('corporate', 'about_content', '20 yılı aşkın tecrübemizle endüstriyel donanım alanında uzmanlaştık. Sadece ürün satmıyor, projelerinizde teknik rehberlik sunuyoruz.'),
('corporate', 'mission', 'Tedarik zincirinde güven, hız ve kaliteyi esas alarak sanayi üretiminin kesintisiz sürmesine katkı sağlamak.'),
('corporate', 'vision', 'Bölgesel liderlikten küresel bir endüstriyel çözüm merkezine dönüşmek.');

-- İletisim (contact)
INSERT INTO public.site_content (page_section, field_key, content_value) VALUES
('contact', 'page_title', 'Bize Ulaşın'),
('contact', 'form_title', 'İletişim Formu'),
('contact', 'map_embed_url', 'https://www.google.com/maps/embed?pb=...'),
('contact', 'contact_subtitle', 'Satış, teknik destek ve kurumsal talepleriniz için ekibimize ulaşın.');
