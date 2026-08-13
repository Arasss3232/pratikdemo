import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Layout, Type, Link as LinkIcon, Image as ImageIcon, Eye, Globe } from "lucide-react";
import { toast } from "sonner";
import { ImageUploadField } from "../ImageUploadField";

export function ContentEditorPanel({ route }: { route: string }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [localSections, setLocalSections] = useState<any[]>([]);

  const [previewMode, setPreviewMode] = useState(false);

  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ["cms-page", route, previewMode],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_pages")
        .select("*")
        .eq("route", route)
        .maybeSingle();
      return data;
    }
  });

  const { data: sections, isLoading: sectionsLoading } = useQuery({
    queryKey: ["cms-sections", page?.id],
    enabled: !!page?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("page_sections")
        .select("*, section_content (*)")
        .eq("page_id", page!.id)
        .order("display_order");
      return data;
    }
  });

  useEffect(() => {
    if (sections) setLocalSections(JSON.parse(JSON.stringify(sections)));
  }, [sections]);

  const saveMutation = useMutation({
    mutationFn: async (isPublish: boolean) => {
      for (const section of localSections) {
        for (const field of section.section_content) {
          const { error } = await supabase
            .from("section_content")
            .update({
              value_text: field.value_text,
              link_url: field.link_url,
              media_url: field.media_url,
              value_json: field.value_json
            })
            .eq("id", field.id);
          if (error) throw error;
        }
      }

      if (isPublish) {
        const { error } = await supabase
          .from("site_pages")
          .update({ status: 'published', updated_at: new Date().toISOString() })
          .eq("id", page!.id);
        if (error) throw error;
      }
    },
    onSuccess: (_, isPublish) => {
      queryClient.invalidateQueries({ queryKey: ["cms-sections", page?.id] });
      toast.success(isPublish ? "İçerik başarıyla yayınlandı!" : "Taslak kaydedildi.");
    },
    onError: (err) => {
      toast.error("Hata: " + err.message);
    }
  });

  if (pageLoading || sectionsLoading) return (
    <div className="flex flex-col items-center justify-center h-64 text-white/40">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p>İçerik yükleniyor...</p>
    </div>
  );

  if (!page) return <div className="p-8 text-white/40">Bu rota için sayfa kaydı bulunamadı.</div>;

  const handleFieldChange = (sectionId: string, fieldId: string, value: any, type: 'text' | 'link' | 'media' | 'json') => {
    setLocalSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        section_content: s.section_content.map((f: any) => {
          if (f.id !== fieldId) return f;
          if (type === 'text') return { ...f, value_text: value };
          if (type === 'link') return { ...f, link_url: value };
          if (type === 'media') return { ...f, media_url: value };
          if (type === 'json') return { ...f, value_json: value };
          return f;
        })
      };
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold">{page.internal_name}</h2>
          <p className="text-white/50">{route} sayfasını düzenliyorsunuz</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate({ search: (prev: any) => ({ ...prev, tab: 'seo', seoTab: 'pages' }) })}
            className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-all"
          >
            <Globe size={16} />
            SEO Ayarlarını Aç
          </button>
          <button 
            onClick={() => window.open(route === '/' ? '/' : route, '_blank')}
            className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-all"
          >
            <Eye size={16} />
            Sitede Gör
          </button>

          <button 
            onClick={() => saveMutation.mutate(false)}
            disabled={saveMutation.isPending}
            className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-all"
          >
            Taslak Olarak Kaydet
          </button>
          <button 
            onClick={() => saveMutation.mutate(true)}
            disabled={saveMutation.isPending}
            className="h-10 px-6 bg-[var(--admin-yellow)] text-[var(--admin-navy)] rounded-lg font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[var(--admin-yellow)]/20"
          >
            {saveMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />}
            Yayınla
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {localSections.length === 0 ? (
          <div className="text-center p-20 border-2 border-dashed border-white/5 rounded-2xl text-white/20">
            <Layout size={48} className="mx-auto mb-4 opacity-50" />
            <p>Bu sayfa için henüz bir içerik bölümü tanımlanmamış.</p>
          </div>
        ) : (
          localSections.map((section) => (
            <div key={section.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--admin-yellow)]/10">
                    <Layout size={18} className="text-[var(--admin-yellow)]" />
                  </div>
                  <h3 className="font-bold">{section.internal_label}</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{section.section_key}</span>
              </div>
              <div className="p-6 space-y-6">
                {section.section_content.map((field: any) => (
                  <div key={field.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-2">
                        {field.field_type === 'text' && <Type size={12} />}
                        {field.field_type === 'link' && <LinkIcon size={12} />}
                        {field.field_type === 'image' && <ImageIcon size={12} />}
                        {field.field_key}
                      </label>
                      <span className="text-[10px] text-white/20">{field.field_type}</span>
                    </div>

                    {field.field_type === 'text' && (
                      <textarea 
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-sm min-h-[80px] focus:border-[var(--admin-yellow)]/50 outline-none transition-colors text-white"
                        value={field.value_text || ""}
                        onChange={(e) => handleFieldChange(section.id, field.id, e.target.value, 'text')}
                      />
                    )}

                    {field.field_type === 'link' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-white/30">Buton Metni</span>
                          <input 
                            className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-4 text-sm focus:border-[var(--admin-yellow)]/50 outline-none transition-colors text-white"
                            value={field.value_text || ""}
                            onChange={(e) => handleFieldChange(section.id, field.id, e.target.value, 'text')}
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-white/30">Yönlendirme URL</span>
                          <input 
                            className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-4 text-sm focus:border-[var(--admin-yellow)]/50 outline-none transition-colors text-white"
                            value={field.link_url || ""}
                            onChange={(e) => handleFieldChange(section.id, field.id, e.target.value, 'link')}
                          />
                        </div>
                      </div>
                    )}

                    {field.field_type === 'image' && (
                      <ImageUploadField 
                        value={field.media_url || ""}
                        onChange={(v) => handleFieldChange(section.id, field.id, v, 'media')}
                        label="Görsel Seç"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
