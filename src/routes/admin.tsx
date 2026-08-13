import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { ContentManagement } from "@/components/admin/content/ContentManagement";
import { CategoryManagement } from "@/components/admin/catalog/CategoryManagement";
import { CatalogManagement } from "@/components/admin/catalog/CatalogManagement";
import { DealershipManagement } from "@/components/admin/dealership/DealershipManagement";
import { MessageManagement } from "@/components/admin/messages/MessageManagement";
import { SeoShell } from "@/components/admin/seo/SeoShell";
import { TaskManagement } from "@/components/admin/tasks/TaskManagement";
import { ApprovalManagement } from "@/components/admin/approvals/ApprovalManagement";
import { NotificationCenter } from "@/components/admin/notifications/NotificationCenter";
import { HistoryManagement } from "@/components/admin/history/HistoryManagement";
import { RoleManagement } from "@/components/admin/roles/RoleManagement";
import { PageHeader } from "@/components/admin/PageHeader";
import type { AdminTab } from "@/components/admin/nav";
import type { SeoSubTab } from "@/components/admin/seo/SeoShell";

const TAB_KEYS: AdminTab[] = [
  "dashboard", "content", "categories", "catalogs", "dealerships", 
  "messages", "seo", "tasks", "approvals", "notifications", 
  "history", "roles"
];

function AdminPage() {
  const { tab = "dashboard", seoTab = "dashboard" } = Route.useSearch();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  const handleTabChange = (newTab: AdminTab) => {
    navigate({ search: (prev) => ({ ...prev, tab: newTab }) });
  };

  const handleQuickAdd = (type: AdminTab) => {
    handleTabChange(type);
  };

  if (loading) return null;

  return (
    <AdminShell 
      tab={tab as AdminTab} 
      onTabChange={handleTabChange} 
      userEmail={userEmail}
      onQuickAdd={handleQuickAdd}
    >
      <div className="space-y-6">
        {tab === "dashboard" && <DashboardOverview />}
        {tab === "content" && <ContentManagement />}
        {tab === "categories" && (
          <>
            <PageHeader 
              title="Kategori Yönetimi" 
              description="Ürün gruplarını, görsellerini ve SEO ayarlarını yönetin." 
            />
            <CategoryManagement />
          </>
        )}
        {tab === "catalogs" && (
          <>
            <PageHeader 
              title="Katalog Yönetimi" 
              description="Dijital ürün kataloglarını ve PDF dosyalarını yönetin." 
            />
            <CatalogManagement />
          </>
        )}
        {tab === "dealerships" && (
          <>
            <PageHeader 
              title="Bayilik Yönetimi" 
              description="Sistemdeki markaları ve bayilik bilgilerini güncelleyin." 
            />
            <DealershipManagement />
          </>
        )}
        {tab === "messages" && (
          <>
            <PageHeader 
              title="Gelen Mesajlar" 
              description="Teklif talepleri ve iletişim formu mesajlarını yönetin." 
            />
            <MessageManagement />
          </>
        )}
        {tab === "seo" && (
          <>
            <PageHeader 
              title="SEO ve Analitik" 
              description="Site geneli SEO ayarlarını, meta verileri ve takip kodlarını yönetin." 
            />
            <SeoShell activeTab={seoTab as SeoSubTab} />
          </>
        )}
        {tab === "tasks" && (
          <>
            <PageHeader 
              title="Görev Takibi" 
              description="Yönetim ekibi için dahili görevleri ve iş listelerini yönetin." 
            />
            <TaskManagement />
          </>
        )}
        {tab === "approvals" && (
          <>
            <PageHeader 
              title="Onay Merkezi" 
              description="Bekleyen içerik değişikliklerini ve sistem onaylarını kontrol edin." 
            />
            <ApprovalManagement />
          </>
        )}
        {tab === "notifications" && (
          <>
            <PageHeader 
              title="Bildirimler" 
              description="Sistem bildirimlerini ve kullanıcı duyurularını görüntüleyin." 
            />
            <NotificationCenter />
          </>
        )}
        {tab === "history" && (
          <>
            <PageHeader 
              title="İşlem Geçmişi" 
              description="Sistemde yapılan tüm değişikliklerin loglarını inceleyin." 
            />
            <HistoryManagement />
          </>
        )}
        {tab === "roles" && (
          <>
            <PageHeader 
              title="Roller ve Yetkiler" 
              description="Yönetici rolleri ve erişim yetkilerini yapılandırın." 
            />
            <RoleManagement />
          </>
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
    tab?: AdminTab; 
    seoTab?: SeoSubTab; 
    aiAction?: string; 
    aiTarget?: string; 
    aiPrompt?: string 
  } => ({
    tab: (TAB_KEYS.includes(s.tab as AdminTab) ? s.tab : "dashboard") as AdminTab,
    seoTab: (s.seoTab as SeoSubTab) || "dashboard",
    aiAction: s.aiAction as string,
    aiTarget: s.aiTarget as string,
    aiPrompt: s.aiPrompt as string,
  }),
  component: AdminPage,
});
