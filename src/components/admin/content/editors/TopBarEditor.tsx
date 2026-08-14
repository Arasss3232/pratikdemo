import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Save, Phone, MapPin, Clock, MessageSquare, ExternalLink, RefreshCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { syncPublicContent } from "@/lib/sync-content.functions";

export function TopBarEditor() {
  const queryClient = useQueryClient();
  const [localContent, setLocalContent] = useState<any[]>([]);
  const syncBootstrap = useServerFn(syncPublicContent);
  const [bootstrapping, setBootstrapping] = useState(false);

  const { data: sectionData, isLoading, refetch } = useQuery({
    queryKey: ["cms-sections", "top_bar"],
    queryFn: async () => {
      const { data: page, error: pageError } = await supabase
        .from("site_pages")
        .select("id")
        .eq("route", "top_bar")
        .maybeSingle();

      if (pageError) throw pageError;
      if (!page) return null;

      const { data, error: sectionsError } = await supabase
        .from("page_sections")
        .select("*, section_content (*)")
        .eq("page_id", page.id)
        .eq("section_key", "top_bar_content")
        .maybeSingle();
      
      if (sectionsError) throw sectionsError;
      return data?.section_content || [];
    }
  });

  useEffect(() => {
    async function bootstrap() {
      if (!isLoading && (!sectionData || (Array.isArray(sectionData) && sectionData.length === 0))) {
        setBootstrapping(true);
        try {
          await syncBootstrap();
          await refetch();
        } catch (err) {
          console.error("TopBar Bootstrap Error:", err);
        } finally {
          setBootstrapping(false);
        }
      }
    }
    bootstrap();
  }, [sectionData, isLoading, syncBootstrap, refetch]);

  useEffect(() => {
    if (sectionData) setLocalContent(JSON.parse(JSON.stringify(sectionData)));
  }, [sectionData]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const field of localContent) {
        const updateData: any = {
          value_text: field.value_text,
          link_url: field.link_url,
          icon: field.icon,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from("section_content")
          .update(updateData)
          .eq("id", field.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-sections", "top_bar"] });
      queryClient.invalidateQueries({ queryKey: ["page-content", "top_bar"] });
      toast.success("Üst bar içerikleri güncellendi.");
    },
    onError: (err) => {
      toast.error("Hata: " + err.message);
    }
  });

  const updateField = (id: string, updates: any) => {
    setLocalContent(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  if (isLoading || bootstrapping) return (
    <div className="flex flex-col items-center justify-center h-64 text-white/40">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p>{bootstrapping ? "İçerik otomatik olarak hazırlanıyor..." : "Yükleniyor..."}</p>
    </div>
  );

  if (!sectionData || (Array.isArray(sectionData) && sectionData.length === 0)) {
    return (
      <div className="p-8 text-white/40 text-center border-2 border-dashed border-white/5 rounded-2xl">
        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
        <p className="mb-4">Üst bar için yönetilebilir bir içerik bulunamadı.</p>
        <button 
          onClick={() => {
            setBootstrapping(true);
            syncBootstrap().then(() => refetch()).finally(() => setBootstrapping(false));
          }}
          className="px-6 py-2 bg-[var(--admin-yellow)] text-[var(--admin-navy)] rounded-lg font-bold flex items-center gap-2 mx-auto"
        >
          <RefreshCcw size={18} />
          İçeriği Şimdi Oluştur
        </button>
      </div>
    );
  }

  const getIcon = (key: string) => {
    switch (key) {
      case 'phone': return <Phone size={18} />;
      case 'address': return <MapPin size={18} />;
      case 'working_hours': return <Clock size={18} />;
      case 'whatsapp': return <MessageSquare size={18} />;
      default: return <ExternalLink size={18} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold">Üst Bilgi Çubuğu (Top Bar)</h2>
          <p className="text-white/50">Ziyaretçilerin en üstte gördüğü iletişim bilgilerini düzenleyin</p>
        </div>
        <button 
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="h-10 px-6 bg-[var(--admin-yellow)] text-[var(--admin-navy)] rounded-lg font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[var(--admin-yellow)]/20 disabled:opacity-50"
        >
          {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {localContent.map((field) => (
          <div key={field.id} className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[var(--admin-yellow)]/10 text-[var(--admin-yellow)]">
                {getIcon(field.field_key)}
              </div>
              <h3 className="font-bold text-sm uppercase tracking-wider">{field.label}</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Görünen Metin</span>
                <input 
                  className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-4 text-sm focus:border-[var(--admin-yellow)] outline-none transition-colors"
                  value={field.value_text || ""}
                  onChange={(e) => updateField(field.id, { value_text: e.target.value })}
                />
              </div>

              {field.link_url !== undefined && (
                <div className="space-y-1">
                  <span className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">Link (URL / tel:)</span>
                  <input 
                    className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-4 text-sm focus:border-[var(--admin-yellow)] outline-none transition-colors"
                    value={field.link_url || ""}
                    onChange={(e) => updateField(field.id, { link_url: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">İkon Adı (Material)</span>
                <input 
                  className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-4 text-sm focus:border-[var(--admin-yellow)] outline-none transition-colors"
                  value={field.icon || ""}
                  onChange={(e) => updateField(field.id, { icon: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}