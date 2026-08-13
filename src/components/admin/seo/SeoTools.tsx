import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Icon } from "../../site-shell";

export function SeoTools() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    id: string;
    title: string;
    status: "pass" | "warn" | "fail";
    description: string;
    fix?: string;
  }[]>([]);
  const [stats, setStats] = useState({ score: 0, checked: 0 });

  const runAudit = async () => {
    setLoading(true);
    setResults([]);
    
    // Simulate steps for UI feel
    await new Promise(r => setTimeout(r, 1200));

    try {
      const [settings, pages] = await Promise.all([
        supabase.from("site_settings").select("*").eq("id", true).single(),
        supabase.from("page_seo").select("*")
      ]);

      const auditResults: typeof results = [];
      const s = settings.data as any;

      // 1. SSL & Base URL Check
      const siteUrl = s?.site_url || "";
      if (!siteUrl) {
        auditResults.push({
          id: "site_url",
          title: "Site URL Yapılandırılmamış",
          status: "fail",
          description: "Canonical etiketleri ve sitemap için base URL tanımlanmalıdır.",
          fix: "Genel SEO Ayarları'ndan site URL'sini girin."
        });
      } else if (!siteUrl.startsWith("https")) {
        auditResults.push({
          id: "ssl",
          title: "SSL Kullanılmıyor",
          status: "warn",
          description: "Site URL'si HTTPS ile başlamıyor.",
          fix: "URL'yi HTTPS olarak güncelleyin."
        });
      } else {
        auditResults.push({
          id: "ssl",
          title: "Güvenli Bağlantı (HTTPS)",
          status: "pass",
          description: "Siteniz HTTPS üzerinden hizmet veriyor."
        });
      }

      // 2. Indexing Check
      if (s?.is_indexing_enabled === false) {
        auditResults.push({
          id: "indexing",
          title: "İndeksleme Devre Dışı",
          status: "fail",
          description: "Robots.txt tüm arama motorlarını engelliyor.",
          fix: "Genel SEO Ayarları'ndan indekslemeyi açın."
        });
      } else {
        auditResults.push({
          id: "indexing",
          title: "İndeksleme Açık",
          status: "pass",
          description: "Arama motorlarının siteyi taramasına izin veriliyor."
        });
      }

      // 3. Analytics & GTM
      if (!s?.ga4_active || !s?.ga4_id) {
        auditResults.push({
          id: "analytics",
          title: "Google Analytics Eksik",
          status: "warn",
          description: "Ziyaretçi trafiği ölçülmüyor.",
          fix: "GA4 Measurement ID'nizi ekleyin."
        });
      }

      // 4. Page Meta Checks
      const missingTitles = pages.data?.filter(p => !p.title).length || 0;
      const missingDesc = pages.data?.filter(p => !p.description).length || 0;

      if (missingTitles > 0) {
        auditResults.push({
          id: "meta_titles",
          title: `${missingTitles} Sayfada Başlık Eksik`,
          status: "fail",
          description: "Bazı sayfaların meta başlıkları boş bırakılmış.",
          fix: "Sayfa SEO Yönetimi'nden eksikleri tamamlayın."
        });
      }
      
      if (missingDesc > 0) {
        auditResults.push({
          id: "meta_desc",
          title: `${missingDesc} Sayfada Açıklama Eksik`,
          status: "warn",
          description: "Meta açıklaması eksik olan sayfalar var.",
          fix: "Sayfa SEO Yönetimi'ni kontrol edin."
        });
      }

      // 5. Favicon check
      if (!s?.favicon_url) {
        auditResults.push({
          id: "favicon",
          title: "Favicon Eksik",
          status: "fail",
          description: "Sitenin tarayıcı ikonu bulunamadı.",
          fix: "Favicon & Site Kimliği bölümünden bir ikon yükleyin."
        });
      }

      setResults(auditResults);
      const score = Math.round((auditResults.filter(r => r.status === "pass").length / auditResults.length) * 100);
      setStats({ score, checked: auditResults.length });
      
      toast.success("SEO denetimi tamamlandı.");
    } catch (err) {
      toast.error("Denetim sırasında bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-bold">SEO Denetimi</h2>
          <p className="text-sm text-muted-foreground">Sitenizin teknik SEO sağlığı için otomatik denetimler.</p>
        </div>
        <button 
          onClick={runAudit}
          disabled={loading}
          className="admin-btn admin-btn-primary flex items-center gap-2"
        >
          <Icon name={loading ? "sync" : "search_check"} className={loading ? "animate-spin" : ""} />
          {loading ? "Denetleniyor..." : "Denetimi Başlat"}
        </button>
      </div>

      {results.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="admin-card p-6 flex flex-col items-center justify-center text-center">
              <div className={`text-4xl font-bold mb-1 ${stats.score > 80 ? 'text-green-600' : stats.score > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                {stats.score}%
              </div>
              <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Genel SEO Skoru</div>
            </div>
            <div className="admin-card p-6 flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold mb-1 text-[var(--admin-navy)]">
                {stats.checked}
              </div>
              <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Kontrol Edilen Madde</div>
            </div>
          </div>

          <div className="space-y-3">
            {results.map((res) => (
              <div 
                key={res.id} 
                className={`p-4 rounded-xl border flex gap-4 transition-all hover:shadow-sm ${
                  res.status === 'pass' ? 'bg-green-50/30 border-green-100' : 
                  res.status === 'warn' ? 'bg-amber-50/30 border-amber-100' : 
                  'bg-red-50/30 border-red-100'
                }`}
              >
                <div className={`mt-0.5 shrink-0 ${
                  res.status === 'pass' ? 'text-green-500' : 
                  res.status === 'warn' ? 'text-amber-500' : 
                  'text-red-500'
                }`}>
                  <Icon name={res.status === 'pass' ? 'check_circle' : res.status === 'warn' ? 'warning' : 'cancel'} className="text-xl" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm" style={{ color: "var(--admin-text)" }}>{res.title}</h4>
                  <p className="text-xs mt-1" style={{ color: "var(--admin-text-2)" }}>{res.description}</p>
                  {res.fix && (
                    <div className="mt-2 text-[11px] font-medium p-2 rounded bg-white/50 border border-dashed flex items-center gap-2">
                      <Icon name="build" className="text-xs opacity-60" />
                      <span>Öneri: {res.fix}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="admin-card p-12 text-center text-muted-foreground border-dashed">
          <Icon name="analytics" className="text-6xl mb-4 opacity-20" />
          <p>Henüz denetim çalıştırılmadı.</p>
          <p className="text-xs mt-1 italic">Sitenizin SEO puanını hesaplamak için yukarıdaki butonu kullanın.</p>
        </div>
      )}
    </div>
  );
}
