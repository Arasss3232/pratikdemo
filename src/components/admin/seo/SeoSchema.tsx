import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Icon } from "../../site-shell";

export function SeoSchema() {
  const settings = useSiteSettings();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      setIsActive(settings.schema_active || false);
    }
  }, [settings]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ schema_active: isActive } as any)
      .eq("id", true);

    if (error) {
      toast.error("Kaydedilemedi: " + error.message);
    } else {
      toast.success("Schema ayarları güncellendi.");
      settings.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Schema Yapılandırılmış Veri</h2>
        <p className="text-sm text-muted-foreground">Google Arama sonuçlarında zengin snippet'ler için JSON-LD yapılandırması.</p>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b bg-muted/30 font-medium">Genel Schema Ayarları</div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border">
            <input 
              type="checkbox"
              id="schema-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--admin-navy)] focus:ring-[var(--admin-yellow)]"
            />
            <label htmlFor="schema-active" className="text-sm font-medium cursor-pointer">
              JSON-LD Schema Çıktısını Aktifleştir
            </label>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold">Desteklenen Türler</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["Organization", "WebSite", "BreadcrumbList", "LocalBusiness", "ContactPage"].map(type => (
                <div key={type} className="flex items-center gap-2 px-3 py-2 rounded border bg-muted/10 text-xs">
                  <Icon name="check_circle" className="text-green-500" />
                  {type}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 rounded bg-[var(--admin-navy)] text-white font-bold text-sm disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="p-4 border-b bg-muted/30 font-medium">JSON-LD Önizleme</div>
        <div className="p-6 bg-slate-900 rounded-b-xl overflow-x-auto">
          <pre className="text-[11px] text-blue-300 font-mono leading-relaxed">
{`{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${settings.company_name || 'Pratik Tedarik Yapı'}",
  "url": "${settings.site_url || 'https://pratiktedarikyapi.com'}",
  "logo": "${settings.logo_url || ''}",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "${settings.phone || ''}",
    "contactType": "customer service"
  }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
