# Admin CMS Restorasyon Planı

Kapsamlı bir içerik yönetim sistemi (CMS) oluşturmak için mevcut modülü tamamen yeniden yapılandıracağız. Sitedeki her metin, link ve görsel URL'sini 1:1 eşleyerek admin panelinden yönetilebilir hale getireceğiz.

## 1. Veritabanı ve Veri Yapısı (Supabase)
`site_content` tablosundaki mevcut verileri temizleyip, tüm site bölümleri için kapsamlı bir şema oluşturacağız.

- **Üst Bilgi (top_bar):** Çalışma saatleri, adres, telefon, WhatsApp bilgileri.
- **Header (header):** Logo URL, menü etiketleri (Ana Sayfa, Kurumsal, vb.), CTA buton metni.
- **Footer (footer):** Şirket açıklaması, iletişim bilgileri, sosyal medya linkleri, telif hakkı metni.
- **Ana Sayfa (hero):** Başlık, alt başlık, buton metinleri, istatistikler.
- **Kurumsal (corporate):** Hakkımızda başlığı, içerik (textarea), misyon, vizyon.
- **İletişim (contact):** Sayfa başlığı, form etiketleri, harita URL'si.

## 2. Admin UI Geliştirmeleri (`ContentEditorPanel.tsx`)
Formları daha düzenli ve kapsamlı hale getireceğiz.
- `shadcn/ui` bileşenleri (`Input`, `Textarea`, `Card`) kullanarak alanları gruplandıracağız.
- `field_key` bazlı dinamik render yerine, her bölüm için özel alan grupları tanımlayacağız.
- "Geri Al" ve "Yayınla" butonlarını `useContentManager` hook'una tam entegre edeceğiz.

## 3. Durum Yönetimi (`useContentManager`)
- `originalData` ve `draftData` ayrımını koruyarak, "Geri Al" özelliğinin draft'ı sıfırlamasını sağlayacağız.
- Değişiklik kontrolü (`hasChanges`) ile butonların aktiflik durumunu yöneteceğiz.

## 4. Frontend Entegrasyonu
- `SiteHeader`, `SiteFooter`, `HomeHero` ve `CorporateSections` bileşenlerini yeni şemadan veri çekecek şekilde güncelleyeceğiz.
- Tüm alanlar için güvenli yedek değerler (fallback) ekleyeceğiz.

## Teknik Detaylar
- **Table:** `site_content` (page_section, field_key, content_value).
- **Hooks:** `useContentManager` (admin tarafı), `useSiteContent` (ziyaretçi tarafı).
- **Ziyaretçi tarafında SSR/hydration güvenliği için fallback değerleri sabit dosyalardan veya prop'lardan okunacak.**
