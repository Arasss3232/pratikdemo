import React from "react";
import { Icon } from "../../site-shell";

export type SeoSubTab =
  | "dashboard"
  | "general"
  | "pages"
  | "sitemap"
  | "robots"
  | "search-console"
  | "analytics"
  | "tag-manager"
  | "redirects"
  | "schema"
  | "social"
  | "favicon"
  | "audit";

interface SeoShellProps {
  currentTab: SeoSubTab;
  onTabChange: (tab: SeoSubTab) => void;
  children: React.ReactNode;
}

const SEO_NAV = [
  { id: "dashboard", label: "Kontrol Paneli", icon: "dashboard" },
  { id: "general", label: "Genel SEO Ayarları", icon: "settings" },
  { id: "pages", label: "Sayfa SEO Yönetimi", icon: "description" },
  { id: "sitemap", label: "XML Sitemap", icon: "account_tree" },
  { id: "robots", label: "Robots.txt Kuralları", icon: "smart_toy" },
  { id: "search-console", label: "Google Search Console", icon: "verified" },
  { id: "analytics", label: "Google Analytics 4", icon: "analytics" },
  { id: "tag-manager", label: "Google Tag Manager", icon: "code" },
  { id: "redirects", label: "301 Yönlendirmeleri", icon: "swap_calls" },
  { id: "schema", label: "Schema Yapılandırılmış Veri", icon: "schema" },
  { id: "social", label: "Sosyal Medya & OG", icon: "share" },
  { id: "favicon", label: "Favicon & Site Kimliği", icon: "image" },
  { id: "audit", label: "SEO Denetimi", icon: "find_in_page" },
];


export function SeoShell({ currentTab, onTabChange, children }: SeoShellProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[600px]">
      {/* Sidebar Nav */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div 
          className="admin-card overflow-hidden sticky top-6"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        >
          <div className="p-4 border-b bg-muted/30" style={{ borderColor: "var(--admin-border)" }}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">SEO Yönetimi</h3>
          </div>
          <nav className="p-2 flex flex-col gap-1">
            {SEO_NAV.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id as SeoSubTab)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all text-left w-full group relative ${
                    isActive 
                      ? "bg-[var(--admin-yellow-soft)] text-[var(--admin-navy)] font-bold shadow-sm" 
                      : "hover:bg-muted/50 text-muted-foreground"
                  }`}

                >
                  <Icon name={item.icon} className="text-lg" />
                  <span>{item.label}</span>
                  {isActive && <div className="ml-auto w-1 h-5 rounded-full" style={{ background: "var(--admin-navy)" }} />}

                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow min-w-0">
        <div 
          className="admin-card p-6 md:p-8 min-h-full"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
