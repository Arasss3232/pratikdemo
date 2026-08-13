import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: string;
  company_name: string | null;
  tagline: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  address: string | null;
  working_hours: string | null;
  logo_url: string | null;
  mobile_logo_url: string | null;
  favicon_url: string | null;
  site_url: string | null;
  google_tag_manager_id: string | null;
  ga4_id: string | null;
  gtm_active: boolean;
  ga4_active: boolean;
  schema_active: boolean;
  is_indexing_enabled: boolean;
  google_search_console: string | null;
  title_suffix: string | null;
  og_image_default: string | null;
  twitter_image_default: string | null;
  map_embed: string | null;
  agency_attribution_visible: boolean;
  agency_attribution_text: string | null;
  agency_attribution_url: string | null;
};

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
  return data;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchSiteSettings();
      setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  return { settings, loading };
}
