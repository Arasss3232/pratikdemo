import { useState } from "react";
import { Icon } from "../../site-shell";

export function SeoTools() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">SEO Denetimi</h2>
      <p className="text-sm text-muted-foreground">Sitenizin teknik SEO sağlığı için otomatik denetimler.</p>
      <button className="admin-btn admin-btn-primary w-fit">Denetimi Başlat</button>
      <div className="admin-card p-6 text-center text-muted-foreground">
        <Icon name="search_check" className="text-4xl mb-4" />
        <p>Henüz denetim çalıştırılmadı. İlk denetimi başlatmak için yukarıdaki butonu kullanın.</p>
      </div>
    </div>
  );
}
