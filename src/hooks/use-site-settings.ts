import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  company_name?: string | null;
  tagline?: string | null;
  description?: string | null;
  hero_title?: string | null;
  hero_description?: string | null;
  hero_image_url?: string | null;
  hero_cta_primary_text?: string | null;
  hero_cta_primary_url?: string | null;
  hero_cta_secondary_text?: string | null;
  hero_cta_secondary_url?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  map_url?: string | null;
  map_embed?: string | null;
  working_hours?: string | null;
  social_linkedin?: string | null;
  social_instagram?: string | null;
  social_youtube?: string | null;
  social_facebook?: string | null;
  social_twitter?: string | null;
  footer_text?: string | null;
  logo_url?: string | null;
  mobile_logo_url?: string | null;
  favicon_url?: string | null;
  google_search_console?: string | null;
  google_analytics_id?: string | null;
  // SEO fields
  site_url?: string | null;
  title_suffix?: string | null;
  og_image_default?: string | null;
  twitter_image_default?: string | null;
  google_tag_manager_id?: string | null;
  search_console_method?: string | null;
  is_indexing_enabled?: boolean;
  gtm_active?: boolean;
  ga4_active?: boolean;
  ga4_id?: string | null;
  schema_active?: boolean;
};

let cache: SiteSettings | null = null;
let inflight: Promise<SiteSettings> | null = null;

export async function fetchSiteSettings(forceRefresh = false): Promise<SiteSettings> {
  if (cache && !forceRefresh) return cache;
  if (inflight && !forceRefresh) return inflight;
  
  inflight = (async () => {
    const { data } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
    const result: SiteSettings = (data as unknown as SiteSettings) ?? {};
    cache = result;
    inflight = null;
    return result;
  })();
  
  return inflight;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cache);

  const refresh = useCallback(async () => {
    const data = await fetchSiteSettings(true);
    setSettings(data);
    return data;
  }, []);

  useEffect(() => {
    if (!cache) {
      fetchSiteSettings().then(setSettings);
    }
  }, []);

  // Return the settings object with a non-enumerable refresh function
  // to avoid breaking existing destructuring if possible, but actually
  // most code uses it as `const settings = useSiteSettings()` then `settings.prop`.
  const result = settings ? { ...settings } : ({} as SiteSettings);
  
  // Attach refresh to the object
  Object.defineProperty(result, 'refresh', {
    value: refresh,
    enumerable: false,
    writable: true,
    configurable: true
  });

  return result as SiteSettings & { refresh: () => Promise<SiteSettings> };
}
