import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2, GripVertical, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export function NavigationPanel({ type }: { type: string }) {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<any[]>([]);

  const { data: navItems, isLoading } = useQuery({
    queryKey: ["navigation", type],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("navigation_items")
        .select("*")
        .eq("menu_type", type)
        .order("display_order");
      
      if (error) {
         console.warn("Navigation table error", error);
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
      // Basic implementation for saving order/status
      for (const item of items) {
        const { error } = await supabase
          .from("navigation_items")
          .update({ 
            display_order: item.display_order,
            is_active: item.is_active,
            desktop_visibility: item.desktop_visibility,
            mobile_visibility: item.mobile_visibility
          })
          .eq("id", item.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation", type] });
      toast.success("Navigasyon düzeni kaydedildi.");
    },
    onError: (err) => {
      toast.error("Hata: " + err.message);
    }
  });

  const toggleVisibility = (id: string, field: 'desktop_visibility' | 'mobile_visibility') => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: !item[field] } : item
    ));
  };


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
            <p className="mb-4 text-sm">Henüz bir link eklenmemiş veya veriler senkronize edilmemiş.</p>
            <button 
              onClick={() => window.location.href = '/admin/sync'}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs transition-all"
            >
              Mevcut Site İçeriğini Senkronize Et
            </button>
          </div>
        ) : (

          items.map((item, idx) => (
            <div key={item.id || idx} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between group text-white">
              <div className="flex items-center gap-4">
                <GripVertical className="text-white/20 cursor-move" size={20} />
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-[var(--admin-yellow)]">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-medium">{item.label}</h4>
                  <p className="text-xs text-white/40">{item.route}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/20 uppercase tracking-tighter">Masaüstü</span>
                  <input 
                    type="checkbox" 
                    checked={item.desktop_visibility} 
                    onChange={() => toggleVisibility(item.id, 'desktop_visibility')}
                    className="accent-[var(--admin-yellow)]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/20 uppercase tracking-tighter">Mobil</span>
                  <input 
                    type="checkbox" 
                    checked={item.mobile_visibility} 
                    onChange={() => toggleVisibility(item.id, 'mobile_visibility')}
                    className="accent-[var(--admin-yellow)]"
                  />
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {item.is_active ? 'AKTİF' : 'PASİF'}
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">

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
