import { useState } from "react";
import { Icon } from "../../site-shell";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[var(--admin-navy)]">SEO Kontrol Paneli</h2>
          <p className="text-muted-foreground">Sitenizin arama motoru görünürlüğünü ve sağlığını buradan takip edin.</p>
        </div>
      </div>

      {/* Sağlık Özeti */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card p-6 border-l-4 border-l-green-500 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Site Durumu</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600">Aktif</span>
            <span className="text-xs text-muted-foreground">İndeksleniyor</span>
          </div>
        </div>
        
        <div className="admin-card p-6 border-l-4 border-l-blue-500 bg-white shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">İndeksli Sayfa</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">12</span>
            <span className="text-xs text-muted-foreground">Sitemap'te</span>
          </div>
        </div>

        <div className="admin-card p-6 border-l-4 border-l-[var(--admin-yellow)] bg-white shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">SEO Skoru</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[var(--admin-navy)]">85/100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hızlı İşlemler */}
        <div className="admin-card bg-white shadow-sm">
          <div className="p-4 border-b font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--admin-navy)]">bolt</span>
            Hızlı SEO İşlemleri
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <button 
              onClick={() => window.open('/sitemap.xml', '_blank')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:bg-muted/50 transition-colors group"
            >
              <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform text-[var(--admin-navy)]">sitemap</span>
              <span className="text-sm font-medium">Sitemap'i Gör</span>
            </button>
            <button 
              onClick={() => window.open('/robots.txt', '_blank')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:bg-muted/50 transition-colors group"
            >
              <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform text-[var(--admin-navy)]">robot</span>
              <span className="text-sm font-medium">Robots.txt Gör</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:bg-muted/50 transition-colors group">
              <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform text-[var(--admin-navy)]">search</span>
              <span className="text-sm font-medium">Google Önizleme</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:bg-muted/50 transition-colors group">
              <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform text-[var(--admin-navy)]">add_link</span>
              <span className="text-sm font-medium">301 Ekle</span>
            </button>
          </div>
        </div>

        {/* SEO Uyarıları */}
        <div className="admin-card bg-white shadow-sm">
          <div className="p-4 border-b font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500">warning</span>
            Kritik SEO Uyarıları
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-red-50 border border-red-100">
              <span className="material-symbols-outlined text-red-500">priority_high</span>
              <div>
                <h4 className="font-bold text-red-900 text-sm">Favicon Kaynağı Eksik</h4>
                <p className="text-xs text-red-700 mt-1">Siteniz için henüz bir favicon yapılandırılmamış.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-amber-50 border border-amber-100">
              <span className="material-symbols-outlined text-amber-500">info</span>
              <div>
                <h4 className="font-bold text-amber-900 text-sm">GSC Doğrulanmamış</h4>
                <p className="text-xs text-amber-700 mt-1">Google Search Console meta etiketi eklenmiş ancak henüz doğrulanmamış.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
