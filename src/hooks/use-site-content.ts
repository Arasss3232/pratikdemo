import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

/**
 * Enterprise-grade hook to manage site content for a specific section.
 * Handles fetching, draft state, undo, and publishing.
 */
export function useContentManager(pageSection: string) {
  const queryClient = useQueryClient();
  
  // 1. Fetch data from Supabase site_content table
  const { data: originalData, isLoading, error } = useQuery({
    queryKey: ["site-content", pageSection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("page_section", pageSection);

      if (error) throw error;

      // Map the flat array from DB to a handy Record: { field_key: content_value }
      const contentMap: Record<string, string> = {};
      data?.forEach((item) => {
        contentMap[item.field_key] = item.content_value;
      });

      return contentMap;
    },
  });

  // 2. Draft state management
  const [draftData, setDraftData] = useState<Record<string, string>>({});
  
  // Initialize/Sync draftData when originalData is loaded
  useEffect(() => {
    if (originalData) {
      setDraftData(JSON.parse(JSON.stringify(originalData)));
    }
  }, [originalData]);

  // 3. Logic to update specific fields in draft
  const updateDraft = (fieldKey: string, value: string) => {
    setDraftData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  // 4. Undo logic: Reset draft to original
  const undoChanges = () => {
    if (originalData) {
      setDraftData(JSON.parse(JSON.stringify(originalData)));
      toast.info("Değişiklikler geri alındı.");
    }
  };

  // 5. Check if there are unsaved changes
  const hasChanges = JSON.stringify(originalData) !== JSON.stringify(draftData);

  // 6. Mutation logic to publish to Supabase
  const publishMutation = useMutation({
    mutationFn: async () => {
      // UPSERT all fields in draftData
      const upsertPromises = Object.entries(draftData).map(([key, val]) => {
        return supabase
          .from("site_content")
          .upsert(
            {
              page_section: pageSection,
              field_key: key,
              content_value: val,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "page_section,field_key" }
          );
      });

      const results = await Promise.all(upsertPromises);
      const errors = results.filter((r) => r.error);
      
      if (errors.length > 0) {
        throw new Error("Bazı alanlar güncellenemedi.");
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content", pageSection] });
      toast.success("İçerik başarıyla yayınlandı.");
    },
    onError: (err: any) => {
      toast.error(`Hata: ${err.message}`);
    },
  });

  return {
    originalData,
    draftData,
    isLoading,
    error,
    updateDraft,
    undoChanges,
    hasChanges,
    publish: publishMutation.mutate,
    isPublishing: publishMutation.isPending,
  };
}

/**
 * Helper hook for frontend components to fetch content with fallbacks.
 */
export function useSiteContent(pageSection: string) {
  return useQuery({
    queryKey: ["site-content", pageSection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_content")
        .select("*")
        .eq("page_section", pageSection);

      if (error) {
        console.error(`CMS Error (${pageSection}):`, error);
        return {};
      }

      const contentMap: Record<string, string> = {};
      data?.forEach((item) => {
        contentMap[item.field_key] = item.content_value;
      });

      return contentMap;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
