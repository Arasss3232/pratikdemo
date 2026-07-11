# 1. Tur — Kurumsal CMS Eklentisi

Mevcut Pratik Endüstriyel (ürünler + teklif + admin) korunur. Üzerine kurumsal site + CMS eklenir. Firma bilgisi verilmedi — jenerik "Pratik Endüstriyel" metinleriyle başlarız, admin panelinden düzenlenir.

## Kapsam (bu turda)

**A. Temel sayfalar + tasarım**
- `/hakkimizda` — tarihçe, misyon, vizyon, değerler, ekip, sertifikalar
- `/hizmetler` + `/hizmetler/$slug` — kart listesi + detay
- `/referanslar` — kategori filtreli grid
- `/iletisim` — form + harita + KVKK onayı
- Header/footer cilası, mevcut hamburger menü korunur

**B. CMS temeli**
Admin panele sekmeler eklenir: Site Ayarları · Hizmetler · Referanslar · Ekip · SSS · Markalar · Sertifikalar · Medya Kütüphanesi

**C. Blog & Haberler**
- `/blog` liste + `/blog/$slug` detay + kategori filtresi
- Admin: Blog Yazıları · Kategoriler · Etiketler

**D. İK + Formlar + Mesajlar**
- `/kariyer` açık pozisyonlar + `/kariyer/$slug` başvuru formu (CV upload)
- Admin: Pozisyonlar · Başvurular (durum yönetimi) · İletişim Mesajları (yeni/okundu/cevaplandı/arşiv)

## Sonraki turlara ertelenenler
Sayfa oluşturucu (block editor), form builder, gerçek analytics, tasarım-token editörü, rol/yetki matrisi, işlem geçmişi, 301 yönetimi, bildirim merkezi, çoklu menü yöneticisi. Şu an admin sadece admin rolüne açık kalır.

## Teknik plan

### 1. Veritabanı (tek migration)
Yeni tablolar (hepsi RLS + GRANT + updated_at trigger'ları):

```text
site_settings      (singleton: logo, iletişim, sosyal, harita, footer)
services           (slug, title, excerpt, body, cover, icon, order, published)
service_images     (service_id, url, order)
references         (slug, title, client, category, cover, project_date, url, order, published)
reference_images
team_members       (name, role, photo, bio, order)
testimonials       (name, company, quote, avatar, rating, order, published)
brands             (name, logo, url, order)
certificates       (name, image, issued_at, order)
faqs               (question, answer, category, order, published)
blog_categories    (slug, name)
blog_tags          (slug, name)
blog_posts         (slug, title, excerpt, body, cover, category_id, author, published_at, featured, seo_title, seo_desc, published)
blog_post_tags     (post_id, tag_id)
job_posts          (slug, title, department, location, type, body, published)
job_applications   (job_id, name, email, phone, cv_url, note, status)
contact_messages   (name, email, phone, department, subject, message, kvkk, status)
media              (path, filename, mime, size, alt)
```

Storage bucket: `media` (public) — CV'ler `cv/` prefix (private policy).

RLS:
- SELECT `anon+authenticated`: yayında (`published=true`) olan içerikler + site_settings
- INSERT `anon`: contact_messages, job_applications
- Diğer tüm yazma: admin (has_role)

### 2. Server functions
`src/lib/cms.functions.ts` — public read'ler (SSR uyumlu, publishable client)
`src/lib/admin.functions.ts` — admin yazma (requireSupabaseAuth + has_role kontrol)
İletişim/başvuru gönderimi doğrudan browser client'tan anon INSERT ile.

### 3. Public sayfalar
Mevcut `SiteShell` + `PageHero` + marketing bileşenleri kullanılır. Her rota kendi `head()` meta ve JSON-LD (Article/Organization/BreadcrumbList) ile.

### 4. Admin
Mevcut `/admin` sidebar'ına yeni bölümler:
```text
İçerik          Ayarlar
├ Hizmetler    ├ Site Ayarları
├ Referanslar  ├ Ekip
├ Blog         ├ Markalar
├ SSS          ├ Sertifikalar
├ Pozisyonlar  └ Medya

İletişim
├ Mesajlar
├ Başvurular
└ Teklif Talepleri (mevcut)

Sistem
├ Ürünler (mevcut)
└ Kullanıcılar (mevcut)
```
Her modül: liste (arama + sayfalama) · ekle/düzenle modal · sil onaylı · yayında/taslak toggle · sürükle-bırak sıra (dnd-kit). Zengin metin için `@tiptap/react`.

### 5. Uygulama sırası (aynı turda)
1. Migration (schema + RLS + bucket + storage policies)
2. Server fn'ler + admin bileşen kütüphanesi (DataTable, MediaPicker, RichEditor, SortableList)
3. Admin CRUD ekranları
4. Public sayfalar + head/JSON-LD
5. Seed: örnek 3 hizmet, 4 referans, 2 blog yazısı, 6 SSS — admin'den silinebilir

## Notlar
- Görsel yükleme: yeni Media Kütüphanesi → Supabase Storage `media` bucket
- Analytics/ziyaretçi sayaçları bu turda YOK (gerçek veri için ayrı entegrasyon turu)
- Tasarım-token editörü YOK — renkler `src/styles.css`'te sabit
- Firma metinlerini sen doldurana kadar jenerik lorem yerine sektörel şablon metin kullanılır