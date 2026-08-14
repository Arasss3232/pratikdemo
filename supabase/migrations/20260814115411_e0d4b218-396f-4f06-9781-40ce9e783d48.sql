-- Drop the legacy site_content table and recreate with the requested robust schema
DROP TABLE IF EXISTS public.site_content;

CREATE TABLE public.site_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_section varchar(255) NOT NULL, -- e.g., 'top_bar', 'header', 'hero', 'footer', 'corporate'
    field_key varchar(255) NOT NULL,    -- e.g., 'phone_number', 'main_title'
    content_value text NOT NULL,        -- Value of the field
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(page_section, field_key)
);

-- Access control
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage site content"
ON public.site_content
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed initial data for all configured sections
INSERT INTO public.site_content (page_section, field_key, content_value) VALUES
-- Top Bar
('top_bar', 'working_hours', 'Pzt - Cmt: 08:30 - 18:30'),
('top_bar', 'address', 'İkitelli OSB, İstanbul'),
('top_bar', 'phone', '+90 (212) 123 45 67'),
('top_bar', 'whatsapp_link', 'https://wa.me/905000000000'),

-- Hero (Home)
('hero', 'main_title', 'İşinize güç katan\nprofesyonel hırdavat çözümleri.'),
('hero', 'about_text', 'Elektrikli el aletlerinden bağlantı elemanlarına, iş güvenliğinden endüstriyel makinelere; sanayi tesisleri ve şantiyeler için yetkili distribütör güvencesiyle tek noktadan tedarik.'),

-- Footer
('footer', 'copyright', '© 2026 Pratik Endüstriyel. Tüm hakları saklıdır.'),
('footer', 'summary', 'Sanayi, inşaat ve teknik servis ekiplerine profesyonel donanım tedariki.'),

-- Corporate
('corporate', 'hero_title', 'Kurumsal'),
('corporate', 'intro_title', 'Endüstriyel Çözüm Ortağınız'),

-- Products
('products', 'hero_title', 'Ürün Gruplarımız'),

-- Contact
('contact', 'hero_title', 'Bize Ulaşın');
