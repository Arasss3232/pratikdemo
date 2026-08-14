# CMS Veri Akışı ve Editör Restorasyonu Planı

Mevcut sorun, global içeriklerin (Üst Bar, Header, Footer) CMS panelinde "İçerik Bulunamadı" hatasına düşmesi ve dinamik içeriklerin editörde görünmemesidir. Bu plan, global ve sayfa içeriklerini net bir şekilde ayırarak otomatik senkronizasyonu ve editör yansımasını kalıcı olarak düzeltecektir.

## Teknik Detaylar

1.  **Manifest ve Key Standardizasyonu:** `CMS_MANIFEST` içinde global alanlar için `top_bar`, `header_nav`, `footer` ve `sistem` anahtarları kullanılacak. Public rotalar için ise `/`, `/kurumsal` gibi gerçek path'ler kullanılacak.
2.  **Otomatik Bootstrap:** `syncPublicContent` server function'ı, manifestteki tüm global ve sayfa içeriklerini veritabanında (varsa dokunmadan, yoksa ekleyerek) oluşturacak.
3.  **Editör Mantığı:** `ContentManagement.tsx` Sidebar'ı, `activeId` ile veritabanındaki `route` kolonunu eşleştirecek. Global alanlar (`top_bar` vb.) rota bazlı filtrelemeye takılmadan manifestteki tanımlarıyla yüklenecek.
4.  **Veri Yansıması:** `usePageContent` hook'u, public tarafta CMS verisini öncelikli tutacak. `saveMutation` sonrası tüm ilgili TanStack Query önbellekleri temizlenecek.

## Uygulama Aşamaları

### Aşama 1: Veritabanı ve Manifest Senkronizasyonu
- `src/lib/sync-content.functions.ts` dosyasındaki `CMS_MANIFEST` güncellenerek `header_nav` ve eksik global alanlar eklenecek.
- `syncPublicContent` fonksiyonu, veritabanında eksik olan her bir alanı (field) `section_content` tablosuna otomatik ekleyecek.

### Aşama 2: CMS Sidebar ve Rota Yönetimi
- `src/components/admin/content/ContentManagement.tsx` dosyasında `NAV_ITEMS` güncellenerek `top_bar`, `header_nav` ve `footer` anahtarları DB ile uyumlu hale getirilecek.
- `activeItem.component === "content"` durumunda rotanın doğru şekilde (`top_bar`, `/kurumsal` vb.) `ContentEditorPanel`'e iletildiğinden emin olunacak.

### Aşama 3: Global Editörlerin İyileştirilmesi
- `ContentEditorPanel.tsx` içindeki boş durum mesajı iyileştirilecek.
- `NavigationPanel.tsx` (Header Nav için) güncellenerek veritabanından mevcut navigasyon kayıtlarını çekmesi ve senkronizasyon uyarısını dinamik yapması sağlanacak.

### Aşama 4: Public Yansıma ve Cache Yönetimi
- `src/hooks/use-page-content.ts` güncellenerek global içeriklerin (`top_bar`, `footer`) public tarafta sorunsuz yüklenmesi sağlanacak.
- `src/components/site-shell.tsx` içindeki `SiteHeader` ve `SiteFooter`, CMS'den gelen verileri (ikon, link, metin) öncelikli olarak kullanacak şekilde harden edilecek.

### Aşama 5: Doğrulama ve Test
- Playwright ile `top_bar`, `header_nav` ve `footer` editörlerinin içerik gösterdiği doğrulanacak.
- Kaydet/Yayınla sonrası public tarafta değişimin anında yansıdığı kontrol edilecek.
