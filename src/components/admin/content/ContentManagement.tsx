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
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-white/5 bg-[var(--admin-navy-deep)]/50 p-4 space-y-1 overflow-y-auto">
          <NavItem active={activeTab === "general"} icon="settings" label="Genel İçerikler" onClick={() => setActiveTab("general")} />
          <NavItem active={activeTab === "home"} icon="home" label="Ana Sayfa" onClick={() => setActiveTab("home")} />
          <NavItem active={activeTab === "header"} icon="ad_units" label="Header & Üst Bar" onClick={() => setActiveTab("header")} />
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-[var(--admin-surface)]">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "home" && <HomeSettings />}
          {activeTab !== "general" && activeTab !== "home" && (
            <div className="flex flex-col items-center justify-center h-64 text-white/40">
              <Icon name="construction" className="text-[48px] mb-4" />
              <p>Bu modül yakında eklenecek.</p>
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
          ? "bg-[var(--admin-yellow)] text-[var(--admin-navy)]" 
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon name={icon} className="text-[20px]" />
      {label}
    </button>
  );
}

function GeneralSettings() {
  const { data: settings, refetch, isLoading } = useQuery({
    queryKey: ["site-settings-cms"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("*").maybeSingle();
      return data;
    }
  });

  if (isLoading) return <div className="text-white/40">Yükleniyor...</div>;
  if (!settings) return <div className="text-white/40">Ayarlar bulunamadı.</div>;

  return (
    <div className="max-w-4xl space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">Şirket Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Şirket Adı" value={settings.company_name || ""} onChange={() => {}} />
          <InputGroup label="Telefon" value={settings.phone || ""} onChange={() => {}} />
        </div>
      </section>
    </div>
  );
}

function HomeSettings() {
  const { data: page } = useQuery({
    queryKey: ["cms-page", "/"],
    queryFn: async () => {
      const { data } = await supabase.from("site_pages").select("*").eq("route", "/").maybeSingle();
      return data;
    }
  });

  const { data: sections, refetch } = useQuery({
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

  return (
    <div className="max-w-4xl space-y-8">
      <h2 className="text-lg font-bold">Ana Sayfa Bölümleri</h2>
      {sections?.map((s: any) => (
        <div key={s.id} className="p-4 rounded-xl bg-[var(--admin-navy-deep)]/40 border border-white/5">
          <h3 className="font-semibold">{s.internal_label}</h3>
        </div>
      ))}
    </div>
  );
}

function InputGroup({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/40 uppercase">{label}</label>
      <input 
        className="w-full bg-[var(--admin-navy-deep)]/60 border border-white/10 rounded-lg h-11 px-4 text-sm"
        defaultValue={value}
      />
    </div>
  );
}
