import { useState } from "react";
import { Icon } from "../../site-shell";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ContentTab = 
  | "general" | "home" | "header" | "footer" | "pages" 
  | "legal" | "messages" | "navigation" | "history";

export function ContentManagement() {
  const [activeTab, setActiveTab] = useState<ContentTab>("general");

  return (
    <div className="flex flex-col h-full bg-[var(--admin-navy-deep)] text-white">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[var(--admin-surface)]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[var(--admin-yellow-soft)] flex items-center justify-center text-[var(--admin-navy)]">
            <Icon name="edit_note" className="text-[24px]" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Site İçerik Yönetimi</h1>
            <p className="text-sm text-white/60">Sitenizdeki tüm metin ve görselleri yönetin</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="admin-btn h-9 px-4 bg-white/5 hover:bg-white/10 text-sm">
            Taslakları Önizle
          </button>
          <button className="admin-btn-accent h-9 px-4 text-sm font-bold">
            Değişiklikleri Yayınla
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-64 border-r border-white/5 bg-[var(--admin-navy-deep)]/50 p-4 space-y-1 overflow-y-auto">
          <NavItem active={activeTab === "general"} icon="settings" label="Genel İçerikler" onClick={() => setActiveTab("general")} />
          <NavItem active={activeTab === "home"} icon="home" label="Ana Sayfa" onClick={() => setActiveTab("home")} />
          <NavItem active={activeTab === "header"} icon="ad_units" label="Header & Üst Bar" onClick={() => setActiveTab("header")} />
          <NavItem active={activeTab === "pages"} icon="auto_stories" label="Sayfalar" onClick={() => setActiveTab("pages")} />
          <NavItem active={activeTab === "navigation"} icon="menu" label="Menü & Navigasyon" onClick={() => setActiveTab("navigation")} />
          <NavItem active={activeTab === "footer"} icon="bottom_panel_open" label="Footer" onClick={() => setActiveTab("footer")} />
          <NavItem active={activeTab === "legal"} icon="gavel" label="Yasal Sayfalar" onClick={() => setActiveTab("legal")} />
          <NavItem active={activeTab === "messages"} icon="chat_bubble" label="Sistem Mesajları" onClick={() => setActiveTab("messages")} />
          <div className="pt-4 border-t border-white/5 mt-4">
            <NavItem active={activeTab === "history"} icon="history" label="İçerik Geçmişi" onClick={() => setActiveTab("history")} />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[var(--admin-surface)]">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "home" && <HomeSettings />}
          {/* Diğerleri sırayla eklenecek */}
          {activeTab !== "general" && activeTab !== "home" && (
            <div className="flex flex-col items-center justify-center h-64 text-white/40">
              <Icon name="construction" className="text-[48px] mb-4" />
              <p>Bu modül yapılandırılıyor...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ active, icon, label, onClick }: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active 
          ? "bg-[var(--admin-yellow)] text-[var(--admin-navy)] shadow-lg shadow-[var(--admin-yellow)]/20" 
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon name={icon} className="text-[20px]" />
      {label}
    </button>
  );
}

function GeneralSettings() {
  const { data: settings, refetch } = useQuery({
    queryKey: ["site-settings-cms"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").single();
      return data;
    }
  });

  const updateSetting = async (field: string, value: string) => {
    if (!settings) return;
    const { error } = await supabase
      .from("site_settings")
      .update({ [field]: value } as any)
      .match({ company_name: settings.company_name });
    
    if (error) {
      console.error("Update error:", error);
    } else {
      refetch();
    }
  };


  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Icon name="business" className="text-[var(--admin-yellow)]" />
          Şirket Bilgileri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Şirket Adı" value={settings?.company_name || ""} onChange={(v) => updateSetting("company_name", v)} />
          <InputGroup label="Kısa Tanıtım" value={settings?.description || ""} onChange={(v) => updateSetting("description", v)} />
          <InputGroup label="Telefon" value={settings?.phone || ""} onChange={(v) => updateSetting("phone", v)} />
          <InputGroup label="WhatsApp" value={settings?.whatsapp || ""} onChange={(v) => updateSetting("whatsapp", v)} />
          <div className="md:col-span-2">
            <InputGroup label="Adres" value={settings?.address || ""} type="textarea" onChange={(v) => updateSetting("address", v)} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2 border-t border-white/5 pt-8">
          <Icon name="schedule" className="text-[var(--admin-yellow)]" />
          Çalışma Saatleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Çalışma Saatleri Metni" value={settings?.working_hours || ""} onChange={(v) => updateSetting("working_hours", v)} />
        </div>
      </section>
    </div>
  );
}


function HomeSettings() {
  const { data: page } = useQuery({
    queryKey: ["cms-page", "/"],
    queryFn: async () => {
      const { data } = await supabase.from("site_pages").select("*").eq("route", "/").single();
      return data;
    }
  });

  const { data: sections, refetch } = useQuery({
    queryKey: ["cms-sections", page?.id],
    enabled: !!page?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("page_sections")
        .select(`
          *,
          section_content (*)
        `)
        .eq("page_id", page!.id)
        .order("display_order");
      return data;
    }
  });

  const [editingSection, setEditingSection] = useState<any>(null);

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Icon name="layers" className="text-[var(--admin-yellow)]" />
          Ana Sayfa Bölümleri
        </h2>
        <button className="admin-btn h-8 px-3 bg-[var(--admin-yellow)] text-[var(--admin-navy)] text-xs font-bold">
          <Icon name="add" className="text-[16px]" />
          Bölüm Ekle
        </button>
      </div>

      <div className="space-y-4">
        {sections?.map((s: any) => (
          <SectionRow 
            key={s.id} 
            label={s.internal_label} 
            status={s.is_active ? "Yayında" : "Taslak"} 
            type={s.section_type} 
            onClick={() => setEditingSection(s)}
          />
        ))}
        {(!sections || sections.length === 0) && (
          <p className="text-white/40 text-center py-8">Henüz bölüm eklenmemiş.</p>
        )}
      </div>

      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--admin-surface)] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold">{editingSection.internal_label} - Düzenle</h3>
              <button onClick={() => setEditingSection(null)} className="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center">
                <Icon name="close" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              {editingSection.section_content?.map((field: any) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">{field.label || field.field_key}</label>
                  {field.field_type === 'text' ? (
                    <textarea 
                      className="w-full bg-[var(--admin-navy-deep)]/60 border border-white/10 rounded-lg p-4 text-sm focus:outline-none focus:border-[var(--admin-yellow)]/50 min-h-[100px]"
                      defaultValue={field.value_text}
                      onBlur={async (e) => {
                        await supabase
                          .from("section_content")
                          .update({ value_text: e.target.value })
                          .eq("id", field.id);
                        refetch();
                      }}
                    />
                  ) : (
                    <input 
                      className="w-full bg-[var(--admin-navy-deep)]/60 border border-white/10 rounded-lg h-11 px-4 text-sm focus:outline-none focus:border-[var(--admin-yellow)]/50"
                      defaultValue={field.link_url || field.media_url || field.value_text}
                      onBlur={async (e) => {
                        const update: any = {};
                        if (field.field_type === 'url') update.link_url = e.target.value;
                        else if (field.field_type === 'image') update.media_url = e.target.value;
                        else update.value_text = e.target.value;
                        
                        await supabase
                          .from("section_content")
                          .update(update)
                          .eq("id", field.id);
                        refetch();
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
              <button onClick={() => setEditingSection(null)} className="admin-btn-accent px-6 h-10 font-bold">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionRow({ label, status, type, onClick }: { label: string; status: string; type: string; onClick: () => void }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--admin-navy-deep)]/40 border border-white/5 hover:border-[var(--admin-yellow)]/30 transition-all group">

      <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-[var(--admin-yellow)] transition-colors">
        <Icon name="drag_indicator" className="cursor-move" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{label}</h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 uppercase">{status}</span>
        </div>
        <p className="text-xs text-white/40 mt-0.5">Tip: {type}</p>
      </div>
      <div className="flex items-center gap-2">
        <button className="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60">
          <Icon name="visibility" className="text-[18px]" />
        </button>
        <button onClick={onClick} className="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60">
          <Icon name="edit" className="text-[18px]" />
        </button>
      </div>

    </div>
  );
}

function InputGroup({ label, value, type = "text", onChange }: { label: string; value: string; type?: "text" | "textarea"; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</label>
      {type === "text" ? (
        <input 
          className="w-full bg-[var(--admin-navy-deep)]/60 border border-white/10 rounded-lg h-11 px-4 text-sm focus:outline-none focus:border-[var(--admin-yellow)]/50 transition-all"
          defaultValue={value}
          onBlur={(e) => onChange(e.target.value)}
        />
      ) : (
        <textarea 
          className="w-full bg-[var(--admin-navy-deep)]/60 border border-white/10 rounded-lg min-h-[100px] p-4 text-sm focus:outline-none focus:border-[var(--admin-yellow)]/50 transition-all"
          defaultValue={value}
          onBlur={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

