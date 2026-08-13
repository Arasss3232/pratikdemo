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
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Icon name="business" className="text-[var(--admin-yellow)]" />
          Şirket Bilgileri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Şirket Adı" value="Pratik Tedarik Yapı" />
          <InputGroup label="Kısa Tanıtım" value="Endüstriyel Alım ve Tedarik Çözümleri" />
          <InputGroup label="Telefon" value="+90 262 123 45 67" />
          <InputGroup label="WhatsApp" value="+90 532 123 45 67" />
          <div className="md:col-span-2">
            <InputGroup label="Adres" value="Gebze Organize Sanayi Bölgesi, No: 123, Gebze/Kocaeli" type="textarea" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2 border-t border-white/5 pt-8">
          <Icon name="schedule" className="text-[var(--admin-yellow)]" />
          Çalışma Saatleri
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputGroup label="Hafta İçi" value="09:00 - 18:00" />
          <InputGroup label="Cumartesi" value="09:00 - 13:00" />
        </div>
      </section>
    </div>
  );
}

function HomeSettings() {
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
        <SectionRow label="Hero Slider (Broşürler)" status="Yayında" type="Slider" />
        <SectionRow label="Giriş Metni (HomeHero)" status="Yayında" type="Text" />
        <SectionRow label="Ürün Kategori Kaşifi" status="Yayında" type="Grid" />
        <SectionRow label="Kurumsal Değerler" status="Yayında" type="Features" />
        <SectionRow label="Sektörel Çözümler" status="Yayında" type="Tabs" />
      </div>
    </div>
  );
}

function SectionRow({ label, status, type }: { label: string; status: string; type: string }) {
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
        <button className="h-8 w-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/60">
          <Icon name="edit" className="text-[18px]" />
        </button>
      </div>
    </div>
  );
}

function InputGroup({ label, value, type = "text" }: { label: string; value: string; type?: "text" | "textarea" }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</label>
      {type === "text" ? (
        <input 
          className="w-full bg-[var(--admin-navy-deep)]/60 border border-white/10 rounded-lg h-11 px-4 text-sm focus:outline-none focus:border-[var(--admin-yellow)]/50 transition-all"
          defaultValue={value}
        />
      ) : (
        <textarea 
          className="w-full bg-[var(--admin-navy-deep)]/60 border border-white/10 rounded-lg min-h-[100px] p-4 text-sm focus:outline-none focus:border-[var(--admin-yellow)]/50 transition-all"
          defaultValue={value}
        />
      )}
    </div>
  );
}
