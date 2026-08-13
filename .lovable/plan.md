# Plan: Ekibimiz ve Sertifikalarımız Modüllerinin Kaldırılması

Bu plan kapsamında, projenin kurumsal kimliğini koruyarak "Ekibimiz" ve "Sertifikalarımız" bölümleri tüm public web sitesinden ve admin panelinden tamamen kaldırılacaktır.

## Yapılacak Değişiklikler

### 1. Public Web Sitesi Temizliği
- **Hakkımızda Sayfası (`src/routes/hakkimizda.tsx`):** `team_members` ve `certificates` tablolarından veri çeken `useEffect` kısımları, ilgili state'ler ve bu verileri render eden "Ekibimiz" ile "Sertifikalarımız" bölümleri tamamen kaldırılacak. Sayfa yapısı Misyon ve Vizyon bölümleriyle profesyonel bir şekilde devam edecek.
- **Navigasyon ve Footer (`src/components/site-shell.tsx`):** Header ve mobile menüdeki "Ekibimiz" veya "Sertifikalarımız" linkleri (varsa) kaldırılacak. Footer'daki kurumsal linkler güncellenecek.
- **Ana Sayfa (`src/components/home/HomeSections.tsx`):** Ana sayfada bu bölümlere referans veren herhangi bir section veya CTA varsa temizlenecek.

### 2. Admin Paneli Temizliği
- **Navigasyon Yapılandırması (`src/components/admin/nav.ts`):** `ADMIN_NAV` listesinden `team` ve `certificates` anahtarları kaldırılacak.
- **Admin Ana Sayfası (`src/routes/admin.tsx`):** `CertificatesTab` ve `TeamTab` bileşenleri, ilgili route render mantığı ve `TAB_KEYS` listesi temizlenecek.
- **Admin Shell ve Hızlı İşlemler:** Sidebar ve hızlı ekleme menülerinden bu modüllere ait linkler kaldırılacak.

### 3. SEO ve Sistem Temizliği
- **SEO Yönetimi:** `page_seo` tablosu üzerinden bu bölümlere ait (varsa) kayıtlar admin arayüzünden artık yönetilemeyecek.
- **Sitemap:** `/sitemap.xml` dinamik olarak `page_seo` tablosuna bağlı olduğu için, bu sayfalar tablodan silinmese bile (arşiv amaçlı) navigasyondan kalktığı için sitemap'te görünmeyecek.
- **Yetkilendirme:** Rol ve izin matrisinden bu modüllere ait görünümler kaldırılacak.

### 4. Veritabanı ve Dosya Güvenliği
- `team_members` ve `certificates` tabloları silinmeyecek, sadece uygulama tarafında erişimi kesilecek.
- Yüklenmiş görseller silinmeyecek, ileride ihtiyaç duyulması ihtimaline karşı arşivde tutulacak.

## Teknik Detaylar
- `src/routes/hakkimizda.tsx` dosyasındaki React hook'ları ve JSX yapısı refaktör edilecek.
- `src/routes/admin.tsx` dosyasındaki devasa switch/case ve bileşen tanımları temizlenecek.
- `bun run build` ile projenin derleme bütünlüğü doğrulanacak.
- Tarayıcı üzerinden görsel boşluklar ve navigasyon linkleri test edilecek.
