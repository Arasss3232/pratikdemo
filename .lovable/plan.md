# Mimari Tutarlılık ve Tek Kaynaklı Kategori Yönetimi Planı

Bu plan, kategorilerin `src/data/catalog.ts` dosyasındaki statik diziden çıkarılarak tamamen veritabanı (Supabase) üzerinden yönetilmesini ve teklif formunda sunucu taraflı doğrulanmasını amaçlar.

## Teknik Değişiklikler

### 1. Veritabanı Şeması
- `product_categories` tablosu oluşturulacak (UUID, slug, title, description, icon, is_active, display_order).
- RLS politikaları: Herkes aktif kategorileri görebilir, adminler tam yetkiye sahiptir.

### 2. Veri Katmanı (Data Layer)
- `src/data/catalog.ts` içindeki `CATEGORIES_DATA` kaldırılacak.
- `src/hooks/use-categories.ts` oluşturularak veritabanından kategorileri çeken bir hook eklenecek.

### 3. Teklif Formu Doğrulaması (`src/routes/teklif.tsx`)
- `categoryId` üzerinden kategori doğrulaması statik dizi yerine veritabanı sorgusu ile yapılacak.
- Form gönderiminde (`onSubmit`), gönderilen `categoryId` veritabanında kontrol edilecek.
- Geçersiz veya pasif kategoriler için hata mesajı gösterilecek.
- Veritabanından gelen güncel kategori adı `quote_requests.items` içinde saklanacak.

### 4. Admin Paneli (`src/routes/admin.tsx`)
- `categories` sekmesi "Coming Soon" olmaktan çıkarılıp `GenericCrud` ile tam işlevsel hale getirilecek.
- Kategori ekleme, silme, düzenleme ve aktiflik durumu yönetimi eklenecek.

### 5. Kamu Sayfaları (`src/routes/urunler.tsx`, `src/components/home/CategoryExplorer.tsx`)
- Kategoriler veritabanından çekilerek dinamik olarak listelenecek.
- `display_order` ve `is_active` filtrelerine göre sıralanacak.

## Kullanıcı Deneyimi (UX)
- Admin panelinde eklenen yeni bir kategori anında ana sayfada ve teklif formunda görünecek.
- Pasif yapılan bir kategori için yeni teklif alınması engellenecek ancak eski kayıtlar korunacak.

## Raporlama
- Tek kaynaklı otorite: Supabase `product_categories` tablosu.
- Sunucu tarafı doğrulama yöntemi: Supabase RPC veya doğrudan sorgu ile UUID ve aktiflik kontrolü.
