import { useEffect, useState } from "react";
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

export function Dashboard({ onNavigate }: { onNavigate: (t: AdminTab) => void }) {
  const [stats, setStats] = useState<Stat[]>([
    { key: "products", label: "Toplam Ürün", icon: "inventory_2", value: null },
    { key: "services", label: "Toplam Hizmet", icon: "handyman", value: null },
    { key: "quotes", label: "Bekleyen Teklif", icon: "request_quote", value: null, hint: "Yeni durumdaki" },
    { key: "messages", label: "Yeni Mesaj", icon: "mail", value: null, hint: "Okunmamış" },
    { key: "blog", label: "Yayında Blog", icon: "article", value: null },
    { key: "jobs", label: "Açık İlan", icon: "work", value: null },
  ]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [setup, setSetup] = useState<{ label: string; done: boolean; tab: AdminTab }[]>([]);

  useEffect(() => {
    let alive = true;
    async function load() {
      const [prod, srv, qNew, msgNew, blogP, jobsP, recentMsg, recentQ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("services").select("*", { count: "exact", head: true }),
        supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("job_posts").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("contact_messages").select("id,name,subject,status,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("quote_requests").select("id,contact_name,company,status,created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      if (!alive) return;
      setStats([
        { key: "products", label: "Toplam Ürün", icon: "inventory_2", value: prod.count ?? 0 },
        { key: "services", label: "Toplam Hizmet", icon: "handyman", value: srv.count ?? 0 },
        { key: "quotes", label: "Bekleyen Teklif", icon: "request_quote", value: qNew.count ?? 0, hint: "Yeni durumda" },
        { key: "messages", label: "Yeni Mesaj", icon: "mail", value: msgNew.count ?? 0, hint: "Okunmamış" },
        { key: "blog", label: "Yayında Blog", icon: "article", value: blogP.count ?? 0 },
        { key: "jobs", label: "Açık İlan", icon: "work", value: jobsP.count ?? 0 },
      ]);
      setMessages((recentMsg.data as Message[]) ?? []);
      setQuotes((recentQ.data as Quote[]) ?? []);
      setSetup([
        { label: "Site ayarlarını doldur", done: false, tab: "settings" },
        { label: "En az bir hizmet ekle", done: (srv.count ?? 0) > 0, tab: "services" },
        { label: "En az bir ürün ekle", done: (prod.count ?? 0) > 0, tab: "products" },
        { label: "En az bir blog yazısı ekle", done: (blogP.count ?? 0) > 0, tab: "blog" },
        { label: "İlk referansını ekle", done: false, tab: "references" },
      ]);
      setLoading(false);
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  const quick: { key: AdminTab; label: string; icon: string }[] = [
    { key: "products", label: "Ürün Ekle", icon: "inventory_2" },
    { key: "services", label: "Hizmet Ekle", icon: "handyman" },
    { key: "blog", label: "Blog Ekle", icon: "article" },
    { key: "references", label: "Referans Ekle", icon: "workspace_premium" },
    { key: "settings", label: "Site Ayarları", icon: "settings" },
    { key: "messages", label: "Mesajları Gör", icon: "mail" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome + setup */}
      <section
        className="relative overflow-hidden rounded-2xl p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5 md:justify-between shadow-sm"
        style={{
          background:
            "linear-gradient(135deg, var(--admin-navy) 0%, var(--admin-navy-med) 100%)",
          color: "#fff",
        }}
      >
        <div
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-20"
          style={{ background: "var(--admin-yellow)", filter: "blur(20px)" }}
          aria-hidden="true"
        />
        <div className="min-w-0 relative">
          <div
            className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold mb-3"
            style={{ background: "color-mix(in oklab, var(--admin-yellow) 22%, transparent)", color: "var(--admin-yellow)" }}
          >
            <Icon name="dashboard" className="text-[13px]" />
            Kontrol Paneli
          </div>
          <p className="text-2xl md:text-[26px] font-bold tracking-tight">Hoş geldiniz 👋</p>
          <p className="text-sm opacity-80 mt-1 max-w-xl">
            Buradan tüm site içeriğinizi tek noktadan yönetebilirsiniz. Hızlı Ekle butonu ile saniyeler içinde yeni içerik oluşturun.
          </p>
        </div>
        {setup.length > 0 && (() => {
          const done = setup.filter((s) => s.done).length;
          const pct = Math.round((done / setup.length) * 100);
          return (
            <div className="min-w-[240px] relative rounded-xl p-4" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="flex items-baseline justify-between text-sm mb-2">
                <span className="opacity-90">Site kurulumu</span>
                <span className="font-bold" style={{ color: "var(--admin-yellow)" }}>{pct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
                <div className="h-full transition-all rounded-full" style={{ width: `${pct}%`, background: "var(--admin-yellow)" }} />
              </div>
              <p className="text-[11px] mt-2 opacity-70">{done} / {setup.length} adım tamamlandı</p>
            </div>
          );
        })()}
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s) => (
          <button
            key={s.key}
            onClick={() => onNavigate(s.key)}
            className="group text-left rounded-xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="h-10 w-10 rounded-lg grid place-items-center transition"
                style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}
              >
                <Icon name={s.icon} className="text-[20px]" />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition" style={{ color: "var(--admin-navy)" }}>
                <Icon name="arrow_forward" className="text-[16px]" />
              </span>
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--admin-text)" }}>
              {loading ? "—" : s.value ?? 0}
            </p>
            <p className="text-[13px] mt-0.5" style={{ color: "var(--admin-text-2)" }}>{s.label}</p>
            {s.hint && <p className="text-[11px] mt-1" style={{ color: "var(--admin-text-mute)" }}>{s.hint}</p>}
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <section className="rounded-xl p-5" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[15px]" style={{ color: "var(--admin-text)" }}>Hızlı İşlemler</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {quick.map((q) => (
            <button
              key={q.key + q.label}
              onClick={() => onNavigate(q.key)}
              className="flex items-center gap-2 h-11 px-3 rounded-lg text-sm text-left transition hover:-translate-y-0.5"
              style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)" }}
            >
              <span className="shrink-0" style={{ color: "var(--admin-navy)" }}>
                <Icon name={q.icon} className="text-[18px]" />
              </span>
              <span className="truncate" style={{ color: "var(--admin-text)" }}>{q.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentList
          title="Son Gelen Mesajlar"
          emptyLabel="Henüz mesaj yok."
          onSeeAll={() => onNavigate("messages")}
          items={messages.map((m) => ({
            id: m.id,
            primary: m.name ?? "İsimsiz",
            secondary: m.subject ?? "—",
            date: m.created_at,
            status: m.status,
          }))}
        />
        <RecentList
          title="Son Teklif Talepleri"
          emptyLabel="Henüz teklif talebi yok."
          onSeeAll={() => onNavigate("quotes")}
          items={quotes.map((q) => ({
            id: q.id,
            primary: q.contact_name,
            secondary: q.company ?? "—",
            date: q.created_at,
            status: q.status,
          }))}
        />
      </div>
    </div>
  );
}

function RecentList({
  title,
  items,
  emptyLabel,
  onSeeAll,
}: {
  title: string;
  items: { id: string; primary: string; secondary: string; date: string; status: string | null }[];
  emptyLabel: string;
  onSeeAll: () => void;
}) {
  return (
    <section className="rounded-xl overflow-hidden" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
      <header className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid var(--admin-border)" }}>
        <h2 className="font-bold text-[14px]" style={{ color: "var(--admin-text)" }}>{title}</h2>
        <button onClick={onSeeAll} className="text-sm font-semibold hover:underline" style={{ color: "var(--admin-navy)" }}>
          Tümünü gör
        </button>
      </header>
      {items.length === 0 ? (
        <p className="p-8 text-center text-sm" style={{ color: "var(--admin-text-2)" }}>{emptyLabel}</p>
      ) : (
        <ul style={{ borderTop: "0" }}>
          {items.map((it) => (
            <li key={it.id} className="px-5 py-3 flex items-center gap-3" style={{ borderTop: "1px solid var(--admin-border)" }}>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate" style={{ color: "var(--admin-text)" }}>{it.primary}</p>
                <p className="text-sm truncate" style={{ color: "var(--admin-text-2)" }}>{it.secondary}</p>
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
    new: { label: "Yeni", cls: "bg-[var(--admin-yellow-soft)] text-[var(--admin-navy)]" },
    in_progress: { label: "İşlemde", cls: "bg-blue-50 text-blue-700" },
    resolved: { label: "Çözüldü", cls: "bg-green-50 text-green-700" },
    completed: { label: "Tamamlandı", cls: "bg-green-50 text-green-700" },
    cancelled: { label: "İptal", cls: "bg-gray-100 text-gray-600" },
    archived: { label: "Arşiv", cls: "bg-gray-100 text-gray-600" },
  };
  const m = status ? map[status] : null;
  if (!m) return null;
  return (
    <span className={`hidden sm:inline text-[11px] px-2 py-0.5 rounded-full font-semibold ${m.cls}`}>
      {m.label}
    </span>
  );
}