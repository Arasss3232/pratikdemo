import { GenericCrud } from "../GenericCrud";

export function SeoRedirects() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">301 Yönlendirmeleri</h2>
        <p className="text-sm text-muted-foreground">Eski URL'leri yeni adreslere kalıcı olarak yönlendirin.</p>
      </div>
      
      <GenericCrud
        table="seo_redirects"
        title="Yönlendirme Listesi"
        description="Aktif yönlendirmeleri buradan yönetebilirsiniz."
        columns={[
          { key: "source_path", label: "Kaynak Rota" },
          { key: "target_path", label: "Hedef Rota/URL" },
          { key: "status_code", label: "Tür", render: (row) => row.status_code === 302 ? "302 (Geçici)" : "301 (Kalıcı)" },
          { key: "is_active", label: "Durum", render: (row) => row.is_active ? "Aktif" : "Pasif" }
        ]}
        fields={[
          { name: "source_path", label: "Kaynak Rota (örn: /eski-sayfa)", type: "text", required: true },
          { name: "target_path", label: "Hedef Rota veya URL", type: "text", required: true },
          { name: "status_code", label: "Durum Kodu", type: "select", options: [
            { value: "301", label: "301 (Moved Permanently)" },
            { value: "302", label: "302 (Found/Temporary)" }
          ] },
          { name: "is_active", label: "Aktif", type: "checkbox" },
          { name: "description", label: "Açıklama / Notlar", type: "textarea" }
        ]}
      />
    </div>
  );
}
