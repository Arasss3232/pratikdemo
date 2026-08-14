# Plan - CMS İçerik Yansıma Sorunlarının Kalıcı Çözümü

Admin panelinde yapılan içerik değişikliklerinin (Site İçerik Yönetimi) kamuya açık web sitesine yansımaması sorununu gidermek için kapsamlı bir restorasyon gerçekleştirilecektir.

## Problem Analizi
*   **Yetkili Kaynak Karmaşası:** Bazı bileşenler CMS (`section_content`) yerine sert kodlanmış (hardcoded) değerleri veya eski `site_settings` tablosunu kullanıyor olabilir.
*   **Önbellek Geçersiz kılma (Cache Invalidation):** TanStack Query anahtarlarının admin ve public tarafta uyumsuz olması veya mutasyon sonrası invalidate işleminin eksikliği.
*   **Yayınlama Modeli Eksikliği:** Mevcut şemada "Taslak" ve "Yayınlanmış" ayrımı tam olarak uygulanmamış olabilir, bu da yerel durum (local state) ile veritabanı arasında kopukluğa neden oluyor.

## Yapılacak İşlemler

### 1. Veri Akışı ve Mutasyon Restorasyonu
*   `ContentEditorPanel.tsx` içindeki `saveMutation` güncellenecek:
    *   Sadece başarılı veritabanı yanıtından sonra başarı mesajı gösterilecek.
    *   Mutasyon sonrası ilgili tüm Query anahtarları (`cms-page`, `cms-sections` ve public taraftaki karşılıkları) invalidate edilecek.
    *   `updated_at` alanı her kayıtta güncellenecek.
*   Taslak/Yayınla ayrımı, veritabanı şemasına (`site_pages.status`) tam uyumlu hale getirilecek. Eğer gerçek bir taslak sütunu yoksa, "Kaydet ve Yayınla" tekil aksiyonuna geçilecek.

### 2. Kamu Sayfalarının CMS Entegrasyonu
*   `usePageContent` kancası (hook), `site_pages` tablosundaki `status` alanını doğru şekilde filtreleyecek (preview modunda 'draft', public modunda 'published').
*   `SiteHeader` (Üst Bar), `SiteFooter` ve `HomeHero` gibi kritik bileşenlerin CMS verilerini öncelikli kullanması, hardcoded fallback'lerin sadece veri yoksa devreye girmesi sağlanacak.
*   `global` içerikler (Top Bar, Footer) için merkezi bir query key fabrikası oluşturulacak.

### 3. Global İçerik Yansıması (Header/Footer)
*   Üst Bilgi Çubuğu (Top Bar): Adres, Telefon, Çalışma Saatleri metinlerinin CMS'den geldiği doğrulanacak.
*   Footer: Şirket özeti, telif hakkı ve ajans linki (Bilgintek) CMS ile tam uyumlu hale getirilecek.

### 4. Teknik Doğrulama ve Test
*   Playwright ile otomatik uçtan uca testler: Admin panelinde metin değiştir -> Yayınla -> Kamu sayfasında doğrula -> Geri al.
*   Farklı rollerle (Anonim, Admin) RLS politikaları test edilecek.
*   Üretim (Production) build testi gerçekleştirilecek.

## Teknik Detaylar
*   **Yetkili Tablolar:** `site_pages`, `page_sections`, `section_content`.
*   **Query Keys:** `["cms-page", route]`, `["cms-sections", pageId]`.
*   **RLS:** Kamu kullanıcıları için `published` statüsündeki içeriklere `SELECT` izni, adminler için tam yetki.
*   **Diller:** Tüm hata mesajları ve UI bildirimleri Türkçe olacak.
