import { useState } from "react";
import { Icon } from "../../site-shell";
import { ContentEditorPanel } from "./ContentEditorPanel";
import { SettingsPanel } from "./SettingsPanel";
import { NavigationPanel } from "./NavigationPanel";
import { HistoryPanel } from "./HistoryPanel";

type NavItemType = {
  id: string;
  label: string;
  icon: string;
  category: "Global" | "Sayfalar" | "Sistem";
  component: "content" | "settings" | "nav" | "placeholder" | "history";
};

const NAV_ITEMS: NavItemType[] = [
  { id: "global_settings", label: "Genel İçerikler", icon: "settings", category: "Global", component: "settings" },
  { id: "top_bar", label: "Üst Bilgi Çubuğu", icon: "menu", category: "Global", component: "nav" },
  { id: "header_nav", label: "Header ve Navigasyon", icon: "ad_units", category: "Global", component: "nav" },
  { id: "footer", label: "Footer", icon: "view_agenda", category: "Global", component: "nav" },
  
  { id: "/", label: "Ana Sayfa", icon: "home", category: "Sayfalar", component: "content" },
  { id: "/kurumsal", label: "Kurumsal Sayfası", icon: "info", category: "Sayfalar", component: "content" },
  { id: "/urunler", label: "Ürün Kategorileri Sayfası", icon: "category", category: "Sayfalar", component: "content" },
  { id: "/kataloglar", label: "Kataloglar Sayfası", icon: "menu_book", category: "Sayfalar", component: "content" },
  { id: "/bayiliklerimiz", label: "Bayiliklerimiz Sayfası", icon: "workspace_premium", category: "Sayfalar", component: "content" },
  { id: "/teklif", label: "Teklif Talep Sayfası", icon: "request_quote", category: "Sayfalar", component: "content" },
  { id: "/iletisim", label: "İletişim Sayfası", icon: "contact_support", category: "Sayfalar", component: "content" },
  { id: "/kvkk", label: "Yasal Sayfalar", icon: "gavel", category: "Sayfalar", component: "content" },
  
  { id: "/sistem", label: "Sistem Mesajları", icon: "display_settings", category: "Sistem", component: "content" },
  { id: "history", label: "İçerik Geçmişi", icon: "history", category: "Sistem", component: "history" },
];

export function ContentManagement() {
  const [activeId, setActiveId] = useState(NAV_ITEMS[0].id);
  const activeItem = NAV_ITEMS.find(i => i.id === activeId)!;

  return (
    <div className="flex h-[800px] bg-[var(--admin-surface)] rounded-2xl border border-white/5 overflow-hidden">
      {/* 1. Sidebar (Left) */}
      <div className="w-72 border-r border-white/5 bg-[var(--admin-navy-deep)]/50 p-4 space-y-6 overflow-y-auto admin-sidebar-scroll">
        <div className="flex items-center gap-3 px-3 mb-6">
          <div className="h-8 w-8 rounded-lg bg-[var(--admin-yellow)] flex items-center justify-center text-[var(--admin-navy)]">
            <Icon name="edit_note" className="text-[20px]" />
          </div>
          <span className="font-bold text-sm tracking-wide">CMS YÖNETİMİ</span>
        </div>

        {["Global", "Sayfalar", "Sistem"].map(cat => (
          <div key={cat} className="mb-6">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">{cat}</h3>
            <div className="space-y-1">
              {NAV_ITEMS.filter(i => i.category === cat).map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    activeId === item.id 
                      ? "bg-[var(--admin-yellow)] text-[var(--admin-navy)] shadow-lg shadow-[var(--admin-yellow)]/10" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon name={item.icon} className={`text-[20px] ${activeId === item.id ? "" : "group-hover:scale-110"}`} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 2 & 3. Main Area (Editor & Actions are merged into the panel but structured) */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
        <div className="flex-1 overflow-y-auto p-8 admin-sidebar-scroll">
          {activeItem.component === "content" && <ContentEditorPanel route={activeItem.id} />}
          {activeItem.component === "settings" && <SettingsPanel />}
          {activeItem.component === "nav" && <NavigationPanel type={activeItem.id} />}
          {activeItem.component === "history" && <HistoryPanel />}
          {activeItem.component === "placeholder" && (
            <div className="h-full flex items-center justify-center text-white/20">
              <div className="text-center">
                <Icon name="construction" className="text-[64px] mb-4" />
                <p>Yakında aktif olacak</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
