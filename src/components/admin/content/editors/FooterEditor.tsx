import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save, Link as LinkIcon, Type, Layout } from "lucide-react";
import { toast } from "sonner";

export function FooterEditor() {
  const queryClient = useQueryClient();
  const [localSections, setLocalSections] = useState<any[]>([]);

  const { data: sections, isLoading } = useQuery({
    queryKey: ["cms-sections", "footer"],
    queryFn: async () => {
      const { data: page, error: pageError } = await supabase
        .from("site_pages")
        .select("id")
        .eq("route", "footer")
        .maybeSingle();

      if (pageError) throw pageError;
      if (!page) return [];

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
            .eq("id", field.id);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-sections", "footer"] });
      queryClient.invalidateQueries({ queryKey: ["page-content", "footer"] });
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

  if (isLoading) return <div className="p-8 text-white/40 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

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