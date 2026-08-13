import { useEffect, useState } from "react";
import { Icon } from "../site-shell";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "../PageHeader";
import { SeoDashboard } from "../seo/SeoDashboard";
import { SeoGeneralSettings } from "../seo/SeoGeneralSettings";
import { SeoPageManagement } from "../seo/SeoPageManagement";
import { SeoTools } from "../seo/SeoTools";

export function ControlCenter({ onNavigate }: { onNavigate: (t: any) => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "general" | "pages" | "tools">("overview");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader 
        tab="seo" 
        title="SEO Yönetimi" 
        description="Sitenizin arama motoru görünürlüğünü ve teknik SEO sağlığını buradan yönetin."
      />
      
      <div className="flex items-center gap-2 p-1 rounded-xl bg-[color:var(--admin-surface-2)] w-fit mb-2">
        <button 
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-[color:var(--admin-navy)]' : 'text-[color:var(--admin-text-2)] hover:text-[color:var(--admin-text)]'}`}
        >
          Genel Bakış
        </button>
        <button 
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'general' ? 'bg-white shadow-sm text-[color:var(--admin-navy)]' : 'text-[color:var(--admin-text-2)] hover:text-[color:var(--admin-text)]'}`}
        >
          Genel Ayarlar
        </button>
        <button 
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pages' ? 'bg-white shadow-sm text-[color:var(--admin-navy)]' : 'text-[color:var(--admin-text-2)] hover:text-[color:var(--admin-text)]'}`}
        >
          Sayfalar
        </button>
        <button 
          onClick={() => setActiveTab("tools")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'tools' ? 'bg-white shadow-sm text-[color:var(--admin-navy)]' : 'text-[color:var(--admin-text-2)] hover:text-[color:var(--admin-text)]'}`}
        >
          Araçlar
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "overview" && <SeoDashboard onNavigate={onNavigate} />}
        {activeTab === "general" && <SeoGeneralSettings />}
        {activeTab === "pages" && <SeoPageManagement />}
        {activeTab === "tools" && <SeoTools />}
      </div>
    </div>
  );
}
