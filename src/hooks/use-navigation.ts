import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type NavItem = {
  id: string;
  label: string;
  route: string;
  is_external: boolean;
};

export function useNavigation() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNav() {
      const { data } = await supabase
        .from("navigation_items")
        .select("id, label, route, is_external")
        .eq("is_active", true)
        .order("display_order");
      
      if (data && data.length > 0) setItems(data);
      else setItems([]); // Ensure array state even on empty data

      setLoading(false);
    }
    loadNav();
  }, []);

  return { items, loading };
}
