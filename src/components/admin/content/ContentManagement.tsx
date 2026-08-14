import { useState } from "react";
import { Icon } from "../../site-shell";
import { ContentEditorPanel } from "./ContentEditorPanel";

/**
 * Main Shell for Site Content Management.
 * Manages the sidebar navigation and passes the active section to the editor.
 */
type NavItemType = {
  id: string;
  label: string;
  icon: string;
  category: "Genel" | "Sayfalar";
  pageSection: string; // The Supabase page_section identifier
};

const NAV_ITEMS: NavItemType[] = [
  // Global sections
  { id: "top_bar", label: "Üst Bilgi Çubuğu", icon: "vertical_align_top", category: "Genel", pageSection: "top_bar" },
  { id: "header", label: "Header ve Navigasyon", icon: "ad_units", category: "Genel", pageSection: "header" },
  { id: "footer", label: "Footer Kimliği", icon: "view_agenda", category: "Genel", pageSection: "footer" },
  
  // Page sections
  { id: "home", label: "Ana Sayfa", icon: "home", category: "Sayfalar", pageSection: "hero" },
  { id: "corporate", label: "Kurumsal Sayfası", icon: "info", category: "Sayfalar", pageSection: "corporate" },
  { id: "products", label: "Ürünler Sayfası", icon: "category", category: "Sayfalar", pageSection: "products" },
  { id: "catalogs", label: "Kataloglar Sayfası", icon: "menu_book", category: "Sayfalar", pageSection: "catalogs" },
  { id: "dealerships", label: "Bayiliklerimiz Sayfası", icon: "handshake", category: "Sayfalar", pageSection: "dealerships" },
  { id: "contact", label: "İletişim Sayfası", icon: "contact_support", category: "Sayfalar", pageSection: "contact" },
];

export function ContentManagement() {
  const [activeId, setActiveId] = useState(NAV_ITEMS[0].id);
  const activeItem = NAV_ITEMS.find(i => i.id === activeId)!;

  return (
    <div className="flex h-[800px] bg-[var(--admin-surface)] rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      {/* 1. SIDEBAR: Section Navigation */}
      <div className="w-72 border-r border-white/5 bg-[var(--admin-navy-deep)]/50 p-6 space-y-8 overflow-y-auto admin-sidebar-scroll">
        <div className="flex items-center gap-3 px-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-[var(--admin-yellow)] flex items-center justify-center text-[var(--admin-navy)] shadow-lg shadow-[var(--admin-yellow)]/20">
            <Icon name="edit_note" className="text-[24px]" />
          </div>
          <div>
            <span className="block font-bold text-sm tracking-wide">İÇERİK YÖNETİMİ</span>
            <span className="block text-[10px] text-white/30 uppercase tracking-widest font-bold">CMS Dashboard</span>
          </div>
        </div>

        {["Genel", "Sayfalar"].map(cat => (
          <div key={cat} className="space-y-3">
            <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{cat}</h3>
            <div className="space-y-1">
              {NAV_ITEMS.filter(i => i.category === cat).map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    activeId === item.id 
                      ? "bg-[var(--admin-yellow)] text-[var(--admin-navy)] shadow-lg shadow-[var(--admin-yellow)]/10" 
                      : "text-white/50 hover:text-white hover:bg-white/5"
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

      {/* 2. MAIN CONTENT: The Dynamic Editor Panel */}
      <div className="flex-1 flex flex-col overflow-hidden bg-black/10">
        <ContentEditorPanel 
          key={activeItem.pageSection} // Reset state when switching sections
          pageSection={activeItem.pageSection} 
        />
      </div>
    </div>
  );
}
