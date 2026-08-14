# Admin Paneli ve CMS Restorasyon Planı — Aşama 2

Tüm ziyaretçi tarafından görülen statik içeriklerin CMS üzerinden %100 yönetilebilir hale getirilmesi, güvenlik açıklarının kapatılması ve veri tutarlılığının sağlanması için kapsamlı restorasyon planı.

## 1. Güvenlik ve Altyapı (Phase 1 & 11)
- `/api/public/sync-trigger` uç noktası tamamen kaldırılacak.
- İçerik senkronizasyonu `src/lib/sync-content.functions.ts` içerisindeki `syncPublicContent` sunucu fonksiyonu üzerinden, sadece yetkili adminler tarafından tetiklenebilecek şekilde Admin Paneli'ne (CMS Ayarları altına) taşınacak.
- Senkronizasyon işlemi `upsert` mantığıyla çalışacak, mevcut (düzenlenmiş) içerikleri ezmeyecek şekilde (`onConflict` stratejisi güncellenerek) idempotent hale getirilecek.

## 2. CMS Kapsam Genişletme (Phase 3, 4, 5, 6)
### Üst Bilgi Çubuğu (Top Bar)
- `site_settings` tablosu tek otorite olacak.
- CMS editörü `site_settings` üzerinden çalışma saatleri, adres, telefon, WhatsApp ve Teklif CTA metinlerini doğrudan güncelleyecek.

### Header ve Navigasyon
- `navigation_items` tablosu kullanılacak.
- Menü etiketleri, rotalar, görünürlük (masaüstü/mobil) ve sıralama tamamen yönetilebilir olacak.
- Logo ve alt metni `site_settings` üzerinden yönetilecek.

### Footer
- 5 ana grup (Kimlik, Linkler, İletişim, Yasal, Alt Bilgi) için CMS alanları oluşturulacak.
- Bilgintek ajans referansı metni ve linki `site_settings` üzerinden yönetilecek.

### Sistem Mesajları
- Global bazda (Hata, 404, Yükleniyor, Başarı vb.) tüm mesajlar için anahtar-değer çiftleri CMS'e eklenecek.

## 3. Sayfa Editörleri ve Veri Senkronizasyonu (Phase 2, 7, 8)
- **Ana Sayfa:** Mevcut tüm bölümler (Hero, Yetkinlik, Sektörler, Neden Pratik) `page_sections` ve `section_content` tablolarına aktarılacak.
- **Kurumsal Sayfası:** Mevcut 7 bölümün CMS entegrasyonu eksiksiz tamamlanacak.
- **Ürün/Katalog/Bayilik/Teklif/İletişim:** Bu sayfaların statik başlık ve açıklama metinleri CMS'e bağlanacak. Kayıt bazlı veriler (kategoriler, kataloglar vb.) kendi modüllerinden beslenmeye devam edecek.
- **Statik Fallback'lerin Kaldırılması:** Kod içerisindeki statik diziler (NAV_LINKS, PRODUCT_GROUPS vb.) veritabanı boşsa sadece ilk kurulumda kullanılacak, sonrasında CMS tek kaynak olacak.

## 4. Teknik Doğrulama ve Test (Phase 9, 10, 12)
- Her CMS alanı için "Düzenle -> Kaydet -> Yenile -> Sitede Gör" döngüsü test edilecek.
- Playwright ile kritik sayfaların (Ana Sayfa, Kurumsal, İletişim) CMS güncellemelerini yansıttığı doğrulanacak.
- Responsive görünüm ve performans testleri yapılacak.

## Teknik Detaylar
- `src/lib/sync-content.functions.ts` dosyası tüm eksik alanları (footer linkleri, sistem mesajları vb.) kapsayacak şekilde genişletilecek.
- `src/components/admin/content/ContentManagement.tsx` sidebar yapısı 5 gruba uygun güncellenecek.
- `src/components/site-shell.tsx` ve diğer sayfa bileşenleri veritabanı başarısızlıklarında kontrollü hata durumları gösterecek.
