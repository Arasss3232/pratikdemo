-- Drop existing site_content if it exists
DROP TABLE IF EXISTS public.site_content;

-- Create the new site_content table with requested schema
CREATE TABLE public.site_content (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_section varchar(255) NOT NULL,
    field_key varchar(255) NOT NULL,
    content_value text NOT NULL, -- The user asked for text/jsonb, I'll use text to keep it simple as per their "field.phone || ..." example
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(page_section, field_key)
);

-- Grant access to authenticated users and service role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Allow all actions for authenticated users"
ON public.site_content
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed some initial data for Top Bar and Home Hero to ensure no empty states
INSERT INTO public.site_content (page_section, field_key, content_value) VALUES
('top_bar', 'working_hours', 'Pzt - Cmt: 08:30 - 18:30'),
('top_bar', 'address', 'İkitelli OSB, İstanbul'),
('top_bar', 'phone', '+90 (212) 123 45 67'),
('top_bar', 'whatsapp_link', 'https://wa.me/905000000000'),
('hero', 'main_title', 'İşinize güç katan\nprofesyonel hırdavat çözümleri.'),
('hero', 'about_text', 'Elektrikli el aletlerinden bağlantı elemanlarına, iş güvenliğinden endüstriyel makinelere; sanayi tesisleri ve şantiyeler için yetkili distribütör güvencesiyle tek noktadan tedarik.');
