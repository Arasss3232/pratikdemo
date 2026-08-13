import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ContentField = {
  field_key: string;
  field_type: string;
  value_text: string | null;
  value_json: any | null;
  media_url: string | null;
  link_url: string | null;
};

export type PageSection = {
  id: string;
  section_key: string;
  section_type: string;
  background_variant: string;
  content: Record<string, ContentField>;
};

export function usePageContent(route: string) {
  const [sections, setSections] = useState<Record<string, PageSection>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const { data: page } = await supabase
          .from("site_pages")
          .select("id")
          .eq("route", route)
          .eq("status", "published")
          .limit(1)
          .maybeSingle();


        if (!page) {
          setLoading(false);
          return;
        }

        const { data: sectionsData } = await supabase
          .from("page_sections")
          .select(`
            id,
            section_key,
            section_type,
            background_variant,
            section_content (
              field_key,
              field_type,
              value_text,
              value_json,
              media_url,
              link_url
            )
          `)
          .eq("page_id", page.id)
          .eq("is_active", true)
          .order("display_order");

        if (sectionsData && sectionsData.length > 0) {

          const contentMap: Record<string, PageSection> = {};
          sectionsData.forEach((s: any) => {
            const fields: Record<string, ContentField> = {};
            s.section_content.forEach((f: any) => {
              fields[f.field_key] = f;
            });
            contentMap[s.section_key] = {
              id: s.id,
              section_key: s.section_key,
              section_type: s.section_type,
              background_variant: s.background_variant,
              content: fields
            };
          });
          setSections(contentMap);
        }
      } catch (error) {
        console.error("CMS Content Load Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [route]);

  return { sections, loading };
}
