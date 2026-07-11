
# Admin Paneli Yeniden Tasarımı

Amaç: Teknik bilgisi olmayan bir kullanıcının bile kolayca kullanabileceği; sade, ferah, hızlı, premium hisli bir yönetim paneli. Mevcut veriler, yetkiler ve veritabanı yapısı aynen korunur — sadece kullanıcı deneyimi, düzen ve ortak bileşenler yenilenir.

## Genel yerleşim

```text
┌──────────────────────────────────────────────────────────┐
│  Topbar: [☰] Arama…  [+ Hızlı ekle]  [Site] [🔔] [👤] │
├──────────┬───────────────────────────────────────────────┤
│ Sidebar  │  Sayfa başlığı                                │
│  Genel   │  Breadcrumb › Bölüm › Sayfa                   │
│  İçerik  │                                               │
│  İletişim│  ┌ İçerik alanı (kartlar / tablo / form) ─┐  │
│  Site    │  │                                        │  │
│  Sistem  │  └────────────────────────────────────────┘  │
└──────────┴───────────────────────────────────────────────┘
```

- Sol **sidebar**: masaüstünde açık, tabletten itibaren ikon moduna daralabilir; mobilde hamburgerle çekmece olarak açılır. Aktif menüde sol vurgu çizgisi + hafif arka plan + kalın yazı. Menüler mantıklı gruplara ayrılır (Genel, İçerik Yönetimi, İletişim, Site Yönetimi, Sistem).
- Sabit **topbar**: sidebar toggle, global arama, hızlı ekle menüsü, "Siteyi görüntüle", bildirim ikonu, karanlık/açık tema, kullanıcı profil menüsü (e-posta + çıkış).
- Her sayfada **başlık + breadcrumb + kısa açıklama + sağda birincil aksiyon** başlığı.

## Sidebar menü yapısı

- **Genel**: Dashboard, Siteyi Görüntüle
- **İçerik Yönetimi**: Hizmetler, Ürünler, Referanslar, Blog, Blog Kategorileri, SSS
- **İletişim**: Gelen Mesajlar, Teklif Talepleri, İş Başvuruları
- **Site Yönetimi**: Site Ayarları, Markalar, Sertifikalar, Ekip, Müşteri Yorumları, İş İlanları
- **Sistem**: Kullanıcılar

Her menünün altında hover'da tooltip (daraltılmış moda hazır). Aktif öğe belirgin, alt gruplar yumuşak geçişle açılır.

## Dashboard

Sade, ferah, sadece gerçekten gerekli bilgiler:

- Üstte 6 özet kart (tıklanınca ilgili yönetim sayfasına gider):
  - Toplam Ürün
  - Toplam Hizmet
  - Bekleyen Teklif Talebi
  - Yeni Mesaj
  - Yayında Blog Yazısı
  - Açık İş İlanı
- Kartlar: hafif gölge, yuvarlatılmış köşeler, küçük ikon, büyük sayı, açıklayıcı alt metin. Renkli arka plan yok.
- Alt bölüm iki sütun:
  - **Son Gelen Mesajlar** (5 kayıt, "tümünü gör")
  - **Son Teklif Talepleri** (5 kayıt, "tümünü gör")
- Altta **Hızlı İşlemler** butonları: Ürün Ekle, Hizmet Ekle, Blog Yazısı Ekle, Referans Ekle, Site Ayarlarına Git, Mesajları Görüntüle.

Ziyaretçi grafiği ve analytics şu an sahte veri gerektirdiği için eklenmez — istenirse ayrı bir turda gerçek veri kaynağıyla entegre edilir.

## Standart liste sayfaları

Tüm CRUD sayfaları aynı iskelette:

- Sayfa başlığı + kısa açıklama + sağ üstte "Yeni ekle"
- Arama kutusu (isim/başlık üzerinden client-side)
- Durum filtresi (yayında/taslak) — ilgili tablolarda
- Sıralama (yeni → eski / eski → yeni)
- Görünüm: tablo (masaüstü) / kart (mobil, otomatik)
- Boş durum: ikon + açıklama + "İlk kaydı ekle" butonu
- Tablolar sade: satır aralıkları geniş, dikey çizgi yok, hover'da satır vurgusu, durum badge'i, satır sonunda üç noktalı menü (Düzenle, Yayınla/Kaldır, Sil-kırmızı)
- Sayfalama: 20 kayıt/sayfa, altta anlaşılır kontrol

## Standart form/modal

Uzun formlar sekmelere ayrılır: **Genel · İçerik · Görsel · SEO · Yayın**.

- Modal geniş (max-w-3xl), üstte başlık, altta sabit aksiyon barı: **Kaydet · İptal**
- Alan etiketleri belirgin, gerekli alanlar `*` ile, altında yardımcı açıklama
- Hata mesajları alanın hemen altında
- Kaydedilmemiş değişiklik varsa çıkışta onay
- Silmede kırmızı onay modal'ı (`confirm` yerine özel dialog)

## Ortak bileşenler (yeni)

`src/components/admin/` altında:

- `AdminShell.tsx` — sidebar + topbar + içerik iskeleti, mobil çekmece, tema toggle, global arama
- `PageHeader.tsx` — başlık + breadcrumb + açıklama + aksiyon
- `StatCard.tsx` — dashboard özet kartı
- `DataTable.tsx` — arama/filtre/sıralama/boş durum + satır menüsü içeren sade tablo
- `EmptyState.tsx` — ikon + metin + CTA
- `ConfirmDialog.tsx` — silme/tehlikeli işlem onayı
- `Toast.tsx` + `useToast` — sağ üstten kısa bildirim ("Kaydedildi", "Silindi", "Hata")
- `FormModal.tsx` — sekmeli, sabit alt bar aksiyonlu form konteyneri
- Mevcut `GenericCrud.tsx` ve `SiteSettingsForm.tsx` yeni bileşenler üzerine taşınır (davranış korunur).

## Görsel dil

- Tek font: Inter (mevcut kurulum korunur).
- Renk paleti: mevcut marka lacivert `primary` + amber `secondary`. Panel içinde ağırlıklı olarak beyaz, açık gri (`surface-container-*`) ve koyu gri metin. Vurgu için yalnızca aktif öğe / birincil buton.
- Durum renkleri (badge/toast): yeşil=başarılı, turuncu=uyarı, kırmızı=hata, mavi=bilgi, gri=taslak.
- Yumuşak gölge, `rounded-md`/`rounded-lg`, geniş iç boşluk. Ağır gölge/büyük ikon yok.

## Mobil uyum

- Sidebar hamburgerle sağdan çekmece.
- Tablolar tek sütunlu kartlara dönüşür (aynı `DataTable` bileşeninde `md:` breakpoint).
- Formlar tek sütun; alt bar (Kaydet / İptal) ekrana sabitlenir.
- Filtreler tek butonla açılan panel.

## Sayfa listesi (route içi tab yerine gerçek alt route hissi)

Mevcut `/admin` tek route kalır (state ile alt sayfa değişir) ama URL query (`?tab=products`) üzerinden derin link desteği eklenir — böylece sidebar linkleri paylaşılabilir ve tarayıcı ileri/geri çalışır.

## Yapılmayacaklar

- Veritabanı şeması değiştirilmez.
- Rol/yetki mantığı, oturum akışı, mevcut Supabase sorguları aynen kalır.
- Ziyaretçi analytics, medya kütüphanesi, form builder, roller matrisi, işlem geçmişi gibi **veri altyapısı olmayan** modüller bu turda eklenmez (sahte veri kullanmama kuralı gereği). İhtiyaç varsa ayrı bir turda ele alınır.
- Global arama şu an sayfa/menü içinde çalışır (ürün/mesaj/blog gibi tablolarda tam arama sonraki turda).

## Teknik notlar

- Route: `src/routes/admin.tsx` mevcut yapıdan `AdminShell` ile sarılır; her tab kendi bileşenine ayrılır (`src/routes/admin/` veya `src/components/admin/tabs/` altına dosyalar bölünür — 900 satırlık tek dosya küçültülür).
- Tab state URL query ile senkronlanır (`useSearch` + `navigate({ search })`).
- `sonner`/`radix` gibi yeni bağımlılık eklemeden; ortak `Toast` ve `ConfirmDialog` küçük ve stilize.
- Karanlık tema `class="dark"` toggle'ı `localStorage`'a yazılır; mevcut `.dark` token'ları kullanılır.
- Erişilebilirlik: tüm ikon-only butonlarda `aria-label`, klavye ile gezinme, `focus-visible` halkası, form label bağlantıları.

## Kabul kriterleri

- Sidebar açılıp kapanabiliyor; mobilde hamburger çalışıyor.
- Dashboard açıldığında 6 özet kart gerçek sayılarla dolar; kartlar tıklanınca ilgili sayfaya gider.
- Her liste sayfasında arama, sıralama, boş durum, satır menüsü, sayfalama çalışır.
- Silme işlemleri özel onay dialog'u ile gerçekleşir, sonrasında toast gösterir.
- URL `/admin?tab=products` gibi doğrudan açılabilir.
- Tüm sayfalar aynı başlık/breadcrumb/aksiyon iskeletinde.
- Mevcut CRUD davranışı ve veritabanı işlemleri hâlâ çalışır.

Onaylarsan uygulamaya başlıyorum. Yalnızca "grafik/analytics" ve "medya kütüphanesi" gibi altyapı gerektiren modülleri kapsam dışında tutuyorum; onları eklemek istersen ayrıca planlayalım.
