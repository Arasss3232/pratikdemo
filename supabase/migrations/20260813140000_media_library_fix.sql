-- Create media_library if not exists
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

-- Enable RLS
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT ON public.media_library TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_library TO authenticated;
GRANT ALL ON public.media_library TO service_role;

-- Policies
CREATE POLICY "Public read for active media" ON public.media_library
    FOR SELECT TO anon USING (true);

CREATE POLICY "Admins can manage media" ON public.media_library
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS \$\$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.media_library;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.media_library
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
