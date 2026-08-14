import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Link as LinkIcon, Type, Layout, RefreshCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { syncPublicContent } from "@/lib/sync-content.functions";

export function FooterEditor() {
  const queryClient = useQueryClient();
  const [localSections, setLocalSections] = useState<any[]>([]);
  const syncBootstrap = useServerFn(syncPublicContent);
  const [bootstrapping, setBootstrapping] = useState(false);

  const { data: sections, isLoading, refetch } = useQuery({
    queryKey: ["cms-sections", "footer"],
    queryFn: async () => {
      const { data: page, error: pageError } = await supabase
        .from("site_pages")
        .select("id")
        .eq("route", "footer")
        .maybeSingle();

      if (pageError) throw pageError;
      if (!page) return null;

      const { data, error: sectionsError } = await supabase
        .from("page_sections")
        .select("*, section_content (*)")
        .eq("page_id", page.id)
        .order("display_order");
      
      if (sectionsError) throw sectionsError;
      return data || [];
    }
  });

  useEffect(() => {
    async function bootstrap() {
      if (!isLoading && (!sections || (Array.isArray(sections) && sections.length === 0))) {
        setBootstrapping(true);
        try {
          await syncBootstrap();
          await refetch();
        } catch (err) {
          console.error("Footer Bootstrap Error:", err);
        } finally {
          setBootstrapping(false);
        }
      }
    }
    bootstrap();
  }, [sections, isLoading, syncBootstrap, refetch]);

  useEffect(() => {
    if (sections) setLocalSections(JSON.parse(JSON.stringify(sections)));
  }, [sections]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const section of localSections) {
        for (const field of section.section_content) {
          const updateData: any = {
            value_text: field.value_text,
            link_url: field.link_url,
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
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-sections", "footer"] });
      queryClient.invalidateQueries({ queryKey: ["page-content", "footer"] });
      queryClient.invalidateQueries({ queryKey: ["cms-sections", "footer"] });
      toast.success("Footer içerikleri güncellendi.");
    },
    onError: (err) => {
      toast.error("Hata: " + err.message);
    }
  });

  const handleFieldChange = (sectionId: string, fieldId: string, value: string, type: 'text' | 'link') => {
    setLocalSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        section_content: s.section_content.map((f: any) => {
          if (f.id !== fieldId) return f;
          return type === 'text' ? { ...f, value_text: value } : { ...f, link_url: value };
        })
      };
    }));
  };

  if (isLoading || bootstrapping) return (
    <div className="flex flex-col items-center justify-center h-64 text-white/40">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p>{bootstrapping ? "İçerik otomatik olarak hazırlanıyor..." : "Yükleniyor..."}</p>
    </div>
  );

  if (!sections || (Array.isArray(sections) && sections.length === 0)) {
    return (
      <div className="p-8 text-white/40 text-center border-2 border-dashed border-white/5 rounded-2xl">
        <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
        <p className="mb-4">Footer için yönetilebilir bir içerik bulunamadı.</p>
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold">Footer İçerikleri</h2>
          <p className="text-white/50">Sitenin en alt bölümünde yer alan bilgileri ve linkleri düzenleyin</p>
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

      <div className="space-y-8">
        {localSections.map((section) => (
          <div key={section.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--admin-yellow)]/10 text-[var(--admin-yellow)]">
                  <Layout size={18} />
                </div>
                <h3 className="font-bold">{section.internal_label}</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{section.section_key}</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.section_content.map((field: any) => (
                <div key={field.id} className="space-y-2 p-4 bg-black/20 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-wider flex items-center gap-2">
                      {field.field_type === 'text' ? <Type size={12} /> : <LinkIcon size={12} />}
                      {field.label}
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-white/20">Değer / Metin</span>
                      {field.field_key === 'summary' ? (
                        <textarea 
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm min-h-[100px] focus:border-[var(--admin-yellow)] outline-none transition-colors"
                          value={field.value_text || ""}
                          onChange={(e) => handleFieldChange(section.id, field.id, e.target.value, 'text')}
                        />
                      ) : (
                        <input 
                          className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-4 text-sm focus:border-[var(--admin-yellow)] outline-none transition-colors"
                          value={field.value_text || ""}
                          onChange={(e) => handleFieldChange(section.id, field.id, e.target.value, 'text')}
                        />
                      )}
                    </div>

                    {field.link_url !== undefined && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-white/20">Link URL</span>
                        <input 
                          className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-4 text-sm focus:border-[var(--admin-yellow)] outline-none transition-colors"
                          value={field.link_url || ""}
                          onChange={(e) => handleFieldChange(section.id, field.id, e.target.value, 'link')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}