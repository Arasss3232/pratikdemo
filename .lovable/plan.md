# Veritabanı ve Şema Restorasyon Planı

Admin panelindeki kritik veritabanı hatalarını (media_library, catalogs, hero_slides) kalıcı olarak düzeltmek, şema uyumsuzluklarını gidermek ve tüm modülleri işlevsel hale getirmek için bu plan uygulanacaktır.

## Kullanıcı İçin Özet
- **Eksik Tabloların Oluşturulması:** `catalogs` ve `media_library` tabloları gerçek veritabanında oluşturulacak.
- **Şema Senkronizasyonu:** Kodun beklediği tablo isimleri ve sütunlar ile veritabanı yapısı eşitlenecek.
- **Katalog Sistemi:** Mevcut 7 katalog kaydı veritabanına taşınacak, admin panelinden yönetilebilir hale getirilecek.
- **Slider Düzenlemesi:** Mevcut `homepage_brochures` tablosu slider yönetimi için yetkili merkez olarak doğrulanacak.
- **Medya Kütüphanesi:** Gerçek dosya yükleme ve yönetimi için altyapı kurulacak.

## Teknik Detaylar
- **Database:** Supabase migrations (`supabase--migration`) kullanılarak idempotent SQL komutları çalıştırılacak.
- **Permissions:** RLS politikaları ve `GRANT` komutları ile yetkilendirme (admin/anon) sağlanacak.
- **Types:** Veritabanı değişikliklerinden sonra TypeScript tipleri (`supabase--generate-types`) güncellenecek.
- **Verification:** Playwright testleri ile admin CRUD ve public sayfa yükleme işlemleri doğrulanacak.

## Uygulama Adımları

### 1. Veritabanı Şeması ve Tablo Restorasyonu
- Eksik olan `catalogs` tablosunu oluşturun (title, year, pdf_url, cover_image, display_order vb.).
- Eksik olan `media_library` tablosunu oluşturun (title, file_url, file_type, file_size vb.).
- `homepage_brochures` tablosunun slider yönetimi için tam uyumlu olduğunu doğrulayın.
- Tüm yeni tablolar için `GRANT` ve `RLS` politikalarını uygulayın.

### 2. Katalog Verilerinin Taşınması (Seeding)
- `src/routes/kataloglar.tsx` içindeki hardcoded 7 katalog kaydını yeni `catalogs` tablosuna aktarın.
- Uygulama içindeki tüm katalog sorgularını veritabanına bağlayın.

### 3. Kod ve Şema Senkronizasyonu
- `src/routes/admin.tsx` içindeki `GenericCrud` konfigürasyonlarını yeni tablo yapılarıyla eşleştirin.
- `src/components/admin/Dashboard.tsx` içindeki istatistik sorgularını düzeltin.
- TypeScript tiplerini güncelleyerek "any" kullanımını azaltın.

### 4. Medya ve Dosya Yönetimi
- `media_library` modülünü işlevsel hale getirin.
- Dosya yükleme alanlarını (FileUploadField) Supabase Storage ile entegre edin.

### 5. Test ve Doğrulama
- Playwright ile Katalog ve Medya modüllerinde CRUD işlemlerini test edin.
- Public sayfalarda (`/`, `/kataloglar`) verilerin doğru göründüğünü onaylayın.
- Build testi yaparak proje bütünlüğünü kontrol edin.
