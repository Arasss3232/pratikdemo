# Kurumsal Sayfası Yeniden Yapılandırma Planı

Pratik Tedarik Yapı projesinin `/kurumsal` (Hakkımızda) sayfası, profesyonel bir endüstriyel çözüm ortağı kimliğini yansıtacak şekilde, CMS entegrasyonlu ve veri odaklı olarak yeniden inşa edilecektir.

## Teknik Teşhis
Sayfanın boş görünme sebebi, `src/routes/kurumsal.tsx` dosyasının sadece `hero` ve `intro` bölümlerini bekliyor olması ve veritabanında bu rota için yeterli bölüm/içerik kaydının bulunmamasıdır.

## Uygulama Adımları

### 1. Veritabanı ve İçerik Yapılandırması (Supabase)
`/kurumsal` rotası için eksik olan CMS bölümlerini ve başlangıç içeriklerini profesyonel bir dille oluşturacağız.
- **Bölümler:** `hero`, `introduction`, `mission_vision`, `values`, `process`, `advantages`, `cta`.
- **Alanlar:** Her bölüm için başlık, alt başlık, açıklama ve görsel alanları tanımlanacak.
- **İçerik:** Şirketin "Endüstriyel Tedarik Çözüm Ortağı" kimliğini vurgulayan, fiyat/sipariş/B2B terimlerinden arındırılmış kurumsal metinler yüklenecek.

### 2. Bileşen Geliştirme (Frontend)
Kurumsal sayfanın bölümlerini içeren `src/components/corporate/CorporateSections.tsx` dosyasını oluşturacağız.
- **Tasarım Dili:** Navy (Lacivert) zeminler, Yellow (Endüstriyel Sarı) vurgular, Manrope tipografi.
- **Bölümler:**
    - **Hero:** Breadcrumb ve profesyonel başlık alanı.
    - **Introduction:** İki sütunlu, görsel destekli şirket tanıtımı.
    - **Mission & Vision:** Modern kart yapısında misyon ve vizyon bildirileri.
    - **Values:** Dörtlü kart düzeninde "Güvenilirlik, Çözüm Odaklılık, Hızlı Geri Dönüş, Sürdürülebilir İş Birliği".
    - **Working Process:** "Nasıl Çalışıyoruz?" (4 adım).
    - **Why Us:** "Neden Pratik Tedarik Yapı?" avantajları.
    - **CTA:** Ürünler ve Teklif sayfalarına yönlendiren güçlü çağrı alanı.
    - **Contact Strip:** `site_settings` verisini kullanan dinamik iletişim bandı.

### 3. Rota ve CMS Entegrasyonu
- `src/routes/kurumsal.tsx` dosyasını yeni bölümleri destekleyecek şekilde güncelleyeceğiz.
- Admin panelindeki CMS editörünün bu yeni bölümleri otomatik olarak algılayıp düzenlenebilir kılmasını sağlayacağız.

### 4. Doğrulama ve Test
- Tüm ekran boyutlarında (mobil, tablet, masaüstü) responsive uyumluluk.
- Admin panelinden yapılan değişikliklerin anlık olarak sayfaya yansıdığının kontrolü.
- `bun run build` ile üretim derlemesi onayı.

## Teknik Detaylar
- **Veri Kaynağı:** `public.page_sections` ve `public.section_content`.
- **Görsel Yönetimi:** `media` storage bucket ve `FileUploadField` entegrasyonu.
- **Güvenlik:** RLS politikaları (okuma: herkese açık, yazma: admin).
- **SEO:** Route `head()` meta verilerinin kurumsal kimliğe göre güncellenmesi.
