import { useState, useEffect } from "react";
import { Icon } from "../../site-shell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploadField } from "../ImageUploadField";
import { toast } from "sonner";
import { Loader2, Save, RotateCcw, ChevronRight, Layout, Type, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

type ContentTab = 
  | "general" | "home" | "hakkimizda" | "teklif" | "iletisim" 
  | "header" | "footer" | "navigation";

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState<ContentTab>("general");
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[var(--admin-navy-deep)] text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[var(--admin-surface)]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[var(--admin-yellow-soft)] flex items-center justify-center text-[var(--admin-navy)]">
            <Icon name="edit_note" className="text-[24px]" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Site İçerik Yönetimi</h1>
            <p className="text-sm text-white/60">Sitenizdeki tüm metin ve görselleri kod yazmadan yönetin</p>
          </div>
        </div>
        
        {hasChanges && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
            <span className="text-xs font-semibold text-[var(--admin-yellow)] uppercase tracking-wider">Kaydedilmemiş Değişiklikler</span>
            <button 
              onClick={() => window.location.reload()} 
              className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
              title="Değişiklikleri Geri Al"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-64 border-r border-white/5 bg-[var(--admin-navy-deep)]/50 p-4 space-y-6 overflow-y-auto">
          <div>
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Global</h3>
            <div className="space-y-1">
              <NavItem active={activeTab === "general"} icon="settings" label="Genel Ayarlar" onClick={() => setActiveTab("general")} />
              <NavItem active={activeTab === "header"} icon="ad_units" label="Header & Üst Bar" onClick={() => setActiveTab("header")} />
              <NavItem active={activeTab === "footer"} icon="view_agenda" label="Footer (Alt Bölüm)" onClick={() => setActiveTab("footer")} />
              <NavItem active={activeTab === "navigation"} icon="menu" label="Navigasyon Linkleri" onClick={() => setActiveTab("navigation")} />
            </div>
          </div>

          <div>
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Sayfalar</h3>
            <div className="space-y-1">
              <NavItem active={activeTab === "home"} icon="home" label="Ana Sayfa" onClick={() => setActiveTab("home")} />
              <NavItem active={activeTab === "hakkimizda"} icon="info" label="Hakkımızda" onClick={() => setActiveTab("hakkimizda")} />
              <NavItem active={activeTab === "teklif"} icon="request_quote" label="Teklif Sayfası" onClick={() => setActiveTab("teklif")} />
              <NavItem active={activeTab === "iletisim"} icon="contact_support" label="İletişim" onClick={() => setActiveTab("iletisim")} />
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[var(--admin-surface)]">
          <div className="max-w-4xl mx-auto pb-20">
            {activeTab === "general" && <GeneralSettings onDirty={() => setHasChanges(true)} onSaved={() => setHasChanges(false)} />}
            {["home", "hakkimizda", "teklif", "iletisim"].includes(activeTab) && (
              <PageContentEditor 
                route={activeTab === "home" ? "/" : `/${activeTab}`} 
                onDirty={() => setHasChanges(true)} 
                onSaved={() => setHasChanges(false)} 
              />
            )}
            {["header", "footer", "navigation"].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-64 text-white/20 border-2 border-dashed border-white/5 rounded-2xl">
                <Icon name="construction" className="text-[64px] mb-4" />
                <p className="text-lg font-medium">Bu modül üzerinde çalışıyoruz.</p>
                <p className="text-sm">Gelişmiş {activeTab} yönetimi bir sonraki güncelleme ile aktif olacak.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
        active 
          ? "bg-[var(--admin-yellow)] text-[var(--admin-navy)] shadow-lg shadow-[var(--admin-yellow)]/10" 
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon name={icon} className={`text-[20px] transition-transform ${active ? "" : "group-hover:scale-110"}`} />
      {label}
    </button>
  );
}

function GeneralSettings({ onDirty, onSaved }: { onDirty: () => void; onSaved: () => void }) {
  const queryClient = useQueryClient();
  const [localSettings, setLocalSettings] = useState<any>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings-cms"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").maybeSingle();
      return data;
    }
  });

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const { error } = await supabase.from("site_settings").update(newSettings).eq("id", settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings-cms"] });
      toast.success("Genel ayarlar başarıyla kaydedildi.");
      onSaved();
    },
    onError: (err) => {
      toast.error("Hata: " + err.message);
    }
  });

  if (isLoading || !localSettings) return <div className="flex items-center gap-3 text-white/40"><Loader2 className="animate-spin" /> Yükleniyor...</div>;

  const handleChange = (field: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
    onDirty();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold">Genel Site Ayarları</h2>
          <p className="text-white/50">Tüm sayfalarda geçerli temel bilgiler</p>
        </div>
        <button 
          onClick={() => settings && updateMutation.mutate(localSettings)}
          disabled={updateMutation.isPending || !settings}

          className="h-11 px-6 bg-[var(--admin-yellow)] text-[var(--admin-navy)] rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[var(--admin-yellow)]/20 disabled:opacity-50"
        >
          {updateMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Değişiklikleri Kaydet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <SectionHeader icon="business" title="Kurumsal Bilgiler" />
          <div className="space-y-4">
            <InputGroup 
              label="Şirket Resmi Adı" 
              value={localSettings.company_name || ""} 
              onChange={(v) => handleChange("company_name", v)} 
            />
            <InputGroup 
              label="Slogan (Tagline)" 
              value={localSettings.tagline || ""} 
              onChange={(v) => handleChange("tagline", v)} 
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/40 uppercase">Şirket Açıklaması</label>
              <textarea 
                className="w-full bg-[var(--admin-navy-deep)]/60 border border-white/10 rounded-lg p-4 text-sm min-h-[120px] focus:border-[var(--admin-yellow)]/50 outline-none transition-colors"
                value={localSettings.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader icon="contact_phone" title="İletişim Kanalları" />
          <div className="space-y-4">
            <InputGroup 
              label="Telefon Numarası" 
              value={localSettings.phone || ""} 
              onChange={(v) => handleChange("phone", v)} 
            />
            <InputGroup 
              label="E-posta Adresi" 
              value={localSettings.email || ""} 
              onChange={(v) => handleChange("email", v)} 
            />
            <InputGroup 
              label="WhatsApp (Ülke kodu ile)" 
              value={localSettings.whatsapp || ""} 
              onChange={(v) => handleChange("whatsapp", v)} 
            />
            <InputGroup 
              label="Çalışma Saatleri" 
              value={localSettings.working_hours || ""} 
              onChange={(v) => handleChange("working_hours", v)} 
            />
          </div>
        </section>

        <section className="space-y-6 md:col-span-2">
          <SectionHeader icon="imagesmode" title="Marka Varlıkları" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 p-6 rounded-2xl border border-white/5">
            <ImageUploadField 
              label="Ana Logo" 
              value={localSettings.logo_url || ""} 
              onChange={(v) => handleChange("logo_url", v)} 
              help="Header bölümünde görünen ana logo (Önerilen: PNG/SVG)"
            />
            <ImageUploadField 
              label="Mobil Logo" 
              value={localSettings.mobile_logo_url || ""} 
              onChange={(v) => handleChange("mobile_logo_url", v)} 
              help="Mobil menüde ve küçük ekranlarda görünen logo"
            />
          </div>
        </section>
        
        <section className="space-y-6 md:col-span-2">
          <SectionHeader icon="link" title="Ajans Referansı (Footer)" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="agency_visible"
                checked={localSettings.agency_attribution_visible}
                onChange={(e) => handleChange("agency_attribution_visible", e.target.checked)}
                className="w-5 h-5 rounded border-white/10 bg-white/5 text-[var(--admin-yellow)] focus:ring-offset-0 focus:ring-0"
              />
              <label htmlFor="agency_visible" className="text-sm font-medium">Link Görünsün mü?</label>
            </div>
            <InputGroup 
              label="Link Metni" 
              value={localSettings.agency_attribution_text || ""} 
              onChange={(v) => handleChange("agency_attribution_text", v)} 
            />
            <InputGroup 
              label="Yönlendirme URL" 
              value={localSettings.agency_attribution_url || ""} 
              onChange={(v) => handleChange("agency_attribution_url", v)} 
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function PageContentEditor({ route, onDirty, onSaved }: { route: string; onDirty: () => void; onSaved: () => void }) {
  const queryClient = useQueryClient();
  const [localSections, setLocalSections] = useState<any[]>([]);

  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ["cms-page", route],
    queryFn: async () => {
      const { data } = await supabase.from("site_pages").select("*").eq("route", route).maybeSingle();
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
    if (sections) setLocalSections(sections);
  }, [sections]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      for (const section of localSections) {
        for (const field of section.section_content) {
          const { error } = await supabase
            .from("section_content")
            .update({
              value_text: field.value_text,
              link_url: field.link_url,
              media_url: field.media_url
            })
            .eq("id", field.id);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-sections", page?.id] });
      toast.success("Sayfa içeriği başarıyla güncellendi.");
      onSaved();
    },
    onError: (err) => {
      toast.error("Kaydetme sırasında hata: " + err.message);
    }
  });

  if (pageLoading || sectionsLoading) return <div className="flex items-center gap-3 text-white/40"><Loader2 className="animate-spin" /> Yükleniyor...</div>;
  if (!page) return <div className="text-white/40">Sayfa kaydı bulunamadı.</div>;

  const handleFieldChange = (sectionId: string, fieldId: string, value: any, type: 'text' | 'link' | 'media') => {
    setLocalSections(prev => (prev as any[]).map(s => {
      if (s.id !== sectionId) return s;
      return {
        ...s,
        section_content: s.section_content.map((f: any) => {
          if (f.id !== fieldId) return f;
          if (type === 'text') return { ...f, value_text: value };
          if (type === 'link') return { ...f, link_url: value };
          if (type === 'media') return { ...f, media_url: value };
          return f;
        })
      };
    }));
    onDirty();
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold">{page.internal_name} İçerik Yönetimi</h2>
          <p className="text-white/50">{route} rotasındaki tüm bölümler</p>
        </div>
        <button 
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
          className="h-11 px-6 bg-[var(--admin-yellow)] text-[var(--admin-navy)] rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[var(--admin-yellow)]/20 disabled:opacity-50"
        >
          {updateMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Değişiklikleri Yayınla
        </button>
      </div>

      <div className="space-y-8">
        {localSections.map((section) => (
          <div key={section.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-4 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5">
                  <Layout size={18} className="text-[var(--admin-yellow)]" />
                </div>
                <h3 className="font-bold text-lg">{section.internal_label}</h3>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-2 py-1 rounded bg-black/20">
                Type: {section.section_type}
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              {section.section_content.map((field: any) => (
                <div key={field.id} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    {field.field_type === 'textarea' || field.field_type === 'text' ? <Type size={14} className="text-white/40" /> : null}
                    {field.field_type === 'link' ? <LinkIcon size={14} className="text-white/40" /> : null}
                    {field.field_type === 'media' ? <ImageIcon size={14} className="text-white/40" /> : null}
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60">{field.label}</span>
                  </div>

                  {field.field_type === 'text' && (
                    <InputGroup 
                      label="" 
                      value={field.value_text || ""} 
                      onChange={(v) => handleFieldChange(section.id, field.id, v, 'text')} 
                    />
                  )}

                  {field.field_type === 'textarea' && (
                    <textarea 
                      className="w-full bg-[var(--admin-navy-deep)]/60 border border-white/10 rounded-lg p-4 text-sm min-h-[100px] focus:border-[var(--admin-yellow)]/50 outline-none transition-colors"
                      value={field.value_text || ""}
                      onChange={(e) => handleFieldChange(section.id, field.id, e.target.value, 'text')}
                    />
                  )}

                  {field.field_type === 'link' && (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <InputGroup 
                          label="Link Adresi" 
                          value={field.link_url || ""} 
                          onChange={(v) => handleFieldChange(section.id, field.id, v, 'link')} 
                        />
                      </div>
                    </div>
                  )}

                  {field.field_type === 'media' && (
                    <ImageUploadField 
                      label="" 
                      value={field.media_url || ""} 
                      onChange={(v) => handleFieldChange(section.id, field.id, v, 'media')} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2 border-l-4 border-[var(--admin-yellow)] pl-4">
      <Icon name={icon} className="text-[20px] text-[var(--admin-yellow)]" />
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
  );
}

function InputGroup({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-semibold text-white/40 uppercase ml-1">{label}</label>}
      <div className="relative group">
        <input 
          className="w-full bg-[var(--admin-navy-deep)]/60 border border-white/10 rounded-lg h-12 px-4 text-sm focus:border-[var(--admin-yellow)]/50 focus:bg-[var(--admin-navy-deep)]/80 outline-none transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
          <ChevronRight size={16} className="text-[var(--admin-yellow)]" />
        </div>
      </div>
    </div>
  );
}
