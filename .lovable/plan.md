# Admin Paneli ve Veritabanı Restorasyon Planı

Admin panelinde karşılaşılan `hero_slides` tablosu hatasını ve diğer olası uyumsuzlukları gidermek için kapsamlı bir restorasyon gerçekleştirilecektir. Mevcut `homepage_brochures` tablosu, slider verileri için tek otorite olarak kullanılacak ve tüm admin modülleri gerçek veritabanı şemasıyla senkronize edilecektir.

## Teknik Analiz ve Temel Neden

1.  **Hata Kaynağı:** Admin panelindeki "Slider Yönetimi" modülü, veritabanında mevcut olmayan `hero_slides` tablosunu sorgulamaya çalışmaktadır.
2.  **Gerçek Durum:** Projede ana sayfa slider verileri için zaten `homepage_brochures` adında profesyonel bir tablo mevcuttur.
3.  **Çözüm:** Kod tabanındaki tüm `hero_slides` referansları `homepage_brochures` tablosuna ve onun kolon yapısına (eyebrow, title, image_desktop vb.) göre güncellenecektir.

## Uygulama Adımları

### 1. Veritabanı ve Şema Senkronizasyonu
- Admin panelindeki `hero_slides` referanslarını `homepage_brochures` olarak güncelleyin.
- `GenericCrud` alanlarını `homepage_brochures` tablosunun gerçek kolonlarına (id, title, eyebrow, image_desktop, primary_cta_label vb.) göre yeniden yapılandırın.
- Mevcut tüm ana sayfa slider içeriklerini (hardcoded olanlar dahil) veritabanına taşıyın.

### 2. Admin Modülleri Denetimi
- **Kategori Yönetimi:** `product_categories` tablosunun RLS politikalarını ve kolon uyumunu kontrol edin.
- **Katalog Yönetimi:** `catalogs` tablosunu doğrulayın (şu an `any` cast ile kullanılıyor, tipleri sabitleyin).
- **Bayilik Yönetimi:** `brands` tablosunun RLS ve CRUD işlemlerini test edin.
- **Medya Kütüphanesi:** `media_library` tablosu eksikse oluşturun veya mevcut `media` tablosunu kullanın.

### 3. RLS ve Güvenlik Sıkılaştırma
- Tüm içerik tabloları (`homepage_brochures`, `product_categories`, `catalogs`, `brands`) için:
    - Anonim kullanıcılara sadece `is_active=true` olan kayıtlar için SELECT yetkisi verin.
    - Admin kullanıcılarına (`admin` rolüne sahip authenticated) tüm CRUD yetkilerini verin.
- RLS politikalarını `has_role(auth.uid(), 'admin')` fonksiyonu ile güvenli hale getirin.

### 4. Kullanıcı Arayüzü ve Veri Akışı İyileştirmeleri
- `BrochureSlider` bileşeninde veritabanı hatası durumunda kullanıcıya anlamlı bir hata mesajı veya boş durum gösterin.
- Dashboard üzerindeki sayaçları (KPI) ve hızlı aksiyonları gerçek tablolarla %100 uyumlu hale getirin.
- TypeScript tiplerini (`Database` interface) yeni şema değişikliklerine göre güncelleyin.

## Teknik Detaylar (Yazılımcılar İçin)

| Modül | Referans Tablo | İşlem |
| :--- | :--- | :--- |
| **Slider** | `homepage_brochures` | `hero_slides` yerine kullanılacak. Alanlar: `title`, `image_desktop`, `is_active` vb. |
| **Kategori** | `product_categories` | Kolonlar: `title`, `slug`, `image_url`, `display_order`, `is_active`. |
| **Katalog** | `catalogs` | Kolonlar: `title`, `pdf_url`, `cover_image`, `display_order`. |
| **Medya** | `media_library` | Dosya yönetimi için merkezi tablo. |

## Doğrulama Kriterleri
- [ ] Admin panelinde "Slider Yönetimi" hatasız açılıyor ve CRUD işlemi yapılabiliyor.
- [ ] Ana sayfa slider'ı veritabanındaki güncel verileri yansıtıyor.
- [ ] Proje genelinde hiçbir `hero_slides` referansı kalmadı.
- [ ] `bun run build` komutu hatasız tamamlanıyor.
- [ ] RLS politikaları admin yetkilerini doğru şekilde kısıtlıyor.
