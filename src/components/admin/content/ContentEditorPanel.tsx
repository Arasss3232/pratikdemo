import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Layout, Type, Link as LinkIcon, Image as ImageIcon, Eye, Globe, Sparkles, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { FileUploadField } from "../FileUploadField";
import { useSiteContent, useUpdateSiteContent } from "@/hooks/use-site-content";

interface ContentEditorPanelProps {
  route: string;
  flexiblePageName?: string;
}

export function ContentEditorPanel({ route, flexiblePageName }: ContentEditorPanelProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [localSections, setLocalSections] = useState<any[]>([]);
  const [flexibleContent, setFlexibleContent] = useState<Record<string, any>>({});

  // 1. Existing Legacy CMS logic (site_pages based)
  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ["cms-page", route],
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

  // 2. New Flexible CMS logic (site_content based)
  const isFlexibleCms = route === "flexible_cms" || !!flexiblePageName;
  const targetPageName = flexiblePageName || "home";
  const { data: siteContent, isLoading: flexibleLoading } = useSiteContent(targetPageName);
  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (sections) setLocalSections(JSON.parse(JSON.stringify(sections)));
  }, [sections]);

  useEffect(() => {
    if (siteContent) setFlexibleContent(JSON.parse(JSON.stringify(siteContent)));
  }, [siteContent]);

  const handleUndo = () => {
    if (isFlexibleCms) {
      if (siteContent) {
        setFlexibleContent(JSON.parse(JSON.stringify(siteContent)));
        toast.info("Değişiklikler geri alındı.");
      }
    } else {
      if (sections) {
        setLocalSections(JSON.parse(JSON.stringify(sections)));
        toast.info("Değişiklikler geri alındı.");
      }
    }
  };

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

  if (pageLoading || sectionsLoading || (isFlexibleCms && flexibleLoading)) return (
    <div className="flex flex-col items-center justify-center h-64 text-white/40">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p>İçerik yükleniyor...</p>
    </div>
  );

  if (!page && !isFlexibleCms) return <div className="p-8 text-white/40">Bu rota için sayfa kaydı bulunamadı.</div>;

  const handleFieldChange = (sectionId: string, fieldId: string, value: any, type: 'text' | 'link' | 'media' | 'json' | 'icon') => {
    setLocalSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        section_content: s.section_content.map((f: any) => {
          if (f.id !== fieldId) return f;
          if (type === 'text') return { ...f, value_text: value };
          if (type === 'link') return { ...f, link_url: value };
          if (type === 'icon') return { ...f, icon: value };
          if (type === 'media') return { ...f, value_text: value };
          if (type === 'json') return { ...f, value_json: value };
          return f;
        })
      };
    }));
  };

  if (isFlexibleCms) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-[var(--admin-yellow)]" />
              {flexiblePageName === "top_bar" ? "Üst Bilgi Çubuğu Yönetimi" : "Gelişmiş CMS (Site İçeriği)"}
            </h2>
            <p className="text-white/50">Esnek veri yapısı ile dinamik alanları yönetin</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleUndo}
              className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-all"
              title="Geri Al"
            >
              <Undo2 size={16} />
              Geri Al
            </button>
            <button 
              onClick={() => {
                // Bulk update for flexible content
                Object.entries(flexibleContent).forEach(([sectionKey, contentValue]) => {
                  updateMutation.mutate({
                    pageName: targetPageName,
                    sectionKey,
                    contentValue
                  });
                });
                toast.success("Tüm değişiklikler yayınlandı.");
              }}
              disabled={updateMutation.isPending}
              className="h-10 px-6 bg-[var(--admin-yellow)] text-[var(--admin-navy)] rounded-lg font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[var(--admin-yellow)]/20"
            >
              {updateMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Globe size={18} />}
              Yayınla
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {Object.keys(flexibleContent).length === 0 ? (
            <div className="text-center p-20 border-2 border-dashed border-white/5 rounded-2xl text-white/20">
              <Layout size={48} className="mx-auto mb-4 opacity-50" />
              <p className="mb-4">Bu bölüm için henüz veri senkronize edilmemiş.</p>
              <button 
                onClick={async () => {
                  const toastId = toast.loading("Veriler senkronize ediliyor...");
                  try {
                    const resp = await fetch('/api/public/sync-trigger', { method: 'POST' });
                    const result = await resp.json();
                    if (result.success) {
                      queryClient.invalidateQueries({ queryKey: ["site-content"] });
                      toast.success("Veriler başarıyla senkronize edildi.", { id: toastId });
                    } else {
                      throw new Error(result.error);
                    }
                  } catch (err: any) {
                    toast.error("Hata: " + err.message, { id: toastId });
                  }
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs transition-all"
              >
                Mevcut Site İçeriğini Senkronize Et
              </button>
            </div>
          ) : (
            Object.entries(flexibleContent).map(([sectionKey, value]) => (
              <div key={sectionKey} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--admin-yellow)]/10">
                      <Layout size={18} className="text-[var(--admin-yellow)]" />
                    </div>
                    <h3 className="font-bold">{sectionKey.toUpperCase()}</h3>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {Object.entries(value).map(([fieldKey, fieldValue]: [string, any]) => (
                    <div key={fieldKey} className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{fieldKey.replace(/_/g, ' ')}</label>
                      <textarea 
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm min-h-[60px] focus:border-[var(--admin-yellow)]/50 outline-none transition-colors text-white"
                        value={fieldValue || ""}
                        onChange={(e) => {
                          setFlexibleContent(prev => ({
                            ...prev,
                            [sectionKey]: {
                              ...prev[sectionKey],
                              [fieldKey]: e.target.value
                            }
                          }));
                        }}
                      />
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold">{page?.internal_name}</h2>
          <p className="text-white/50">{route} sayfasını düzenliyorsunuz</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleUndo}
            className="h-10 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center gap-2 transition-all"
            title="Geri Al"
          >
            <Undo2 size={16} />
            Geri Al
          </button>
          <button 
            onClick={() => navigate({ search: (prev: any) => ({ ...prev, tab: 'seo', seoTab: 'pages' }) } as any)}
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
            <p className="mb-4">Bu sayfa için henüz bir içerik bölümü tanımlanmamış.</p>
            <button 
              onClick={async () => {
                const toastId = toast.loading("Veriler senkronize ediliyor...");
                try {
                  const resp = await fetch('/api/public/sync-trigger', { method: 'POST' });
                  const result = await resp.json();
                  if (result.success) {
                    queryClient.invalidateQueries({ queryKey: ["cms-sections"] });
                    queryClient.invalidateQueries({ queryKey: ["cms-page"] });
                    toast.success("Veriler başarıyla senkronize edildi.", { id: toastId });
                  } else {
                    throw new Error(result.error);
                  }
                } catch (err: any) {
                  toast.error("Hata: " + err.message, { id: toastId });
                }
              }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs transition-all"
            >
              Mevcut Site İçeriğini Senkronize Et
            </button>
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
                        {field.label || field.field_key}
                      </label>
                      <span className="text-[10px] text-white/20 capitalize">{field.field_type}</span>
                    </div>


                    {field.field_type === 'text' && (
                      <div className="space-y-3">
                        <textarea 
                          className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-sm min-h-[80px] focus:border-[var(--admin-yellow)]/50 outline-none transition-colors text-white"
                          value={field.value_text || ""}
                          onChange={(e) => handleFieldChange(section.id, field.id, e.target.value, 'text')}
                        />
                        
                        {(field.link_url !== undefined || field.icon !== undefined) && (
                          <div className="flex flex-wrap gap-4 p-3 bg-black/20 rounded-lg border border-white/5">
                            {field.link_url !== undefined && (
                              <div className="flex-1 min-w-[200px] space-y-1">
                                <span className="text-[10px] text-white/30 uppercase tracking-wider">Yönlendirme URL</span>
                                <div className="relative">
                                  <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                  <input 
                                    className="w-full bg-black/40 border border-white/10 rounded-lg h-8 pl-8 pr-4 text-[11px] focus:border-[var(--admin-yellow)]/50 outline-none transition-colors text-white"
                                    value={field.link_url || ""}
                                    placeholder="/rota veya https://..."
                                    onChange={(e) => handleFieldChange(section.id, field.id, e.target.value, 'link')}
                                  />
                                </div>
                              </div>
                            )}
                            {field.icon !== undefined && (
                              <div className="w-32 space-y-1">
                                <span className="text-[10px] text-white/30 uppercase tracking-wider">İkon (Material)</span>
                                <div className="relative">
                                  <Globe size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                  <input 
                                    className="w-full bg-black/40 border border-white/10 rounded-lg h-8 pl-8 pr-4 text-[11px] focus:border-[var(--admin-yellow)]/50 outline-none transition-colors text-white"
                                    value={field.icon || ""}
                                    placeholder="call, mail..."
                                    onChange={(e) => handleFieldChange(section.id, field.id, e.target.value, 'icon')}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
                      <FileUploadField 
                        value={field.value_text || ""}
                        onChange={(v) => handleFieldChange(section.id, field.id, v, 'text')}
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
