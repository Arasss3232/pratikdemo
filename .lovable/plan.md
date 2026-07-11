
# Yapay Zekâ Kontrol Merkezi — Uygulama Planı

Admin panelin varsayılan `dashboard` sekmesi, mevcut CMS/B2B modülleriyle derinlemesine entegre çalışan yeni bir **Yapay Zekâ Kontrol Merkezi** ile değiştirilecek. Yeni sayfa; site sağlığı, öneriler, taslak değişiklikler, hızlı görevler ve doğal dille komutu tek ekranda toplar.

## 1. Mevcut Sistem Denetimi (bulgular)

- **Yönlendirme**: Tek dosyalık admin (`src/routes/admin.tsx`, 1578 satır) tab tabanlı çalışıyor; URL değişmiyor. `AdminShell` sidebar + topbar yapısı hazır.
- **Sidebar**: `src/components/admin/nav.ts` içindeki ilk grup `Ana Yönetim` — `dashboard, myTasks, approvals, notifications`. Ayrıca `Akıllı Araçlar` grubunda `aiAssistant`, `aiHistory` var.
- **Mevcut Dashboard** (`src/components/admin/Dashboard.tsx`, 537 satır): Products, Services, Quotes, Messages, Blog, Jobs sayımları + son teklifler/mesajlar. Değerli — atılmayacak, yeni merkeze widget olarak taşınacak.
- **AI altyapısı**: `src/lib/ai-assistant-registry.ts` (5 aksiyon whitelist), `src/lib/ai-assistant.functions.ts` (Lovable AI Gateway + rate limit + draft/approve/apply/undo akışı), `src/components/admin/ai/*` (workspace, proposal card, history). Bu altyapı korunacak ve yeniden kullanılacak.
- **DB**: `ai_conversations`, `ai_messages`, `ai_action_proposals` mevcut. `homepage_brochures`, `products`, `services`, `blog_posts`, `faqs`, `contact_messages`, `quote_requests`, `site_settings`, `media` üzerinden gerçek veri var.
- **Yetki**: `user_roles` + `has_role`, ayrıca B2B için `company_role` fonksiyonları. `is_super_admin`, `is_internal_staff` hazır — yeni izinleri bunlara bağlayacağız.
- **Eksikler**: Bildirim tablosu yok, task/todo tablosu yok, audit finding tablosu yok, revision/undo snapshot AI proposal içinde tutuluyor (yeterli), site sağlığı taraması yok.

## 2. Navigasyon Değişikliği

- `nav.ts` içindeki ilk öğe **"Genel Bakış" → "Yapay Zekâ Kontrol Merkezi"** olarak yeniden adlandırılacak, ikon `auto_awesome` (veya `neurology`) olacak.
- Aynı sekme anahtarı (`dashboard`) korunacak; admin girişinde varsayılan olarak açılmaya devam edecek. İki rakip sayfa oluşturulmayacak.
- `Akıllı Araçlar` grubu tutulacak (asistan detay ekranı ve geçmiş listesi hâlâ ayrı erişim noktaları).
- Mobile: `AdminShell` mevcut drawer davranışı kullanılacak; yeni sayfa tek kolon dizilecek.

## 3. Bilgi Mimarisi (tek sayfa)

Yukarıdan aşağıya, mod anahtarı sağ üstte:

```text
[Mod: Kolay | Gelişmiş]
┌─ Akıllı Karşılama ────────────────────────────────────┐
│  "Bugün sitenizde ne yapmak istersiniz?"               │
│  [ doğal dil komut alanı  ]  [ Gönder ]                │
└────────────────────────────────────────────────────────┘
┌─ Ne Yapmak İstiyorsunuz? (görev kartları) ────────────┐
│  12 büyük kart — her biri rehberli akışı başlatır      │
└────────────────────────────────────────────────────────┘
┌─ Site Sağlık Özeti ───────────┬─ Yapay Zekâ Önerileri ┐
│  Ziyaretçi, mesaj, başvuru,   │  Acil / Önemli /       │
│  ürün, taslak, broşür, SEO,   │  İyileştirme / Öneri   │
│  görsel, bağlantı, sağlık puanı│                        │
└────────────────────────────────┴────────────────────────┘
┌─ Bekleyen AI Değişiklikleri ──┬─ İş Kuyruğu ──────────┐
│  proposal kartları             │  görev/onay/taslak     │
└────────────────────────────────┴────────────────────────┘
┌─ Görsel Site Haritası (tıklanır bölümler) ────────────┐
└────────────────────────────────────────────────────────┘
┌─ Son Etkinlik ────────────────────────────────────────┐
└────────────────────────────────────────────────────────┘
```

Kolay Modda: görev kartları ve öneriler öne çıkar; teknik alanlar (slug, meta, tablo) gizlenir; her onay ekranında "Bu ne yapar?" açıklaması. Gelişmiş Modda: etkilenen kayıt sayıları, alan adları, JSON diff, toplu işlem düğmeleri görünür. Mod tercihi `localStorage` + `ai_project_preferences.default_mode`.

## 4. Görev Kartları → Gerçek Akışlar

Her kart mevcut modüle yönlendirir ve gerektiğinde AI proposal üretir:

| Kart | Bağlanır |
|---|---|
| Ana Sayfayı Düzenle | `homepage_brochures` + `site_settings` (rehberli sihirbaz) |
| Yeni Ürün Ekle | `products` create + AI açıklama üretimi |
| Ürün Açıklaması Hazırla | `update_product_content` proposal |
| Yeni Broşür Oluştur | `update_brochure_content` create-mode |
| Siteyi Baştan Sona Kontrol Et | Site sağlık taraması (bkz. §7) |
| SEO Eksiklerini Bul | Sağlık taraması → SEO grubu |
| Mobil Görünümü Kontrol Et | Playwright önizleme (server fn) |
| Yazım Hatalarını Düzelt | Batch proposal — düşük risk |
| Eksik Görselleri Bul | `products.image_url IS NULL` taraması |
| İletişim Bilgilerini Kontrol Et | `site_settings` doğrulaması |
| Yeni Sayfa Hazırla | Blog / Service create sihirbazı |
| Gelen Mesajları Özetle | `contact_messages` özetleme |

## 5. Yeni / Genişletilen Aksiyon Kayıt Defteri

`src/lib/ai-assistant-registry.ts` genişletilecek — mevcut 5 aksiyon korunacak, eklenecekler:

- `create_product_draft`, `create_blog_draft`, `create_service_draft`, `create_brochure_draft`
- `update_site_settings_copy` (sadece metin alanları — telefon, adres, açıklama)
- `bulk_fix_alt_text`, `bulk_fix_typos`, `deactivate_expired_brochures`
- `summarize_messages`, `draft_message_reply`
- `run_site_audit` (yazma yok, sadece bulgu üretir)

Her giriş `permission`, `allowedFields`, `maxLen`, `maxAffectedRecords`, `risk`, `requiresApproval`, `previewComponent`, `rollback` metadatası taşıyacak. Sunucu, aksiyonu bu kayıt dışında **çalıştırmayacak**.

## 6. Yetki Matrisi

`app_role` tablosuna değil, `has_permission(user, key)` yardımcısına dayalı olacak. `super_admin`/`admin` hepsini alır; `content_editor` içerik onay dışında düzenler; `report_viewer` sadece görür.

| İzin | admin | content_editor | sales/finance | report_viewer |
|---|---|---|---|---|
| ai_control_center.view | ✔ | ✔ | ✔ | ✔ |
| ai_control_center.use | ✔ | ✔ | ✔ | – |
| ai_control_center.create_draft | ✔ | ✔ | – | – |
| ai_control_center.apply_content_changes | ✔ | ✔ | – | – |
| ai_control_center.apply_design_changes | ✔ | – | – | – |
| ai_control_center.run_audit | ✔ | ✔ | – | ✔ |
| ai_control_center.approve_changes | ✔ | – | – | – |
| ai_control_center.undo_changes | ✔ | ✔ | – | – |
| ai_control_center.bulk_actions | ✔ | – | – | – |
| ai_control_center.manage_settings | ✔ | – | – | – |

## 7. Site Sağlık Taraması (yeni)

Yazma yapmayan bir `run_site_audit` server fonksiyonu:

- Ürün: `image_url`, `description`, kısa açıklama eksikleri
- SEO: `seo_title`, `seo_description` eksik/tekrar
- Broşür: `is_active` ve `expire_at` tutarlılığı, mobil görsel
- Kontak tutarlılığı: `site_settings.phone/email` ↔ ilan/iletişim sayfaları
- Yayın: `draft` sayıları, süresi geçmiş içerik
- Bulgular `ai_audit_findings` tablosunda saklanır ve merkezdeki "Öneriler" ile "Site Haritası" katmanlarını besler.

## 8. Veritabanı Planı

Yeni tablolar (mevcutları çoğaltmadan):

- `ai_audit_findings` — id, category, severity (acil/önemli/iyileştirme/öneri), target_table, target_id, message_tr, suggestion_tr, status (open/snoozed/dismissed/resolved), snooze_until, created_at
- `ai_task_items` — id, user_id, title_tr, source (user/ai/audit), related_proposal_id, status, due_at, created_at
- `ai_project_preferences` — singleton row: tone, formality, default_mode, homepage_density, brand_terms[]
- `ai_change_bundles` — id, title_tr, description_tr, status; ilişki tablosu `ai_change_bundle_items(bundle_id, proposal_id)`
- `ai_usage_logs` — id, user_id, action, tokens, cost_estimate, latency_ms, created_at

Her tabloda: `GRANT` blokları (`authenticated`, `service_role`), RLS, `has_role`/`is_internal_staff` bazlı politikalar, `updated_at` trigger.

## 9. Backend (TanStack server functions)

Hepsi `createServerFn` + `requireSupabaseAuth` + izin kontrolü ile. Mevcut `src/lib/ai-assistant.functions.ts` genişletilecek:

- `getControlCenterSnapshot()` → sayaçlar, öneriler (top N), bekleyen proposal, task, son etkinlik (tek istek)
- `runSiteAudit()` → sağlık taraması, `ai_audit_findings` doldurur
- `createProposalFromCommand(text, context?)` → doğal dil → registry aksiyonu (mevcut chat altyapısı)
- `approveProposal / rejectProposal / applyProposal / undoProposal` (mevcut) — bundle desteği eklenecek
- `previewProposal(id, viewport)` → önceki/sonraki HTML parçası (server render)
- `dismissFinding / snoozeFinding / resolveFinding`
- `savePreference / getPreferences`

Gizli anahtar okuma yalnızca handler içinde. Toplu işlem `maxAffectedRecords` sınırıyla.

## 10. Provider Entegrasyonu

Mevcut Lovable AI Gateway kullanılacak (`LOVABLE_API_KEY` set). Varsayılan model `google/gemini-2.5-flash` (mevcut asistanla aynı — maliyet/hız dengesi). Ses girişi ilk sürümde **eklenmeyecek** (sahte kontrol yasak). System prompt Türkçe; teknik terim yasağı Kolay Modda pekiştirilir.

## 11. Taslak → Önizleme → Onay → Uygulama → Geri Alma

Mevcut `ai_action_proposals` akışı temel alınacak, üzerine:

- Önizleme: mevcut before/after diff + yeni **cihaz sekmesi** (desktop/tablet/mobile) — ilgili public route'un iframe önizlemesi `?preview_proposal=<id>` parametresiyle
- Bundle: birden fazla proposal aynı anda onaylanır; kısmi onay desteği
- Undo: proposal `previous_values` snapshot'ı zaten tutuluyor; UI'dan tek tıkla geri alma; başarı sonrası `ai_task_items` otomatik kapatılır

## 12. Bileşen Mimarisi

Yeni dosyalar (hepsi client-safe):

```text
src/components/admin/control-center/
  ControlCenter.tsx            (bölümleri düzenleyen kapsayıcı)
  SmartWelcome.tsx             (doğal dil komut girişi)
  TaskCards.tsx                (12 rehberli kart)
  HealthSummary.tsx            (10 metrik + tıklanır)
  RecommendationsList.tsx      (severity gruplu)
  PendingChanges.tsx           (proposal kartları — mevcut ActionProposalCard yeniden kullanılır)
  WorkQueue.tsx                (task + approvals)
  SiteMap.tsx                  (görsel harita, tıklanır bölümler)
  RecentActivity.tsx           (audit log)
  ModeToggle.tsx               (Kolay/Gelişmiş)
  GuidedInterview.tsx          (belirsiz istekler için)
  ChangeBundleCard.tsx
  DevicePreviewFrame.tsx
src/hooks/
  use-control-center.ts        (snapshot query)
  use-user-mode.ts             (Kolay/Gelişmiş kalıcılığı)
```

## 13. Değiştirilecek / Korunacak Dosyalar

**Değişecek**
- `src/components/admin/nav.ts` — ilk öğe etiketi + ikon
- `src/routes/admin.tsx` — `dashboard` sekmesinde `<Dashboard />` yerine `<ControlCenter />`
- `src/lib/ai-assistant-registry.ts` — yeni aksiyonlar
- `src/lib/ai-assistant.functions.ts` — yeni server fonksiyonları
- `src/components/admin/ai/ActionProposalCard.tsx` — cihaz önizleme sekmesi

**Korunacak (silinmeyecek)**
- `src/components/admin/Dashboard.tsx` — metrik widget'ları `HealthSummary` içine taşınır, dosya referans olarak kalır; sonradan silinir
- `AdminShell`, `CommandPalette`, `GenericCrud`, tüm modül sekmeleri
- Mevcut proposal / history akışı ve UI

## 14. Uygulama Fazları

1. **Faz 1 — DB**: 5 yeni tablo migration + RLS + GRANT + preference singleton seed.
2. **Faz 2 — Registry & backend**: yeni aksiyonlar, `getControlCenterSnapshot`, `runSiteAudit`, finding CRUD.
3. **Faz 3 — Shell**: `ControlCenter` iskeleti, mod toggle, nav etiketi değişimi, dashboard yerine bağlanma.
4. **Faz 4 — Bölümler**: SmartWelcome, TaskCards, HealthSummary, RecommendationsList, PendingChanges, WorkQueue.
5. **Faz 5 — Görsel harita + rehberli görüşme + bundle**.
6. **Faz 6 — Önizleme**: cihaz sekmeleri + `?preview_proposal=` iframe köprüsü.
7. **Faz 7 — Beginner metinleri ve erişilebilirlik cilası** (ARIA, klavye, kontrast).
8. **Faz 8 — Playwright doğrulama** (bkz. §15).

## 15. Tarayıcı Test Planı

Playwright ile: admin girişi → `/admin` açılışında Kontrol Merkezi görünür → komut gönder → proposal oluşur → onay → uygulama → geri alma; Kolay/Gelişmiş mod geçişi; mobil viewport (390px) tek kolon; sağlık taraması sonrası bulgu kartı tıklanınca ilgili modüle yönlendirir. Her adımda ekran görüntüsü.

## 16. Kabul Kriterleri

- `/admin` girişinde ilk ekran Kontrol Merkezi, sidebar ilk öğe "Yapay Zekâ Kontrol Merkezi".
- İki rakip dashboard yok; eski metrikler yeni ekranda erişilebilir.
- Tüm görünür metinler Türkçe, teknik terim Kolay Modda gizli.
- Her AI aksiyonu registry içinde, izin kontrolüyle, önizleme + onay + geri alma zinciriyle çalışır.
- Doğal dil komutu belirsizse Rehberli Görüşme devreye girer, doğrudan yazma yapmaz.
- Sağlık taraması gerçek verilere karşı çalışır ve bulguları önerilere yansıtır.
- Mobil (≤640px), tablet, masaüstünde erişilebilir ve klavyeyle gezilebilir.
- Servis rolü anahtarı istemciye sızmaz; tüm AI çağrıları server fn üzerinden.

Onaylarsanız Faz 1 (DB migration) ile başlıyorum.
