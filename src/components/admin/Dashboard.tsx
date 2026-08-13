import { useEffect, useMemo, useState } from "react";
import { Icon } from "../site-shell";
import { supabase } from "@/integrations/supabase/client";
import type { AdminTab } from "./nav";

type Stat = {
  key: AdminTab;
  label: string;
  icon: string;
  value: number | null;
  hint?: string;
};

type Message = {
  id: string;
  name: string | null;
  subject: string | null;
  status: string | null;
  created_at: string;
};

type Quote = {
  id: string;
  contact_name: string;
  company: string | null;
  status: string;
  created_at: string;
};

type LoadedStats = {
  catalogs: number;
  quotesNew: number;
  messagesNew: number;
  refs: number;
  categories: number;
  lastUpdated: string | null;
  tasksPending: number;
  notificationsUnread: number;
};

const initialStats: LoadedStats = {
  catalogs: 0,
  quotesNew: 0,
  messagesNew: 0,
  refs: 0,
  categories: 0,
  lastUpdated: null,
  tasksPending: 0,
  notificationsUnread: 0,
};


export function Dashboard({ onNavigate }: { onNavigate: (t: AdminTab) => void }) {
  const [stats, setStats] = useState<LoadedStats>(initialStats);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Hoş geldiniz");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 6 ? "İyi geceler" : h < 12 ? "Günaydın" : h < 18 ? "İyi günler" : "İyi akşamlar");
  }, []);

  useEffect(() => {
    let alive = true;
    async function load() {
      const [cats, qNew, msgNew, refs, catsCount, lastUpd, taskCount, notifCount, appCount] = await Promise.all([
        supabase.from("catalogs" as any).select("*", { count: "exact", head: true }),
        supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("brands").select("*", { count: "exact", head: true }),
        supabase.from("product_categories").select("*", { count: "exact", head: true }),
        supabase.from("quote_requests").select("updated_at").order("updated_at", { ascending: false }).limit(1),
        supabase.from("admin_tasks").select("*", { count: "exact", head: true }).neq("status", "Tamamlandı"),
        supabase.from("notifications").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("approval_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      const [recentMsg, recentQ] = await Promise.all([
        supabase.from("contact_messages").select("id,name,subject,status,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("quote_requests").select("id,contact_name,company,status,created_at").order("created_at", { ascending: false }).limit(5),
      ]);

      if (!alive) return;
      setStats({
        catalogs: cats.count ?? 0,
        quotesNew: qNew.count ?? 0,
        messagesNew: msgNew.count ?? 0,
        refs: refs.count ?? 0,
        categories: catsCount.count ?? 0,
        lastUpdated: (lastUpd.data?.[0] as { updated_at?: string } | undefined)?.updated_at ?? null,
        tasksPending: taskCount.count ?? 0,
        notificationsUnread: notifCount.count ?? 0,
        approvalsPending: appCount.count ?? 0,
      });


      setMessages((recentMsg.data as Message[]) ?? []);
      setQuotes((recentQ.data as Quote[]) ?? []);
      setLoading(false);
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  const priorities = useMemo(() => {
    const list: { icon: string; label: string; value: string; tone: "warning" | "info" | "danger"; tab: AdminTab }[] = [];
    if (stats.messagesNew > 0)
      list.push({ icon: "mail", label: "Yanıtlanmamış mesaj", value: `${stats.messagesNew} adet`, tone: "warning", tab: "messages" });
    if (stats.quotesNew > 0)
      list.push({ icon: "request_quote", label: "Bekleyen teklif talebi", value: `${stats.quotesNew} adet`, tone: "warning", tab: "quotes" });
    if (stats.catalogs === 0)
      list.push({ icon: "menu_book", label: "Henüz katalog eklenmedi", value: "İlk kataloğu yükleyin", tone: "danger", tab: "catalogs" });
    return list.slice(0, 4);
  }, [stats]);

  const setup = useMemo(
    () => [
      { label: "Site ayarlarını tamamla", done: false, tab: "settings" as AdminTab, icon: "settings" },
      { label: "En az bir kategori ekle", done: stats.categories > 0, tab: "categories" as AdminTab, icon: "category" },
      { label: "En az bir katalog yükle", done: stats.catalogs > 0, tab: "catalogs" as AdminTab, icon: "menu_book" },
      
    ],
    [stats],
  );
  const setupDone = setup.filter((s) => s.done).length;
  const setupPct = Math.round((setupDone / setup.length) * 100);

  const quickCreate: { key: AdminTab; label: string; icon: string; desc: string }[] = [
    { key: "categories", label: "Kategori Ekle", icon: "category", desc: "Yeni ürün grubu" },
    { key: "catalogs", label: "Katalog Ekle", icon: "menu_book", desc: "Yeni PDF kataloğu" },
    
  ];

  const kpis: { key: AdminTab; label: string; icon: string; value: number; hint?: string }[] = [
    { key: "quotes", label: "Toplam Teklif Talebi", icon: "request_quote", value: stats.quotesNew, hint: "Yeni talepler" },
    { key: "messages", label: "Yeni İletişim Mesajları", icon: "mail", value: stats.messagesNew, hint: "Bekleyen mesajlar" },
    { key: "categories", label: "Aktif Kategori Sayısı", icon: "category", value: stats.categories },
    { key: "catalogs", label: "Aktif Katalog Sayısı", icon: "menu_book", value: stats.catalogs },
    { key: "brands", label: "Aktif Bayilik Sayısı", icon: "workspace_premium", value: stats.refs },
    { key: "notifications", label: "Okunmamış Bildirimler", icon: "notifications", value: stats.notificationsUnread },
    { key: "myTasks", label: "Geciken Görevler", icon: "task_alt", value: stats.tasksPending },
  ];


  return (
    <div className="admin-section">
      {/* Welcome hero */}
      <section
        className="relative overflow-hidden rounded-[20px] p-6 md:p-8"
        style={{
          background:
            "radial-gradient(circle at 90% 0%, rgba(244,197,66,0.28) 0%, rgba(244,197,66,0) 45%), linear-gradient(135deg, var(--admin-navy-deep) 0%, var(--admin-navy-2) 100%)",
          color: "#fff",
          boxShadow: "var(--admin-shadow-3)",
        }}
      >
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-10">
          <div>
            <p
              className="inline-flex items-center gap-1.5 h-6 px-3 rounded-full text-[11px] font-semibold mb-3"
              style={{ background: "rgba(244,197,66,0.16)", color: "var(--admin-yellow)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--admin-yellow)" }} />
              Yönetim Merkezi
            </p>
            <h1 className="text-[28px] md:text-[32px] font-bold tracking-tight leading-tight">
              {greeting}, hoş geldiniz.
            </h1>
            <p className="text-[15px] mt-2 max-w-xl" style={{ color: "rgba(231,236,243,0.78)" }}>
              Web sitenizi buradan kolayca yönetebilirsiniz. Aşağıdaki öncelikleri
              takip ederek bugünkü işlerinizi hızlıca tamamlayın.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate("messages")}
                className="admin-btn admin-btn-accent"
                style={{ height: 40 }}
              >
                <Icon name="inbox" className="text-[18px]" />
                Gelen Mesajlar
              </button>
              <button
                onClick={() => onNavigate("settings")}
                className="admin-btn"
                style={{
                  height: 40,
                  background: "rgba(255,255,255,0.10)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <Icon name="settings" className="text-[18px]" />
                Site Ayarları
              </button>
            </div>
          </div>

          {/* Setup checklist */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="flex items-baseline justify-between mb-3">
              <p className="text-[13px] font-semibold text-white/90">Site Kurulum Durumu</p>
              <p className="text-lg font-bold" style={{ color: "var(--admin-yellow)" }}>
                %{setupPct}
              </p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.14)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${setupPct}%`, background: "var(--admin-yellow)" }}
              />
            </div>
            <ul className="flex flex-col gap-1.5">
              {setup.map((s) => (
                <li key={s.label}>
                  <button
                    onClick={() => onNavigate(s.tab)}
                    className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left hover:bg-white/6 transition"
                  >
                    <span
                      className="grid place-items-center h-6 w-6 rounded-full text-[13px] shrink-0"
                      style={
                        s.done
                          ? { background: "var(--admin-yellow)", color: "var(--admin-navy-deep)" }
                          : { background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.6)" }
                      }
                    >
                      <Icon name={s.done ? "check" : "circle"} className="text-[14px]" />
                    </span>
                    <span
                      className="text-[13px] flex-1 truncate"
                      style={{
                        color: s.done ? "rgba(255,255,255,0.55)" : "#fff",
                        textDecoration: s.done ? "line-through" : "none",
                      }}
                    >
                      {s.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Priorities */}
      {priorities.length > 0 && (
        <section className="admin-card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className="grid place-items-center h-8 w-8 rounded-lg"
                style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}
              >
                <Icon name="priority_high" className="text-[18px]" />
              </span>
              <div>
                <h2 className="text-[16px] font-semibold">Bugünkü Öncelikler</h2>
                <p className="text-[12px]" style={{ color: "var(--admin-text-2)" }}>
                  Sitenizle ilgili dikkat gerektiren maddeler
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
            {priorities.map((p) => (
              <button
                key={p.label + p.tab}
                onClick={() => onNavigate(p.tab)}
                className="flex items-center gap-3 p-3 rounded-xl text-left transition hover:-translate-y-0.5"
                style={{
                  background: "var(--admin-surface-2)",
                  border: "1px solid var(--admin-border)",
                }}
              >
                <span
                  className="grid place-items-center h-10 w-10 rounded-lg shrink-0"
                  style={
                    p.tone === "danger"
                      ? { background: "var(--admin-danger-soft)", color: "var(--admin-danger)" }
                      : p.tone === "warning"
                      ? { background: "var(--admin-warning-soft)", color: "var(--admin-warning)" }
                      : { background: "var(--admin-info-soft)", color: "var(--admin-info)" }
                  }
                >
                  <Icon name={p.icon} className="text-[20px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px]" style={{ color: "var(--admin-text-2)" }}>
                    {p.label}
                  </span>
                  <span className="block text-[14px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>
                    {p.value}
                  </span>
                </span>
                <Icon name="arrow_forward" className="text-[16px]" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Quick create rail */}
      <section className="admin-card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[16px] font-semibold">Hızlı Oluştur</h2>
            <p className="text-[12px]" style={{ color: "var(--admin-text-2)" }}>
              Sık kullandığınız içerik türlerini tek tıkla oluşturun.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {quickCreate.map((q) => (
            <button
              key={q.key + q.label}
              onClick={() => {
                onNavigate(q.key as any);
                setTimeout(() => window.dispatchEvent(new CustomEvent("admin:quick-add", { detail: { tab: q.key } })), 60);
              }}
              className="group flex flex-col items-start gap-2 p-3.5 rounded-xl text-left transition-all hover:-translate-y-0.5"
              style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
              }}
            >
              <span
                className="grid place-items-center h-10 w-10 rounded-xl"
                style={{ background: "var(--admin-navy)", color: "var(--admin-yellow)" }}
              >
                <Icon name={q.icon} className="text-[20px]" />
              </span>
              <span className="text-[14px] font-semibold" style={{ color: "var(--admin-text)" }}>
                {q.label}
              </span>
              <span className="text-[12px] leading-tight" style={{ color: "var(--admin-text-2)" }}>
                {q.desc}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* KPI grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[16px] font-semibold">Sitenizin Anlık Durumu</h2>
            <p className="text-[12px]" style={{ color: "var(--admin-text-2)" }}>
              Her karta tıklayarak ilgili sayfaya gidin.
            </p>
          </div>
          {stats.lastUpdated && (
            <p className="hidden sm:block text-[12px]" style={{ color: "var(--admin-text-mute)" }}>
              Son güncelleme: {new Date(stats.lastUpdated).toLocaleString("tr-TR")}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-3">
          {kpis.map((s, i) => (
            <button
              key={s.label + i}
              onClick={() => onNavigate(s.key)}
              className="admin-card group text-left p-4 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="grid place-items-center h-9 w-9 rounded-lg"
                  style={{ background: "var(--admin-surface-2)", color: "var(--admin-navy)" }}
                >
                  <Icon name={s.icon} className="text-[18px]" />
                </span>
                {s.value > 0 && s.hint?.includes("Yanıt") && (
                  <span className="admin-badge admin-badge-warning">Dikkat</span>
                )}
              </div>
              <p className="text-[26px] font-bold tracking-tight" style={{ color: "var(--admin-text)" }}>
                {loading ? <span className="admin-skel inline-block h-6 w-10 align-middle" /> : s.value}
              </p>
              <p className="text-[13px] mt-0.5" style={{ color: "var(--admin-text-2)" }}>
                {s.label}
              </p>
              {s.hint && (
                <p className="text-[11px] mt-1" style={{ color: "var(--admin-text-mute)" }}>
                  {s.hint}
                </p>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentList
          title="Son Gelen Mesajlar"
          emptyLabel="Henüz mesaj yok."
          icon="mail"
          onSeeAll={() => onNavigate("messages")}
          items={messages.map((m) => ({
            id: m.id,
            primary: m.name ?? "İsimsiz",
            secondary: m.subject ?? "—",
            date: m.created_at,
            status: m.status,
          }))}
          onOpen={() => onNavigate("messages")}
        />
        <RecentList
          title="Son Teklif Talepleri"
          emptyLabel="Henüz teklif talebi yok."
          icon="request_quote"
          onSeeAll={() => onNavigate("quotes")}
          items={quotes.map((q) => ({
            id: q.id,
            primary: q.contact_name,
            secondary: q.company ?? "—",
            date: q.created_at,
            status: q.status,
          }))}
          onOpen={() => onNavigate("quotes")}
        />
      </div>
      
      {/* Quick actions & Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
        <section className="admin-card p-5">
          <h2 className="text-[16px] font-semibold mb-4">Hızlı Aksiyonlar</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onNavigate("categories")} className="admin-btn admin-btn-outline admin-btn-sm"><Icon name="add" /> Yeni Kategori</button>
            <button onClick={() => onNavigate("catalogs")} className="admin-btn admin-btn-outline admin-btn-sm"><Icon name="add" /> Yeni Katalog</button>
            <button onClick={() => onNavigate("brands")} className="admin-btn admin-btn-outline admin-btn-sm"><Icon name="add" /> Yeni Bayilik</button>
            <button onClick={() => onNavigate("quotes")} className="admin-btn admin-btn-outline admin-btn-sm"><Icon name="visibility" /> Teklif Talepleri</button>
            <button onClick={() => onNavigate("messages")} className="admin-btn admin-btn-outline admin-btn-sm"><Icon name="visibility" /> Mesajları Gör</button>
            <button onClick={() => onNavigate("slider")} className="admin-btn admin-btn-outline admin-btn-sm"><Icon name="slideshow" /> Slider Yönetimi</button>
            <button onClick={() => onNavigate("content")} className="admin-btn admin-btn-outline admin-btn-sm"><Icon name="edit_note" /> Site İçeriği</button>
            <button onClick={() => onNavigate("seo")} className="admin-btn admin-btn-outline admin-btn-sm"><Icon name="trending_up" /> SEO Yönetimi</button>
          </div>
        </section>

        <section className="admin-card p-5 lg:w-80">
          <h2 className="text-[16px] font-semibold mb-4">Görev & Onay</h2>
          <div className="space-y-3">
            <button onClick={() => onNavigate("myTasks")} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition">
              <div className="flex items-center gap-3">
                <Icon name="task_alt" className="text-blue-600" />
                <span className="text-sm font-medium">Bekleyen Görevlerim</span>
              </div>
              <span className="text-xs font-bold text-blue-600">{stats.tasksPending}</span>
            </button>
            <button onClick={() => onNavigate("approvals")} className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition">
              <div className="flex items-center gap-3">
                <Icon name="approval" className="text-orange-600" />
                <span className="text-sm font-medium">Onay Bekleyenler</span>
              </div>
              <span className="text-xs font-bold text-orange-600">{stats.approvalsPending}</span>
            </button>


          </div>
        </section>
      </div>
    </div>
  );
}

function RecentList({
  title,
  items,
  emptyLabel,
  icon,
  onSeeAll,
  onOpen,
}: {
  title: string;
  items: { id: string; primary: string; secondary: string; date: string; status: string | null }[];
  emptyLabel: string;
  icon: string;
  onSeeAll: () => void;
  onOpen: () => void;
}) {
  return (
    <section className="admin-card overflow-hidden">
      <header className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--admin-border)" }}>
        <div className="flex items-center gap-2">
          <span
            className="grid place-items-center h-7 w-7 rounded-lg"
            style={{ background: "var(--admin-surface-2)", color: "var(--admin-navy)" }}
          >
            <Icon name={icon} className="text-[16px]" />
          </span>
          <h2 className="text-[14px] font-semibold" style={{ color: "var(--admin-text)" }}>
            {title}
          </h2>
        </div>
        <button
          onClick={onSeeAll}
          className="text-[12px] font-semibold inline-flex items-center gap-1 hover:underline"
          style={{ color: "var(--admin-navy)" }}
        >
          Tümünü gör
          <Icon name="arrow_forward" className="text-[14px]" />
        </button>
      </header>
      {items.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm" style={{ color: "var(--admin-text-2)" }}>
            {emptyLabel}
          </p>
        </div>
      ) : (
        <ul>
          {items.map((it) => (
            <li
              key={it.id}
              className="px-5 py-3 flex items-center gap-3 hover:bg-[var(--admin-surface-2)] cursor-pointer transition"
              style={{ borderTop: "1px solid var(--admin-border)" }}
              onClick={onOpen}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>
                  {it.primary}
                </p>
                <p className="text-[13px] truncate" style={{ color: "var(--admin-text-2)" }}>
                  {it.secondary}
                </p>
              </div>
              <StatusBadge status={it.status} />
              <span className="text-[11px] whitespace-nowrap" style={{ color: "var(--admin-text-mute)" }}>
                {new Date(it.date).toLocaleDateString("tr-TR")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const map: Record<string, { label: string; cls: string }> = {
    new: { label: "Yeni", cls: "admin-badge-accent" },
    in_progress: { label: "İşlemde", cls: "admin-badge-info" },
    resolved: { label: "Çözüldü", cls: "admin-badge-success" },
    completed: { label: "Tamamlandı", cls: "admin-badge-success" },
    cancelled: { label: "İptal", cls: "admin-badge-neutral" },
    archived: { label: "Arşiv", cls: "admin-badge-neutral" },
    reviewing: { label: "İnceleniyor", cls: "admin-badge-info" },
    interviewed: { label: "Görüşüldü", cls: "admin-badge-info" },
    hired: { label: "İşe Alındı", cls: "admin-badge-success" },
    rejected: { label: "Reddedildi", cls: "admin-badge-danger" },
  };
  const m = status ? map[status] : null;
  if (!m) return null;
  return <span className={`admin-badge ${m.cls}`}>{m.label}</span>;
}