import { useEffect, useState } from "react";
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
};

let cache: SiteSettings | null = null;
let inflight: Promise<SiteSettings> | null = null;

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const { data } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
    cache = (data as unknown as SiteSettings) ?? {};
    inflight = null;
    return cache;
  })();
  return inflight;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cache);
  useEffect(() => {
    if (!cache) fetchSiteSettings().then(setSettings);
  }, []);
  return settings ?? {};
}