import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  image_alt: string | null;
  display_order: number;

  is_active: boolean;
};

export function useCategories(includeInactive = false) {
  const query = useQuery({
    queryKey: ["product_categories", includeInactive],
    queryFn: async () => {
      let q = supabase
        .from("product_categories")
        .select("*")
        .order("display_order", { ascending: true });

      if (!includeInactive) {
        q = q.eq("is_active", true);
      }

      const { data, error } = await q;
      if (error) {
        console.error("Supabase category fetch error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      if (!data) return [];
      return (data as any[]).map(cat => ({
        ...cat,
        image_alt: cat.image_alt ?? null
      })) as Category[];


    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  };
}
