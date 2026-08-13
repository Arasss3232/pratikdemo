# Admin Paneli Restorasyon Planı

Admin panelini modüler, profesyonel ve her sorumluluğun kendi alanında olduğu temiz bir yapıya geri döndüreceğim. "Site İçerik Yönetimi"ni sadece ziyaretçi odaklı metinlerle sınırlayıp, yapısal verileri (Kategoriler, Kataloglar vb.) kendi modüllerine taşıyacağım.

## Adımlar

### 1. Navigasyon ve Rota Yönetimi
- `src/components/admin/nav.ts` dosyasını talep edilen 5 ana grup (Ana Yönetim, İçerik Yönetimi, İşlemler, Kurumsal ve Site, Sistem) ve 17 modüle göre güncelleyeceğim.
- URL parametrelerini (`tab`, `contentTab`, `seoTab`) birbirinden izole ederek çakışmaları önleyeceğim.

### 2. Dashboard (Genel Bakış) Restorasyonu
- `src/components/admin/Dashboard.tsx` dosyasındaki "yakında" placeholder'larını kaldırıp; toplam teklif, yeni mesajlar, aktif kategori/katalog sayıları gibi gerçek Supabase verilerini gösteren KPI kartlarını ve "Hızlı Aksiyonlar" bölümünü ekleyeceğim.

### 3. CMS (Site İçerik Yönetimi) Sadeleştirme
- `src/components/admin/content/ContentManagement.tsx` içinden SEO, Kategori, Katalog ve Bayilik gibi yapısal veri yönetimlerini çıkaracağım.
- CMS navigasyonunu; Global (Genel, Header, Footer), Sayfalar (Ana Sayfa, Kurumsal vb.) ve Sistem Mesajları olarak 16 kalemlik bir yapıya oturtacağım.

### 4. Modüler Fonksiyonellik
- Kategori, Katalog ve Bayilik modüllerini `src/components/admin/GenericCrud.tsx` veya özel bileşenler üzerinden gerçek CRUD işlemlerine bağlayacağım.
- SEO modülünü CMS'ten tamamen ayırıp bağımsız bir modül olarak `src/components/admin/seo/SeoShell.tsx` altında çalıştıracağım.
- Kullanıcılar, Roller ve İşlem Geçmişi için placeholder'lar yerine çalışan gerçek yönetim ekranlarını devreye alacağım.

### 5. Veri ve Güvenlik
- Her modülün sadece kendi tablosuna erişmesini sağlayacak veri sahipliği haritasını uygulayacağım.
- Admin yetkilerini (`content.update` vs.) modül bazlı ayrıştıracağım.

## Teknik Ayrıntılar
- **Teknoloji:** TanStack Start, Supabase (RLS & Auth).
- **Tasarım:** Mevcut Lacivert-Sarı "Industrial Authority" teması korunacak.
- **Doğrulama:** Browser üzerinden tüm modüllerin bağımsızlığı ve gerçek verilerle çalışması test edilecek.

Gereksiz eklentileri temizleyip, profesyonel bir B2B yönetim deneyimi sunacağım.
