-- Add robots_txt to site_settings
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='robots_txt') THEN
        ALTER TABLE public.site_settings ADD COLUMN robots_txt text;
    END IF;
END $$;

-- Add ga4_id to site_settings if missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='site_settings' AND column_name='ga4_id') THEN
        ALTER TABLE public.site_settings ADD COLUMN ga4_id text;
    END IF;
END $$;
