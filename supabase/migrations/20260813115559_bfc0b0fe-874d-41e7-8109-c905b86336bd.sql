-- Add agency attribution fields to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS agency_attribution_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS agency_attribution_text TEXT DEFAULT 'Bilgintek Yazılım & Reklam Ajansı | Website Paketleri ile hazırlanmıştır.',
ADD COLUMN IF NOT EXISTS agency_attribution_url TEXT DEFAULT 'https://www.bilgintek.com';

-- Update the existing row with initial values
UPDATE public.site_settings 
SET 
  agency_attribution_visible = true,
  agency_attribution_text = 'Bilgintek Yazılım & Reklam Ajansı | Website Paketleri ile hazırlanmıştır.',
  agency_attribution_url = 'https://www.bilgintek.com'
WHERE id = true;
