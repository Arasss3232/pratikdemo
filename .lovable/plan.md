
# Ana Sayfa Yeniden Tasarım Planı — "Endüstriyel Hassasiyet"

Sadece herkese açık ana sayfayı (`/`) yeniden tasarlıyoruz. Admin panel, kimlik doğrulama, veritabanı, roller ve tüm CMS akışları aynen korunacak.

## 1. Mevcut Ana Sayfa Özeti

`src/routes/index.tsx` şu an klasik bir şablon:
- Full-bleed hero (arka plan fotoğraf + navy overlay + iki buton)
- 6 kategori kartı (statik `CATEGORIES` dizisi — DB'ye bağlı değil)
- 4 "Neden Pratik?" özelliği (statik `FEATURES`)
- Navy renkli tek satırlık CTA bandı

Layout yardımcıları: `SiteShell` (header + footer), `PageHero`, `SectionHeader`, `CategoryCard`, `FeatureCard`, `Breadcrumb`.

Dinamik veri kaynakları: `useSiteSettings()` hook'u `site_settings` tablosundan hero başlığı/açıklaması, telefon, WhatsApp, e-posta, adres, sosyal medya, çalışma saatleri gibi alanları çekiyor — **ana sayfada şu an neredeyse hiç kullanılmıyor.** Ürünler, hizmetler, markalar, referanslar için `products / services / brands / references / testimonials / blog_posts` tabloları mevcut ama ana sayfa hiçbirini okumuyor. Admin bunları yönetebiliyor fakat ziyaretçi göremiyor.

## 2. Mevcut Sorunlar

**UX**
- Hero jenerik — "arka plan + başlık + 2 buton" şablonu
- Kategori kartları hepsi aynı — hiyerarşi yok, ürün sayısı/görseli yok
- Sosyal kanıt (referans, marka, sayısal başarı) yok
- Hizmetlerden bahsedilmiyor, sektörel çözümler görünmez
- CTA bandı dışında tek bir dönüşüm hunisi (WhatsApp, telefon) yok
- Blog / içerik girişi yok
- Mobil menüde iletişim aksiyonu yok, arama alanı çok baskın

**Görsel**
- Kırmızı yerine sarı denendi ama hero'da yalnızca yumuşak navy overlay var — endüstriyel karakter zayıf
- Tipografi tek beden (`headline-xl`) — editoryal ritim yok
- Kartlar tek stil, kenar yumuşaklığı ve gölge sistemi tutarsız
- Görsel dil şantiye stok fotoğrafı — teknik hassasiyet hissi yok

**Teknik**
- Ana sayfa `site_settings` ve içerik tablolarını okumuyor — admin editleri kamu sitesine yansımıyor
- Statik kategori/özellik dizileri kod içinde
- Hero için tek büyük Google usercontent görseli — LCP riski
- Section-based `Route.loader` yok; QueryClient/SSR faydası kullanılmıyor

## 3. Korunan Dinamik Bağlantılar

Yeni ana sayfa aşağıdaki tabloları **okunur** olarak kullanacak (yazma yok):
- `site_settings` → hero metinleri, telefon, WhatsApp, e-posta, adres, çalışma saatleri, sosyal ağlar
- `product_categories` (varsa) veya `products` `category` alanı → kategori indeksi + öne çıkan ürün görseli
- `services` (aktif olanlar, `sort_order`) → hizmet bandı
- `brands` (aktif olanlar) → marka ekosistemi şeridi
- `references` (öne çıkanlar) → seçilmiş projeler
- `testimonials` (yayında) → müşteri ifadeleri (varsa)
- `blog_posts` (yayında, tarihe göre 3 adet) → sektörel içerik girişi

Alan yoksa fallback statik veri kullanılır. Şema veya admin CRUD **değiştirilmez.**

## 4. Yaratıcı Yön — "Endüstriyel Hassasiyet"

Editoryal + teknik. Sayfa bir CAD çiziminin görsel ritmini taşır: ince kılavuz çizgileri, ölçek etiketleri, spesifikasyon rozetleri, sıra numaraları (`01 / 07`), monospaced küçük etiketler. Baskın yüzey warm off-white (`#F7F7F4`), taşıyıcı renk deep navy (`#08182C`), aksan sarı (`#F4C542`) sadece odak noktalarında — buton, sıra numarası, altçizgi, mikro rozet.

Anahtar sözler: dayanıklılık, kalibrasyon, yetkili distribütör, hızlı sevkiyat.

## 5. Bölüm Sırası ve Amacı

```text
1. Utility strip (navy)   → telefon + WhatsApp + çalışma saatleri (site_settings)
2. Sticky premium header  → mevcut, sadece stil rafinesi
3. Hero (asimetrik)       → editoryal başlık + ürün kompozisyonu + trust satırı
4. Trust bar              → 4 metrik (yıl, marka, ürün, teslimat) + logo şeridi
5. Kategori tarayıcı      → yatay ray, aktif panelde büyük ürün + açıklama
6. Değer önerisi (split)  → "Neden Pratik" 3 sütun editoryal
7. Sektörel uygulama      → 6 sektör kartı, ikon + kısa cümle
8. Öne çıkan ürünler      → 4 ürün, teknik spec rozetleri (mevcut PRODUCTS)
9. Hizmet ve tedarik akışı → 4 adımlı numaralı süreç
10. Marka ekosistemi      → yetkili distribütör logoları
11. Referans + istatistik → seçilmiş 3 proje + sayı animasyonu
12. Sektörel içerik       → 3 blog kartı (varsa)
13. Teklif CTA bandı      → tek birincil aksiyon + telefon ikincil
14. Footer                → mevcut, küçük düzen
```

Her bölüm bir iş amacına bağlıdır; jenerik "hakkımızda" veya "özellikler" bölümü ikinci kez tekrarlanmaz.

## 6. Masaüstü Wireframe (özet)

```text
┌ utility strip: ☎ +90 … | WhatsApp | Pzt–Cmt 08:30–18:00 ─────────────┐
├ HEADER (sticky, glass) ──────────────────────────────────────────────┤
│                                                                        
│  01 / ENDÜSTRİYEL TEDARİK              [ürün kompozisyonu +           │
│                                         teknik ölçek çizgileri]        │
│  Sanayinin ölçülü                       ┌───────────┐                  │
│  gücü.                                  │  matkap   │  ⌀ 13 mm          │
│                                         │  render   │  850 W            │
│  20.000+ profesyonel ürün, tek           └───────────┘  Bosch Pro.     │
│  tedarikçiden. Yetkili distribütör.                                    │
│  [ Ürün Gruplarını İncele → ]  [ Teklif Al ]                           │
│                                                                        │
│  ─── ISO 9001 ─── 15+ yıl ─── 40+ marka ─── 24 saatte sevk ───         │
├────────────────────────────────────────────────────────────────────────┤
│  02 / ÜRÜN GRUPLARI                                    Tümü →          │
│  [ kategori rayı ][ seçili büyük panel: görsel + 3 alt kategori ]      │
├────────────────────────────────────────────────────────────────────────┤
│  03 / NEDEN PRATİK   →  3 kolon: kalibrasyon, garanti, mühendislik    │
├────────────────────────────────────────────────────────────────────────┤
│  04 / SEKTÖREL UYGULAMA  →  6 kart grid (Sanayi, İnşaat, Otomotiv…)   │
├────────────────────────────────────────────────────────────────────────┤
│  05 / ÖNE ÇIKAN ÜRÜNLER  →  4 ürün, spec rozeti, "Detay" linki        │
├────────────────────────────────────────────────────────────────────────┤
│  06 / TEDARİK SÜRECİ  →  01 Talep ▸ 02 Teklif ▸ 03 Sevk ▸ 04 Destek   │
├────────────────────────────────────────────────────────────────────────┤
│  07 / MARKA EKOSİSTEMİ  →  yatay logo şeridi (grayscale → renk hover) │
├────────────────────────────────────────────────────────────────────────┤
│  08 / SEÇİLMİŞ REFERANSLAR  →  3 proje + counter (Ø projeler, sektör) │
├────────────────────────────────────────────────────────────────────────┤
│  09 / BİLGİ MERKEZİ  →  3 blog kartı                                  │
├────────────────────────────────────────────────────────────────────────┤
│  10 / TEKLİF CTA (navy, tam genişlik)                                 │
├ FOOTER ───────────────────────────────────────────────────────────────┤
```

## 7. Mobil Wireframe (özet)

- Utility strip → sadece telefon + WhatsApp ikon çifti, çalışma saati menüde
- Hero → dikey stack: eyebrow → başlık → 2 satır açıklama → birincil CTA (full-width) → ikincil (outline) → küçük ürün render
- Kategori → yatay swipe rayı (snap-x), kart genişliği 80vw
- Öne çıkan ürünler → yatay carousel (snap), 1.1 kart görünür
- Marka logoları → 3x2 grid
- Sabit alt bar → "Teklif Al" + WhatsApp ikonu (yalnızca mobil, `safe-area-inset-bottom`)

## 8. Header Mimarisi

- Sticky, `backdrop-blur` + `bg-primary/95`, alt kenarda 1px sarı vurgu
- Sol: logo + ince dikey ayraç + "Endüstriyel Tedarik" mikro etiketi
- Orta: 6 ana bağlantı (mevcut `NAV_LINKS`)
- Sağ: telefon linki (masaüstünde metin), arama ikon-butonu (modal), sepet, teklif CTA
- Mobil menü: tam ekran drawer, üstte iletişim aksiyonları, altta sosyal ağlar

## 9. Hero Mimarisi

- 12 kolon grid, sol 7 kolon metin, sağ 5 kolon görsel kompozisyon
- Sol kolonda: `01 / ENDÜSTRİYEL TEDARİK` monospace eyebrow, 64/72 başlık (mobilde 40/48), 18/28 açıklama, iki buton
- Sağ kolonda: warm off-white kart üzerinde ürün PNG, çevresinde ince kılavuz çizgileri (`stroke-dasharray`), 3 spec etiketi (⌀ 13 mm, 850 W, Bosch Pro.)
- Hero altında trust satırı: 4 metrik + ISO 9001 rozeti — ayrı bölüm değil, hero'nun devamı
- Metinler `site_settings.hero_title / hero_description / hero_cta_*` alanlarından okunur; fallback statik

## 10. Kategori Etkileşimi

- Sol: dikey kategori listesi (numaralı, hover'da sarı alt çizgi + 4px navy şerit)
- Sağ: seçili kategori büyük paneli — kapak görseli, kısa açıklama, 3 alt kategori chip'i, ürün sayısı, "Kategoriye git →"
- Klavye: ↑/↓ ile seçim, Enter ile git; ARIA `tablist`/`tab`/`tabpanel`
- Mobilde: yatay `overflow-x-auto` snap-carousel, aktif kart panele dönüşür
- Veri: `product_categories` tablosu varsa oradan, yoksa `PRODUCTS`'tan türetilir

## 11. Tasarım Token Önerisi (`src/styles.css`, `:root`)

Yalnızca **kamu sitesi tokenları** güncellenir. `.admin-scope` bloğu **değiştirilmez.**

```css
--brand-navy-950: #08182C;
--brand-navy-900: #0E294B;
--brand-navy-700: #173B67;
--brand-yellow-500: #F4C542;
--brand-yellow-600: #DFAE1B;
--brand-graphite: #202630;
--surface-page: #F7F7F4;
--surface-raised: #FFFFFF;
--surface-soft: #EEF1F4;
--border-hairline: #DFE3E8;
--text-primary: #152033;
--text-secondary: #667085;
--shadow-blueprint: 0 1px 0 rgba(21,32,51,.04), 0 24px 48px -32px rgba(8,24,44,.22);
```

`--color-primary`, `--color-secondary` gibi mevcut semantik tokenlar bu değerlere yeniden eşlenir. Bileşenlerde hardcode hex kullanılmaz.

## 12. Tipografi Ölçeği

- Başlık ailesi: `"Inter Tight"` (Inter zaten yüklü, `Inter Tight` eklenir — display kullanım için)
- Gövde: mevcut Inter
- Mono etiketler (eyebrow, ölçek): `"JetBrains Mono"` veya sistem `ui-monospace`
- Ölçek:
  - Display XL (hero): 64/72, tracking -0.02em, weight 600 → mobil 40/48
  - Display L: 48/56 → mobil 32/40
  - H2 section: 32/40 → mobil 26/32
  - H3 card: 20/28
  - Body L: 18/28
  - Body M: 15/24
  - Label / eyebrow: 12/16 uppercase tracking 0.14em mono
  - Button: 14/20 weight 600

## 13. Motion Sistemi

- `framer-motion` (varsa `motion/react`) — reduced-motion ile devre dışı
- Hero: eyebrow → başlık → açıklama → butonlar 40ms stagger, y:12→0, 350ms `ease-out`
- Kategori paneli: cross-fade 200ms + görsel `clip-path` mask reveal
- Sayı sayaç: `IntersectionObserver` ile 800ms ease-out
- Buton: 120ms transform + sarı alt çizgi genişleme
- Bölüm reveal: `opacity 0→1, y 16→0` yalnızca ilk giriş
- Yalnızca ana sayfada uygulanır

## 14. Yeniden Kullanılabilir Bileşen Mimarisi

Yeni dosyalar (yalnızca `src/components/home/` altında — mevcut marketing bileşenleri korunur):

- `HomeUtilityStrip.tsx`
- `HomeHero.tsx` + `HeroProductCard.tsx`
- `TrustBar.tsx`
- `CategoryExplorer.tsx`
- `ValueProps.tsx`
- `SectorGrid.tsx`
- `FeaturedProducts.tsx` (mevcut `ProductCard`'ı sarar)
- `ProcessTimeline.tsx`
- `BrandStrip.tsx`
- `SelectedReferences.tsx` + `StatCounter.tsx`
- `InsightsPreview.tsx`
- `QuoteCTA.tsx`
- `MobileContactBar.tsx`

Data hook'ları (salt-okunur, `useQuery` ile):
- `src/hooks/use-home-data.ts` — `site_settings`, `services`, `brands`, `references`, `blog_posts`, `products`

## 15. Değişecek Dosyalar

- `src/routes/index.tsx` — tamamen yeniden yazılır (yeni bölümleri kompoze eder)
- `src/styles.css` — kamu sitesi token bloğu güncellenir (`.admin-scope` DOKUNULMAZ)
- `src/components/site-shell.tsx` — header rafinesi, utility strip mount noktası, mobil menüye iletişim aksiyonu; SiteFooter küçük düzenleme
- `src/routes/__root.tsx` — yeni fontlar için `<link>` (Inter Tight, JetBrains Mono)
- `src/data/nav.ts` — değişmez (NAV_LINKS aynı)
- `src/hooks/use-home-data.ts` — yeni dosya
- `src/components/home/*` — yeni dosyalar

## 16. Korunacak Dosyalar (dokunulmayacak)

- `src/routes/admin.tsx` ve tüm `src/components/admin/*`
- `src/styles.css` içindeki `.admin-scope { … }` blokları
- `src/integrations/supabase/*`
- Auth (`src/hooks/use-auth.ts`, `src/routes/giris.tsx`)
- Diğer public route dosyaları (`urunler.*`, `hizmetler.*`, `iletisim.tsx`, vs.) — bu turda değişmez
- `src/lib/quote-cart.ts`, `button-styles.ts`
- Migration ve `supabase/config.toml`

## 17. Bozulmaması Gereken Fonksiyonlar

- Giriş / çıkış akışı
- Admin panele erişim (`/admin`) ve tüm CRUD sekmeleri
- Teklif sepeti ekleme / listesi (`/teklif-sepeti`)
- Ürün detay yönlendirmesi
- Sitemap ve robots
- SEO meta üretimi (title / description / og / canonical / JSON-LD)

## 18. Uygulama Aşamaları

1. **Token & tipografi tabanı** — `styles.css` kamu tokenları, `__root.tsx` font linkleri, `site-shell` rafinesi
2. **Data hook'ları** — `use-home-data.ts` (site_settings, categories, services, brands, references, blog)
3. **Hero + trust bar** — asimetrik grid, dinamik metinler, LCP için `fetchpriority=high` sadece hero görselinde
4. **Kategori tarayıcı** — dinamik veri + klavye + mobil carousel
5. **Değer / sektör / süreç / marka bölümleri**
6. **Öne çıkan ürünler + referans + blog**
7. **Teklif CTA + mobil iletişim bar**
8. **Motion katmanı + reduced-motion**
9. **SEO / performans son geçiş** (heading hierarchy, alt metinleri, srcset, JSON-LD `Organization` + `WebSite`)

## 19. Test Stratejisi

- `tsgo` typecheck her aşamada
- Preview: 1920 / 1280 / 768 / 375 viewport ekran görüntüleri (Playwright)
- Klavye tab akışı: hero → kategori → CTA
- Reduced-motion: `prefers-reduced-motion: reduce` medya simülasyonu
- Lighthouse hedefleri (mobil): Performance ≥ 85, Accessibility ≥ 95, SEO 100
- Admin panele giriş yap → Products/Services/Settings düzenle → yeni ana sayfaya yansıdığını doğrula (regresyon testi)

## 20. Kabul Kriterleri

- Ana sayfa jenerik şablon hissi vermez; editoryal + teknik dil hakim
- `site_settings` alanları hero / utility strip / footer'da görünür
- Kategori, hizmet, marka, referans, blog verileri DB'den gelir (varsa)
- Admin panel görünümü, davranışı ve tüm CRUD akışları değişmez
- Hero LCP < 2.5s (mobil), CLS < 0.1
- Tüm görsellerde alt metin, tüm interaktiflerde erişilebilir isim
- 375px'de yatay kaydırma yok, tıklama hedefleri ≥ 44px
- `prefers-reduced-motion` aktifken animasyon çalışmaz
- Tüm görünür metin doğru Türkçe, İngilizce arayüz sızıntısı yok

Onaylarsan 1. aşamadan başlıyorum.
