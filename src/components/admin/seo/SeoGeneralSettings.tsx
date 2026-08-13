import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { Icon } from "../../site-shell";

export function SeoGeneralSettings() {
  const settings = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    title_suffix: "",
    site_url: "",
    description: "",
    is_indexing_enabled: true,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        company_name: settings.company_name || "",
        title_suffix: (settings as any).title_suffix || " | Pratik Tedarik Yapı",
        site_url: (settings as any).site_url || "",
        description: settings.description || "",
        is_indexing_enabled: (settings as any).is_indexing_enabled !== false,
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Validate site_url
      if (form.site_url && !form.site_url.startsWith("https://")) {
        toast.error("Site URL'si https:// ile başlamalıdır.");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("site_settings")
        .update({
          company_name: form.company_name,
          title_suffix: form.title_suffix,
          site_url: form.site_url,
          description: form.description,
          is_indexing_enabled: form.is_indexing_enabled,
        } as any)
        .eq("id", true);

      if (error) throw error;
      toast.success("Genel SEO ayarları başarıyla kaydedildi.");
      // Force reload or cache clear might be needed if not using real-time
      window.location.reload(); 
    } catch (error: any) {
      toast.error("Ayarlar kaydedilemedi", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Genel SEO Ayarları</h2>
        <p className="text-sm" style={{ color: "var(--admin-text-2)" }}>
          Sitenin genel arama motoru kimliğini ve meta veri şablonlarını yönetin.
        </p>
      </div>

      <div className="grid gap-6 p-6 border rounded-xl" style={{ borderColor: "var(--admin-border)" }}>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Site Adı (Kurum Adı)</label>
            <input
              type="text"
              className="admin-input w-full"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              placeholder="Örn: Pratik Tedarik Yapı"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Site Başlık Son Eki (Suffix)</label>
            <input
              type="text"
              className="admin-input w-full"
              value={form.title_suffix}
              onChange={(e) => setForm({ ...form, title_suffix: e.target.value })}
              placeholder="Örn: | Endüstriyel Çözümler"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Gerçek Site URL'si (Production)</label>
          <input
            type="url"
            className="admin-input w-full"
            value={form.site_url}
            onChange={(e) => setForm({ ...form, site_url: e.target.value })}
            placeholder="https://pratiktedarikyapi.com"
          />
          <p className="text-[11px]" style={{ color: "var(--admin-text-mute)" }}>
            * Canonical URL, Sitemap ve Robots.txt bu adresi temel alır.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Varsayılan Meta Açıklaması</label>
          <textarea
            className="admin-input w-full min-h-[100px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Sitenin genel meta açıklaması..."
          />
          <div className="flex justify-between items-center">
            <p className="text-[11px]" style={{ color: "var(--admin-text-mute)" }}>
              Önerilen uzunluk: 150-160 karakter.
            </p>
            <span className={`text-[11px] font-bold ${form.description.length > 160 ? 'text-red-500' : 'text-green-600'}`}>
              {form.description.length} / 160
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-dashed" style={{ borderColor: "var(--admin-border)" }}>
          <div>
            <p className="text-sm font-bold">Arama Motoru İndekslemesi</p>
            <p className="text-xs text-muted-foreground">Tüm sitenin Google tarafından taranmasına izin ver veya engelle.</p>
          </div>
          <button 
            onClick={() => setForm({ ...form, is_indexing_enabled: !form.is_indexing_enabled })}
            className={`h-6 w-12 rounded-full relative transition-colors ${form.is_indexing_enabled ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <div className={`absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-transform ${form.is_indexing_enabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            disabled={loading}
            onClick={handleSave}
            className="admin-btn admin-btn-primary px-8"
          >
            {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
          </button>
        </div>
      </div>

      <div className="admin-card p-4 border-amber-200 bg-amber-50 flex gap-3">
        <Icon name="warning" className="text-amber-500 mt-1" />
        <div className="text-xs text-amber-800 leading-relaxed">
          <strong>Önemli:</strong> Site URL'sini değiştirdiğinizde Sitemap ve Robots.txt dosyaları otomatik olarak yeni adresi gösterecek şekilde güncellenir. Arama motoru indekslemesini kapatmak (noindex), sitenizin Google sonuçlarından silinmesine neden olabilir.
        </div>
      </div>
    </div>
  );
}
