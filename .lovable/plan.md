# Yönetim Paneli Yeniden Tasarım Planı

## 1. Mevcut mimari özeti

**Rota katmanı**
- Tüm admin arayüzü tek bir sekmeli sayfada: `src/routes/admin.tsx` (911 satır) — `?tab=<key>` search parametresi ile 17 sekme değiştirir.
- Public rotalar `src/routes/` altında (blog, hizmetler, kariyer, ürünler, iletişim vb.). Admin bunlardan ayrı.
- Auth kapısı: `use-auth.ts` hook'u + admin sayfası içinde `isAdmin` kontrolü (yetkisizse ekranda uyarı). `_authenticated/` layout kullanılmıyor.

**Bileşenler (`src/components/admin/`)**
- `AdminShell.tsx` — Sidebar + topbar (bu turda navy/yellow ile yeniden boyandı, ama hâlâ tek shell).
- `nav.ts` — 5 grup, 17 sekme sabit listesi.
- `Dashboard.tsx` — Hero + istatistik kartları + hızlı işlemler + son mesajlar/teklifler.
- `GenericCrud.tsx` (443 satır) — Tüm CRUD sekmelerinin ortak tablo/form/modal motoru.
- `SiteSettingsForm.tsx`, `PageHeader.tsx`, `ConfirmDialog.tsx`, `EmptyState.tsx`.
- Sekme mantığı 15+ inline `*Tab()` fonksiyonu olarak `admin.tsx` içinde (Products, Quotes, Users, Services, References, Brands, Certificates, Team, Testimonials, Faqs, BlogCategories, BlogPosts, Jobs, Applications, Messages).

**Veri katmanı**
- Doğrudan `supabase` browser client'ı ile `select/insert/update/delete`.
- 20 tablo (products, services, references, brands, certificates, team_members, testimonials, faqs, blog_posts, blog_categories, blog_tags, blog_post_tags, jobs, job_applications, contact_messages, quote_requests, site_settings, reference_images, service_images, media, user_roles).
- `has_role()` SECURITY DEFINER + `handle_new_user_role()` trigger + `set_updated_at()` — RLS her tabloda açık, admin politikalarıyla korunuyor.
- Storage: private `media` bucket'ı.

**Tasarım sistemi**
- `src/styles.css` — OKLCH tabanlı Material-3 türevi token seti (primary lacivert `#0c3474`, secondary amber `#d69a1c`).
- Public site: Inter font ailesi, geniş navy hero'lar, sarı vurgular, kare-yumuşak köşeler (`rounded-lg/xl`), Material Symbols ikonlar.
- Admin için bu turda `.admin-scope` altına navy (`#0B1F3A`) + sarı (`#F5C542`) token'ları eklendi.

**Toast/dialog**
- `sonner` root'ta bağlı, `confirmDialog()` özel promise-based host.

## 2. Mevcut UX ve tasarım problemleri

**Bilgi mimarisi**
- 17 sekme tek düzlemde — arama/sayfalandırma dışında keşif yok.
- Sidebar grupları mantıksal değil (örn. "Markalar" ve "Sertifikalar" içerik değil, "Site Yönetimi" altında).
- "Site Ayarları" tek uzun form; alt sekmesi yok.
- Kullanıcı yönetimi ile içerik yönetimi eşit ağırlıkta görünüyor.

**Görsel tutarsızlık**
- `admin.tsx` içinde hâlâ `bg-surface-container-lowest`, `text-on-surface` gibi Material token'ları kullanan blokları var — yeni navy/sarı sistemle karışıyor.
- Bazı butonlar `buttonStyles()`, bazıları inline `className`; boyutlar (`h-9/h-10/h-11`) karışık.
- Form alanları `<input>`/`<select>` shell'i özelleştirilmemiş — public sitedeki input stilinden farklı.
- Modal (form editörü) tam ekran overlay olmayıp basit kart — büyük formlarda daralıyor.

**Etkileşim ve geri bildirim**
- Boş durum yalnızca tabloda; sekme ilk açılışta çoğu zaman "hiç veri yok" durumunu grafiksel anlatmıyor.
- Yüklenme iskeleti sadece `GenericCrud` içinde; Dashboard/Settings/Messages'ta yok.
- "Kaydet" butonu formun altında, uzun formda kaybolur (sticky yok).
- "Sil" butonu ile "Kaydet" aynı renk ağırlığında görünebilir.
- Kaydedilmemiş değişiklik uyarısı yok — sekme değiştirince veri kaybolur.
- Undo (geri al) toast yok — silme geri alınamaz, sadece onay dialoğu var.
- Global arama yalnızca görsel; sonuç göstermiyor.
- Cmd/Ctrl+K yok.
- Bildirim merkezi yok — yeni mesaj/teklif geldiğini yalnızca dashboard sayısı gösterir.

**Terminoloji (Türkçe / teknik dil)**
- "Slug", "SKU", "Meta Description", "OG Image", "RLS", "Status: new" gibi teknik ifadeler kullanıcıya doğrudan gösteriliyor.
- İş ilanı/blog formlarında yardımcı metin (helper text) yok.
- Tarih formatı bazen ISO, bazen `tr-TR`.

**Mobil**
- Sidebar drawer çalışıyor ama form/tablo mobilde yatay kaydırma gerektiriyor.
- Modal formlarda alan yüksekliği ekranı aşıyor, sticky kaydet olmadığı için kullanıcı butonu göremiyor.

**Fonksiyonel boşluklar**
- Medya kütüphanesi yok (görseller yalnızca URL alanı olarak isteniyor).
- Sayfa/menü yönetimi yok — public menü kod içinde sabit.
- Ana sayfa görsel builder yok.
- Çöp kutusu / soft delete yok.
- Sürüm geçmişi yok.
- İşlem günlüğü (activity log) yok.
- Rol/izin matrisi yok — sadece admin/user.
- Ziyaretçi analitikleri yok.
- Preview (desktop/tablet/mobile) yok.

**Placeholder/mock durumlar**
- Topbar araması `<input>` bağlı değil.
- Dashboard "Site kurulumu" adımlarından `settings` ve `references` için `done: false` sabit — gerçek doluluk hesaplanmıyor.
- Bazı public sayfalarda hâlâ statik veriler (`src/data/*`) — admin'den ürün eklense bile bazı vitrinler statik.

## 3. Marka analizi ve tasarım dili

**Public site** navy hero + sarı CTA + geniş beyaz alan + Inter + Material Symbols. Kart köşeleri `rounded-xl`, gölgeler yumuşak, tipografi kalın başlıklar.

**Admin için uyarlama** — aynı marka, farklı ürün:
- Sidebar: derin navy gradient (`#0B1F3A → #071426`), sarı aktif göstergesi, ince beyaz ayraçlar.
- İçerik alanı: sıcak açık gri arka plan (`#F6F8FB`) + beyaz yüzey kartları — public sitenin ferahlığını korur.
- Vurgu: sarı yalnızca birincil eylem, aktif nav, ilerleme göstergesi ve marka rozetlerinde.
- Tipografi: Inter (700 başlık, 600 alt başlık, 500 gövde ağırlık, 400 yardım metni). Başlıklarda -0.02em letter-spacing.
- Köşeler: `rounded-xl` (12px) genel, `rounded-2xl` hero/modal.
- Gölge: `shadow-sm` liste kartları, `shadow-md` hover, `shadow-xl` modal.
- İkon: Material Symbols Rounded, 20px sidebar, 18px inline, dolgu değişkeni sadece aktif nav'da.
- Boşluk sistemi: 4/8/12/16/24/32/48 (Tailwind spacing 1/2/3/4/6/8/12).

## 4. Ürün konsepti: "Yönetim Merkezi"

Sekmeli tekil bir dashboard yerine **çok bölümlü bir SaaS uygulaması**:

```text
┌─────────────────────────────────────────────────────────────┐
│ [PE]  Ara (⌘K)                    [+ Ekle] [🔔] [Site] [👤] │
├──────────┬──────────────────────────────────────────────────┤
│ Ana Sayfa│  Sayfa Başlığı                    [Yardım] [...] │
│ İçerik ▸ │  ────────────────────────────────────────────    │
│ Site ▸   │  Filtre çubuğu / sekme                           │
│ Mesajlar │  ────────────────────────────────────────────    │
│ Ayarlar ▸│  Akıllı tablo / kart ızgarası                    │
│          │                                                  │
│          │  ────────────────────────────────────────────    │
│          │  Sticky kaydet çubuğu (form modunda)             │
└──────────┴──────────────────────────────────────────────────┘
```

- Her ana bölüm kendi rotasına sahip → tarayıcı geçmişi, derin linkler, dış paylaşım.
- Formlar yan panel (drawer) veya split-view olarak açılır; sağda canlı önizleme.
- Cmd/K global paletle her sayfaya/aksiyona ulaşım.
- Yeni içerik oluşturma "sihirbaz" tarzı 3 adım: **Temel bilgi → İçerik/Medya → Yayınla**.

## 5. Bilgi mimarisi ve yeni rota yapısı

```text
/admin                              → Kontrol Merkezi (ana sayfa)
/admin/icerik                       → İçerik özeti
/admin/icerik/hizmetler
/admin/icerik/hizmetler/$id
/admin/icerik/urunler
/admin/icerik/urunler/$id
/admin/icerik/referanslar
/admin/icerik/referanslar/$id
/admin/icerik/blog                  → yazı listesi
/admin/icerik/blog/$id
/admin/icerik/blog/kategoriler
/admin/icerik/sss
/admin/site                         → site kimliği özeti
/admin/site/ayarlar                 → hero, iletişim, sosyal, footer (alt sekmeler)
/admin/site/menu                    → menü/nav yöneticisi
/admin/site/anasayfa                → ana sayfa bölüm builder
/admin/site/markalar
/admin/site/sertifikalar
/admin/site/ekip
/admin/site/yorumlar
/admin/site/medya                   → medya kütüphanesi
/admin/mesajlar                     → gelen kutusu (mesaj + teklif + başvuru sekmeleri)
/admin/mesajlar/teklifler
/admin/mesajlar/basvurular
/admin/kariyer                      → ilan yönetimi
/admin/kariyer/$id
/admin/ayarlar                      → hesap + kullanıcılar + entegrasyonlar
/admin/ayarlar/kullanicilar
/admin/ayarlar/entegrasyonlar       → analytics/pixel/webhook
/admin/cop-kutusu                   → soft-deleted kayıtlar
/admin/gecmis                       → işlem günlüğü
```

Hepsi `_authenticated/admin/` altında olacak (managed layout kullanılır); admin rolü ayrıca `beforeLoad` içinde kontrol edilir.

## 6. Bileşen mimarisi

```text
src/components/admin/
  shell/
    AdminShell.tsx              — layout kabuğu
    BrandSidebar.tsx            — navy gradient nav (grup açılır-kapanır)
    CommandTopbar.tsx           — arama, hızlı ekle, bildirim, profil
    GlobalCommandPalette.tsx    — Cmd/K (rota + aksiyon)
    NotificationCenter.tsx      — yeni mesaj/teklif/başvuru
    QuickCreateMenu.tsx         — sarı [+ Ekle] menüsü
  page/
    PageHeader.tsx              — başlık, breadcrumb, aksiyonlar
    ContextualActionBar.tsx     — seçili satır aksiyonları
    HelpDrawer.tsx              — sağdan açılan yardım
    SetupChecklist.tsx          — dashboard onboarding
  data/
    SmartDataTable.tsx          — sıralama, sayfalama, seçim, kolon ayarı
    MobileDataCard.tsx          — mobilde satır → kart
    FilterBar.tsx               — arama + filtreler
    ActiveFilterChips.tsx       — uygulanan filtreler
    GuidedEmptyState.tsx        — grafikli boş durum + ilk aksiyon
    LoadingSkeleton.tsx
    ErrorState.tsx
    AccessDeniedState.tsx
  form/
    MultiStepForm.tsx           — sihirbaz iskeleti
    FormSection.tsx             — başlık + açıklama + alanlar
    Field.tsx                   — label + yardım + hata + input slot
    StickySaveBar.tsx           — kaydet/iptal alt bar
    UnsavedGuard.tsx            — sekme/rota değişiminde uyarı
    LivePreviewPanel.tsx        — sağda desktop/tablet/mobile önizleme
    MediaPicker.tsx             — kütüphaneden seçim + yükleme
  feedback/
    ConfirmationDialog.tsx      — mevcut ConfirmDialog'un evrimi
    UndoToast.tsx               — silme sonrası geri al
    ActivityTimeline.tsx        — kim, ne, ne zaman
  widgets/
    SmartSummaryCard.tsx        — dashboard KPI
    DashboardWidget.tsx         — konteynır
  domain/                       — her varlık için özelleşmiş form/tablo:
    services/, products/, references/, blog/, jobs/, team/, ...
```

Mevcut `GenericCrud.tsx` **kademeli olarak** varlığa özel sayfalarla değiştirilir (aşamalar 3-5).

## 7. Tasarım token sistemi

`.admin-scope` altında (bu tur eklendi, genişletilecek):

```text
--admin-navy: #0B1F3A        --admin-yellow: #F5C542
--admin-navy-dark: #071426   --admin-yellow-hover: #DFAE16
--admin-navy-med: #16345C    --admin-yellow-soft: #FFF7D6
--admin-bg: #F6F8FB          --admin-yellow-border: #F2D978
--admin-surface: #FFFFFF     --admin-success: #16A34A
--admin-surface-2: #F0F3F7   --admin-warning: #F59E0B
--admin-text: #142033        --admin-danger: #DC2626
--admin-text-2: #667085      --admin-info: #2563EB
--admin-text-mute: #98A2B3   --admin-border: #E4E7EC
--radius-sm: 8px  --radius-md: 12px  --radius-lg: 16px  --radius-xl: 20px
--shadow-1: 0 1px 2px rgba(11,31,58,.06)
--shadow-2: 0 4px 12px rgba(11,31,58,.08)
--shadow-3: 0 12px 32px rgba(11,31,58,.12)
--dur-fast: 120ms --dur-med: 200ms --ease: cubic-bezier(.2,.7,.2,1)
```

Dark mode aynı token adlarını override eder (bu tur eklendi).

## 8. Değiştirilecek dosyalar (tam yenilenecek)

- `src/routes/admin.tsx` → 911 satırlık monolit **silinir**; yerine `_authenticated/admin/` altında rota başına dosyalar.
- `src/components/admin/AdminShell.tsx` → yeni `shell/AdminShell.tsx` + `BrandSidebar` + `CommandTopbar`.
- `src/components/admin/nav.ts` → yeni bölüm/alt-bölüm hiyerarşisi + rota bağı.
- `src/components/admin/Dashboard.tsx` → widget tabanlı kontrol merkezi.
- `src/components/admin/GenericCrud.tsx` → parçalanır (SmartDataTable + FilterBar + form drawer'ı ayrılır); tam kaldırma Faz 5.
- `src/components/admin/PageHeader.tsx`, `EmptyState.tsx`, `ConfirmDialog.tsx` → yeni sürümlerle değiştirilir (isim/api korunur).
- `src/components/admin/SiteSettingsForm.tsx` → alt sekmeli çoklu form.

## 9. Refaktör edilecek (korunur, uyarlanır)

- `src/hooks/use-auth.ts` — router context ile entegre edilecek, aynı API.
- `src/lib/button-styles.ts` — navy/sarı varyantları eklenir; mevcut çağrılar bozulmaz.
- `src/styles.css` — token bölümü genişletilir; public site token'larına dokunulmaz.
- `src/routes/__root.tsx` — Cmd/K listener ve NotificationCenter portalı için provider eklenir.
- `src/routes/giris.tsx` — sonrası `?redirect=` param'ı okur (yeni auth akışıyla uyumlu).
- Public sayfalarda hâlâ statik `src/data/*` referansı olanlar → Supabase'e bağlanır (admin'de eklenen içeriğin görünmesi için gerekli).

## 10. Korunacak fonksiyonellik

- Tüm Supabase tabloları, RLS politikaları, `has_role`, trigger'lar, storage bucket.
- Mevcut auth akışı (`/giris`), admin rolü, ilk kullanıcı otomatik admin.
- Tüm formların kaydettiği alanlar (schema değişmez).
- Public site rotaları, SEO, sitemap, tema.
- Toast + confirm API'leri (`toast()`, `confirmDialog()`) — bileşenler yenilense de imza korunur.

## 11. Veritabanı riskleri ve önlemleri

**Yeni migration'lar** (her biri ayrı, veri kaybı riski olmadan additive):
- `deleted_at TIMESTAMPTZ` + `deleted_by UUID` — soft delete için içerik tablolarına.
- `activity_log` tablosu (user_id, entity, entity_id, action, diff jsonb, created_at) + trigger'lar.
- `content_versions` tablosu (entity, entity_id, snapshot jsonb, created_by, created_at).
- `menu_items` ve `home_sections` tabloları (menü + ana sayfa builder için).
- `notifications` tablosu (user_id, kind, payload, read_at).
- `app_role` enum'una `editor` eklenmesi; `has_role` değişmez, yeni izinler `has_any_role` ile.

**Precautions**
- Migration'lar CREATE + GRANT + RLS + POLICY dörtlü yapıda.
- Yeni sütunlar `NULL DEFAULT NULL` → mevcut satırlar bozulmaz.
- Public SELECT policy'leri `deleted_at IS NULL` filtresiyle güncellenir → çöp kutusu genel siteye sızmaz.
- Rollback için her migration ters SQL ile belgelenir.
- Production öncesi `supabase--read_query` ile satır sayıları doğrulanır.

## 12. Uygulama fazları

**Faz 0 — Temel (0.5 gün)**
- Token seti final; `.admin-scope` tüm admin rotalarına uygulanır.
- Rota iskeleti: `_authenticated/admin/` + alt rota dosyaları (boş sayfalar, redirect yok).
- `AdminShell` yeni sürüm devreye; eski `admin.tsx` içindeki içerik yeni sayfalara taşınır (fonksiyon değişmez).

**Faz 1 — Navigasyon ve komuta**
- `BrandSidebar` (grup açılır-kapanır, aktif rota vurgusu).
- `CommandTopbar` + `GlobalCommandPalette` (Cmd/K).
- `NotificationCenter` (contact_messages/quote_requests/job_applications realtime).
- `QuickCreateMenu` gerçek rotalara bağlanır.

**Faz 2 — Kontrol merkezi**
- `Dashboard` widget'ları (KPI, son aktivite, kurulum ilerlemesi gerçek verili, hızlı işlemler).
- `SetupChecklist` gerçek doluluk (settings/references gerçek kontrol).
- Realtime son 24s mesaj/teklif akışı.

**Faz 3 — Veri katmanı**
- `SmartDataTable` + `FilterBar` + `MobileDataCard` + `GuidedEmptyState` + `LoadingSkeleton` + `ErrorState`.
- İlk domain: **Ürünler** ve **Hizmetler** (en çok kullanılan) yeni tabloya taşınır; `GenericCrud` bu domainlerden kaldırılır.
- Toplu seçim + `ContextualActionBar` (toplu yayınla/sil/dışa aktar).

**Faz 4 — Form deneyimi**
- `MultiStepForm`, `FormSection`, `StickySaveBar`, `UnsavedGuard`, `LivePreviewPanel`.
- Medya kütüphanesi (`/admin/site/medya`) + `MediaPicker`.
- Otomatik taslak (draft) — form her 3sn'de local'e, dakikada bir DB'ye.
- Terminoloji cilası: "Slug → Sayfa Bağlantısı", "Meta Description → Arama Motoru Açıklaması" vb. + tüm alanlara helper text.

**Faz 5 — Kalan domainler**
- References, Blog, Blog Categories, Jobs, Applications, Team, Testimonials, Brands, Certificates, FAQ, Messages, Quotes, Users domain sayfalarına taşınır. `GenericCrud` kaldırılır.
- Site Ayarları alt sekmeli forma dönüştürülür + `LivePreviewPanel` bağlanır.
- Menü yöneticisi (`/admin/site/menu`) — public üst menü DB'den okunur.
- Ana sayfa builder (`/admin/site/anasayfa`) — sürükle-bırak bölüm sıralama.

**Faz 6 — Güvenlik ağı ve içgörü**
- Soft delete + çöp kutusu + geri yükleme + `UndoToast`.
- `activity_log` + `ActivityTimeline` her varlık detayında.
- `content_versions` + sürüm karşılaştır/geri yükle.
- `HelpDrawer` (her sayfa için Türkçe rehber).
- Erişim kontrolü: editor rolü + izin bazlı UI gizleme.
- Entegrasyonlar sayfası: GA/Meta Pixel/webhook.
- Beginner onboarding tur.

## 13. Test planı

- **Manuel duman testi** her faz sonunda: `/admin` giriş → sekme geçişi → CRUD ekle/düzenle/sil → toast → refresh → veri kalıcı.
- **Playwright** (`/tmp/browser/`): admin login, dashboard render, ürün ekleme akışı, silme + undo, Cmd/K arama, mobil drawer.
- **Supabase read_query** her migration sonrası satır sayısı/policy kontrolü.
- **Erişim testi**: user rolüyle giriş → `/admin` erişim reddi ekranı.
- **RLS testi**: anonim `curl` ile korumalı tablolara yazma denemesi 401/403 dönmeli.
- **Erişilebilirlik**: klavye ile tüm nav, ARIA-current aktif nav, form label eşleşmeleri, kontrast AA.
- **Mobil**: 375/768/1024 breakpoint'lerinde sidebar, tablo→kart, form kaydet butonu görünürlüğü.
- **Regression**: public site rotalarında tema/render değişmedi.

## 14. Rollback ve güvenlik planı

- Her faz ayrı commit + preview URL — kullanıcı onayı olmadan sonraki faza geçilmez.
- Rota bazlı: yeni `_authenticated/admin/*` sayfaları eski `/admin?tab=` ile paralel yayınlanır (Faz 3'e kadar). Eski rota `?tab` param'ını yeni rotaya redirect eder.
- Feature flag localStorage: `admin_v2=1` — sorun olursa eski shell'e dönülür.
- DB migration'ları **additive**; her biri için ters SQL notu (`.lovable/rollback/*.sql`).
- Storage'a dokunulmaz (mevcut `media` bucket korunur, sadece yeni obje yolları eklenir).
- İlk admin kullanıcısı asla silinemez (trigger korunur).

## 15. Faz bazlı kabul kriterleri

**Faz 0**: `/admin` yeni shell ile açılır, tüm eski sekmeler hâlâ çalışır, 0 regression.
**Faz 1**: Cmd/K arama, bildirim rozeti gerçek sayıyla, sarı [+ Ekle] tüm hızlı ekleme rotalarına gider. Sidebar grup daralt/genişlet kalıcı.
**Faz 2**: Dashboard tüm KPI'ları gerçek DB'den, setup ilerleme %'si doğru, son 5 mesaj + teklif akıyor, realtime yeni kayıt anında görünüyor.
**Faz 3**: Ürünler ve Hizmetler yeni tabloda: arama + filtre + sıralama + sayfalama + toplu seçim + mobilde kart görünümü + boş/hata/yükleniyor durumları. Kullanıcı 3 tıkla yeni ürün ekleyebiliyor.
**Faz 4**: Ürün formu 3 adımlı sihirbaz + sticky kaydet + kaydedilmemiş uyarısı + canlı desktop/tablet/mobil önizleme + medya kütüphanesinden görsel seçme. Tüm form alanlarında Türkçe yardım metni; "Slug" gibi terim kalmadı.
**Faz 5**: `GenericCrud` kaldırıldı, tüm domain sayfaları yeni sistemle. Site Ayarları alt sekmeli + önizlemeli. Menü ve ana sayfa builder çalışıyor, public site DB'den okuyor.
**Faz 6**: Silme → çöp kutusuna gider + 8s undo toast + çöp kutusundan geri yüklenebilir. Her düzenleme activity_log'a düşer, geçmiş sekmesinden görülebilir. Sürüm karşılaştır + geri yükle çalışır. Editor rolü ürün ekleyebilir ama kullanıcı silemez.

---

Onaylarsan Faz 0'dan başlıyorum. Faz sırasını değiştirmek istersen belirt (örn. medya kütüphanesini erkene çekmek).