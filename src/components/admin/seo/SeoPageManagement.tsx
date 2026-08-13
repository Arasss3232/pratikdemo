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
          { key: "route_path", label: "Rota" },
          { key: "title", label: "SEO Başlığı" },
          { 
            key: "no_index", 
            label: "İndeks", 
            render: (row) => (
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${!row.no_index ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {!row.no_index ? 'Açık' : 'Kapalı'}
              </span>
            )
          },
          { 
            key: "sitemap_include", 
            label: "Sitemap",
            render: (row) => row.sitemap_include ? 'Dahil' : 'Hariç'
          }
        ]}
        fields={[
          { name: "route_path", label: "Sayfa Yolu (örn: /kurumsal)", type: "text", required: true },
          { name: "title", label: "SEO Başlığı (Meta Title)", type: "text", required: true },
          { name: "description", label: "Meta Açıklaması", type: "textarea", required: true },
          { name: "canonical_url", label: "Canonical URL (Opsiyonel)", type: "url" },
          { name: "og_title", label: "Open Graph Başlığı", type: "text" },
          { name: "og_description", label: "Open Graph Açıklaması", type: "textarea" },
          { name: "no_index", label: "İndekslenmesin (noindex)", type: "checkbox" },
          { name: "no_follow", label: "Takip Edilmesin (nofollow)", type: "checkbox" },
          { name: "sitemap_include", label: "Site Haritasına (Sitemap) Dahil Et", type: "checkbox" },
          { 
            name: "sitemap_priority", 
            label: "Sitemap Önceliği (0.0 - 1.0)", 
            type: "number",
          },
          { 
            name: "sitemap_changefreq", 
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
          },
          { name: "schema_type", label: "Schema Türü", type: "select", options: [
            { value: "WebPage", label: "Web Page" },
            { value: "AboutPage", label: "About Page" },
            { value: "ContactPage", label: "Contact Page" },
            { value: "CollectionPage", label: "Collection Page" }
          ]}
        ]}
      />
    </div>
  );
}
