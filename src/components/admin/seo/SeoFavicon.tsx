import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Icon } from "../../site-shell";

export function SeoFavicon() {
  const settings = useSiteSettings();
  const [faviconUrl, setFaviconUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settings) {
      setFaviconUrl(settings.favicon_url || "");
    }
  }, [settings]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ favicon_url: faviconUrl } as any)
      .eq("id", true);

    if (error) {
      toast.error("Kaydedilemedi: " + error.message);
    } else {
      toast.success("Favicon ayarları güncellendi.");
      settings.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold">Favicon & Site Kimliği</h2>
        <p className="text-sm text-muted-foreground">Tarayıcı sekmelerinde ve mobil ana ekranlarda görünen ikonları yönetin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="admin-card overflow-hidden">
          <div className="p-4 border-b bg-muted/30 font-medium">Favicon Kaynağı</div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Favicon URL (.ico veya .png)</label>
              <div className="flex gap-2">
                <input 
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  className="admin-input flex-grow"
                  placeholder="https://.../favicon.png"
                />
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 rounded bg-[var(--admin-navy)] text-white text-sm"
                >
                  Girişi Kaydet
                </button>
              </div>
            </div>
            
            <div className="p-4 rounded border border-dashed bg-muted/5 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded border bg-white flex items-center justify-center overflow-hidden">
                {faviconUrl ? (
                  <img src={faviconUrl} alt="Favicon Önizleme" className="w-8 h-8 object-contain" />
                ) : (
                  <Icon name="image" className="text-3xl text-muted-foreground" />
                )}
              </div>
              <span className="text-xs text-muted-foreground">Önizleme (32x32)</span>
            </div>
          </div>
        </div>

        <div className="admin-card overflow-hidden">
          <div className="p-4 border-b bg-muted/30 font-medium text-[var(--admin-navy)]">Favicon Doğrulama</div>
          <div className="p-6 space-y-3">
            {[
              { label: "favicon.ico", status: !!faviconUrl },
              { label: "apple-touch-icon.png (180x180)", status: !!faviconUrl },
              { label: "android-chrome-192x192.png", status: !!faviconUrl },
              { label: "site.webmanifest", status: !!faviconUrl }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-xs font-medium">{item.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${item.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.status ? 'Hazır' : 'Eksik'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 flex gap-3">
        <Icon name="lightbulb" className="text-amber-500" />
        <div className="text-xs text-amber-800 leading-relaxed">
          <strong>Öneri:</strong> En iyi sonuçlar için 512x512 boyutunda kare bir PNG dosyası yükleyin. 
          Sistem bu dosyayı otomatik olarak farklı cihazlar için optimize eder.
        </div>
      </div>
    </div>
  );
}
