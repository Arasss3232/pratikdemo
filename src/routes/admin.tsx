import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "../components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { GenericCrud, type CrudField, type CrudColumn } from "../components/admin/GenericCrud";
import { SiteSettingsForm } from "../components/admin/SiteSettingsForm";
import { AdminShell } from "../components/admin/AdminShell";
import { Dashboard } from "../components/admin/Dashboard";
import { PageHeader } from "../components/admin/PageHeader";
import { EmptyState } from "../components/admin/EmptyState";
import { ConfirmDialogHost, confirmDialog } from "../components/admin/ConfirmDialog";
import type { AdminTab } from "../components/admin/nav";
import { ComingSoon } from "../components/admin/ComingSoon";
import { SeoShell, type SeoSubTab } from "../components/admin/seo/SeoShell";
import { SeoDashboard } from "../components/admin/seo/SeoDashboard";
import { SeoGeneralSettings } from "../components/admin/seo/SeoGeneralSettings";
import { SeoPageManagement } from "../components/admin/seo/SeoPageManagement";
import { SeoSearchConsole } from "../components/admin/seo/SeoSearchConsole";
import { SeoTools } from "../components/admin/seo/SeoTools";
import { SeoRedirects } from "../components/admin/seo/SeoRedirects";


const TAB_KEYS: AdminTab[] = [
  // Ana Yönetim
  "dashboard","myTasks","approvals","notifications",
  // Müşteri Yönetimi
  "companies","dealers","companyUsers","customerGroups","applications","salesReps",
  // Satış
  "quotations","orders","quickOrder","opportunities","discountApprovals",
  // Ürün ve Fiyat
  "categories","brands","priceLists","specialPrices","discounts","stock",
  // Finans
  "accounts","creditLimits","dueTracking","payments","statements","risk",
  // Operasyon
  "warehouse","shipments","deliveries","returns","documents",
  // Raporlar
  "reportSales","reportQuotes","reportOrders","reportCustomers","reportProducts","reportFinance",
  // Site Yönetimi
  "settings","brochures","catalogs","certificates","team","testimonials",
  "faqs","messages","quotes",
  // Sistem
  "users","roles","workflows","integrations","activityLogs","security","backup",
  // SEO
  "seo",
];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Paneli — Pratik Endüstriyel" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { 
    tab?: AdminTab; 
    seoTab?: SeoSubTab; 
    aiAction?: string; 
    aiTarget?: string; 
    aiPrompt?: string 
  } => ({
    tab: (TAB_KEYS.includes(s.tab as AdminTab) ? s.tab : "dashboard") as AdminTab,
    seoTab: s.seoTab as SeoSubTab,
    aiAction: s.aiAction as string,
    aiTarget: s.aiTarget as string,
    aiPrompt: s.aiPrompt as string,
  }),
  component: AdminPage,
});

type Tab = AdminTab;

function DashboardHost({ onNavigate }: { onNavigate: (t: AdminTab) => void }) {
  return <Dashboard onNavigate={onNavigate} />;
}

type QuoteRequest = {
  id: string;
  contact_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  category_id: string | null;
  category_name: string | null;
  items: unknown;
  status: string;
  created_at: string;
  // Backward compatibility fields
  city?: string | null;
  timeline?: string | null;
  budget?: string | null;
};


type UserRoleRow = {
  id: string;
  user_id: string;
  role: "admin" | "user";
  created_at: string;
};

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const tab = search.tab || "dashboard";
  const seoTab = search.seoTab || "dashboard";

  function setTab(t: AdminTab) {
    navigate({
      to: "/admin",
      search: (prev: any) => ({
        ...prev,
        tab: t,
        seoTab: t === "seo" ? "dashboard" : undefined,
        aiAction: undefined,
        aiTarget: undefined,
        aiPrompt: undefined,
      }),
    });
  }

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/giris" });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div
        className="admin-scope min-h-screen grid place-items-center"
        style={{ background: "var(--admin-bg)", color: "var(--admin-text-2)" }}
      >
        <div className="flex items-center gap-3 text-sm">
          <span
            className="h-5 w-5 rounded-full border-2 animate-spin"
            style={{ borderColor: "var(--admin-navy)", borderTopColor: "transparent" }}
          />
          Yönetim paneli yükleniyor…
        </div>
      </div>
    );
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div
        className="admin-scope min-h-screen grid place-items-center p-8 text-center"
        style={{ background: "var(--admin-bg)" }}
      >
        <div
          className="max-w-md w-full flex flex-col gap-4 items-center rounded-2xl p-8 shadow-sm"
          style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
        >
          <div
            className="h-14 w-14 rounded-full grid place-items-center"
            style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}
          >
            <Icon name="lock" className="text-[28px]" />
          </div>
          <p className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>
            Yetkisiz erişim
          </p>
          <p className="text-sm" style={{ color: "var(--admin-text-2)" }}>
            Bu sayfayı görüntülemek için yönetici yetkiniz olmalı. Yetki için sistem sorumlunuzla iletişime geçin.
          </p>
          <Link to="/" className="admin-btn admin-btn-primary admin-btn-sm">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    );
  }

  function handleQuickAdd(t: AdminTab) {
    setTab(t);
    // Give tab time to mount, then dispatch a "create" event that tabs can listen to.
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("admin:quick-add", { detail: { tab: t } }));
    }, 50);
  }

  return (
    <>
      <AdminShell
        tab={tab}
        onTabChange={setTab}
        userEmail={user.email ?? ""}
        onQuickAdd={handleQuickAdd}
      >
        {tab !== "dashboard" && tab !== "seo" && <PageHeader tab={tab} />}
        {tab === "dashboard" && <Dashboard onNavigate={setTab} />}
        {tab === "seo" && (
          <SeoShell 
            currentTab={seoTab} 
            onTabChange={(st) => navigate({ 
              to: "/admin",
              search: (prev: any) => ({ ...prev, seoTab: st }) 
            })}
          >
            {seoTab === "dashboard" && <SeoDashboard onNavigate={setTab} />}
            {seoTab === "general" && <SeoGeneralSettings />}
            {seoTab === "pages" && <SeoPageManagement />}
            {seoTab === "search-console" && <SeoSearchConsole />}
            {seoTab === "redirects" && <SeoRedirects />}
            {seoTab === "audit" && <SeoTools />}
            {/* placeholders for others to be implemented */}
            {["sitemap", "robots", "analytics", "tag-manager", "schema", "social", "favicon"].includes(seoTab) && (
              <ComingSoon tab="seo" phase={`SEO Modülü: ${seoTab}`} />
            )}
          </SeoShell>
        )}
        {tab === "settings" && <SiteSettingsForm />}
        {tab === "brochures" && <BrochuresTab />}
        {tab === "products" && <ProductsTab />}
        {tab === "categories" && <CategoriesTab />}

        {tab === "quotes" && <QuotesTab />}
        {tab === "users" && <UsersTab currentUserId={user.id} />}
        {tab === "catalogs" && <CatalogsTab />}
        {tab === "brands" && <BrandsTab />}
        {tab === "certificates" && <CertificatesTab />}
        {tab === "team" && <TeamTab />}
        {tab === "testimonials" && <TestimonialsTab />}
        {tab === "faqs" && <FaqsTab />}
        {tab === "messages" && <MessagesTab />}
        {tab === "myTasks" && (
          <ComingSoon tab="myTasks" phase="Faz 3 · Onay Motoru" bullets={[
            "Onay adımlarında size atanan iş kalemleri",
            "Süre aşımı ve hatırlatmalar",
            "Tek tıkla onay / reddet + not bırakma",
          ]} />
        )}
        {tab === "approvals" && <ComingSoon tab="approvals" phase="Sistem Onayları" />}
        {tab === "notifications" && (
          <ComingSoon tab="notifications" phase="Faz 5 · Bildirim Merkezi" bullets={[
            "Sistem içi bildirim akışı ve okundu takibi",
            "E-posta ve WhatsApp entegrasyonu",
            "Rol bazlı bildirim tercihleri",
          ]} />
        )}
        {tab === "quotations" && (
          <ComingSoon tab="quotations" phase="Faz 3 · Teklif Yönetimi" bullets={[
            "Çok kalemli teklif oluşturma, iskonto ve KDV",
            "Revizyon takibi ve PDF çıktı",
            "Teklifi tek tıkla siparişe dönüştürme",
          ]} />
        )}
        {tab === "orders" && (
          <ComingSoon tab="orders" phase="Faz 3 · Sipariş Yönetimi" bullets={[
            "Sipariş durum akışı: Onay → Hazırlık → Sevkiyat → Teslim",
            "Kısmi sevkiyat ve iade süreçleri",
            "Satış temsilcisi ve depo görevleri",
          ]} />
        )}
        {tab === "quickOrder" && (
          <ComingSoon tab="quickOrder" phase="Faz 3 · Satış" bullets={[
            "SKU ile çoklu satır girişi",
            "Firma seçildiğinde otomatik fiyat & stok kontrolü",
          ]} />
        )}
        {tab === "carts" && (
          <ComingSoon tab="carts" phase="Faz 6 · Müşteri Portali" bullets={[
            "Firmaların açık sepetlerini görüntüleme",
            "Portal üzerinden gelen taleplere anında müdahale",
          ]} />
        )}
        {tab === "opportunities" && (
          <ComingSoon tab="opportunities" phase="Faz 5 · Satış Yönetimi" bullets={[
            "Aktif fırsatlar ve tahmini kapanış tarihleri",
            "Satış temsilcisi bazlı pipeline raporu",
          ]} />
        )}
        {tab === "discountApprovals" && (
          <ComingSoon tab="discountApprovals" phase="Faz 3 · Onay Motoru" bullets={[
            "Standart dışı indirim talepleri",
            "Fiyat override kayıtları",
          ]} />
        )}
        {tab === "categories" && <CategoriesTab />}
        {tab === "priceLists" && (
          <ComingSoon tab="priceLists" phase="Faz 2 · Fiyat Yönetimi" bullets={[
            "Genel, müşteri grubu ve bayi seviyesi fiyat listeleri",
            "Kademeli fiyatlandırma",
          ]} />
        )}
        {tab === "specialPrices" && (
          <ComingSoon tab="specialPrices" phase="Faz 2 · Fiyat Yönetimi" bullets={[
            "Firma × ürün özel fiyatları",
            "Sözleşme fiyatları ve geçerlilik tarihleri",
          ]} />
        )}
        {tab === "discounts" && (
          <ComingSoon tab="discounts" phase="Faz 2 · Fiyat Yönetimi" bullets={[
            "Kampanya, kategori ve ürün bazlı kurallar",
            "Tarih aralıklı kampanyalar",
          ]} />
        )}
        {tab === "stock" && (
          <ComingSoon tab="stock" phase="Faz 2 · Stok & Depo" bullets={[
            "Depo × ürün stok haritası",
            "Mevcut / rezerve / gelen stok",
          ]} />
        )}
        {tab === "accounts" && (
          <ComingSoon tab="accounts" phase="Faz 4 · Finans" bullets={[
            "Firma bazlı cari hesap özeti",
            "Açık faturalar ve tahsilatlar",
          ]} />
        )}
        {tab === "creditLimits" && (
          <ComingSoon tab="creditLimits" phase="Faz 4 · Finans" bullets={[
            "Kredi limiti değişiklik geçmişi",
            "Onay akışına bağlı limit güncelleme",
          ]} />
        )}
        {tab === "dueTracking" && (
          <ComingSoon tab="dueTracking" phase="Faz 4 · Finans" bullets={[
            "Yaklaşan vadeler ve otomatik uyarılar",
            "Geciken tahsilat raporu",
          ]} />
        )}
        {tab === "payments" && (
          <ComingSoon tab="payments" phase="Faz 4 · Finans" bullets={[
            "Tahsilat kayıtları",
            "Fatura eşleştirmesi",
          ]} />
        )}
        {tab === "statements" && (
          <ComingSoon tab="statements" phase="Faz 4 · Finans" bullets={[
            "PDF ekstre çıktısı",
            "Firma paylaşımı için imzalı bağlantı",
          ]} />
        )}
        {tab === "risk" && (
          <ComingSoon tab="risk" phase="Faz 4 · Finans" bullets={[
            "Risk skoru ve engelli hesaplar",
            "Vadesi geçmiş bakiye yaşlandırma",
          ]} />
        )}
        {tab === "warehouse" && (
          <ComingSoon tab="warehouse" phase="Faz 4 · Operasyon" bullets={[
            "Depo tanımları ve sorumlu kullanıcılar",
            "Depolar arası transfer",
          ]} />
        )}
        {tab === "shipments" && (
          <ComingSoon tab="shipments" phase="Faz 4 · Operasyon" bullets={[
            "Sevkiyat oluşturma ve kargo bilgisi",
            "Kısmi sevkiyat desteği",
          ]} />
        )}
        {tab === "deliveries" && (
          <ComingSoon tab="deliveries" phase="Faz 4 · Operasyon" bullets={[
            "Teslimat belgeleri ve tesellüm",
          ]} />
        )}
        {tab === "returns" && (
          <ComingSoon tab="returns" phase="Faz 4 · Operasyon" bullets={[
            "İade talepleri ve nedenleri",
            "Stok ve cari düzeltmeleri",
          ]} />
        )}
        {tab === "documents" && (
          <ComingSoon tab="documents" phase="Faz 4 · Operasyon" bullets={[
            "Sözleşmeler, faturalar ve teknik belgeler için ortak depo",
            "Rol bazlı erişim kontrolü",
          ]} />
        )}
        {tab === "reportSales" && <ComingSoon tab="reportSales" phase="Faz 5 · Raporlar" />}
        {tab === "reportQuotes" && <ComingSoon tab="reportQuotes" phase="Faz 5 · Raporlar" />}
        {tab === "reportOrders" && <ComingSoon tab="reportOrders" phase="Faz 5 · Raporlar" />}
        {tab === "reportCustomers" && <ComingSoon tab="reportCustomers" phase="Faz 5 · Raporlar" />}
        {tab === "reportProducts" && <ComingSoon tab="reportProducts" phase="Faz 5 · Raporlar" />}
        {tab === "reportFinance" && <ComingSoon tab="reportFinance" phase="Faz 5 · Raporlar" />}
        {tab === "roles" && (
          <ComingSoon tab="roles" phase="Faz 1 · Sistem" bullets={[
            "Dahili ve firma rolleri artık veritabanında tanımlı",
            "Kullanıcı ekranı üzerinden rol atanabilir",
          ]} />
        )}
        {tab === "workflows" && (
          <ComingSoon tab="workflows" phase="Faz 3 · Onay Motoru" />
        )}
        {tab === "integrations" && (
          <ComingSoon tab="integrations" phase="Faz 7 · Entegrasyonlar" bullets={[
            "Muhasebe, kargo, e-posta ve SMS sağlayıcılar",
          ]} />
        )}
        {tab === "activityLogs" && (
          <ComingSoon tab="activityLogs" phase="Faz 5 · Denetim" bullets={[
            "Tüm mutasyonların otomatik kaydı",
            "Rol bazlı görüntüleme",
          ]} />
        )}
        {tab === "security" && (
          <ComingSoon tab="security" phase="Faz 7 · Güvenlik" bullets={[
            "Oturum ve başarısız giriş takibi",
            "Şifre politikası",
          ]} />
        )}
        {tab === "backup" && (
          <ComingSoon tab="backup" phase="Faz 7 · Süreklilik" bullets={[
            "Yedekleme durumu ve geri yükleme",
          ]} />
        )}
      </AdminShell>
      <ConfirmDialogHost />
    </>
  );
}

/* ================= Products ================= */

function askAiAction(actionType: string) {
  return {
    key: `ask-ai-${actionType}`,
    label: "AI'ya Sor",
    icon: "auto_awesome",
    tone: "primary" as const,
    onRun: (row: any) => {
      const params = new URLSearchParams({
        tab: "aiAssistant",
        aiAction: actionType,
        aiTarget: String(row.id),
      });
      window.location.assign(`/admin?${params.toString()}`);
    },
  };
}

function BrochuresTab() {
  return (
    <GenericCrud
      table="homepage_brochures"
      quickAddKey="brochures"
      title="Broşür ve Slider Yönetimi"
      description="Ana sayfada otomatik olarak gösterilen tanıtım broşürlerini buradan ekleyebilir, düzenleyebilir ve sıralayabilirsiniz. Değişiklikler kaydedildiği an ana sayfada yayınlanır."
      orderBy="display_order"
      ascending={true}
      defaults={{ is_active: true, overlay_style: "left-navy", text_theme: "light", display_order: 0 }}
      extraRowActions={[
        {
          key: "preview",
          label: "Önizle",
          icon: "open_in_new",
          onRun: () => {
            window.open("/", "_blank", "noopener,noreferrer");
          },
        },
        askAiAction("update_brochure_content"),
        {
          key: "toggle",
          label: "Yayın Durumu",
          icon: "toggle_on",
          tone: "success",
          onRun: async (row, { refresh }) => {
            const next = !row.is_active;
            const { error } = await supabase
              .from("homepage_brochures")
              .update({ is_active: next })
              .eq("id", row.id);
            if (error) { toast.error("Güncellenemedi", { description: error.message }); return; }
            toast.success(next ? "Broşür yayınlandı" : "Broşür pasif hale getirildi");
            refresh();
          },
        },
        {
          key: "up",
          label: "Yukarı",
          icon: "arrow_upward",
          onRun: async (row, { refresh }) => {
            const current = Number(row.display_order ?? 0);
            const { error } = await supabase
              .from("homepage_brochures")
              .update({ display_order: Math.max(0, current - 1) })
              .eq("id", row.id);
            if (error) { toast.error("Sıralama güncellenemedi", { description: error.message }); return; }
            toast.success("Sıralama güncellendi");
            refresh();
          },
        },
        {
          key: "down",
          label: "Aşağı",
          icon: "arrow_downward",
          onRun: async (row, { refresh }) => {
            const current = Number(row.display_order ?? 0);
            const { error } = await supabase
              .from("homepage_brochures")
              .update({ display_order: current + 1 })
              .eq("id", row.id);
            if (error) { toast.error("Sıralama güncellenemedi", { description: error.message }); return; }
            toast.success("Sıralama güncellendi");
            refresh();
          },
        },
        {
          key: "duplicate",
          label: "Kopyala",
          icon: "content_copy",
          onRun: async (row, { refresh }) => {
            const {
              id: _id, created_at: _c, updated_at: _u,
              ...rest
            } = row as Record<string, unknown> & { id: string };
            void _id; void _c; void _u;
            const copy = {
              ...rest,
              title: `${row.title ?? "Broşür"} (Kopya)`,
              is_active: false,
              start_at: null,
              end_at: null,
            };
            const { error } = await supabase
              .from("homepage_brochures")
              .insert(copy as never);
            if (error) { toast.error("Kopyalanamadı", { description: error.message }); return; }
            toast.success("Broşür kopyalandı (taslak)");
            refresh();
          },
        },
      ]}
      fields={[
        { name: "title", label: "Başlık", required: true, help: "Slaytın büyük başlığı" },
        { name: "eyebrow", label: "Üst Etiket", help: "Örn: YENİ · KAMPANYA · 2025 KATALOĞU" },
        { name: "subtitle", label: "Alt Başlık" },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "image_desktop", label: "Masaüstü Görsel URL (16:9 ya da 21:9)", type: "url", required: true, help: "Önerilen: 1920×900 px" },
        { name: "image_tablet", label: "Tablet Görsel URL", type: "url", help: "Önerilen: 1280×720 px (boş bırakılırsa masaüstü kullanılır)" },
        { name: "image_mobile", label: "Mobil Görsel URL", type: "url", help: "Önerilen: 900×1100 px (dikey)" },
        { name: "image_alt", label: "Görsel Alt Metni (SEO / erişilebilirlik)" },
        { name: "primary_cta_label", label: "Birincil Buton Metni", help: "Örn: Kataloğu İndir" },
        { name: "primary_cta_href", label: "Birincil Buton Bağlantısı", help: "Örn: /urunler veya https://..." },
        { name: "secondary_cta_label", label: "İkincil Buton Metni" },
        { name: "secondary_cta_href", label: "İkincil Buton Bağlantısı" },
        {
          name: "overlay_style",
          label: "Metin Yerleşimi",
          type: "select",
          options: [
            { value: "left-navy", label: "Sol · Lacivert Panel" },
            { value: "right-navy", label: "Sağ · Lacivert Panel" },
            { value: "center-navy", label: "Ortalanmış · Yumuşak Overlay" },
            { value: "bottom-gradient", label: "Alt · Gradient" },
            { value: "minimal", label: "Minimal · Sol" },
          ],
        },
        {
          name: "text_theme",
          label: "Metin Rengi",
          type: "select",
          options: [
            { value: "light", label: "Açık (koyu arka plan için)" },
            { value: "dark", label: "Koyu (açık arka plan için)" },
          ],
        },
        { name: "accent_color", label: "Vurgu Rengi (HEX)", help: "Örn: #F5D311 (boş bırakılırsa marka sarısı)" },
        { name: "display_order", label: "Sıra", type: "number", help: "Küçük değer önce gösterilir" },
        { name: "start_at", label: "Yayın Başlangıcı", type: "date" },
        { name: "end_at", label: "Yayın Bitişi", type: "date" },
        { name: "is_active", label: "Yayında", type: "checkbox" },
      ]}
      columns={[
        {
          key: "image_desktop",
          label: "Görsel",
          render: (r) => {
            const src = r.image_desktop as string | null;
            return src ? (
              <div
                className="h-11 w-20 rounded-md overflow-hidden"
                style={{ background: "var(--admin-bg-2, #eef2f7)", border: "1px solid var(--admin-border)" }}
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            ) : (
              <span style={{ color: "var(--admin-text-mute)" }}>—</span>
            );
          },
        },
        { key: "display_order", label: "Sıra", render: (r) => (
          <span className="font-mono text-[12px]" style={{ color: "var(--admin-text-2)" }}>
            {String(r.display_order ?? 0)}
          </span>
        ) },
        { key: "title", label: "Başlık", render: (r) => (
          <div className="flex flex-col">
            <span className="font-medium">{String(r.title ?? "—")}</span>
            {r.eyebrow ? (
              <span className="text-[11px] uppercase tracking-wider" style={{ color: "var(--admin-text-mute)" }}>
                {String(r.eyebrow)}
              </span>
            ) : null}
          </div>
        ) },
        { key: "overlay_style", label: "Yerleşim" },
        { key: "is_active", label: "Durum", render: (r) => (
          <StatusBadge tone={r.is_active ? "success" : "neutral"}>
            {r.is_active ? "Yayında" : "Gizli"}
          </StatusBadge>
        ) },
      ]}
    />
  );
}

function ProductsTab() {
  return (
    <GenericCrud
      table="products"
      quickAddKey="products"
      title="Ürünler"
      description="Ürün kataloğunuz. Sitede görünen tüm ürünleri buradan yönetin."
      extraRowActions={[askAiAction("update_product_content")]}
      fields={[
        { name: "sku", label: "Ürün Kodu (SKU)", required: true, help: "Örn: PRT-2024-001" },
        { name: "name", label: "Ürün Adı", required: true },
        { name: "brand", label: "Marka", required: true },
        { name: "category", label: "Kategori", required: true, help: "Örn: elektrikli-el-aletleri" },
        { name: "image_url", label: "Kapak Görseli (URL)", type: "url" },
        { name: "description", label: "Kısa Açıklama", type: "textarea" },
        { name: "price", label: "Fiyat (₺)", type: "number", help: "Boş bırakırsanız 'Fiyat için teklif alın' gösterilir" },
        { name: "is_active", label: "Sitede yayında göster", type: "checkbox" },
      ]}
      columns={[
        { key: "sku", label: "Kod", render: (r) => (
          <span className="font-mono text-[12px]" style={{ color: "var(--admin-text-2)" }}>
            {String(r.sku ?? "—")}
          </span>
        ) },
        { key: "name", label: "Ürün Adı", render: (r) => (
          <span className="font-medium">{String(r.name ?? "—")}</span>
        ) },
        { key: "brand", label: "Marka" },
        { key: "category", label: "Kategori" },
        { key: "price", label: "Fiyat", render: (r) =>
          r.price != null ? `₺${Number(r.price).toLocaleString("tr-TR")}` : "—",
        },
        { key: "is_active", label: "Durum", render: (r) => (
          <StatusBadge tone={r.is_active ? "success" : "neutral"}>
            {r.is_active ? "Yayında" : "Gizli"}
          </StatusBadge>
        ) },
      ]}
    />
  );
}

function CategoriesTab() {
  return (
    <GenericCrud
      table="product_categories"
      quickAddKey="categories"
      title="Ürün Kategorileri"
      description="Web sitesinde gösterilen ürün gruplarını buradan yönetebilirsiniz. Sıralama (Sıra) alanı ana sayfadaki görünüm sırasını belirler."
      orderBy="display_order"
      ascending={true}
      fields={[
        { name: "title", label: "Kategori Adı", required: true },
        { name: "slug", label: "URL Slug", required: true, help: "Örn: elektrikli-el-aletleri (benzersiz olmalı)" },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "icon", label: "İkon (Material Symbol)", help: "Örn: hardware, build, settings" },
        { name: "image_url", label: "Görsel URL (Ana Sayfa için)", type: "url" },
        { name: "display_order", label: "Sıra", type: "number", help: "Küçük değer önce gösterilir" },
        { name: "is_active", label: "Aktif", type: "checkbox" },
      ]}
      columns={[
        { key: "display_order", label: "Sıra", render: (r) => (
          <span className="font-mono text-[12px]">{String(r.display_order ?? 0)}</span>
        ) },
        { key: "title", label: "Kategori Adı", render: (r) => <span className="font-medium">{String(r.title)}</span> },
        { key: "slug", label: "Slug" },
        { key: "is_active", label: "Durum", render: (r) => (
          <StatusBadge tone={r.is_active ? "success" : "neutral"}>
            {r.is_active ? "Aktif" : "Pasif"}
          </StatusBadge>
        ) },
      ]}
    />
  );
}


// ================================================================
// B2B Çekirdek Modülleri (Faz 1)
// ================================================================

export function CustomerGroupsTab() {
  return (
    <GenericCrud
      table="customer_groups"
      title="Müşteri Grupları"
      fields={[
        { name: "code", label: "Kod" },
        { name: "name", label: "Ad" },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "default_discount_pct", label: "Varsayılan İskonto (%)", type: "number" },
        { name: "display_order", label: "Sıra", type: "number" },
        { name: "is_active", label: "Aktif", type: "checkbox" },
      ]}
      columns={[
        { key: "code", label: "Kod" },
        { key: "name", label: "Ad" },
        { key: "default_discount_pct", label: "İskonto %" },
        { key: "is_active", label: "Aktif", render: (r) => (r.is_active ? "Evet" : "Hayır") },
      ]}
    />
  );
}

export function DealersTab() {
  return (
    <GenericCrud
      table="dealer_levels"
      title="Bayi Seviyeleri"
      fields={[
        { name: "code", label: "Kod" },
        { name: "name", label: "Ad" },
        { name: "tier", label: "Kademe", type: "number" },
        { name: "discount_pct", label: "İskonto (%)", type: "number" },
        { name: "min_annual_volume", label: "Min. Yıllık Ciro", type: "number" },
        { name: "color_hex", label: "Renk (HEX)" },
        { name: "is_active", label: "Aktif", type: "checkbox" },
      ]}
      columns={[
        { key: "tier", label: "Kademe" },
        { key: "code", label: "Kod" },
        { key: "name", label: "Ad" },
        { key: "discount_pct", label: "İskonto %" },
        { key: "is_active", label: "Aktif", render: (r) => (r.is_active ? "Evet" : "Hayır") },
      ]}
    />
  );
}

export function SalesRepsTab() {
  return (
    <GenericCrud
      table="sales_representatives"
      title="Satış Temsilcileri"
      fields={[
        { name: "code", label: "Kod" },
        { name: "full_name", label: "Ad Soyad" },
        { name: "email", label: "E-posta" },
        { name: "phone", label: "Telefon" },
        { name: "region", label: "Bölge" },
        { name: "is_active", label: "Aktif", type: "checkbox" },
      ]}
      columns={[
        { key: "code", label: "Kod" },
        { key: "full_name", label: "Ad Soyad" },
        { key: "region", label: "Bölge" },
        { key: "email", label: "E-posta" },
        { key: "is_active", label: "Aktif", render: (r) => (r.is_active ? "Evet" : "Hayır") },
      ]}
    />
  );
}

export function CompaniesTab() {
  return (
    <GenericCrud
      table="companies"
      title="Firmalar"
      fields={[
        { name: "legal_name", label: "Ünvan" },
        { name: "trade_name", label: "Ticari Ad" },
        { name: "account_code", label: "Cari Kodu" },
        { name: "company_type", label: "Firma Tipi", type: "select", options: [
          { value: "corporate", label: "Kurumsal" },
          { value: "dealer", label: "Bayi" },
          { value: "distributor", label: "Distribütör" },
          { value: "public_sector", label: "Kamu" },
          { value: "individual", label: "Bireysel" },
        ] },
        { name: "sector", label: "Sektör" },
        { name: "tax_number", label: "Vergi Numarası" },
        { name: "tax_office", label: "Vergi Dairesi" },
        { name: "primary_contact_name", label: "İlgili Kişi" },
        { name: "primary_contact_email", label: "İlgili E-posta" },
        { name: "primary_contact_phone", label: "İlgili Telefon" },
        { name: "credit_limit", label: "Kredi Limiti", type: "number" },
        { name: "available_limit", label: "Kullanılabilir Limit", type: "number" },
        { name: "payment_term_days", label: "Vade (Gün)", type: "number" },
        { name: "currency", label: "Para Birimi" },
        { name: "account_status", label: "Hesap Durumu", type: "select", options: [
          { value: "active", label: "Aktif" },
          { value: "on_hold", label: "Beklemede" },
          { value: "blocked", label: "Engelli" },
          { value: "closed", label: "Kapalı" },
        ] },
        { name: "approval_status", label: "Onay Durumu", type: "select", options: [
          { value: "pending", label: "Beklemede" },
          { value: "approved", label: "Onaylı" },
          { value: "rejected", label: "Reddedildi" },
        ] },
        { name: "risk_status", label: "Risk", type: "select", options: [
          { value: "low", label: "Düşük" },
          { value: "medium", label: "Orta" },
          { value: "high", label: "Yüksek" },
        ] },
        { name: "internal_notes", label: "Dahili Notlar", type: "textarea" },
      ]}
      columns={[
        { key: "legal_name", label: "Ünvan" },
        { key: "company_type", label: "Tip" },
        { key: "account_code", label: "Cari" },
        { key: "credit_limit", label: "Kredi Limiti" },
        { key: "account_status", label: "Durum" },
        { key: "approval_status", label: "Onay" },
      ]}
    />
  );
}

export function CompanyUsersTab() {
  return (
    <GenericCrud
      table="company_users"
      title="Firma Kullanıcıları"
      fields={[
        { name: "company_id", label: "Firma ID" },
        { name: "user_id", label: "Kullanıcı ID" },
        { name: "role", label: "Rol", type: "select", options: [
          { value: "owner", label: "Sahip" },
          { value: "purchaser", label: "Satın Alma" },
          { value: "finance", label: "Finans" },
          { value: "viewer", label: "Görüntüleyici" },
        ] },
        { name: "title", label: "Görev" },
        { name: "is_primary", label: "Birincil", type: "checkbox" },
        { name: "is_active", label: "Aktif", type: "checkbox" },
      ]}
      columns={[
        { key: "company_id", label: "Firma" },
        { key: "user_id", label: "Kullanıcı" },
        { key: "role", label: "Rol" },
        { key: "is_primary", label: "Birincil", render: (r) => (r.is_primary ? "Evet" : "Hayır") },
        { key: "is_active", label: "Aktif", render: (r) => (r.is_active ? "Evet" : "Hayır") },
      ]}
    />
  );
}

/* ================= Quotes (inbox) ================= */

const QUOTE_STATUSES = [
  { value: "new", label: "Yeni", tone: "accent" as const },
  { value: "in_progress", label: "İşleme Alındı", tone: "warning" as const },
  { value: "completed", label: "Tamamlandı", tone: "success" as const },
  { value: "cancelled", label: "İptal", tone: "danger" as const },
];

function QuotesTab() {
  const [items, setItems] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setItems((data as any[]) ?? []);

    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
    if (error) {
      toast.error("Durum güncellenemedi", { description: error.message });
    } else {
      toast.success("Durum güncellendi");
      refresh();
    }
  }

  async function handleDelete(id: string) {
    const ok = await confirmDialog({
      title: "Bu teklif talebini silmek istediğinize emin misiniz?",
      description: "Bu işlem geri alınamaz.",
      confirmLabel: "Evet, sil",
      destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("quote_requests").delete().eq("id", id);
    if (error) toast.error("Silinemedi", { description: error.message });
    else { toast.success("Teklif talebi silindi"); refresh(); }
  }

  const filtered = items.filter((q) => {
    if (filter !== "all" && q.status !== filter) return false;
    if (!query.trim()) return true;
    const t = query.trim().toLowerCase();
    return [q.contact_name, q.company, q.email, q.phone, q.message]
      .some((v) => (v ?? "").toString().toLowerCase().includes(t));
  });

  const counts = QUOTE_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s.value] = items.filter((i) => i.status === s.value).length;
    return acc;
  }, { all: items.length });

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="admin-card p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} count={counts.all}>
            Tümü
          </FilterChip>
          {QUOTE_STATUSES.map((s) => (
            <FilterChip
              key={s.value}
              active={filter === s.value}
              onClick={() => setFilter(s.value)}
              count={counts[s.value] ?? 0}
              tone={s.tone}
            >
              {s.label}
            </FilterChip>
          ))}
        </div>
        <div
          className="flex items-center gap-2 h-10 px-3 rounded-xl sm:w-72"
          style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)" }}
        >
          <span style={{ color: "var(--admin-text-mute)" }}>
            <Icon name="search" className="text-[18px]" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="İsim, e-posta, firma ara…"
            className="bg-transparent outline-none text-sm flex-1 min-w-0"
            style={{ color: "var(--admin-text)" }}
          />
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl p-3 text-sm"
          style={{ background: "var(--admin-danger-soft)", color: "var(--admin-danger)" }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-card p-5 flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-skel h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={items.length === 0 ? "mail" : "search_off"}
          title={items.length === 0 ? "Henüz teklif talebi yok" : "Sonuç bulunamadı"}
          description={items.length === 0
            ? "Web sitesinden gelen teklif talepleri burada listelenir."
            : "Farklı bir filtre veya anahtar kelime deneyin."}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((q) => {
            const itemsList = Array.isArray(q.items)
              ? (q.items as Array<{ name?: string; sku?: string; quantity?: number }>)
              : [];
            const initials = (q.contact_name || "?")
              .split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
            const statusMeta = QUOTE_STATUSES.find((s) => s.value === q.status);
            return (
              <article key={q.id} className="admin-card p-4 sm:p-5 flex flex-col gap-4">
                <header className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div
                    className="h-11 w-11 rounded-xl grid place-items-center font-semibold text-[15px] shrink-0"
                    style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <p className="font-semibold text-[15px]" style={{ color: "var(--admin-text)" }}>
                        {q.contact_name}
                      </p>
                      {q.company && (
                        <span className="text-[13px]" style={{ color: "var(--admin-text-2)" }}>
                          · {q.company}
                        </span>
                      )}
                      {statusMeta && (
                        <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
                      )}
                    </div>
                    <p className="text-[13px] mt-0.5 flex flex-wrap gap-x-3" style={{ color: "var(--admin-text-2)" }}>
                      <a href={`mailto:${q.email}`} className="hover:underline">{q.email}</a>
                      {q.phone && <a href={`tel:${q.phone}`} className="hover:underline">{q.phone}</a>}
                      <span>{new Date(q.created_at).toLocaleString("tr-TR")}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={q.status}
                      onChange={(e) => updateStatus(q.id, e.target.value)}
                      className="admin-input h-9 text-[13px]"
                      style={{ padding: "0 30px 0 10px" }}
                      aria-label="Durum"
                    >
                      {QUOTE_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon"
                      style={{ color: "var(--admin-danger)" }}
                      aria-label="Sil"
                      title="Sil"
                    >
                      <Icon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--admin-text-mute)" }}>
                        Ürün Grubu / Kategori
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-[#08182C] font-semibold text-sm">
                        <Icon name="category" className="text-[16px] text-primary" />
                        {q.category_name || "Belirtilmedi"}
                      </div>
                    </div>

                    {q.message && (
                      <div>
                        <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--admin-text-mute)" }}>
                          Talep Detayı
                        </p>
                        <p
                          className="text-[14px] p-3 rounded-lg leading-relaxed"
                          style={{ background: "var(--admin-surface-2)", color: "var(--admin-text)" }}
                        >
                          {q.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Backward compatibility / Legacy data */}
                  {(q.city || q.timeline || q.budget || itemsList.length > 0) && (
                    <div className="space-y-3 p-4 rounded-xl border border-dashed border-admin-border" style={{ background: "var(--admin-surface)" }}>
                      <p className="text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--admin-text-mute)" }}>
                        Ek Bilgiler
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-[13px]">
                        {q.city && <div><span className="text-admin-text-mute block text-[11px]">Şehir</span>{q.city}</div>}
                        {q.timeline && <div><span className="text-admin-text-mute block text-[11px]">Termin</span>{q.timeline}</div>}
                        {q.budget && <div><span className="text-admin-text-mute block text-[11px]">Bütçe</span>{q.budget}</div>}
                      </div>
                      
                      {itemsList.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-admin-border">
                          <p className="text-[11px] font-semibold mb-1" style={{ color: "var(--admin-text-mute)" }}>Eski Kayıt Ürünleri</p>
                          <ul className="flex flex-wrap gap-1.5">
                            {itemsList.map((it, i) => (
                              <li
                                key={i}
                                className="text-[12px] px-2 py-0.5 rounded bg-admin-surface-2 text-admin-text-2 border border-admin-border"
                              >
                                {it.name ?? it.sku ?? "Ürün"} × {it.quantity ?? 1}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>

            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================= Users ================= */

function UsersTab({ currentUserId }: { currentUserId: string }) {
  const [roles, setRoles] = useState<UserRoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setRoles((data as UserRoleRow[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  async function makeAdmin(userId: string) {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) toast.error("Yetki verilemedi", { description: error.message });
    else { toast.success("Kullanıcı yönetici yapıldı"); refresh(); }
  }
  async function removeRole(id: string) {
    const ok = await confirmDialog({
      title: "Bu yetkiyi kaldırmak istediğinize emin misiniz?",
      description: "Kullanıcı bu yetkinin sağladığı erişimi kaybeder.",
      confirmLabel: "Kaldır",
      destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) toast.error("Kaldırılamadı", { description: error.message });
    else { toast.success("Yetki kaldırıldı"); refresh(); }
  }

  const grouped = new Map<string, UserRoleRow[]>();
  for (const r of roles) {
    const list = grouped.get(r.user_id) ?? [];
    list.push(r);
    grouped.set(r.user_id, list);
  }
  const entries = Array.from(grouped.entries());

  return (
    <div className="flex flex-col gap-4">
      <div
        className="admin-card p-4 flex items-start gap-3"
        style={{ background: "var(--admin-yellow-soft)", borderColor: "var(--admin-yellow-border)" }}
      >
        <span
          className="h-9 w-9 rounded-lg grid place-items-center shrink-0"
          style={{ background: "var(--admin-yellow)", color: "var(--admin-navy)" }}
        >
          <Icon name="info" className="text-[18px]" />
        </span>
        <p className="text-[13.5px]" style={{ color: "var(--admin-navy)" }}>
          Yeni bir kullanıcıyı yönetici yapmak için önce o kişinin{" "}
          <Link to="/giris" className="underline font-semibold">/giris</Link>{" "}
          üzerinden kayıt olması gerekir. Ardından listede User ID'sini görüp{" "}
          <strong>Yönetici Yap</strong> butonunu kullanın.
        </p>
      </div>

      {error && (
        <div className="rounded-xl p-3 text-sm" style={{ background: "var(--admin-danger-soft)", color: "var(--admin-danger)" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-card p-5 flex flex-col gap-3">
          {[...Array(3)].map((_, i) => <div key={i} className="admin-skel h-12" />)}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState icon="group" title="Henüz kullanıcı yok" description="Kayıt olan kullanıcılar burada görünür." />
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    className="text-left px-5 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold"
                    style={{ color: "var(--admin-text-2)", background: "var(--admin-surface-2)", borderBottom: "1px solid var(--admin-border)" }}
                  >
                    Kullanıcı
                  </th>
                  <th
                    className="text-left px-5 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold"
                    style={{ color: "var(--admin-text-2)", background: "var(--admin-surface-2)", borderBottom: "1px solid var(--admin-border)" }}
                  >
                    Yetkiler
                  </th>
                  <th
                    className="text-right px-5 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold"
                    style={{ color: "var(--admin-text-2)", background: "var(--admin-surface-2)", borderBottom: "1px solid var(--admin-border)" }}
                  >
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([uid, rs], i) => {
                  const isAdminRow = rs.some((r) => r.role === "admin");
                  return (
                    <tr key={uid}>
                      <td className="px-5 py-4" style={{ borderTop: i === 0 ? 0 : "1px solid var(--admin-border)" }}>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-[12px] px-2 py-1 rounded"
                            style={{ background: "var(--admin-surface-2)", color: "var(--admin-text)" }}
                          >
                            {uid.slice(0, 8)}…{uid.slice(-4)}
                          </span>
                          {uid === currentUserId && (
                            <StatusBadge tone="accent">Siz</StatusBadge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4" style={{ borderTop: i === 0 ? 0 : "1px solid var(--admin-border)" }}>
                        <div className="flex flex-wrap gap-1.5">
                          {rs.map((r) => (
                            <span
                              key={r.id}
                              className="inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1 rounded-full text-[12px] font-medium"
                              style={{
                                background: r.role === "admin" ? "var(--admin-navy-soft)" : "var(--admin-surface-2)",
                                color: r.role === "admin" ? "var(--admin-navy)" : "var(--admin-text-2)",
                                border: "1px solid var(--admin-border)",
                              }}
                            >
                              {r.role === "admin" ? "Yönetici" : "Kullanıcı"}
                              <button
                                onClick={() => removeRole(r.id)}
                                className="h-5 w-5 rounded-full grid place-items-center hover:bg-[var(--admin-surface)]"
                                style={{ color: "var(--admin-danger)" }}
                                aria-label="Yetkiyi kaldır"
                                title="Kaldır"
                              >
                                <Icon name="close" className="text-[13px]" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td
                        className="px-5 py-4 text-right whitespace-nowrap"
                        style={{ borderTop: i === 0 ? 0 : "1px solid var(--admin-border)" }}
                      >
                        {!isAdminRow && (
                          <button
                            onClick={() => makeAdmin(uid)}
                            className="admin-btn admin-btn-outline admin-btn-sm"
                          >
                            <Icon name="shield_person" className="text-[16px]" />
                            Yönetici Yap
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ManualAdminGrant onGrant={makeAdmin} />
    </div>
  );
}

function ManualAdminGrant({ onGrant }: { onGrant: (id: string) => void }) {
  const [uid, setUid] = useState("");
  return (
    <div className="admin-card p-4 flex flex-col gap-2 max-w-2xl">
      <div className="flex items-center gap-2">
        <span
          className="h-8 w-8 rounded-lg grid place-items-center"
          style={{ background: "var(--admin-navy-soft)", color: "var(--admin-navy)" }}
        >
          <Icon name="key" className="text-[16px]" />
        </span>
        <p className="font-semibold text-[14px]" style={{ color: "var(--admin-text)" }}>
          User ID ile Yönetici Yetkisi Ver
        </p>
      </div>
      <p className="text-[12.5px]" style={{ color: "var(--admin-text-2)" }}>
        Kayıtlı bir kullanıcının UUID'sini yapıştırın; anında yönetici yetkisi verilir.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 mt-1">
        <input
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          placeholder="00000000-0000-0000-0000-000000000000"
          className="admin-input font-mono flex-1"
        />
        <button
          onClick={() => {
            if (!uid.trim()) return;
            onGrant(uid.trim());
            setUid("");
          }}
          className="admin-btn admin-btn-primary admin-btn-sm"
          disabled={!uid.trim()}
        >
          <Icon name="add" className="text-[16px]" />
          Yetki Ver
        </button>
      </div>
    </div>
  );
}

/* ================= Shared ================= */

function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}) {
  const cls = `admin-badge admin-badge-${tone}`;
  return <span className={cls}>{children}</span>;
}

function FilterChip({
  active,
  onClick,
  count,
  tone,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  tone?: "accent" | "warning" | "success" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 h-9 px-3 rounded-full text-[13px] font-medium transition-colors"
      style={
        active
          ? { background: "var(--admin-navy)", color: "#fff", border: "1px solid var(--admin-navy)" }
          : { background: "var(--admin-surface-2)", color: "var(--admin-text-2)", border: "1px solid var(--admin-border)" }
      }
    >
      {children}
      <span
        className="h-5 min-w-[20px] px-1.5 rounded-full grid place-items-center text-[11px] font-semibold"
        style={
          active
            ? { background: "var(--admin-yellow)", color: "var(--admin-navy)" }
            : tone
              ? { background: `var(--admin-${tone === "accent" ? "yellow" : tone}-soft)`, color: `var(--admin-${tone === "accent" ? "navy" : tone})` }
              : { background: "var(--admin-surface)", color: "var(--admin-text-2)" }
        }
      >
        {count}
      </span>
    </button>
  );
}

/* ================= CMS Tabs (GenericCrud) ================= */

const PUBLISHED_FIELD: CrudField = { name: "published", label: "Yayında", type: "checkbox" };
const ORDER_FIELD: CrudField = { name: "display_order", label: "Sıra", type: "number" };

function pubCol(): CrudColumn {
  return { key: "published", label: "Yayında", render: (r) => (r.published ? "✓" : "—") };
}

export function CatalogsTab() {
  return (
    <GenericCrud
      table="catalogs"
      quickAddKey="catalogs"
      title="Katalog Yönetimi"
      orderBy="display_order"
      ascending
      fields={[
        { name: "title", label: "Katalog Başlığı", required: true },
        { name: "year", label: "Yıl", placeholder: "2024" },
        { name: "pages", label: "Sayfa Sayısı", placeholder: "120 Sayfa" },
        { name: "file_size", label: "Dosya Boyutu", placeholder: "24 MB" },
        { name: "cover_url", label: "Kapak Görseli", type: "file", help: "A4 formatında görsel yükleyin" },
        { name: "pdf_url", label: "PDF Dosyası", type: "file", help: "PDF formatında dosya yükleyin" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[
        { key: "title", label: "Başlık" },
        { key: "year", label: "Yıl" },
        pubCol(),
      ]}
    />
  );
}


export function BrandsTab() {
  return (
    <GenericCrud
      table="brands"
      quickAddKey="brands"
      title="Bayilik Yönetimi"
      orderBy="display_order"
      ascending
      fields={[
        { name: "name", label: "Bayilik/Marka Adı", required: true },
        { name: "logo_url", label: "Logo URL", type: "url" },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "website_url", label: "Resmî Web Sitesi URL", type: "url" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[{ key: "name", label: "Bayilik" }, { key: "display_order", label: "Sıra" }, pubCol()]}
    />
  );
}

export function CertificatesTab() {
  return (
    <GenericCrud
      table="certificates"
      quickAddKey="certificates"
      title="Sertifikalar"
      orderBy="display_order"
      ascending
      fields={[
        { name: "name", label: "Ad", required: true },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "image_url", label: "Görsel URL", type: "url" },
        { name: "issued_at", label: "Veriliş Tarihi", type: "date" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[{ key: "name", label: "Ad" }, pubCol()]}
    />
  );
}

export function TeamTab() {
  return (
    <GenericCrud
      table="team_members"
      quickAddKey="team"
      title="Ekip Üyeleri"
      orderBy="display_order"
      ascending
      fields={[
        { name: "name", label: "Ad Soyad", required: true },
        { name: "role", label: "Görev", required: true },
        { name: "photo_url", label: "Fotoğraf URL", type: "url" },
        { name: "bio", label: "Kısa Biyografi", type: "textarea" },
        { name: "email", label: "E-posta" },
        { name: "linkedin_url", label: "LinkedIn", type: "url" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[{ key: "name", label: "Ad" }, { key: "role", label: "Görev" }, pubCol()]}
    />
  );
}

export function TestimonialsTab() {
  return (
    <GenericCrud
      table="testimonials"
      quickAddKey="testimonials"
      title="Müşteri Yorumları"
      orderBy="display_order"
      ascending
      fields={[
        { name: "name", label: "Ad", required: true },
        { name: "company", label: "Firma" },
        { name: "role", label: "Görev" },
        { name: "quote", label: "Yorum", type: "textarea", required: true },
        { name: "avatar_url", label: "Avatar URL", type: "url" },
        { name: "rating", label: "Puan (1-5)", type: "number" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[{ key: "name", label: "Ad" }, { key: "company", label: "Firma" }, pubCol()]}
    />
  );
}

export function FaqsTab() {
  return (
    <GenericCrud
      table="faqs"
      quickAddKey="faqs"
      title="Sık Sorulan Sorular"
      extraRowActions={[askAiAction("update_faq_content")]}
      orderBy="display_order"
      ascending
      fields={[
        { name: "question", label: "Soru", required: true },
        { name: "answer", label: "Cevap", type: "textarea", required: true },
        { name: "category", label: "Kategori" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[{ key: "question", label: "Soru" }, { key: "category", label: "Kategori" }, pubCol()]}
    />
  );
}


export function MessagesTab() {
  return (
    <GenericCrud
      table="contact_messages"
      title="İletişim Mesajları"
      allowCreate={false}
      fields={[
        { name: "name", label: "Ad" },
        { name: "email", label: "E-posta" },
        { name: "phone", label: "Telefon" },
        { name: "department", label: "Departman" },
        { name: "subject", label: "Konu" },
        { name: "message", label: "Mesaj", type: "textarea" },
        { name: "status", label: "Durum", type: "select", options: [
          { value: "new", label: "Yeni" },
          { value: "in_progress", label: "İşlemde" },
          { value: "resolved", label: "Çözüldü" },
          { value: "archived", label: "Arşiv" },
        ] },
        { name: "admin_notes", label: "Notlar", type: "textarea" },
      ]}
      columns={[
        { key: "name", label: "Ad" },
        { key: "subject", label: "Konu" },
        { key: "status", label: "Durum" },
        { key: "created_at", label: "Tarih", render: (r) => new Date(String(r.created_at)).toLocaleString("tr-TR") },
      ]}
    />
  );
}