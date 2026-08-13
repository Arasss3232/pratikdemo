-- 1. Create Page & Section Types
DO $$ BEGIN
    CREATE TYPE public.content_status AS ENUM ('draft', 'review', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.section_background AS ENUM ('navy-950', 'navy-900', 'navy-800', 'light', 'yellow');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Page Table
CREATE TABLE IF NOT EXISTS public.site_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route TEXT UNIQUE NOT NULL, 
    internal_name TEXT NOT NULL,
    status public.content_status DEFAULT 'draft' NOT NULL,
    is_indexable BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Sections Table
CREATE TABLE IF NOT EXISTS public.page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.site_pages(id) ON DELETE CASCADE NOT NULL,
    section_key TEXT NOT NULL, 
    section_type TEXT NOT NULL, 
    internal_label TEXT NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    desktop_visibility BOOLEAN DEFAULT true NOT NULL,
    mobile_visibility BOOLEAN DEFAULT true NOT NULL,
    background_variant public.section_background DEFAULT 'navy-900',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(page_id, section_key)
);

-- 4. Content Fields Table
CREATE TABLE IF NOT EXISTS public.section_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES public.page_sections(id) ON DELETE CASCADE NOT NULL,
    field_key TEXT NOT NULL, 
    field_type TEXT NOT NULL, 
    label TEXT NOT NULL,
    value_text TEXT,
    value_json JSONB,
    media_url TEXT,
    link_url TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(section_id, field_key)
);

-- 5. Revisions Table
CREATE TABLE IF NOT EXISTS public.content_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.site_pages(id) ON DELETE CASCADE NOT NULL,
    revision_no INTEGER NOT NULL,
    full_snapshot JSONB NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    notes TEXT
);

-- 6. Navigation Table
CREATE TABLE IF NOT EXISTS public.navigation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    route TEXT NOT NULL,
    parent_id UUID REFERENCES public.navigation_items(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_external BOOLEAN DEFAULT false NOT NULL,
    desktop_visibility BOOLEAN DEFAULT true NOT NULL,
    mobile_visibility BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. RLS & Grants
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.section_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

-- Grants (Using a DO block to avoid errors if grants already exist)
DO $$ BEGIN
    GRANT SELECT ON public.site_pages TO anon, authenticated;
    GRANT SELECT ON public.page_sections TO anon, authenticated;
    GRANT SELECT ON public.section_content TO anon, authenticated;
    GRANT SELECT ON public.navigation_items TO anon, authenticated;

    GRANT ALL ON public.site_pages TO authenticated;
    GRANT ALL ON public.page_sections TO authenticated;
    GRANT ALL ON public.section_content TO authenticated;
    GRANT ALL ON public.content_revisions TO authenticated;
    GRANT ALL ON public.navigation_items TO authenticated;

    GRANT ALL ON public.site_pages TO service_role;
    GRANT ALL ON public.page_sections TO service_role;
    GRANT ALL ON public.section_content TO service_role;
    GRANT ALL ON public.content_revisions TO service_role;
    GRANT ALL ON public.navigation_items TO service_role;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Policies
DO $$ BEGIN
    CREATE POLICY "Anyone can read published pages" ON public.site_pages FOR SELECT USING (status = 'published' OR (auth.role() = 'authenticated'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Anyone can read active sections" ON public.page_sections FOR SELECT USING (is_active = true OR (auth.role() = 'authenticated'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Anyone can read active content" ON public.section_content FOR SELECT USING (is_active = true OR (auth.role() = 'authenticated'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE POLICY "Anyone can read active nav" ON public.navigation_items FOR SELECT USING (is_active = true OR (auth.role() = 'authenticated'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 8. Seed Initial Data
INSERT INTO public.site_pages (route, internal_name, status) 
VALUES 
('/', 'Ana Sayfa', 'published'),
('/kurumsal', 'Kurumsal', 'published'),
('/urunler', 'Ürün Kategorileri', 'published'),
('/kataloglar', 'Kataloglarımız', 'published'),
('/bayiliklerimiz', 'Bayiliklerimiz', 'published'),
('/teklif', 'Teklif Talep', 'published'),
('/iletisim', 'İletişim', 'published'),
('/kvkk', 'KVKK', 'published')
ON CONFLICT (route) DO NOTHING;
