## Pratik Endüstriyel — Kapsamlı SEO Kurulum & Optimizasyon Planı

Türkçe endüstriyel donanım sitesi (Bosch, Makita, DeWalt, Hilti tedariki) için sıfırdan uçtan uca SEO altyapısı. Site henüz yayınlanmadığı için kanonik URL'ler ve sitemap `BASE_URL` başlangıçta göreli/boş bırakılır; domain bağlanınca güncellenir.

---

### 1) Teknik Temel (Foundation)

- **`public/robots.txt`** oluştur:
  ```
  User-agent: *
  Allow: /
  ```
  (Yayınlandığında `Sitemap:` satırı eklenecek.)
- **`src/routes/sitemap[.]xml.ts`** server route — her public route için bir `<url>` üret (`/`, `/urunler`, `/urunler/elektrikli-el-aletleri`, `/markalar`, `/kataloglar`, `/hizmetler`, `/sektorel`, `/kurumsal`, `/teklif`, `/iletisim`, `/teknik-destek`, `/kvkk`). `BASE_URL = ""` + TODO.
- **`__root.tsx`** yalnızca site geneli varsayılanlar tutar: charSet, viewport, `og:site_name: "Pratik"`, `og:type: "website"`, Organization JSON-LD.
- Root'taki jenerik başlığı kaldır — her leaf route kendi title/description'ını yazacak.

### 2) Her Route için Head Metadata

Her sayfa için `head()` içinde: `title` (<60 kar, keyword önde), `description` (<160 kar), `og:title`, `og:description`, `og:type`, `og:url` (göreli), `<link rel="canonical">` (göreli, self-referencing).

Örnek anahtar başlıklar (Türkçe, keyword-odaklı):

| Route | Title | Ana Keyword |
|---|---|---|
| `/` | Endüstriyel Donanım Tedariki — Pratik | endüstriyel donanım tedarik |
| `/urunler` | Endüstriyel Ürün Kategorileri — Pratik | endüstriyel ürünler |
| `/urunler/elektrikli-el-aletleri` | Elektrikli El Aletleri — Bosch, Makita, DeWalt | elektrikli el aletleri |
| `/markalar` | Yetkili Distribütör Markalar — Pratik | bosch yetkili satıcı |
| `/kataloglar` | Ürün Katalogları ve Teknik Dokümanlar | ürün kataloğu indir |
| `/hizmetler` | Endüstriyel Tedarik ve Servis Hizmetleri | endüstriyel tedarik hizmeti |
| `/sektorel` | Sektörel Çözümler — İnşaat, İmalat, Enerji | sektörel endüstriyel çözüm |
| `/kurumsal` | Kurumsal — Hakkımızda | pratik endüstriyel hakkında |
| `/teklif` | Toplu Teklif Formu — Endüstriyel Alım | toplu teklif |
| `/iletisim` | İletişim — Pratik Endüstriyel | iletişim |
| `/teknik-destek` | Teknik Destek ve Servis | teknik destek |
| `/kvkk` | KVKK Aydınlatma Metni | kvkk (noindex opsiyonel) |

### 3) Yapısal Veri (JSON-LD)

- **Root**: `Organization` (isim, logo, iletişim, sameAs sosyal linkler) + `WebSite` (potentialAction: SearchAction).
- **`/urunler/elektrikli-el-aletleri`** ve kategori sayfaları: `BreadcrumbList` + `ItemList` (ürünleri listeler).
- Her ürün için: `Product` schema (name, brand, sku, image, offers/availability).
- **`/iletisim`**: `LocalBusiness` (adres, telefon, açılış saatleri).
- **`/kurumsal`**: `AboutPage` + `Organization` referansı.

### 4) İçerik & Bilgi Mimarisi

- H1 her sayfada TEK ve keyword içerir; H2/H3 hiyerarşisi korunur.
- **Kategori sayfaları için 150-300 kelimelik SEO paragrafı** (elektrikli el aletleri hakkında rehber metin — hem kullanıcıya değer hem long-tail için).
- **Internal linking**: breadcrumbs (var ✓), her kategori kartından ürün detayına, related brand → related products cross-links.
- Anchor text: "buraya tıkla" yerine "elektrikli el aletleri kategorisine göz atın" gibi keyword'lü.

### 5) Görsel & Erişilebilirlik SEO

- Tüm `<img>` için açıklayıcı Türkçe `alt` (mevcut altlar İngilizce — Türkçeye çevir: "Bosch darbeli matkap beyaz zeminde").
- `width`/`height` ekle (CLS için — logo'lar zaten yapıldı; ürün ve hero görselleri de).
- `loading="lazy"` + `decoding="async"` (yapıldı ✓); LCP hero preload (yapıldı ✓).
- Semantic HTML: `<article>`, `<nav>`, `<main>`, `<section>` — mevcut yapı büyük ölçüde uygun.

### 6) Performans (Core Web Vitals — SEO ranking sinyali)

- ✓ LCP preload eklendi.
- ✓ Görsel lazy-load + preconnect eklendi.
- ✓ Icon font tek varyanta indirildi.
- Sonraki adım: hero görsellerini WebP/AvIF olarak host etmek (şu an lh3.googleusercontent).

### 7) URL & Kanonik Politika

- Kısa, keyword'lü, Türkçe URL'ler (mevcut ✓).
- Trailing slash yok (TanStack kuralı ✓).
- Her leaf `canonical` self-referencing — parametreli URL'ler ana URL'ye canonical.
- İleride: `/urunler/{kategori}/{urun-slug}` dynamic route eklenirse aynı desen.

### 8) Yayın Sonrası (Post-Publish)

1. `BASE_URL`'i sitemap ve tüm `og:url`/`canonical`'larda gerçek domaine set et.
2. `robots.txt`'e `Sitemap: https://domain.com/sitemap.xml` ekle.
3. **Google Search Console**: site verification (META token) → `__root.tsx`'e meta tag ekle → verify → property olarak ekle → sitemap submit.
4. **Bing Webmaster** aynı akış.
5. og:image üret (imagegen, 1200×630) — marka + slogan; leaf route'larda hero görseline eşle.

### 9) Devam Eden İzleme

- Yayından sonra Semrush `domain_analysis` + `seo_trend` ile takip.
- Google Search Console `urlInspection` ile indexleme durumu kontrolü.
- Ayda bir SEO scan (Lovable SEO sekmesi) + eksikleri kapatma döngüsü.

---

### Uygulama Sırası (Build Order)

1. `robots.txt` + `sitemap[.]xml.ts` oluştur.
2. `__root.tsx`'i sitewide-only'a indir + Organization/WebSite JSON-LD ekle.
3. 12 route'un her birine `head()` (title, description, og:*, canonical) yaz.
4. Ürün ve kategori sayfalarına BreadcrumbList + ItemList + Product JSON-LD.
5. İletişim sayfasına LocalBusiness JSON-LD.
6. Görsel `alt`'larını Türkçeleştir; H1 kontrolü.
7. Kategori sayfasına SEO açıklama paragrafı ekle.
8. Yayın sonrası: BASE_URL güncelle, GSC verify + sitemap submit.

Onaylarsan sırayla uygularım. İstersen belirli bir adımı önce/yalnız yapabilirim.