
-- 1. Ensure the site_content table exists with proper structure
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_section TEXT NOT NULL,
    field_key TEXT NOT NULL,
    content_value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(page_section, field_key)
);

-- 2. Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
GRANT SELECT ON public.site_content TO anon;

-- 3. RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on site_content"
ON public.site_content FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow admin to manage site_content"
ON public.site_content FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Seed initial comprehensive data
INSERT INTO public.site_content (page_section, field_key, content_value)
VALUES
    -- Global / Top Bar
    ('top_bar', 'working_hours', 'Pzt - Cmt: 08:30 - 18:30'),
    ('top_bar', 'address', 'İvedik OSB, 1354. Cadde, No: 1 Ankara'),
    ('top_bar', 'phone', '0553 306 92 10'),
    ('top_bar', 'whatsapp_number', '905533069210'),
    ('top_bar', 'whatsapp_link', 'https://wa.me/905533069210'),
    
    -- Header & Nav
    ('header', 'nav_home', 'Ana Sayfa'),
    ('header', 'nav_corporate', 'Kurumsal'),
    ('header', 'nav_products', 'Ürünler'),
    ('header', 'nav_catalogs', 'Kataloglar'),
    ('header', 'nav_dealerships', 'Bayiliklerimiz'),
    ('header', 'nav_contact', 'İletişim'),
    ('header', 'cta_button_text', 'Teklif Talep Et'),
    
    -- Home Hero
    ('hero', 'main_title', 'İşinize güç katan\nprofesyonel hırdavat çözümleri.'),
    ('hero', 'about_text', 'Elektrikli el aletlerinden bağlantı elemanlarına, iş güvenliğinden endüstriyel makinelere; sanayi tesisleri ve şantiyeler için yetkili distribütör güvencesiyle tek noktadan tedarik.'),
    ('hero', 'primary_cta_text', 'Ürün Gruplarını İncele'),
    ('hero', 'secondary_cta_text', 'Teklif Talep Et'),
    ('hero', 'stat_1_label', 'Ürün Grupları'),
    ('hero', 'stat_1_value', '6 ana kategori'),
    ('hero', 'stat_2_label', 'Kurumsal Tedarik'),
    ('hero', 'stat_2_value', 'Sözleşmeli müşteri'),
    
    -- Corporate
    ('corporate', 'page_title', 'Kurumsal'),
    ('corporate', 'page_subtitle', 'Sektörde Güven ve Tecrübe'),
    ('corporate', 'about_title', 'Pratik Endüstriyel, sahayı bilen bir tedarik ortağıdır.'),
    ('corporate', 'about_content', 'Her projede aynı kişi, aynı süreç, aynı sorumluluk. Uzun soluklu tedarikçi ilişkileri kurmak için çalışıyoruz.'),
    ('corporate', 'mission', 'Endüstriyel dünyada güvenilir, hızlı ve sürdürülebilir tedarik çözümleri sunarak iş ortaklarımızın üretim verimliliğini artırmak.'),
    ('corporate', 'vision', 'Türkiye''nin en çok tercih edilen, dijitalleşmiş ve müşteri odaklı endüstriyel tedarik merkezi olmak.'),
    
    -- Products Page
    ('products', 'page_title', 'Ürün Kategorileri'),
    ('products', 'page_description', '20.000''i aşkın profesyonel endüstriyel ürünümüzü kategoriler halinde inceleyin. Aradığınız ürün grubu için uzman ekibimizden kurumsal teklif alabilirsiniz.'),
    
    -- Catalogs Page
    ('catalogs', 'page_title', 'Dijital Kataloglar'),
    ('catalogs', 'page_description', 'Profesyonel ürün gruplarımıza ait teknik kataloglarımızı online inceleyebilir veya PDF olarak indirebilirsiniz.'),
    
    -- Dealerships Page
    ('dealerships', 'page_title', 'Bayiliklerimiz'),
    ('dealerships', 'page_description', 'Yetkili bayisi olduğumuz ve birlikte çalıştığımız güçlü markaları keşfedin.'),
    
    -- Contact Page
    ('contact', 'page_title', 'Bize Ulaşın'),
    ('contact', 'contact_subtitle', 'Satış, teknik destek ve kurumsal talepleriniz için ekibimize ulaşın.'),
    ('contact', 'map_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3056.883726591741!2d32.74837597652758!3d39.98801598160473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d3493e8e7a0201%3A0xc02c3427ca71169!2s%C4%B0vedik%20Osb!5e0!3m2!1str!2str!4v1709565551234!5m2!1str!2str'),
    ('contact', 'form_title', 'İletişim Formu')
ON CONFLICT (page_section, field_key) DO UPDATE 
SET content_value = EXCLUDED.content_value;
