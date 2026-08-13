-- SEO Settings Table (Enhancing site_settings or separate)
-- We'll use site_settings for global stuff, but let's ensure all fields requested are there.
-- Also create seo_redirects and page_seo.

CREATE TABLE IF NOT EXISTS public.seo_redirects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_path text NOT NULL UNIQUE,
    target_path text NOT NULL,
    status_code integer DEFAULT 301,
    is_active boolean DEFAULT true,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.page_seo (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    route_path text NOT NULL UNIQUE,
    title text,
    description text,
    canonical_url text,
    og_title text,
    og_description text,
    og_image text,
    no_index boolean DEFAULT false,
    no_follow boolean DEFAULT false,
    sitemap_include boolean DEFAULT true,
    sitemap_priority numeric(2,1) DEFAULT 0.5,
    sitemap_changefreq text DEFAULT 'monthly',
    schema_type text DEFAULT 'WebPage',
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.seo_audit_results (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    check_type text NOT NULL,
    status text NOT NULL, -- 'success', 'warning', 'error'
    message text NOT NULL,
    affected_route text,
    suggestion text,
    created_at timestamptz DEFAULT now()
);

-- Ensure site_settings has all SEO fields
-- site_settings is a single row table where id=true
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='site_url') THEN
        ALTER TABLE public.site_settings ADD COLUMN site_url text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='title_suffix') THEN
        ALTER TABLE public.site_settings ADD COLUMN title_suffix text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='og_image_default') THEN
        ALTER TABLE public.site_settings ADD COLUMN og_image_default text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='twitter_image_default') THEN
        ALTER TABLE public.site_settings ADD COLUMN twitter_image_default text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='google_tag_manager_id') THEN
        ALTER TABLE public.site_settings ADD COLUMN google_tag_manager_id text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='search_console_method') THEN
        ALTER TABLE public.site_settings ADD COLUMN search_console_method text DEFAULT 'meta';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='is_indexing_enabled') THEN
        ALTER TABLE public.site_settings ADD COLUMN is_indexing_enabled boolean DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='gtm_active') THEN
        ALTER TABLE public.site_settings ADD COLUMN gtm_active boolean DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='ga4_active') THEN
        ALTER TABLE public.site_settings ADD COLUMN ga4_active boolean DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='schema_active') THEN
        ALTER TABLE public.site_settings ADD COLUMN schema_active boolean DEFAULT true;
    END IF;
END $$;

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_redirects TO authenticated;
GRANT ALL ON public.seo_redirects TO service_role;
GRANT SELECT ON public.seo_redirects TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_seo TO authenticated;
GRANT ALL ON public.page_seo TO service_role;
GRANT SELECT ON public.page_seo TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_audit_results TO authenticated;
GRANT ALL ON public.seo_audit_results TO service_role;

GRANT SELECT ON public.site_settings TO anon;

-- RLS
ALTER TABLE public.seo_redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_audit_results ENABLE ROW LEVEL SECURITY;

-- If has_role doesn't exist, we might need to handle that, but based on context it should.
-- Re-applying grant just in case for site_settings
GRANT SELECT ON public.site_settings TO authenticated;

-- Policies (assuming public.has_role is available as per security rules)
CREATE POLICY "Admins can manage redirects" ON public.seo_redirects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can read active redirects" ON public.seo_redirects FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Admins can manage page seo" ON public.page_seo FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can read page seo" ON public.page_seo FOR SELECT TO anon USING (true);

CREATE POLICY "Admins can manage audit results" ON public.seo_audit_results FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
