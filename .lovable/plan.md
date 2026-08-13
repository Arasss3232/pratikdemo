# SEO Yönetimi Modülü Ekleme ve AI Asistanı Kaldırma Planı

Pratik Tedarik Yapı projesinin admin panelini modernize etmek, Yapay Zekâ (AI) bileşenlerini temizlemek ve kapsamlı bir SEO yönetim sistemi kurmak için aşağıdaki adımlar uygulanacaktır.

## Teknik Detaylar
- **Navigasyon:** `src/components/admin/nav.ts` üzerinden AI kaldırılacak, SEO eklenecek.
- **Admin Shell:** `AdminShell.tsx` ve `CommandPalette.tsx` içindeki AI referansları temizlenecek.
- **Rotalar:** `src/routes/admin.tsx` içindeki AI render mantığı SEO modülü ile değiştirilecek.
- **Bileşenler:** `src/components/admin/seo/` altında yeni modüler SEO bileşenleri oluşturulacak.
- **Veritabanı:** `seo_settings`, `page_seo` ve `redirects` tabloları (varsa) kullanılacak veya Lovable Cloud üzerinden yönetilecek.
- **Dinamik Dosyalar:** `robots.txt` ve `sitemap.xml` rotaları merkezi SEO ayarlarından beslenecek.

## Uygulama Adımları

### 1. AI Asistanı Kaldırma
- `src/components/admin/nav.ts` dosyasından `aiAssistant` ve `aiHistory` öğelerini kaldırın.
- `src/components/admin/AdminShell.tsx` içindeki AI popup/drawer ve ikonlarını silin.
- `src/components/admin/Dashboard.tsx` içindeki AI Kontrol Merkezi başlığını "Genel Bakış" veya benzeri kurumsal bir ifadeyle değiştirin.
- `src/routes/admin.tsx` içindeki AI Workspace render kodunu kaldırın.
- `src/components/admin/GenericCrud.tsx` içindeki "AI'ya Sor" butonlarını kaldırın.
- `src/lib/ai-assistant.functions.ts` ve ilgili asistan dosyalarını (hiçbir yer kullanmıyorsa) temizleyin.

### 2. SEO Yönetim Modülü Altyapısı
- `AdminTab` tipine SEO ile ilgili yeni sekmeler ekleyin.
- SEO modülü için yeni bileşenler oluşturun:
  - `SeoDashboard.tsx`: Teknik denetim ve özet kartları.
  - `SeoGeneralSettings.tsx`: Site adı, production URL, favicon, GSC kodu.
  - `SeoPageManagement.tsx`: Sayfa bazlı title/description/og yönetimi.
  - `SeoTools.tsx`: Sitemap, Robots.txt ve Yönlendirme yönetimi.
- `src/routes/admin.tsx` dosyasına SEO tablarını render edecek mantığı ekleyin.

### 3. SEO Kontrol Paneli ve Denetim
- Gerçek verilere dayalı (favicon var mı, meta açıklama var mı vb.) bir sağlık puanı sistemi kurun.
- Search Console doğrulama kodu için güvenli ayrıştırma (parse) mantığı ekleyin.
- Sitemap'teki sayfa sayısını dinamik olarak gösterin.

### 4. XML Sitemap ve Robots.txt Entegrasyonu
- `src/routes/sitemap[.]xml.ts` dosyasını merkezi SEO ayarlarından (production URL) beslenecek şekilde güncelleyin.
- Yeni bir `src/routes/robots[.]txt.ts` rotası oluşturarak dinamik robots.txt sunun.

### 5. Sayfa Bazlı SEO ve Schema
- Mevcut rotaların metadata'sını (`__root.tsx` ve leaf routes) veritabanı/ayar odaklı hale getirin.
- JSON-LD Schema yapılarını merkezi ayarlara bağlayın.
