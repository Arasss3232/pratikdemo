# CMS Senkronizasyon ve İyileştirme Planı

CMS modülündeki boş ekran sorunlarını gidermek ve mevcut web sitesi içeriğini veritabanıyla tam uyumlu hale getirmek için kapsamlı bir restorasyon gerçekleştirilecektir.

## Yapılacak İşlemler

### 1. Senkronizasyon Motorunun Güçlendirilmesi
*   `src/lib/sync-content.functions.ts` dosyası, mevcut web sitesindeki tüm statik verileri (Üst Bar, Navigasyon, Footer, Sistem Mesajları, Sayfa Bölümleri) içerecek şekilde güncellenecektir.
*   **Top Bar:** Çalışma saatleri, adres, telefon, WhatsApp ve "Teklif Talep Et" buton verileri eklenecektir.
*   **Navigation:** 6 ana menü öğesi (Ana Sayfa, Kurumsal, Ürünler, Kataloglarımız, Bayiliklerimiz, İletişim) rota ve etiketleriyle senkronize edilecektir.
*   **Footer:** Logo, özet, iletişim bilgileri, ajans referansı ve tüm link grupları eklenecektir.
*   **Sistem Mesajları:** 404, Hata Sayfası, Form başarı/hata mesajları ve yükleme metinleri için bir dictionary yapısı kurulacaktır.

### 2. Admin Editörlerinin İyileştirilmesi
*   **NavigationPanel:** "Henüz bir link eklenmemiş" uyarısı yerine mevcut menü öğelerinin düzenlenebileceği bir liste sunulacaktır.
*   **ContentEditorPanel:** `label` alanı desteği ile teknik anahtarlar (field_key) yerine kullanıcı dostu etiketler gösterilecektir.
*   **Sistem Mesajları:** Bu modül, sayfa bazlı içerik yerine global bir "Mesaj Sözlüğü" editörüne dönüştürülecektir.

### 3. Public Web Sitesi Entegrasyonu
*   `src/components/site-shell.tsx` ve diğer bileşenlerdeki hardcoded veriler tamamen CMS'e bağlanacaktır.
*   Supabase RLS politikaları ve veri çekme kancaları (hooks) doğrulanarak admin dışı erişimin sadece yayınlanmış içeriklere olması sağlanacaktır.

### 4. Doğrulama ve Test
*   Playwright ile Admin panelindeki değişikliklerin anında kamuya açık siteye yansıdığı test edilecektir.
*   URL parametrelerinin izole edildiği ve navigasyon sırasında state kaybı yaşanmadığı kontrol edilecektir.

## Teknik Detaylar
*   **Tablolar:** `site_pages`, `page_sections`, `section_content`, `navigation_items`.
*   **Kısıtlamalar:** Mükerrer kayıt oluşumunu engellemek için `upsert` ve `onConflict` stratejisi kullanılacaktır.
*   **Güvenlik:** Admin yetkisi olmayan kullanıcıların CMS verilerini değiştirmesi engellenecektir.
