import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { ContentManagement } from "@/components/admin/content/ContentManagement";
import { SeoShell, type SeoSubTab } from "@/components/admin/seo/SeoShell";
import { SeoGeneralSettings } from "@/components/admin/seo/SeoGeneralSettings";
import { SeoDashboard } from "@/components/admin/seo/SeoDashboard";
import { SeoPageManagement } from "@/components/admin/seo/SeoPageManagement";
import { SeoSitemap } from "@/components/admin/seo/SeoSitemap";
import { SeoRobots } from "@/components/admin/seo/SeoRobots";
import { SeoSearchConsole } from "@/components/admin/seo/SeoSearchConsole";
import { SeoAnalytics } from "@/components/admin/seo/SeoAnalytics";
import { SeoTagManager } from "@/components/admin/seo/SeoTagManager";
import { SeoRedirects } from "@/components/admin/seo/SeoRedirects";
import { SeoSchema } from "@/components/admin/seo/SeoSchema";
import { SeoSocial } from "@/components/admin/seo/SeoSocial";
import { SeoFavicon } from "@/components/admin/seo/SeoFavicon";
import { SeoTools } from "@/components/admin/seo/SeoTools";
import { Dashboard } from "@/components/admin/Dashboard";
import { UserManagement } from "@/components/admin/UserManagement";
import { RolesTab } from "@/components/admin/RolesTab";
import { AuditLogsTab } from "@/components/admin/AuditLogsTab";
import { TasksTab } from "@/components/admin/TasksTab";
import { ApprovalsTab } from "@/components/admin/ApprovalsTab";
import { NotificationsTab } from "@/components/admin/NotificationsTab";
import { GenericCrud } from "@/components/admin/GenericCrud";
import type { AdminTab } from "@/components/admin/nav";

function AdminPage() {
  const search = Route.useSearch();
  const tab = (search.tab as AdminTab) || "dashboard";
  const seoTab = (search.seoTab as SeoSubTab) || "dashboard";
  const navigate = useNavigate({ from: Route.fullPath });
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
        setUserId(session.user.id);
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  const handleTabChange = (newTab: AdminTab) => {
    // Clear sub-tab parameters when switching main tabs
    navigate({ 
      search: { tab: newTab },
      replace: true 
    });
  };

  const handleSeoTabChange = (newSeoTab: SeoSubTab) => {
    navigate({ 
      search: (prev: any) => ({ ...prev, seoTab: newSeoTab }),
      replace: true
    });
  };

  const handleQuickAdd = (type: AdminTab) => {
    handleTabChange(type);
  };

  if (loading) return null;

  return (
    <AdminShell 
      tab={tab} 
      onTabChange={handleTabChange} 
      userEmail={userEmail}
      onQuickAdd={handleQuickAdd}
    >
      <div className="space-y-6">
        {tab === "dashboard" && <Dashboard onNavigate={handleTabChange} />}
        
        {tab === "content" && <ContentManagement />}
        
        {tab === "categories" && (
          <GenericCrud
            table="product_categories"
            title="Kategori Yönetimi"
            description="Ürün grupları ve teklif kategorilerini yönetin."
            fields={[
              { name: "name", label: "Kategori Adı", type: "text", required: true },
              { name: "description", label: "Açıklama", type: "textarea" },
              { name: "image_url", label: "Kategori Görseli", type: "file" },
              { name: "image_alt", label: "Görsel Alt Etiketi (SEO)", type: "text" },
              { name: "display_order", label: "Sıralama", type: "number" },
              { name: "is_active", label: "Aktif", type: "checkbox" },
            ]}
            columns={[
              { key: "name", label: "Kategori" },
              { key: "display_order", label: "Sıra" },
              { key: "is_active", label: "Durum", render: (r) => r.is_active ? "Aktif" : "Pasif" },
            ]}
          />
        )}
        
        {tab === "catalogs" && (
          <GenericCrud
            table="catalogs"
            title="Katalog Yönetimi"
            description="Dijital PDF kataloglarını yönetin."
            fields={[
              { name: "title", label: "Katalog Başlığı", type: "text", required: true },
              { name: "description", label: "Açıklama", type: "textarea" },
              { name: "pdf_url", label: "PDF Dosyası", type: "file" },
              { name: "cover_image", label: "Kapak Görseli", type: "file" },
              { name: "year", label: "Yıl", type: "number" },
              { name: "display_order", label: "Sıralama", type: "number" },
            ]}
            columns={[
              { key: "title", label: "Katalog" },
              { key: "year", label: "Yıl" },
            ]}
          />
        )}

        {tab === "brands" && (
          <GenericCrud
            table="brands"
            title="Bayilik Yönetimi"
            description="Yetkili bayisi olunan markaları yönetin."
            fields={[
              { name: "name", label: "Marka Adı", type: "text", required: true },
              { name: "description", label: "Açıklama", type: "textarea" },
              { name: "logo_url", label: "Logo", type: "file" },
              { name: "website_url", label: "Web Sitesi", type: "url" },
              { name: "display_order", label: "Sıralama", type: "number" },
            ]}
            columns={[
              { key: "name", label: "Marka" },
              { key: "website_url", label: "Web Sitesi" },
            ]}
          />
        )}

        {tab === "slider" && (
          <GenericCrud
            table="homepage_brochures"
            title="Slider Yönetimi"
            description="Ana sayfa kampanya slider içeriklerini yönetin."
            fields={[
              { name: "title", label: "Başlık", type: "text", required: true },
              { name: "eyebrow", label: "Üst Başlık", type: "text" },
              { name: "subtitle", label: "Alt Başlık", type: "text" },
              { name: "description", label: "Açıklama", type: "textarea" },
              { name: "image_desktop", label: "Görsel (Masaüstü)", type: "file" },
              { name: "image_mobile", label: "Görsel (Mobil)", type: "file" },
              { name: "primary_cta_label", label: "Buton Metni", type: "text" },
              { name: "primary_cta_href", label: "Buton Linki", type: "text" },
              { name: "display_order", label: "Sıralama", type: "number" },
              { name: "is_active", label: "Aktif", type: "checkbox" },
            ]}
            columns={[
              { key: "title", label: "Başlık" },
              { key: "display_order", label: "Sıra" },
              { key: "is_active", label: "Durum", render: (r) => r.is_active ? "Aktif" : "Pasif" },
            ]}
          />
        )}
        
        {tab === "messages" && (
          <GenericCrud
            table="contact_messages"
            title="İletişim Mesajları"
            description="Web sitesinden gelen iletişim mesajlarını inceleyin."
            allowCreate={false}
            fields={[
              { name: "name", label: "Gönderen", type: "text" },
              { name: "email", label: "E-posta", type: "text" },
              { name: "subject", label: "Konu", type: "text" },
              { name: "message", label: "Mesaj", type: "textarea" },
              { name: "status", label: "Durum", type: "select", options: [
                { value: "new", label: "Yeni" },
                { value: "read", label: "Okundu" },
                { value: "replied", label: "Yanıtlandı" },
              ]},
            ]}
            columns={[
              { key: "name", label: "Gönderen" },
              { key: "subject", label: "Konu" },
              { key: "created_at", label: "Tarih", render: (r) => new Date(r.created_at as string).toLocaleDateString("tr-TR") },
            ]}
          />
        )}

        {tab === "quotes" && (
          <GenericCrud
            table="quote_requests"
            title="Teklif Talepleri"
            description="Web sitesinden gelen teklif taleplerini yönetin."
            allowCreate={false}
            fields={[
              { name: "contact_name", label: "İlgili Kişi", type: "text" },
              { name: "company", label: "Firma", type: "text" },
              { name: "email", label: "E-posta", type: "text" },
              { name: "phone", label: "Telefon", type: "text" },
              { name: "message", label: "Talep Detayı", type: "textarea" },
              { name: "status", label: "Durum", type: "select", options: [
                { value: "new", label: "Yeni" },
                { value: "processing", label: "İşleniyor" },
                { value: "completed", label: "Tamamlandı" },
              ]},
            ]}
            columns={[
              { key: "contact_name", label: "Kişi" },
              { key: "company", label: "Firma" },
              { key: "created_at", label: "Tarih", render: (r) => new Date(r.created_at as string).toLocaleDateString("tr-TR") },
            ]}
          />
        )}
        
        {tab === "seo" && (
          <SeoShell currentTab={seoTab} onTabChange={handleSeoTabChange}>
            {seoTab === "dashboard" && <SeoDashboard onNavigate={(t, st) => navigate({ search: { tab: t, seoTab: st } })} />}
            {seoTab === "general" && <SeoGeneralSettings />}
            {seoTab === "pages" && <SeoPageManagement />}
            {seoTab === "sitemap" && <SeoSitemap />}
            {seoTab === "robots" && <SeoRobots />}
            {seoTab === "search-console" && <SeoSearchConsole />}
            {seoTab === "analytics" && <SeoAnalytics />}
            {seoTab === "tag-manager" && <SeoTagManager />}
            {seoTab === "redirects" && <SeoRedirects />}
            {seoTab === "schema" && <SeoSchema />}
            {seoTab === "social" && <SeoSocial />}
            {seoTab === "favicon" && <SeoFavicon />}
            {seoTab === "audit" && <SeoTools />}
          </SeoShell>
        )}
        
        {tab === "myTasks" && <TasksTab />}
        {tab === "approvals" && <ApprovalsTab />}
        {tab === "notifications" && <NotificationsTab />}
        
        {tab === "users" && <UserManagement currentUserId={userId} />}
        {tab === "roles" && <RolesTab />}
        {tab === "activityLogs" && <AuditLogsTab />}
        
        {tab === "settings" && (
          <div className="admin-card p-8">
             <h2 className="text-xl font-bold mb-4">Site Ayarları</h2>
             <p className="text-muted-foreground">Genel site yapılandırması CMS içerisindeki "Genel İçerikler" bölümüne taşınmıştır.</p>
             <button 
              onClick={() => handleTabChange("content")}
              className="mt-4 admin-btn admin-btn-primary"
             >
               CMS'e Git
             </button>
          </div>
        )}

        {tab === "media" && (
          <GenericCrud
            table="media_library"
            title="Medya Yönetimi"
            description="Tüm görsel, PDF ve dosya varlıklarını yönetin."
            fields={[
              { name: "title", label: "Dosya Adı", type: "text", required: true },
              { name: "file_url", label: "Dosya Seç", type: "file" },
              { name: "file_type", label: "Dosya Türü", type: "select", options: [
                { value: "image", label: "Görsel" },
                { value: "pdf", label: "PDF" },
                { value: "other", label: "Diğer" },
              ]},
            ]}
            columns={[
              { key: "title", label: "Başlık" },
              { key: "file_type", label: "Tür" },
              { key: "created_at", label: "Yüklenme", render: (r) => new Date(r.created_at as string).toLocaleDateString("tr-TR") },
            ]}
          />
        )}

      </div>
    </AdminShell>
  );
}

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/giris" });
    }
    
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id);
      
    const isAdmin = roles?.some(r => r.role === "admin");
    if (!isAdmin) {
      throw redirect({ to: "/" });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin Paneli — Pratik Endüstriyel" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { 
    tab?: string; 
    seoTab?: string; 
  } => ({
    tab: s.tab as string,
    seoTab: s.seoTab as string,
  }),
  component: AdminPage,
});