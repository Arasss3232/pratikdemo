-- Create catalogs table
CREATE TABLE IF NOT EXISTS public.catalogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    year TEXT,
    pages TEXT,
    file_size TEXT,
    cover_image_url TEXT,
    pdf_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for catalogs
ALTER TABLE public.catalogs ENABLE ROW LEVEL SECURITY;

-- Grants for catalogs
GRANT SELECT ON public.catalogs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalogs TO authenticated;
GRANT ALL ON public.catalogs TO service_role;

-- Policies for catalogs
CREATE POLICY "Public read for active catalogs" ON public.catalogs
    FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Admins can manage catalogs" ON public.catalogs
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create media_library table
CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL DEFAULT 'image',
    file_size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for media_library
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Grants for media_library
GRANT SELECT ON public.media_library TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_library TO authenticated;
GRANT ALL ON public.media_library TO service_role;

-- Policies for media_library
CREATE POLICY "Public read for active media" ON public.media_library
    FOR SELECT TO anon USING (true);

CREATE POLICY "Admins can manage media" ON public.media_library
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed catalogs
INSERT INTO public.catalogs (title, year, pages, file_size, cover_image_url, pdf_url, display_order)
VALUES 
('Genel Ürün Kataloğu 2024', '2024', '240 Sayfa', '42 MB', 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?auto=format&fit=crop&w=600&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 1),
('Elektrikli El Aletleri Özel Seçki', '2024', '86 Sayfa', '18 MB', 'https://images.unsplash.com/photo-1581147036324-c47a03a81d48?auto=format&fit=crop&w=600&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 2),
('İş Güvenliği ve KKD Ekipmanları', '2023', '112 Sayfa', '24 MB', 'https://images.unsplash.com/photo-1618568949779-05df34c1b02e?auto=format&fit=crop&w=600&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 3),
('Bağlantı Elemanları Teknik Tablo', '2024', '48 Sayfa', '12 MB', 'https://images.unsplash.com/photo-1609205807107-e8ec2120f9de?auto=format&fit=crop&w=600&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 4),
('Endüstriyel Makineler Rehberi', '2024', '64 Sayfa', '15 MB', 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 5),
('El Aletleri Fiyat Listesi', '2024', '32 Sayfa', '8 MB', 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 6),
('Sarf Malzemeleri Kataloğu', '2024', '120 Sayfa', '28 MB', 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 7)
ON CONFLICT DO NOTHING;
