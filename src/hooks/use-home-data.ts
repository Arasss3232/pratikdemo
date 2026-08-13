import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchSiteSettings, type SiteSettings } from "./use-site-settings";

export type HomeService = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  icon: string | null;
  cover_url: string | null;
};

export type HomeBrand = {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
};

export type HomeReference = {
  id: string;
  slug: string;
  title: string;
  client_name: string | null;
  category: string | null;
  cover_url: string | null;
};

export type HomeBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_url: string | null;
  published_at: string | null;
};

export function useHomeSettings() {
  return useQuery<SiteSettings>({
    queryKey: ["site_settings"],
    queryFn: fetchSiteSettings,
    staleTime: 60_000,
  });
}


export function useHomeBrands() {
  return useQuery<HomeBrand[]>({
    queryKey: ["home", "brands"],
    queryFn: async () => {
      const { data } = await supabase
        .from("brands")
        .select("id, name, logo_url, website_url")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .limit(12);
      return (data ?? []) as HomeBrand[];
    },
    staleTime: 60_000,
  });
}

export function useHomeReferences() {
  return useQuery<HomeReference[]>({
    queryKey: ["home", "references"],
    queryFn: async () => {
      const { data } = await supabase
        .from("project_references")
        .select("id, slug, title, client_name, category, cover_url")
        .eq("published", true)
        .order("display_order", { ascending: true })
        .limit(3);
      return (data ?? []) as HomeReference[];
    },
    staleTime: 60_000,
  });
}
