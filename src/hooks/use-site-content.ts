import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteContent = {
  id: string;
  page_name: string;
  section_key: string;
  content_value: any;
  updated_at: string;
};

/**
 * Hook to fetch site content for a specific page
 */
export function useSiteContent(pageName: string) {
  return useQuery({
    queryKey: ["site-content", pageName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("page_name", pageName);

      if (error) throw error;

      // Convert array to record for easy access: { section_key: content_value }
      const contentMap: Record<string, any> = {};
      data?.forEach((item) => {
        contentMap[item.section_key] = item.content_value;
      });

      return contentMap;
    },
  });
}

/**
 * Hook to update site content
 */
export function useUpdateSiteContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pageName,
      sectionKey,
      contentValue,
    }: {
      pageName: string;
      sectionKey: string;
      contentValue: any;
    }) => {
      const { data, error } = await supabase
        .from("site_content")
        .upsert(
          {
            page_name: pageName,
            section_key: sectionKey,
            content_value: contentValue,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "page_name,section_key" }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["site-content", data.page_name] });
    },
  });
}
