import { useState } from "react";
import { GenericCrud } from "../GenericCrud";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
          { key: "source_path", label: "Kaynak Rota", type: "text" },
          { key: "target_path", label: "Hedef Rota/URL", type: "text" },
          { key: "status_code", label: "Tür", type: "select", options: [
            { value: 301, label: "301 (Kalıcı)" },
            { value: 302, label: "302 (Geçici)" }
          ]},
          { key: "is_active", label: "Durum", type: "boolean" }
        ]}
        fields={[
          { key: "source_path", label: "Kaynak Rota (örn: /eski-sayfa)", type: "text", required: true },
          { key: "target_path", label: "Hedef Rota veya URL", type: "text", required: true },
          { key: "status_code", label: "Durum Kodu", type: "select", options: [
            { value: 301, label: "301 (Moved Permanently)" },
            { value: 302, label: "302 (Found/Temporary)" }
          ], defaultValue: 301 },
          { key: "is_active", label: "Aktif", type: "boolean", defaultValue: true },
          { key: "description", label: "Açıklama / Notlar", type: "textarea" }
        ]}
      />
    </div>
  );
}
