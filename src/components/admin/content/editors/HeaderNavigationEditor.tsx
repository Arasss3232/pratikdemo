import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Save, Trash2, GripVertical, Check, X, Globe, Smartphone, Monitor, RefreshCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { syncPublicContent } from "@/lib/sync-content.functions";

export function HeaderNavigationEditor() {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<any[]>([]);
  const [headerConfig, setHeaderConfig] = useState<any[]>([]);
  const syncBootstrap = useServerFn(syncPublicContent);
  const [bootstrapping, setBootstrapping] = useState(false);

  const { data: navData, isLoading: navLoading } = useQuery({
    queryKey: ["navigation", "header_navigation"],
    queryFn: async () => {
      const { data } = await supabase
        .from("navigation_items")
        .select("*")
        .eq("menu_type", "header_navigation")
        .order("display_order");
      return data || [];
    }
  });

  const { data: configData, isLoading: configLoading, refetch: refetchConfig } = useQuery({
    queryKey: ["cms-sections", "header_navigation"],
    queryFn: async () => {
      const { data: page, error: pageError } = await supabase
        .from("site_pages")
        .select("id")
        .eq("route", "header_navigation")
        .maybeSingle();

      if (pageError) throw pageError;
      if (!page) return null;

      const { data, error: sectionsError } = await supabase
        .from("page_sections")
        .select("*, section_content (*)")
        .eq("page_id", page.id)
        .eq("section_key", "header_config")
        .maybeSingle();
      
      if (sectionsError) throw sectionsError;
      return data?.section_content || [];
    }
  });

  useEffect(() => {
    async function bootstrap() {
      if (!configLoading && (!configData || (Array.isArray(configData) && configData.length === 0))) {
        setBootstrapping(true);
        try {
          await syncBootstrap();
          await refetchConfig();
        } catch (err) {
          console.error("Header Bootstrap Error:", err);
        } finally {
          setBootstrapping(false);
        }
      }
    }
    bootstrap();
  }, [configData, configLoading, syncBootstrap, refetchConfig]);

  useEffect(() => {
    if (navData) setItems(JSON.parse(JSON.stringify(navData)));
  }, [navData]);

  useEffect(() => {
    if (configData) setHeaderConfig(JSON.parse(JSON.stringify(configData)));
  }, [configData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      // Save Nav Items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.id) {
          const { error } = await supabase
            .from("navigation_items")
            .update({
              label: item.label,
              route: item.route,
              display_order: i + 1,
              is_active: item.is_active,
              desktop_visibility: item.desktop_visibility,
              mobile_visibility: item.mobile_visibility,
              updated_at: new Date().toISOString()
            })
            .eq("id", item.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("navigation_items")
            .insert({
              menu_type: "header_navigation",
              label: item.label,
              route: item.route,
              display_order: i + 1,
              is_active: true,
              desktop_visibility: true,
              mobile_visibility: true
            });
          if (error) throw error;
        }
      }

      // Save Header Config
      for (const field of headerConfig) {
        const updateData: any = {
          value_text: field.value_text,
          updated_at: new Date().toISOString()
        };
        const { error } = await supabase
          .from("section_content")
          .update(updateData)
          .eq("id", field.id)
          .select()
          .single();
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
      queryClient.invalidateQueries({ queryKey: ["cms-sections"] });
      queryClient.invalidateQueries({ queryKey: ["page-content"] });
      toast.success("Header navigasyonu ve ayarları kaydedildi.");
    },
    onError: (err) => {
      toast.error("Hata: " + err.message);
    }
  });

  const updateItem = (index: number, updates: any) => {
    setItems(prev => prev.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const updateConfig = (id: string, value: string) => {
    setHeaderConfig(prev => prev.map(f => f.id === id ? { ...f, value_text: value } : f));
  };

  const addItem = () => {
    setItems(prev => [...prev, { label: "Yeni Link", route: "/", is_active: true, desktop_visibility: true, mobile_visibility: true }]);
  };

  const removeItem = async (id: string, index: number) => {
    if (id) {
      const { error } = await supabase.from("navigation_items").delete().eq("id", id);
      if (error) {
        toast.error("Silme hatası: " + error.message);
        return;
      }
    }
    setItems(prev => prev.filter((_, i) => i !== index));
    toast.success("Link kaldırıldı.");
  };

  if (navLoading || configLoading || bootstrapping) return (
    <div className="flex flex-col items-center justify-center h-64 text-white/40">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p>{bootstrapping ? "İçerik otomatik olarak hazırlanıyor..." : "Yükleniyor..."}</p>
    </div>
  );

  if (!configData || (Array.isArray(configData) && configData.length === 0)) {
    return (
      <div className="p-8 text-white/40 text-center border-2 border-dashed border-white/5 rounded-2xl">
        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
        <p className="mb-4">Header yapılandırması için yönetilebilir bir içerik bulunamadı.</p>
        <button 
          onClick={() => {
            setBootstrapping(true);
            syncBootstrap().then(() => refetchConfig()).finally(() => setBootstrapping(false));
          }}
          className="px-6 py-2 bg-[var(--admin-yellow)] text-[var(--admin-navy)] rounded-lg font-bold flex items-center gap-2 mx-auto"
        >
          <RefreshCcw size={18} />
          İçeriği Şimdi Oluştur
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold">Header ve Navigasyon</h2>
          <p className="text-white/50">Ana menü linklerini ve header ayarlarını yönetin</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={addItem}
            className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-all border border-white/10"
          >
            <Plus size={18} />
            Yeni Link Ekle
          </button>
          <button 
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="h-10 px-6 bg-[var(--admin-yellow)] text-[var(--admin-navy)] rounded-lg font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[var(--admin-yellow)]/20 disabled:opacity-50"
          >
            {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Değişiklikleri Kaydet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 flex items-center gap-2 mb-4">
            <Globe size={14} />
            Menü Linkleri (Sıralanabilir)
          </h3>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id || index} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center gap-4 group">
                <div className="cursor-move text-white/20 hover:text-white/40 transition-colors">
                  <GripVertical size={20} />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Etiket</span>
                    <input 
                      className="w-full bg-black/40 border border-white/10 rounded-lg h-9 px-3 text-sm focus:border-[var(--admin-yellow)] outline-none transition-colors"
                      value={item.label || ""}
                      onChange={(e) => updateItem(index, { label: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Rota / URL</span>
                    <input 
                      className="w-full bg-black/40 border border-white/10 rounded-lg h-9 px-3 text-sm focus:border-[var(--admin-yellow)] outline-none transition-colors"
                      value={item.route || ""}
                      onChange={(e) => updateItem(index, { route: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 px-4 border-x border-white/5">
                  <button 
                    onClick={() => updateItem(index, { desktop_visibility: !item.desktop_visibility })}
                    className={`p-2 rounded-lg transition-all ${item.desktop_visibility ? 'bg-[var(--admin-yellow)]/10 text-[var(--admin-yellow)]' : 'bg-white/5 text-white/20'}`}
                    title="Masaüstü Görünürlüğü"
                  >
                    <Monitor size={18} />
                  </button>
                  <button 
                    onClick={() => updateItem(index, { mobile_visibility: !item.mobile_visibility })}
                    className={`p-2 rounded-lg transition-all ${item.mobile_visibility ? 'bg-[var(--admin-yellow)]/10 text-[var(--admin-yellow)]' : 'bg-white/5 text-white/20'}`}
                    title="Mobil Görünürlüğü"
                  >
                    <Smartphone size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateItem(index, { is_active: !item.is_active })}
                    className={`h-9 px-3 rounded-lg text-[10px] font-bold transition-all border ${
                      item.is_active 
                        ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                        : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}
                  >
                    {item.is_active ? 'AKTİF' : 'PASİF'}
                  </button>
                  <button 
                    onClick={() => removeItem(item.id, index)}
                    className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 flex items-center gap-2 mb-4">
            <Save size={14} />
            Header Ayarları
          </h3>
          <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-6">
            {headerConfig.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider">{field.label}</label>
                {field.field_key === 'admin_login_visible' ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateConfig(field.id, "true")}
                      className={`flex-1 h-10 rounded-lg text-xs font-bold border transition-all ${field.value_text === 'true' ? 'bg-[var(--admin-yellow)] text-[var(--admin-navy)] border-[var(--admin-yellow)]' : 'bg-white/5 border-white/10 text-white/40'}`}
                    >
                      GÖSTER
                    </button>
                    <button 
                      onClick={() => updateConfig(field.id, "false")}
                      className={`flex-1 h-10 rounded-lg text-xs font-bold border transition-all ${field.value_text === 'false' ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-white/5 border-white/10 text-white/40'}`}
                    >
                      GİZLE
                    </button>
                  </div>
                ) : (
                  <input 
                    className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-4 text-sm focus:border-[var(--admin-yellow)] outline-none transition-colors"
                    value={field.value_text || ""}
                    onChange={(e) => updateConfig(field.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}