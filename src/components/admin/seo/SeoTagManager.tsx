import { useState } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Icon } from "../../site-shell";

export function SeoTagManager() {
  const { settings, refresh } = useSiteSettings();
  const [gtmId, setGtmId] = useState(settings?.google_tag_manager_id || "");
  const [isActive, setIsActive] = useState(settings?.gtm_active || false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ 
        google_tag_manager_id: gtmId,
        gtm_active: isActive 
      })
      .eq("id", true);

    if (error) {
      toast.error("Kaydedilemedi: " + error.message);
    } else {
      toast.success("GTM ayarları güncellendi.");
      refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Google Tag Manager (GTM)</h2>
        <p className="text-sm text-muted-foreground">Etiketleri yönetmek için GTM Container ID'nizi girin.</p>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b bg-muted/30 font-medium">GTM Yapılandırması</div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Container ID</label>
            <input 
              placeholder="GTM-XXXXXXX"
              value={gtmId}
              onChange={(e) => setGtmId(e.target.value)}
              className="w-full max-w-md p-2 rounded border focus:ring-2 focus:ring-[var(--admin-yellow)] focus:outline-none"
            />
            <p className="text-xs text-muted-foreground">Örn: GTM-ABC1234</p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border">
            <input 
              type="checkbox"
              id="gtm-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--admin-navy)] focus:ring-[var(--admin-yellow)]"
            />
            <label htmlFor="gtm-active" className="text-sm font-medium cursor-pointer">
              GTM Konteynerını Aktifleştir
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

      <div className="p-4 rounded-xl border bg-amber-50 border-amber-100 flex gap-3">
        <Icon name="warning" className="text-amber-500" />
        <div className="text-xs text-amber-800 leading-relaxed">
          <strong>Dikkat:</strong> Hem GA4 hem de GTM kullanıyorsanız, çift ölçümü önlemek için 
          Analytics izlemesini GTM içinden veya doğrudan Analytics panelinden 
          kontrol ettiğinizden emin olun.
        </div>
      </div>
    </div>
  );
}
