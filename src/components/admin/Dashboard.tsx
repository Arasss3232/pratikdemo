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
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stats.map((s) => (
          <button
            key={s.key}
            onClick={() => onNavigate(s.key)}
            className="group text-left bg-surface-container-lowest border border-outline-variant rounded-lg p-4 hover:border-primary hover:shadow-sm transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-md bg-primary/10 text-primary grid place-items-center">
                <Icon name={s.icon} className="text-[20px]" />
              </div>
              <Icon name="arrow_forward" className="text-[16px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition" />
            </div>
            <p className="text-headline-md font-headline-md text-on-background">
              {loading ? "—" : s.value ?? 0}
            </p>
            <p className="text-body-sm text-on-surface-variant mt-0.5">{s.label}</p>
            {s.hint && <p className="text-[11px] text-on-surface-variant mt-1">{s.hint}</p>}
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-label-bold text-body-md">Hızlı İşlemler</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {quick.map((q) => (
            <button
              key={q.key + q.label}
              onClick={() => onNavigate(q.key)}
              className="flex items-center gap-2 h-11 px-3 rounded-md border border-outline-variant text-body-sm hover:bg-surface-container hover:border-primary transition text-left"
            >
              <Icon name={q.icon} className="text-[18px] text-primary shrink-0" />
              <span className="truncate">{q.label}</span>
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
    <section className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
      <header className="flex items-center justify-between px-5 py-3 border-b border-outline-variant">
        <h2 className="font-label-bold text-body-md">{title}</h2>
        <button onClick={onSeeAll} className="text-body-sm text-primary hover:underline">
          Tümünü gör
        </button>
      </header>
      {items.length === 0 ? (
        <p className="p-8 text-center text-body-sm text-on-surface-variant">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-outline-variant">
          {items.map((it) => (
            <li key={it.id} className="px-5 py-3 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-body-sm font-label-bold truncate">{it.primary}</p>
                <p className="text-body-sm text-on-surface-variant truncate">{it.secondary}</p>
              </div>
              <StatusBadge status={it.status} />
              <span className="text-[11px] text-on-surface-variant whitespace-nowrap">
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
    new: { label: "Yeni", cls: "bg-primary/10 text-primary" },
    in_progress: { label: "İşlemde", cls: "bg-secondary/15 text-on-secondary-fixed-variant" },
    resolved: { label: "Çözüldü", cls: "bg-green-100 text-green-800" },
    completed: { label: "Tamamlandı", cls: "bg-green-100 text-green-800" },
    cancelled: { label: "İptal", cls: "bg-surface-container-highest text-on-surface-variant" },
    archived: { label: "Arşiv", cls: "bg-surface-container-highest text-on-surface-variant" },
  };
  const m = status ? map[status] : null;
  if (!m) return null;
  return (
    <span className={`hidden sm:inline text-[11px] px-2 py-0.5 rounded-full font-label-bold ${m.cls}`}>
      {m.label}
    </span>
  );
}