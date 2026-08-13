CREATE TABLE public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

GRANT SELECT ON public.product_categories TO anon, authenticated;
GRANT ALL ON public.product_categories TO service_role;

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active categories" ON public.product_categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can view all categories" ON public.product_categories
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage categories" ON public.product_categories
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed categories with auto-generated UUIDs
INSERT INTO public.product_categories (slug, title, is_active, display_order, icon) VALUES
('elektrikli-el-aletleri', 'Elektrikli El Aletleri', true, 1, 'hardware'),
('el-aletleri', 'El Aletleri', true, 2, 'build'),
('baglanti-elemanlari', 'Bağlantı Elemanları', true, 3, 'settings'),
('kkd', 'Kişisel Koruyucu Donanım', true, 4, 'shield'),
('endustriyel-makineler', 'Endüstriyel Makineler', true, 5, 'precision_manufacturing'),
('sarf-malzemeleri', 'Sarf Malzemeleri', true, 6, 'inventory_2'),
('pasif-kategori', 'Pasif Kategori', false, 7, 'block');