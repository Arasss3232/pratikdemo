import { GenericCrud } from "../GenericCrud";
import { Icon } from "../../site-shell";

export function SeoPageManagement() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-[var(--admin-navy)]">Sayfa SEO Yönetimi</h2>
          <p className="text-sm text-muted-foreground">Her sayfa için özel meta verileri ve indeksleme ayarlarını yönetin.</p>
        </div>
        <div className="flex gap-2">
          <div className="admin-badge admin-badge-primary">
            <Icon name="visibility" className="text-xs" />
            <span>Google Önizleme Aktif</span>
          </div>
        </div>
      </div>

      <GenericCrud
        table="page_seo"
        title="Sayfa Listesi"
        description="Public sayfaların SEO yapılandırmalarını buradan güncelleyebilirsiniz."
        columns={[
          { key: "page_path", label: "Rota" },
          { key: "title", label: "SEO Başlığı" },
          { 
            key: "is_indexed", 
            label: "İndeks", 
            render: (row) => (
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${row.is_indexed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {row.is_indexed ? 'Açık' : 'Kapalı'}
              </span>
            )
          },
          { 
            key: "in_sitemap", 
            label: "Sitemap",
            render: (row) => row.in_sitemap ? 'Dahil' : 'Hariç'
          }
        ]}
        fields={[
          { name: "page_path", label: "Sayfa Yolu (örn: /kurumsal)", type: "text", required: true },
          { name: "title", label: "SEO Başlığı (Meta Title)", type: "text", required: true },
          { name: "description", label: "Meta Açıklaması", type: "textarea", required: true },
          { name: "canonical_url", label: "Canonical URL (Opsiyonel)", type: "url" },
          { name: "og_title", label: "Open Graph Başlığı", type: "text" },
          { name: "og_description", label: "Open Graph Açıklaması", type: "textarea" },
          { name: "is_indexed", label: "Arama Motorlarında İndekslensin", type: "checkbox" },
          { name: "in_sitemap", label: "Site Haritasına (Sitemap) Dahil Et", type: "checkbox" },
          { 
            name: "sitemap_priority", 
            label: "Sitemap Önceliği (0.0 - 1.0)", 
            type: "number",
          },
          { 
            name: "change_frequency", 
            label: "Değişim Sıklığı", 
            type: "select",
            options: [
              { value: "always", label: "Her zaman" },
              { value: "hourly", label: "Saatlik" },
              { value: "daily", label: "Günlük" },
              { value: "weekly", label: "Haftalık" },
              { value: "monthly", label: "Aylık" },
              { value: "yearly", label: "Yıllık" },
              { value: "never", label: "Asla" }
            ]
          }
        ]}
      />
    </div>
  );
}
