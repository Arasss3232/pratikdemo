# Pratik Tedarik Yapı Admin Panel Geliştirme Planı

Bu plan, admin panelindeki beş eksik modülün (Görevlerim, Onay Bekleyenler, Bildirimler, İşlem Geçmişi, Roller ve Yetkiler) aktif hale getirilmesini ve sistem genelinde entegrasyonunu kapsamaktadır.

## Kullanıcı Özeti
- **Dil:** Tamamen Türkçe.
- **Tasarım:** Lacivert-Sarı endüstriyel tema (Industrial Authority).
- **Kapsam:** Kurumsal teklif odaklı sistem (B2B/E-ticaret özellikleri kaldırıldı).
- **Hedef:** Roadmap placeholder'larını gerçek çalışan modüllerle değiştirmek.

## Teknik Detaylar
- **Backend:** Supabase (PostgreSQL, RLS, Edge Functions yerine TanStack Start Server Functions).
- **Frontend:** TanStack Start v1, React 19, Tailwind v4.
- **Güvenlik:** RLS politikaları, server-side yetki kontrolü, immutable audit log.

## Adımlar

### 1. Veritabanı ve Güvenlik Altyapısı
- `app_role` enum'ına `seo_manager` eklenmesi.
- Yeni tabloların oluşturulması:
  - `admin_tasks`: Görev yönetimi.
  - `task_notes`: Görev içi notlar.
  - `approval_requests`: Onay akışları.
  - `approval_events`: Onay geçmişi.
  - `notifications`: Sistem içi bildirimler.
  - `notification_preferences`: Kullanıcı bazlı tercihler.
  - `audit_logs`: İşlem geçmişi (immutable).
  - `permissions`: Yetki anahtarları tanımları.
  - `role_permissions`: Rol-yetki eşleşmesi.
- RLS politikalarının ve GRANT komutlarının uygulanması.
- `has_permission` security definer fonksiyonunun oluşturulması.

### 2. Yetkilendirme ve Roller (Roller ve Yetkiler)
- `src/components/admin/RolesTab.tsx` ve `src/components/admin/UserManagement.tsx` bileşenlerinin oluşturulması.
- Granüler yetki sisteminin kurulması (dashboard, quotes, categories, seo vb.).
- Mevcut `useAuth` hook'unun yeni yetki sistemiyle uyumlu hale getirilmesi.

### 3. Bildirim Sistemi (Bildirimler)
- `src/components/admin/NotificationsTab.tsx` oluşturulması.
- Admin header'ındaki bildirim çanının gerçek verilere bağlanması.
- Gerçek zamanlı güncellemeler için Supabase Realtime entegrasyonu.

### 4. Görev Yönetimi (Görevlerim)
- `src/components/admin/TasksTab.tsx` oluşturulması.
- Görev oluşturma, atama, durum güncelleme ve filtreleme özelliklerinin eklenmesi.

### 5. Onay Merkezi (Onay Bekleyenler)
- `src/components/admin/ApprovalsTab.tsx` oluşturulması.
- Hassas işlemler için (SEO değişimi, kategori yayını vb.) onay talep etme ve inceleme akışının kurulması.

### 6. İşlem Geçmişi (İşlem Geçmişi)
- `src/components/admin/AuditLogsTab.tsx` oluşturulması.
- Sistemdeki tüm kritik aksiyonların (oluşturma, güncelleme, silme, yetki değişimi) otomatik loglanması.
- CSV dışa aktarma özelliği.

### 7. Entegrasyon ve Temizlik
- Tüm `ComingSoon` placeholder'larının kaldırılması.
- Teklif talepleri, mesajlar, SEO ve içerik yönetim modüllerinden otomatik bildirim ve log tetikleyicilerinin eklenmesi.
- Admin navigasyonunun yetkilere göre dinamikleştirilmesi.

### 8. Doğrulama ve Test
- Playwright ile modüller arası akışların (görev atama -> bildirim -> onay -> audit log) test edilmesi.
- `bun run build` ile projenin derlendiğinin teyit edilmesi.
