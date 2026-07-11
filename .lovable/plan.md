# Admin Paneli Tam Yeniden Yapılandırma Planı

Talebiniz 35+ modülü kapsıyor (medya kütüphanesi, sürükle-bırak sayfa/menü inşacıları, rol matrisi, yedekleme, sürüm geçmişi, Google/Meta entegrasyonları, tarayıcı testleri…). Bu, tek turda tamamlanabilecek bir kapsam değil; yarım bırakılırsa daha kötü bir durum ortaya çıkar (bazı sayfalar modern, bazıları eski). Bu yüzden işi 6 faza böldüm ve her fazı ayrı bir turda uçtan uca teslim edip test edeceğim.

## Faz A — Görsel bütünlük (bir sonraki tur)
Amaç: mevcut hiçbir admin sekmesi eski görünmesin.
- `products`, `quotes`, `users`, `messages` sekmelerinin özel tabloları da `SmartDataTable` görünümüne geçer
- `PageHeader` + Türkçe açıklamalar tüm sekmelerde
- `ConfirmDialog` yeni tema
- Loading skeleton + empty state her sekmede
- Sidebar mobil drawer davranışı düzeltme

## Faz B — Mesaj/Başvuru merkezi
- Inbox: Yeni · Okundu · İşleme Alındı · Cevaplandı · Tamamlandı · Arşivlendi
- Durum güncelleme, dahili not, atama, toplu işlem, arama, filtre
- `contact_messages`, `quote_requests`, `job_applications` için ortak inbox bileşeni
- Yeni kolonlar: `status`, `assigned_to`, `internal_notes` (migration)

## Faz C — Rehberli içerik oluşturma
- Ürün + Hizmet için çok adımlı wizard (Temel · Kategori · İçerik · Görseller · Teknik · SEO · Önizleme · Yayın)
- Taslak / Yayın / Zamanlama alanları (migration)
- Basit revizyon geçmişi (audit tablosu)

## Faz D — Medya kütüphanesi
- `media` bucket + `media` tablosu (zaten mevcut) üzerinden görsel yükleyici
- Sürükle-bırak yükleme, ızgara/liste, arama, tür filtresi, alt-metin düzenleme, güvenli silme
- Ürün/Hizmet/Blog formlarında "Kütüphaneden seç" bağlantısı

## Faz E — Yapısal yönetim
- **Ana Sayfa Düzeni**: `home_sections` tablosu + sürükle-bırak (dnd-kit), göster/gizle/çoğalt/sil, cihaz önizleme
- **Menü Yönetimi**: `nav_menus` + `nav_items`, iç içe drag-drop, sayfa seçici + özel URL
- **Tasarım Ayarları**: logo/renk/font/radius/shadow — canlı önizleme, WCAG kontrast uyarısı (Türkçe)
- **SEO**: Google SERP önizleme, karakter sayacı, sosyal görsel; site_settings üzerinden

## Faz F — Güvenlik, roller, gözlem
- Rol matrisi: 6 rol × 7 izin grubu (`role_permissions` tablosu)
- Sidebar/rota `hasPermission()` ile gizlenir
- `activity_logs` tablosu + İşlem Geçmişi sayfası
- Bildirim merkezi (topbar zil): yeni mesaj/başvuru/teklif
- SSS/Slider/Banner/Galeri/Referans için standart CRUD (yeni tasarımla)
- Analitik entegrasyonları (GA4/Search Console/Meta Pixel) — site_settings’e script alanları

## Kapsamda kısıtlanacaklar
Aşağıdakiler bu proje kapsamında **gerçekçi değil** ve kısaltılmış/atlanmış olarak teslim edilecek — netlik için önden söylüyorum:
- **Yedekleme**: Lovable Cloud’da servis rolüne erişim yok; “Cloud → Advanced settings → Export data” yönlendirmesi olarak kalır
- **Google Analytics / Search Console / Meta Pixel**: Script/ID alanı + site head’e enjekte; API tarafında canlı istatistik değil
- **Ziyaretçi İstatistikleri**: Hafif client-side sayaç (page_views tablosu) — GA seviyesi değil
- **Yazı Tipleri**: Sistem-tarafı Inter kalıyor; sadece heading/body ölçek ve harf aralığı ayarlanabilir olur
- **Tarayıcı testleri**: Playwright ile giriş → sidebar → CRUD → form → oturum kapatma dumu (30 testin tamamı değil, kritik akışlar)

## Onay istediğim şey
1. Bu 6 fazlı sırayla ilerlememi onaylıyor musunuz? (Faz A → F, her fazın sonunda size teslim + test)
2. Yoksa öncelik değişsin mi? Örn: **Medya kütüphanesi + Ana Sayfa Düzeni**ni öne al, sonrası devam etsin.

Onay verdiğinizde Faz A ile başlıyorum ve o tur içinde tüm mevcut sekmelerin görsel bütünlüğünü tamamlıyorum.