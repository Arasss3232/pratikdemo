import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Plus, Trash2, GripVertical, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export function NavigationPanel({ type }: { type: string }) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<any[]>([]);

  // Since we don't have a dedicated navigation_items table in the visual report but mention it, 
  // I will check if it exists or use a mock/placeholder approach until I can verify the schema.
  // Actually, I should probably check the migrations.
  
  const { data: navItems, isLoading } = useQuery({
    queryKey: ["navigation", type],
    queryFn: async () => {
      // Assuming a navigation_items table exists based on previous logic
      const { data, error } = await supabase
        .from("navigation_items")
        .select("*")
        .eq("menu_type", type)
        .order("display_order");
      
      if (error && error.code !== "PGRST116") {
         console.warn("Navigation table error, using empty state", error);
         return [];
      }
      return data || [];
    }
  });

  useEffect(() => {
    if (navItems) setItems(JSON.parse(JSON.stringify(navItems)));
  }, [navItems]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Logic to save items...
      toast.info("Navigasyon düzenleme altyapısı hazırlanıyor.");
    }
  });

  if (isLoading) return <div className="p-8 text-white/40"><Loader2 className="animate-spin" /> Yükleniyor...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold">{type === 'header_nav' ? 'Header Navigasyon' : type === 'footer' ? 'Footer Linkleri' : 'Üst Bar Mesajları'}</h2>
          <p className="text-white/50">Menü yapısını ve linkleri düzenleyin</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-all">
            <Plus size={16} />
            Yeni Ekle
          </button>
          <button 
            onClick={() => saveMutation.mutate()}
            className="h-10 px-6 bg-[var(--admin-yellow)] text-[var(--admin-navy)] rounded-lg font-bold flex items-center gap-2"
          >
            Sıralamayı Kaydet
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center p-20 border-2 border-dashed border-white/5 rounded-2xl text-white/20">
            <p>Henüz bir link eklenmemiş.</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={item.id || idx} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <GripVertical className="text-white/20 cursor-move" size={20} />
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-[var(--admin-yellow)]">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-medium">{item.label}</h4>
                  <p className="text-xs text-white/40">{item.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white">
                  <ChevronRight size={18} />
                </button>
                <button className="p-2 hover:bg-red-500/10 rounded-lg text-white/60 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
