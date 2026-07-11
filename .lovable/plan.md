
# Admin Paneli — Tam Kapsamlı Yeniden Tasarım

Talebin çok geniş (34 başlık, ~150 alt madde). Bunların bir kısmı **saf UI** (yapılabilir), bir kısmı **veri altyapısı gerektiriyor** (yapılabilir ama migration + tablo), bir kısmı ise **dış servis entegrasyonu** gerektiriyor (Google Analytics, Meta Pixel, Search Console, gerçek ziyaretçi analitiği, e-posta gönderimi, yedekleme). Hepsini tek turda + sahte veri olmadan bitirmek mümkün değil. Bu yüzden **aşamalı** ilerleyeceğiz — ama her aşama **gerçek, çalışan** bir şey teslim eder; sahte kart/buton bırakmam.

Onayını alınca **Aşama 1**'i uygulamaya başlıyorum. Sonraki aşamaları sırayla teslim edeceğim.

---

## Tasarım Sistemi (tüm aşamalarda ortak — bir kez)

Ana sitedeki token'ları admin panelinde de kullanacağım (zaten paylaşılıyor: `--primary` lacivert, `--secondary` amber, Inter fontu, `surface-container-*` yüzeyler, `outline-variant` çizgiler, `rounded-md/lg`). Admin'e özgü ek token yok — tutarlılık için mevcut sistem yeniden kullanılıyor.

- Buton stilleri: `src/lib/button-styles.ts` (mevcut) — admin de bunu kullanır
- Kart: `bg-surface-container-lowest border border-outline-variant rounded-lg`
- Aktif menü vurgusu: sol 3px `bg-primary` çizgi + `bg-primary/8` arka plan + `font-label-bold`
- Durum badge renkleri: success=green-600, warning=amber-600, danger=red-600, info=primary, muted=on-surface-variant
- Radius/gölge/boşluk: ana siteyle aynı

Karanlık tema mevcut `.dark` class'ıyla; localStorage'da saklanır.

---

## Aşama 1 — İskelet + Dashboard + Ortak Bileşenler (bu turda)

**Amaç:** Yeni kabuk, tüm sayfalar için tekrar kullanılan altyapı, dashboard, listeleme deneyimi. Mevcut CRUD verisi hiç bozulmadan yeni sistem üzerine taşınır.

### Yapılacaklar
1. **`AdminShell`** — sabit topbar (sidebar toggle, global arama, hızlı ekle, siteyi görüntüle, bildirim, tema, profil menüsü), sol sidebar (gruplu, daraltılabilir, tooltip'li, mobil çekmece), içerik alanı + breadcrumb.
2. **Sidebar menüsü** — istediğin gruplar (Genel / Site İçerikleri / Başvurular ve Mesajlar / Görünüm ve Tasarım / Pazarlama ve SEO / Sistem). Şu an veri altyapısı olmayan menüler (Analitik, Meta Pixel, Yedekleme, İşlem Geçmişi, Roller matrisi, Medya Kütüphanesi, Menü Yönetimi, Sayfa Builder, Yönlendirmeler) sidebar'da görünür ama tıklanınca **"Yakında" değil, gerçek durum ekranı**: "Bu modül henüz aktif değil, aktifleştirmek için tek tık" — aktifleştirme sonraki aşamalarda migration ile geliyor. Sahte grafik/veri göstermem.
3. **Global arama** — ürün, hizmet, blog, referans, mesaj, teklif, sayfa başlığı üzerinde canlı arama (Supabase üzerinden, debounce).
4. **Hızlı Ekle menüsü** — Ürün / Hizmet / Blog / Referans / Sayfa direkt ilgili modal'ı açar.
5. **Dashboard** — 
   - Karşılama alanı + **Site Kurulumu ilerleme çubuğu** (firma bilgisi, logo, hizmet var mı, ürün var mı, iletişim, referans, blog — DB'den gerçek kontrol, %)
   - 8 özet kart (Yayında Ürün, Yayında Hizmet, Yeni Mesaj, Bekleyen Teklif, Bekleyen Başvuru, Yayında Blog, Taslak İçerik, Toplam Referans) — hepsi gerçek sayı, tıklanınca ilgili sayfaya gider
   - Son 5 mesaj / son 5 teklif / son düzenlenen 5 içerik / hızlı işlemler
   - Ziyaretçi grafiği: **veri kaynağı yok — göstermem.** Google Analytics bağlanınca gelecek (Aşama 5).
6. **Ortak bileşenler:**
   - `DataTable` — arama, sıralama, filtre, sayfalama, toplu seçim, satır menüsü (Görüntüle/Düzenle/Kopyala/Yayınla/Yayından kaldır/Arşivle/Sil), tablo↔kart görünüm toggle (localStorage), boş durum
   - `EmptyState`, `ConfirmDialog` (mevcut — genişlet: içerik sayısı gösterimi, tehlike rengi)
   - `FormModal` — sekmeli (Genel / İçerik / Görseller / SEO / Yayın), sabit alt bar (Kaydet / Taslak / Önizle / Yayınla / İptal), kaydedilmemiş değişiklik uyarısı, otomatik taslak (5 sn debounce → localStorage), "Son kayıt: HH:MM"
   - `FormField` — teknik olmayan etiket + yardım metni + hata mesajı + karakter sayacı ("Slug"→"Sayfa bağlantısı" gibi dönüşümler burada standart)
   - `ImageUploader` — sürükle-bırak, önizleme, alt metin, önerilen ölçü ipucu, Supabase storage'a yükleme, WebP tercihi
   - `SeoFields` — Google başlığı, Google açıklaması, sayfa bağlantısı, sosyal görsel + **canlı Google SERP önizlemesi** + karakter uyarısı
   - `Toast` — sonner (mevcut, `Toaster` __root'ta), tüm işlemlerde başarı/hata bildirimi
   - `Skeleton` — tüm liste/form yüklemelerinde
7. **URL derin link** — `/admin?tab=products` gibi, tarayıcı ileri/geri çalışır.

### Aşama 1 sonunda çalışır durumda olacaklar
- Yeni kabuk her yerde
- Dashboard gerçek verilerle
- Mevcut CRUD sekmeleri (Hizmetler, Ürünler, Referanslar, Blog, Blog Kategorileri, SSS, Markalar, Sertifikalar, Ekip, Yorumlar, İş İlanları, Başvurular, Mesajlar, Teklifler, Site Ayarları, Kullanıcılar) yeni `DataTable` + `FormModal` deneyimiyle — hepsi gerçek DB, silmede onay + toast, kullanıcı dostu etiketler

---

## Aşama 2 — Çöp Kutusu + Sürüm Geçmişi + İşlem Geçmişi (soft delete altyapısı)

Migration: her ana tabloya `deleted_at`, `deleted_by` kolonları + `content_versions` tablosu + `activity_log` tablosu + RLS + GRANT'ler. Silme artık soft delete; "Çöp Kutusu" menüsü, geri yükleme, kalıcı silme. İçerik düzenlemede "Sürüm Geçmişi" sekmesi. "Sistem → İşlem Geçmişi" sayfası.

## Aşama 3 — Medya Kütüphanesi + Menü Yönetimi + Sayfa Yönetimi

`media` bucket'ı zaten var. Ayrı bir kütüphane sayfası (grid, arama, alt metin düzenle, kullanım yerleri). `nav_menus` + `nav_items` tabloları (sürükle-bırak). `pages` tablosu (dinamik sayfalar + slug + SEO).

## Aşama 4 — Ana Sayfa Blok Builder + Rol/Yetki Matrisi + Bildirim Merkezi

`home_sections` tablosu (tip + sıra + payload jsonb + aktif). Sürükle-bırak + canlı önizleme (masaüstü/tablet/mobil iframe). Rol matrisi UI'ı (modül × işlem grid'i, `role_permissions` tablosu). Bildirim merkezi (`notifications` tablosu + realtime).

## Aşama 5 — Analitik + SEO Yönlendirmeler + Dış Entegrasyonlar

Kendi ziyaretçi izleyicimizi kurarım (`page_views` tablosu — her sayfa yüklemesinde küçük bir kayıt, kişisel veri toplamadan). Dashboard gerçek grafiği bundan çeker. Google Analytics / Meta Pixel / Search Console için **ölçüm ID alanı** ve kod enjeksiyonu (harici hesapları kullanıcı bağlar). `redirects` tablosu (301/302).

## Aşama 6 — Yedekleme + Güvenlik + Gelişmiş Erişilebilirlik denetimi

Yedekleme = DB'nin JSON export'unu indirme + geri yükleme. Başarısız giriş denemesi kaydı, oturum listesi. Tüm sayfaların klavye/kontrast denetimi.

---

## Kapsam dışı bırakmam gerekenler (açıkça)

- **Gerçek e-posta gönderimi**: SMTP/Resend gibi bir servis + API anahtarı gerekir. Aşama 2'de bağlarız, senden anahtar isterim.
- **Meta Pixel / Google Analytics ölçümü**: Sadece kod yerleştirme yapılır. Ziyaretçi verisi Google/Meta'da görünür; admin paneline özet çekmek için ek OAuth entegrasyonu gerekir (Aşama 5+).

---

## Onayınla başlıyorum

"Onaylıyorum" dersen **Aşama 1**'i tek seferde teslim ederim (kabuk + dashboard + tüm mevcut CRUD sekmelerinin yeni deneyimle çalışır hali + ortak bileşenler + global arama + hızlı ekle + karanlık tema + mobil). Sonra 2. aşamayı açacağım.

Aşamalar veya kapsam hakkında değiştirmek istediğin bir şey varsa söyle — plana işleyip yeniden sunayım.
