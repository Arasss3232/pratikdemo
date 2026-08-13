import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { PageHeader } from "@/components/admin/PageHeader";
import { ContentManagement } from "@/components/admin/content/ContentManagement";
import { SeoShell, type SeoSubTab } from "@/components/admin/seo/SeoShell";
import { SeoGeneralSettings } from "@/components/admin/seo/SeoGeneralSettings";
import type { AdminTab } from "@/components/admin/nav";

const TAB_KEYS: AdminTab[] = [
  "dashboard", "content", "categories", "catalogs", 
  "messages", "seo", "myTasks", "notifications", 
  "roles"
];

function PlaceholderModule({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center bg-white/50">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <span className="material-symbols-rounded text-slate-400 text-3xl">construction</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm">{description}</p>
    </div>
  );
}

function AdminPage() {
  const search = Route.useSearch();
  const tab = (search.tab as AdminTab) || "dashboard";
  const seoTab = (search.seoTab as SeoSubTab) || "dashboard";
  const navigate = useNavigate({ from: Route.fullPath });
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
    navigate({ 
      search: (prev: any) => ({ ...prev, tab: newTab }),
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
        {tab === "dashboard" && (
          <>
            <PageHeader 
              tab="dashboard"
              title="Genel Bakış" 
              description="Sitenizin genel durumu, öncelikleriniz ve son hareketler." 
            />
            <PlaceholderModule title="Dashboard Paneli" description="İstatistikler ve özet veriler yakında burada olacak." />
          </>
        )}
        
        {tab === "content" && <ContentManagement />}
        
        {tab === "categories" && (
          <>
            <PageHeader 
              tab="categories"
              title="Kategori Yönetimi" 
              description="Ürün kategorileri ve alt kategoriler." 
            />
            <PlaceholderModule title="Kategori Yönetimi" description="Ürün kategorilerini ve hiyerarşiyi buradan yönetebileceksiniz." />
          </>
        )}
        
        {tab === "catalogs" && (
          <>
            <PageHeader 
              tab="catalogs"
              title="Katalog Yönetimi" 
              description="Dijital ürün kataloglarını (PDF) buradan yönetin." 
            />
            <PlaceholderModule title="Katalog Yönetimi" description="PDF katalog yükleme ve listeleme modülü." />
          </>
        )}
        
        {tab === "messages" && (
          <>
            <PageHeader 
              tab="messages"
              title="İletişim Mesajları" 
              description="Web sitenizden gelen iletişim mesajları." 
            />
            <PlaceholderModule title="Gelen Mesajlar" description="Müşterilerden gelen tüm talepler burada listelenecek." />
          </>
        )}
        
        {tab === "seo" && (
          <>
            <PageHeader 
              tab="seo"
              title="SEO ve Analitik" 
              description="Arama motoru optimizasyonu, meta etiketleri ve site kimliği yönetimi." 
            />
            <SeoShell currentTab={seoTab} onTabChange={handleSeoTabChange}>
              {seoTab === "dashboard" && <PlaceholderModule title="SEO Kontrol Paneli" description="SEO performans özeti." />}
              {seoTab === "general" && <SeoGeneralSettings />}
              {/* Fallback for other SEO tabs */}
              {!["dashboard", "general"].includes(seoTab) && (
                <PlaceholderModule title="Modül Hazırlanıyor" description={`${seoTab} modülü yakında aktif edilecek.`} />
              )}
            </SeoShell>
          </>
        )}
        
        {tab === "myTasks" && (
          <>
            <PageHeader 
              tab="myTasks"
              title="Görevlerim" 
              description="Size atanmış görevler, hatırlatmalar ve süresi yaklaşan işler." 
            />
            <PlaceholderModule title="Görevlerim" description="İş takip ve atama modülü." />
          </>
        )}
        
        {tab === "notifications" && (
          <>
            <PageHeader 
              tab="notifications"
              title="Bildirimler" 
              description="Sistemden gelen tüm bildirimler ve önemli uyarılar." 
            />
            <PlaceholderModule title="Bildirim Merkezi" description="Sistem içi uyarılar ve bildirimler." />
          </>
        )}
        
        {tab === "roles" && (
          <>
            <PageHeader 
              tab="roles"
              title="Roller ve Yetkiler" 
              description="Sistem rolleri, izin matrisi ve dahili roller." 
            />
            <PlaceholderModule title="Rol ve Yetki Yönetimi" description="Kullanıcı bazlı yetkilendirme ayarları." />
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
    tab?: string; 
    seoTab?: string; 
    aiAction?: string; 
    aiTarget?: string; 
    aiPrompt?: string;
    categoryId?: string;
    category?: string;
  } => ({
    tab: s.tab as string,
    seoTab: s.seoTab as string,
    aiAction: s.aiAction as string,
    aiTarget: s.aiTarget as string,
    aiPrompt: s.aiPrompt as string,
    categoryId: s.categoryId as string,
    category: s.category as string,
  }),
  component: AdminPage,
});
