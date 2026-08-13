import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
};

export function useCategories(includeInactive = false) {
  return useQuery({
    queryKey: ["product_categories", includeInactive],
    queryFn: async () => {
      try {
        let query = supabase
          .from("product_categories")
          .select("*")
          .order("display_order", { ascending: true });

        if (!includeInactive) {
          query = query.eq("is_active", true);
        }

        const { data, error } = await query;
        if (error) {
          console.error("Supabase category fetch error:", error);
          return [] as Category[];
        }
        return (data as Category[]) || [];
      } catch (err) {
        console.error("useCategories exception:", err);
        return [] as Category[];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
