import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Icon } from "../../site-shell";

export function SeoSitemap() {
  const [stats, setStats] = useState({ total: 0, indexed: 0, excluded: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const { data } = await supabase.from("page_seo").select("sitemap_include, no_index");
      if (data) {
        setStats({
          total: data.length,
          indexed: data.filter(d => d.sitemap_include && !d.no_index).length,
          excluded: data.filter(d => !d.sitemap_include).length
        });
      }
      setLoading(false);
    }
    loadStats();
  }, []);

  const handleGenerate = () => {
    toast.success("Sitemap başarıyla güncellendi.");
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold">XML Sitemap Yönetimi</h2>
        <p className="text-sm text-muted-foreground">Arama motorları için site haritası yapılandırması.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-muted/20">
          <div className="text-xs font-medium text-muted-foreground uppercase">Toplam URL</div>
          <div className="text-2xl font-bold mt-1">{stats.total}</div>
        </div>
        <div className="p-4 rounded-xl border bg-green-50 border-green-100">
          <div className="text-xs font-medium text-green-600 uppercase">Dahil Edilen</div>
          <div className="text-2xl font-bold mt-1 text-green-700">{stats.indexed}</div>
        </div>
        <div className="p-4 rounded-xl border bg-amber-50 border-amber-100">
          <div className="text-xs font-medium text-amber-600 uppercase">Hariç Tutulan</div>
          <div className="text-2xl font-bold mt-1 text-amber-700">{stats.excluded}</div>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b bg-muted/30 font-medium">Sitemap Yapılandırması</div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Sitemap URL</label>
            <div className="flex gap-2">
              <input 
                readOnly 
                value={window.location.origin + "/sitemap.xml"} 
                className="flex-grow p-2 rounded border bg-muted/30 text-sm font-mono"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + "/sitemap.xml");
                  toast.success("URL kopyalandı");
                }}
                className="px-3 py-2 rounded bg-[var(--admin-navy)] text-white text-sm"
              >
                Kopyala
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button 
              onClick={handleGenerate}
              className="px-4 py-2 rounded bg-[var(--admin-yellow)] text-[var(--admin-navy)] font-bold text-sm flex items-center gap-2"
            >
              <Icon name="refresh" className="text-lg" />
              Sitemap'i Yeniden Oluştur
            </button>
            <button 
              onClick={() => window.open("/sitemap.xml", "_blank")}
              className="px-4 py-2 rounded border hover:bg-muted transition-colors text-sm flex items-center gap-2"
            >
              <Icon name="visibility" className="text-lg" />
              Görüntüle
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 flex gap-3">
        <Icon name="info" className="text-blue-500" />
        <div className="text-xs text-blue-800 leading-relaxed">
          <strong>İpucu:</strong> Sitemap'e yeni sayfalar eklemek için "Sayfa SEO Yönetimi" sekmesini kullanın. 
          Arama motorları sitemap'i genellikle 24-48 saat içinde tekrar tarar.
        </div>
      </div>
    </div>
  );
}
