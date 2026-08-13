# Plan: Teklif Sayfası ve Admin Detay Dönüşümü

Pratik Tedarik Yapı projesindeki teklif toplama sürecini, çok aşamalı yapıdan modern, tek sayfalık ve kategori odaklı bir kurumsal forma dönüştüreceğim.

## User Review Required

> [!IMPORTANT]
> - Teklif formu artık "Proje Bilgileri" (bütçe, konum, tarih) sormayacak; bu alanlar veritabanında saklanmaya devam edecek ancak yeni formda görünmeyecek.
> - Admin panelindeki teklif detay görünümü, yeni sade yapıya uyumlu hale getirilecek ancak eski kayıtlar için "Proje Bilgileri" görünmeye devam edecek.

## Teknik Detaylar

### 1. Teklif Sayfası Refaktörü (`src/routes/teklif.tsx`)
- **Arayüz:** Çok aşamalı (stepper) yapıyı kaldırıp, masaüstünde 2 sütunlu (Sol: Bilgi/Güven, Sağ: Form) düzene geçeceğim.
- **Form Şeması:** `contactSchema` içinden `city`, `timeline`, `budget` alanlarını isteğe bağlı (optional) bırakacak veya form gönderiminde boş gönderecek şekilde güncelleyeceğim.
- **Form Alanları:**
  - **Ürün Grubu:** Supabase `product_categories` tablosundan dinamik gelecek. URL'den `categoryId` gelirse otomatik seçilecek ve doğrulanacak.
  - **İletişim:** Ad Soyad, Firma (opsiyonel), Telefon, E-posta.
  - **Talep:** Geniş bir "Talep Detayı" textarea alanı.
- **Gönderim:** Tek bir "Teklif Talebini Gönder" butonu. Gönderim sonrası formun yerinde modern bir başarı ekranı.

### 2. Admin Panel Güncellemesi (`src/routes/admin.tsx`)
- **QuotesTab:** `items` listeleme yapısında (Array.isArray(q.items)) kategori bilgisini daha net göstereceğim.
- **Detay Görünümü:** Her teklif satırı tıklandığında veya genişlediğinde gösterilen detay alanlarını yeni sade yapıya göre düzenleyeceğim. "Proje Bilgileri" sadece veride varsa (eski kayıtlar) gösterilecek.

### 3. Görsel Standartlar
- **Renkler:** Koyu lacivert (#08182C) ve kurumsal sarı vurgular.
- **Tipografi:** Manrope (gövde) ve Barlow Condensed (başlıklar).
- **Responsive:** Mobil (360px - 768px) ve masaüstü (1024px+) uyumluluğu.

## Etki Alanı ve Riskler
- **Geriye Dönük Uyumluluk:** `quote_requests` tablosu değişmeyecek, sadece formdan gönderilen veri seti sadeleşecek. Eski admin kayıtları bozulmayacak.
- **Performans:** Kategori listesi `useCategories` hook'u ile verimli bir şekilde yüklenecek.
