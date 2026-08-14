# Admin Paneli: Site İçerik Yönetimi (CMS) Yeniden Yapılandırma Planı

Mevcut "Site İçerik Yönetimi" modülü, kullanıcı talebi doğrultusunda sıfırdan ve kapsamlı bir şekilde yeniden inşa edilecektir. Bu çalışma, web sitesindeki tüm metinlerin, linklerin ve görsellerin 1:1 eşleşen form alanlarıyla yönetilmesini sağlayacaktır.

## 1. Veritabanı ve Şema Hazırlığı

- **`site_content` Tablosu:** Mevcut tablo, `page_section` ve `field_key` bazlı benzersiz kısıtlamalarla optimize edilecek.
- **Kapsamlı Veri Eşleme:** 
    - **Global/Header:** Çalışma saatleri, Adres, Telefon, WhatsApp, Menü etiketleri.
    - **Ana Sayfa (Home):** Hero başlık, alt başlık, buton metinleri, istatistikler.
    - **Kurumsal Sayfası:** Sayfa başlığı, Hakkımızda içeriği, Misyon/Vizyon, Değerlerimiz, Sürecimiz.
    - **Ürünler/Katalog/Bayilik:** Sayfa başlıkları ve açıklamaları.
    - **İletişim:** Form etiketleri, Harita URL, iletişim bilgileri.

## 2. CMS Arayüzü (Admin UI) Yeniden İnşası

- **Dinamik Form Üretimi:** Seçilen kategoriye göre (Kurumsal, İletişim vb.) ilgili tüm alanları içeren formlar otomatik oluşturulacak.
- **Gruplandırılmış Görünüm:** `shadcn/ui` Card bileşenleri kullanılarak "Hero Bölümü", "İletişim Bilgileri" gibi mantıksal gruplar oluşturulacak.
- **Kullanıcı Deneyimi:** Kısa metinler için `Input`, uzun içerikler için `Textarea` kullanılacak. Tüm alanlar veritabanındaki güncel değerlerle ön-doldurulmuş gelecek.

## 3. Durum Yönetimi ve Fonksiyonellik

- **Taslak vs Orijinal:** `originalData` (DB'den gelen) ve `draftData` (kullanıcı editi) ayrıştırılacak.
- **Üst Aksiyon Çubuğu:**
    - **Sitede Gör:** Canlı siteyi yeni sekmede açar.
    - **Geri Al (Undo):** Taslağı orijinal veriye sıfırlar (değişiklik yoksa pasif).
    - **Yayınla (Publish):** Taslağı Supabase'e `UPSERT` ile kaydeder ve orijinal veriyi günceller.
- **Veri Senkronizasyonu:** `@tanstack/react-query` ile anlık ve tutarlı veri yönetimi.

## 4. Frontend Entegrasyonu (Failsafe)

- **Güvenli Fallback Mekanizması:** Ziyaretçi tarafında `useSiteContent` hook'u kullanılacak. DB boş olsa dahi sitenin kırılmaması için her alan için kod içerisinde tanımlanmış yedek (fallback) değerler korunacak/eklenecek.

## Teknik Detaylar
- **Dosyalar:** `src/components/admin/content/*`, `src/hooks/use-site-content.ts`.
- **Teknoloji:** Supabase, TanStack Query, Zustand/React State, Tailwind CSS.
