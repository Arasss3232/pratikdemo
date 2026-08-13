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

-- Seed categories with corrected UUID syntax
INSERT INTO public.product_categories (id, slug, title, is_active, display_order, icon) VALUES
('e1a2b3c4-d5e6-4f7d-8a9b-000000000001'::uuid, 'elektrikli-el-aletleri', 'Elektrikli El Aletleri', true, 1, 'hardware'),
('a1b2c3d4-e5f6-4a7b-8c9d-000000000002'::uuid, 'el-aletleri', 'El Aletleri', true, 2, 'build'),
('b1c2d3e4-f5g6-4a7b-8c9d-000000000003'::uuid, 'baglanti-elemanlari', 'Bağlantı Elemanları', true, 3, 'settings'),
('c1d2e3f4-g5h6-4a7b-8c9d-000000000004'::uuid, 'kkd', 'Kişisel Koruyucu Donanım', true, 4, 'shield'),
('d1e2f3g4-h5i6-4a7b-8c9d-000000000005'::uuid, 'endustriyel-makineler', 'Endüstriyel Makineler', true, 5, 'precision_manufacturing'),
('f1g2h3i4-j5k6-4a7b-8c9d-000000000006'::uuid, 'sarf-malzemeleri', 'Sarf Malzemeleri', true, 6, 'inventory_2'),
('deadbeef-dead-4eef-aded-beefdeadbeef'::uuid, 'pasif-kategori', 'Pasif Kategori', false, 7, 'block');
