## 1. Mevcut Sistem Denetimi

**Yönetim paneli (`src/routes/admin.tsx`, ~1013 satır)**
- Tek dosyalık büyük panel; `tab` query param ile sekme yönlendirmesi.
- Modüller: dashboard, settings, products, services, references, brands, certificates, team, testimonials, faqs, blog, blogcats, jobs, applications, messages, quotes, users (bkz. `admin/nav.ts`).
- Bileşenler: `AdminShell`, `Dashboard` (Supabase count sorguları), `GenericCrud` (SmartDataTable), `CommandPalette`, `SiteSettingsForm`, `PageHeader`, `EmptyState`, `ConfirmDialog`.
- Tema: `admin-scope` altında navy (#08182C) + sarı token'ları, Inter yazı tipi.

**Public site**: `index`, `hakkimizda`, `hizmetler[/$slug]`, `urunler[+7 kategori]`, `urun-detay/$sku`, `blog[/$slug]`, `kariyer[/$slug]`, `referanslar`, `sektorel`, `kataloglar`, `markalar`, `iletisim`, `kvkk`, `teklif`, `teklif-sepeti`, `giris`, `sitemap.xml`.

**Veritabanı (mevcut 21 tablo)**: `products, services, service_images, project_references, reference_images, brands, certificates, team_members, testimonials, faqs, blog_posts, blog_categories, blog_tags, blog_post_tags, job_posts, job_applications, contact_messages, quote_requests, media, site_settings, user_roles`.

**Auth & yetki**
- `user_roles` (enum: admin/user) + `has_role()` security-definer.
- `handle_new_user_role()`: ilk kayıt admin, kalanlar user (trigger yok — sadece fonksiyon var, migration'da bağlanacak).
- RLS her tabloda; genel desen: "public read + admin ALL" (public içerik) veya "authenticated insert + admin manage" (form gönderileri).

**Güçlü yönler (korunacak)**
- Navy + sarı token sistemi (`admin-scope`), SmartDataTable, CommandPalette, sticky topbar, PageHeader deseni, tek panelde tab yönlendirme mimarisi, Supabase entegrasyonu, RLS + `has_role` güvenlik omurgası.

**Zayıflıklar (giderilecek)**
- Tek dosyalık dev route (1000+ satır) — bakımı zor, split yok.
- Sadece iki rol (admin/user); B2B akışları yok.
- Firma/cari/teklif-sipariş/fiyat/stok modülleri yok.
- Onay iş akışı, aktivite kaydı, bildirim merkezi yok.
- Müşteri (B2B) portali yok; `teklif-sepeti` `localStorage` tabanlı.
- Rapor, ekstre, iade, sevkiyat kavramları yok.
- Mobil admin deneyimi sınırlı (drawer var ama tablo/CRUD ekranları dar).

## 2. Hedef Bilgi Mimarisi (Yönetim Paneli Sidebar)

`Ana Yönetim`, `Müşteri Yönetimi`, `Satış`, `Ürün ve Fiyat`, `Finans`, `Operasyon`, `Raporlar`, `Site Yönetimi`, `Sistem` — kullanıcı istediği yapıyı bire bir uygulayacağız. Site Yönetimi grubu mevcut CMS modüllerini (Ürünler/Hizmetler/Referanslar/Blog/SSS/Markalar/Sertifikalar/Ekip/Yorumlar/Kariyer/Mesajlar) tam olarak koruyacak — hiçbir mevcut CRUD kaybolmayacak.

```text
/admin
 ├─ /genel-bakis, /gorevlerim, /onaylar, /bildirimler
 ├─ /firmalar, /firmalar/$id, /bayiler, /firma-kullanicilari,
 │   /musteri-gruplari, /basvurular, /satis-temsilcileri
 ├─ /teklifler, /teklifler/$id, /siparisler, /siparisler/$id,
 │   /hizli-siparis, /sepetler, /firsatlar, /indirim-onaylari
 ├─ /urunler, /kategoriler, /markalar, /fiyat-listeleri,
 │   /ozel-fiyatlar, /iskontolar, /stok
 ├─ /cari-hesaplar, /kredi-limitleri, /vade, /odemeler,
 │   /ekstreler, /risk
 ├─ /depo, /sevkiyatlar, /teslimatlar, /iadeler, /belgeler
 ├─ /raporlar/{satis,teklif,siparis,musteri,urun,finans}
 ├─ /site/{sayfalar,icerikler,bannerlar,medya,seo,ayarlar}
 └─ /sistem/{kullanicilar,roller,onay-akislari,entegrasyonlar,
     islem-gecmisi,guvenlik}
```

Panel `/admin` altına, alt-route tabanlı yeni bir shell'e taşınacak: `src/routes/admin/route.tsx` (layout + guard) + her modül için `src/routes/admin/<segment>.tsx`. Mevcut `admin.tsx` tab akışı korunarak yeni segment route'lara aşamalı olarak parçalanacak.

## 3. Müşteri B2B Portali (Ayrı Namespace)

`/portal/*` — `_authenticated/portal` altında, sadece `company_user` rolü olanlar. Modüller: Panel özeti, Ürünler (kişiye özel fiyatlarla), Sepet, Teklifler, Siparişler, Ekstre, Firma Bilgileri & Kullanıcıları, Adresler, Belgeler, Duyurular, Temsilci İletişim. İç admin verisi asla sızmayacak.

## 4. Rol & Yetki Matrisi

**Dahili roller (enum genişletmesi)**: `super_admin, general_manager, sales_manager, sales_rep, finance, warehouse, operations, content_editor, report_viewer`.

**Firma rolleri (yeni enum `company_role`)**: `company_admin, purchasing, order_creator, finance_viewer, viewer`.

Yetki tablosu (özet):

| Alan | super_admin | sales_mgr | sales_rep | finance | warehouse | content | company_admin | purchasing | viewer |
|---|---|---|---|---|---|---|---|---|---|
| Firma CRUD | ✓ | ✓ | kendi portföyü | görüntüleme | – | – | kendi firması | – | – |
| Teklif oluştur | ✓ | ✓ | ✓ | – | – | – | ✓ | ✓ | – |
| Teklif onay | ✓ | ✓ | – | limit üstü | – | – | – | – | – |
| Sipariş onay | ✓ | ✓ | – | kredi/vade | – | – | ✓ | limit içi | – |
| Fiyat listesi | ✓ | ✓ | – | – | – | – | – | – | – |
| Stok görüntü | ✓ | ✓ | ✓ | ✓ | ✓ | – | görünürlük kuralı | görünürlük | – |
| Cari & ödeme | ✓ | özet | özet | ✓ | – | – | kendi ekstresi | – | ekstre görüntü |
| Sevkiyat | ✓ | – | okuma | – | ✓ | ✓ | takip | takip | – |
| CMS | ✓ | – | – | – | – | ✓ | – | – | – |
| Sistem | ✓ | – | – | – | – | – | – | – | – |

## 5. Onay İş Akışı

Yapılandırılabilir kural motoru: `approval_workflows(trigger_type, condition_jsonb, steps_jsonb)`. Tetikleyiciler: yeni firma, kredi limiti değişikliği, özel indirim, fiyat override, yüksek tutarlı teklif/sipariş, kredi üstü sipariş, vadesi geçmiş borçlu sipariş, sözleşme, rol değişikliği. Adımlar: satış temsilcisi → satış müdürü → finans → genel müdür. Her istek `approval_requests` + `approval_steps` üzerinde ilerler; timeline UI görevi olarak da `/gorevlerim`'de gösterilir.

## 6. Veritabanı Migration Planı (3 dalga)

Mevcut hiçbir tablo silinmez. Yalnızca `user_roles.role` enum'una yeni değerler eklenir (mevcut `admin/user` korunur — `admin` → `super_admin` alias'ı DB view ile sağlanır, kod kademeli geçer).

**Dalga 1 — Firma & kullanıcı çekirdeği**
- `companies` (firma_adi, vergi_dairesi, vergi_no, tip, musteri_grubu_id, bayi_seviyesi_id, sektor, cari_kodu, kredi_limiti, kullanilabilir_limit, vade_gun, risk_durumu, hesap_durumu, satis_temsilcisi_id, onay_durumu, notlar, created_by).
- `customer_groups`, `dealer_levels`.
- `company_users` (company_id, user_id, company_role, permissions_jsonb, invited_by).
- `company_addresses` (tip: fatura/teslimat, varsayılan bayrağı).
- `sales_representatives` (user_id, bölge, kod).
- Enum genişletme + `has_company_role()` security-definer.

**Dalga 2 — Ürün genişletme + fiyat + stok**
- `product_categories` (mevcut `products.category` metnini normalize et), `products` ek kolonlar (kod, birim, paket_adedi, min_siparis, b2b_gorunur, one_cikan, publication_status).
- `warehouses`, `inventory(product_id, warehouse_id, mevcut, rezerve, gelen)`.
- `price_lists`, `price_list_items`, `company_prices`, `discount_rules` (kategori/marka/kampanya bazlı, tarih aralıklı).

**Dalga 3 — Teklif, sipariş, cari, onay, operasyon, log**
- `quotations` + `quotation_items` + `quotation_revisions` (status TR label enum'u ile).
- `orders` + `order_items` + `order_status_history`.
- `approval_workflows`, `approval_requests`, `approval_steps`.
- `customer_accounts` (bakiye özeti view olabilir), `account_transactions`, `credit_limits`, `payments`.
- `shipments`, `shipment_items`, `returns`, `documents` (Storage `documents` bucket bağlı).
- `notifications`, `tasks`, `activity_logs`.

Her tablo için: `GRANT` bloğu → `ENABLE RLS` → policy'ler → `updated_at` trigger. Mevcut `quote_requests` **korunur**; yeni `quotations`'a "legacy" olarak taşınır (view ile birleştirilebilir), böylece iletişim formundan gelen teklif akışı çalışmaya devam eder.

## 7. Güvenlik Planı (RLS)

- `has_role(uid, app_role)` genişletilir, `has_company_role(uid, company_id, company_role)` eklenir, `current_company_id(uid)` helper'ı yazılır.
- Firma verisi izolasyonu: her B2B tabloda `company_id` + policy `USING (company_id = current_company_id(auth.uid()) OR has_role(auth.uid(),'super_admin') OR has_role(auth.uid(),'sales_manager'))`.
- Fiyat görünürlüğü: `company_prices` sadece kendi firması + iç satış rolleri.
- Finans tabloları: `finance` + `super_admin` yaz; `company_admin`/`finance_viewer` sadece kendi firması.
- `activity_logs` sadece `super_admin` okur; INSERT trigger'la sistem tarafından yazılır.
- Storage `documents` bucket'ı private; imzalı URL edge function ile (roller doğrulanır).
- Login-attempt koruması: `failed_login_attempts` tablosu + auth webhook; 10 dk lockout.
- İlk-admin trigger'ı yalnızca doğrulanmış e-posta ile çalışacak biçimde güncellenir.

## 8. Tasarım Sistemi Planı

Mevcut `admin-scope` navy/sarı paleti + Inter korunur; şu genişlemeler eklenir:
- **Token**: `--admin-surface-1/2/3`, `--admin-border`, `--admin-text-1/2/3`, `--admin-accent`, durum renkleri (`--status-draft/pending/approved/rejected/shipped/overdue`).
- **Tipografi**: başlıklarda Inter Tight opsiyonel; sayı gösterimlerinde `tabular-nums`.
- **Bileşenler**: `PageHeader`, `SmartDataTable` (mevcut GenericCrud üzerine sütun seçici + kayıtlı görünüm + toplu işlem), `StatusBadge`, `Timeline`, `ApprovalTracker`, `FilterBar`, `SavedViewMenu`, `DetailDrawer`, `SplitLayout` (list+detay), `MetricCard`, `Sparkline`, `PriceInput`, `MoneyDisplay`, `AddressCard`, `AttachmentList`, `NotificationDrawer`, `HelpDrawer`, `EmptyState`, `LoadingSkeleton`, `ErrorState`, `MobileRecordCard`.

## 9. Modül Bağımlılık Haritası

```text
companies ──► company_users ──► auth.users
    │
    ├─► company_addresses
    ├─► customer_groups / dealer_levels ──► price_lists
    ├─► sales_representatives
    └─► customer_accounts ──► account_transactions ──► payments

products ──► product_categories / brands
    ├─► inventory ──► warehouses
    ├─► price_list_items ──► price_lists
    └─► company_prices (product × company)

quotations ──► quotation_items ──► products
    ├─► quotation_revisions
    └─► convert ─► orders ──► order_items
                          ├─► order_status_history
                          ├─► shipments ──► shipment_items
                          └─► returns

approval_workflows ──► approval_requests ──► approval_steps
                                     ▲
                    quotations / orders / discounts / limits

notifications ◄── (tüm event'ler)
activity_logs ◄── (tüm mutasyonlar; DB trigger)
tasks ◄── (approval, follow-up)
```

## 10. Uygulama Fazları

**Faz 0 — Temel refactor (kod bozmadan)**
- `src/routes/admin.tsx`'i `src/routes/admin/route.tsx` layout + `src/routes/admin/index.tsx` (dashboard) + mevcut sekmeleri `src/routes/admin/<segment>.tsx` alt route'larına böl.
- `nav.ts`'i yeni 9 gruba göre yeniden yaz; eski CRUD ekranları "Site Yönetimi" grubunda aynen çalışır.
- SmartDataTable'ı `src/components/admin/data/` altına taşı; sütun-seçici, kayıtlı görünüm, toplu işlem eklenir.

**Faz 1 — Rol & firma çekirdeği**
- Dalga 1 migration + rol enum'u + `has_company_role`.
- `/admin/firmalar`, `/admin/firma-kullanicilari`, `/admin/musteri-gruplari`, `/admin/bayiler`, `/admin/satis-temsilcileri` ekranları.
- Kullanıcı davet akışı (`inviteUserByEmail` server fn, `requireSupabaseAuth` + rol kontrol).

**Faz 2 — Ürün & fiyat & stok**
- Dalga 2 migration; mevcut `products.category` metnini `product_categories`'e taşıyan veri migrasyonu (mevcut satırlar KORUNUR).
- Fiyat listeleri, özel fiyatlar, indirim kuralları UI'ı.
- Stok & depo ekranı; ürün detayında B2B görünürlük sekmesi.

**Faz 3 — Teklif & sipariş & onay**
- Dalga 3 migration.
- Teklif oluştur/düzenle (multi-item, indirim, KDV, revizyon, PDF export server fn), teklif → sipariş dönüşümü.
- Sipariş yönetimi + status timeline.
- Onay motoru + `/admin/onaylar` + `/admin/gorevlerim`.

**Faz 4 — Finans & operasyon**
- Cari, kredi limiti, vade, ödeme, ekstre PDF, risk raporu.
- Sevkiyat, teslimat, iade, belgeler.

**Faz 5 — Raporlar & bildirim**
- Rapor sayfaları (server fn ile agregasyon; Recharts).
- Bildirim merkezi (in-app + opsiyonel e-posta), `activity_logs` timeline'ı.

**Faz 6 — B2B müşteri portali**
- `/portal/*` route grubu, kişiye özel ürün/fiyat, teklif, sipariş, ekstre, firma yönetimi.
- Mevcut public `teklif` formu yeni `quotations` tablosuna bağlanır; giriş yapmış müşteri portale yönlendirilir.

**Faz 7 — Mobil, erişilebilirlik, cilalama**
- Tüm tablolara mobil kart görünümü, sticky action bar, komut paletine yeni komutlar, klavye kısayolları, WCAG kontrast denetimi, yardım drawer'ı.

## 11. Veri Koruma Planı

- Hiçbir DROP TABLE yok. Mevcut `quote_requests`, `contact_messages`, `job_applications`, `products`, `services`, tüm CMS tabloları aynen çalışmaya devam eder.
- `products.category` (text) → `product_categories` FK migrasyonu, eski kolon `category_legacy` olarak tutulur ve 2 sürüm sonra düşürülür.
- Rol enum genişletmesi additive; mevcut `admin` değeri korunur, kodda `super_admin` ile eşdeğer sayılır.
- Yeni tablolar boş başlar; seed sadece `customer_groups`, `dealer_levels`, örnek `price_lists`, varsayılan onay iş akışları için.

## 12. Test & Kabul Planı

- Migration sonrası: `supabase--linter`, RLS smoke testleri (her rol için select/insert/update matrisi), TanStack Router typecheck.
- E2E (Playwright): giriş → firma oluştur → kullanıcı davet → teklif oluştur → onay → siparişe dönüştür → sevkiyat → tamamlandı; müşteri portalinden teklif akışı.
- Kabul kriterleri: her modül için Turkish label, boş/yükleniyor/hata durumu; RLS ile başka firma verisine 403; onay adımları eksik role'de görev listesine düşer; mobilde tüm tablolar kart olarak taşınır; mevcut public site sayfaları hiçbir gerilemeye uğramaz.

## 13. Onay İçin Sorular

Bu plan kapsamlıdır; hepsini tek turda uygulamayacağım. Onaydan sonra **Faz 0 + Faz 1**'i uygulayarak başlamayı öneriyorum (refactor + firma/kullanıcı çekirdeği). Sonraki fazları sırayla ilerleteceğiz.

Onaylıyor musunuz, yoksa fazları veya kapsamı değiştirmek ister misiniz?