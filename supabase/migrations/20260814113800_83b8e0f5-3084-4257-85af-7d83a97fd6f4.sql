-- Create site_content table for flexible CMS management
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_name TEXT NOT NULL,
    section_key TEXT NOT NULL,
    content_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(page_name, section_key)
);

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT SELECT ON public.site_content TO anon;
GRANT ALL ON public.site_content TO service_role;

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin full access site_content" ON public.site_content FOR ALL TO authenticated USING (true);

-- Seed initial data for Home page
INSERT INTO public.site_content (page_name, section_key, content_value)
VALUES 
('home', 'hero', '{"title": "İşinize güç katan profesyonel hırdavat çözümleri.", "subtitle": "Sanayi, inşaat ve üretim tesisleri için profesyonel donanım tedariki.", "cta_text": "Teklif Al", "cta_link": "/teklif"}'),
('home', 'trust_stats', '{"projects": "1000+", "clients": "500+", "experience": "15 Yıl"}')
ON CONFLICT (page_name, section_key) DO NOTHING;
