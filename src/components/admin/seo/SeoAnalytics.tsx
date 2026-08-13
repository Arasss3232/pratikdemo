import { useState } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Icon } from "../../site-shell";

export function SeoAnalytics() {
  const settings = useSiteSettings();
  const [ga4Id, setGa4Id] = useState(settings?.ga4_id || "");
  const [isActive, setIsActive] = useState(settings?.ga4_active || false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ 
        ga4_id: ga4Id,
        ga4_active: isActive 
      })
      .eq("id", true);

    if (error) {
      toast.error("Kaydedilemedi: " + error.message);
    } else {
      toast.success("GA4 ayarları güncellendi.");
      settings.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Google Analytics 4 (GA4)</h2>
        <p className="text-sm text-muted-foreground">Site trafiğinizi ölçmek için GA4 Measurement ID'nizi girin.</p>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b bg-muted/30 font-medium">GA4 Yapılandırması</div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Measurement ID</label>
            <input 
              placeholder="G-XXXXXXXXXX"
              value={ga4Id}
              onChange={(e) => setGa4Id(e.target.value)}
              className="w-full max-w-md p-2 rounded border focus:ring-2 focus:ring-[var(--admin-yellow)] focus:outline-none"
            />
            <p className="text-xs text-muted-foreground">Örn: G-1234567890</p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border">
            <input 
              type="checkbox"
              id="ga4-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--admin-navy)] focus:ring-[var(--admin-yellow)]"
            />
            <label htmlFor="ga4-active" className="text-sm font-medium cursor-pointer">
              GA4 İzlemeyi Aktifleştir
            </label>
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

      <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex gap-3">
        <Icon name="help" className="text-blue-500" />
        <div className="text-xs text-blue-800 leading-relaxed">
          <strong>Yardım:</strong> GA4 kodunu almak için Google Analytics panelinde Yönetici &gt; Veri Akışları &gt; Web Akışı yolunu izleyin. 
          Measurement ID girilmediği sürece herhangi bir izleme kodu yüklenmez.
        </div>
      </div>
    </div>
  );
}
