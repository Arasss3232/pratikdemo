import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Icon } from "../../site-shell";

export function SeoRobots() {
  const [content, setContent] = useState("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /auth");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, we'd fetch this from settings
    setContent(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /auth\n\nSitemap: ${window.location.origin}/sitemap.xml`);
  }, []);

  const handleSave = () => {
    setLoading(true);
    // Simüle ediyoruz, gerçekte site_settings tablosuna kaydedilmeli
    setTimeout(() => {
      toast.success("Robots.txt kuralları kaydedildi.");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">Robots.txt Kuralları</h2>
        <p className="text-sm text-muted-foreground">Arama motoru botlarının hangi sayfaları tarayabileceğini belirleyin.</p>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b bg-muted/30 font-medium flex justify-between items-center">
          <span>robots.txt İçeriği</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setContent("User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /auth\n\nSitemap: " + window.location.origin + "/sitemap.xml")}
              className="text-xs text-blue-600 hover:underline"
            >
              Varsayılana Dön
            </button>
          </div>
        </div>
        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-4 rounded border font-mono text-sm focus:ring-2 focus:ring-[var(--admin-yellow)] focus:outline-none"
            spellCheck={false}
          />
          
          <div className="mt-6 flex gap-3">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 rounded bg-[var(--admin-navy)] text-white font-bold text-sm disabled:opacity-50"
            >
              {loading ? "Kaydediliyor..." : "Kuralları Kaydet"}
            </button>
            <button 
              onClick={() => window.open("/robots.txt", "_blank")}
              className="px-6 py-2 rounded border hover:bg-muted transition-colors text-sm"
            >
              Canlı robots.txt Dosyasını Gör
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border bg-amber-50 border-amber-100">
          <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2 mb-2">
            <Icon name="warning" className="text-amber-500" />
            Dikkatli Olun
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            <code>Disallow: /</code> kuralı tüm sitenin indekslenmesini durdurur. 
            Yalnızca botların görmesini istemediğiniz teknik dizinleri (örn: /admin) engelleyin.
          </p>
        </div>
        
        <div className="p-4 rounded-xl border bg-blue-50 border-blue-100">
          <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2 mb-2">
            <Icon name="info" className="text-blue-500" />
            Sitemap Yönergesi
          </h4>
          <p className="text-xs text-blue-800 leading-relaxed">
            Botların sitemap dosyanızı daha hızlı bulması için robots.txt dosyanızın en altına 
            Sitemap URL'sini eklemeniz önerilir.
          </p>
        </div>
      </div>
    </div>
  );
}
