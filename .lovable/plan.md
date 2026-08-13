# Plan - Yapısal İçerik ve Navigasyon Güncellemesi

Bu plan, blog, kariyer ve hizmetler modüllerini kaldırırken, referansları bayiliklere dönüştürmeyi ve katalog yönetimini iyileştirmeyi hedefler. Tüm iletişim Türkçe olarak yürütülecektir.

## 1. Modül Kaldırma (Blog, Kariyer, Hizmetler)
- **Public:** Header, footer ve mobil menüden linkleri kaldır. Anasayfa bölümlerini ve ilgili rotaları devre dışı bırak.
- **Admin:** Yan menüden, dashboard kartlarından ve tüm CRUD ekranlarından ilgili modülleri kaldır.
- **Güvenlik:** Rotaları anasayfaya veya 404 sayfasına yönlendir. Verileri veritabanında sakla ama UI'dan tamamen gizle.

## 2. Referanslar -> Bayiliklerimiz Dönüşümü
- **Public:** Tüm "Referanslar" etiketlerini "Bayiliklerimiz" olarak değiştir. `/referanslar` rotasını `/bayiliklerimiz` rotasına yönlendir.
- **Admin:** Modül adını "Bayiliklerimiz Yönetimi" olarak güncelle. CRUD butonlarını ve form etiketlerini ("Yeni Bayilik Ekle" vb.) Türkçeleştir.
- **UI:** Logoları kurumsal, temiz ve responsive bir grid yapısında sun.

## 3. Katalog Yönetimi ve Geliştirmeler
- **Public:** Navigasyona "Kataloglarımız" ekle. `/kataloglar` rotasını standartlaştır.
- **Filtreleme:** Katalogları kategorilere ayır (Tüm Kataloglar, Diğer vb.). Filtreleme işlemini sayfa yenilenmeden yap.
- **Görünüm:** Katalog kapaklarını A4 oranında (210/297) `aspect-ratio` ile sabitle.
- **Etkileşim:** "Teklif Al" ve "Hızlı İncele" butonlarını kaldır. Sadece "İndir" butonu kalsın ve PDF'i yeni sekmede açsın. Arama kutusunu kaldır.
- **Admin:** "Katalog Yönetimi" modülünü tam işlevsel hale getir (Kategori atama, PDF/Kapak yükleme, sıralama).

## Teknik Detaylar
- **Navigasyon:** `src/components/site-shell.tsx` ve `src/components/admin/nav.ts` güncellenecek.
- **Rotalar:** `src/routes/` altındaki ilgili dosyalar (`blog.tsx`, `kariyer.tsx`, `hizmetler.tsx`) kaldırılacak veya yönlendirilecek.
- **Stil:** `src/styles.css` içinde katalog kapakları için A4 oran kuralı eklenecek.
- **Bileşenler:** `HomeSections.tsx` ve katalog grid bileşenleri revize edilecek.
