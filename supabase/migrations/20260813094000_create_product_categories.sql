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

-- Seed categories
INSERT INTO public.product_categories (id, slug, title, is_active, display_order, icon) VALUES
('e1a2b3c4-d5e6-4f7g-8h9i-0j1k2l3m4n5o', 'elektrikli-el-aletleri', 'Elektrikli El Aletleri', true, 1, 'hardware'),
('a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p', 'el-aletleri', 'El Aletleri', true, 2, 'build'),
('b1c2d3e4-f5g6-4h7i-8j9k-0l1m2n3o4p5q', 'baglanti-elemanlari', 'Bağlantı Elemanları', true, 3, 'settings'),
('c1d2e3f4-g5h6-4i7j-8k9l-0m1n2o3p4q5r', 'kkd', 'Kişisel Koruyucu Donanım', true, 4, 'shield'),
('d1e2f3g4-h5i6-4j7k-8l9m-0n1o2p3q4r5s', 'endustriyel-makineler', 'Endüstriyel Makineler', true, 5, 'precision_manufacturing'),
('f1g2h3i4-j5k6-4l7m-8n9o-0p1q2r3s4t5u', 'sarf-malzemeleri', 'Sarf Malzemeleri', true, 6, 'inventory_2'),
('deadbeef-dead-beef-dead-beefdeadbeef', 'pasif-kategori', 'Pasif Kategori', false, 7, 'block');

