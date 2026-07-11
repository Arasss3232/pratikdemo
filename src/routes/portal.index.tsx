import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePortalContext } from "@/hooks/use-portal-context";
import { Icon } from "@/components/site-shell";
import { PageTitle, StatCard, EmptyState, QuoteStatusPill, shortDateTr } from "@/components/portal/portal-ui";

export const Route = createFileRoute("/portal/")({
  component: PortalDashboard,
});

type QuoteRow = {
  id: string;
  status: string;
  created_at: string;
  contact_name: string;
  items: unknown;
};

function PortalDashboard() {
  const ctx = usePortalContext();
  const companyId = ctx.activeCompany?.id ?? null;
  const [stats, setStats] = useState({ open: 0, quoted: 0, approved: 0, total: 0 });
  const [recent, setRecent] = useState<QuoteRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    let cancel = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("quote_requests")
        .select("id,status,created_at,contact_name,items")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (cancel) return;
      const rows = (data ?? []) as QuoteRow[];
      const open = rows.filter((r) => ["new", "reviewing", "pending", "revision_requested"].includes(r.status)).length;
      const quoted = rows.filter((r) => r.status === "quoted").length;
      const approved = rows.filter((r) => ["approved", "converted"].includes(r.status)).length;
      setStats({ open, quoted, approved, total: rows.length });
      setRecent(rows.slice(0, 6));
      setLoading(false);
    })();
    return () => { cancel = true; };
  }, [companyId]);

  const displayName = ctx.email?.split("@")[0] ?? "";
  const companyName = ctx.activeCompany?.trade_name || ctx.activeCompany?.legal_name || "—";

  return (
    <>
      <PageTitle
        icon="waving_hand"
        title={`Merhaba ${displayName}`}
        subtitle={`${companyName} adına işlem yapıyorsunuz.`}
        right={
          <>
            <Link to="/portal/teklif-al" className="portal-btn portal-btn-yellow">
              <Icon name="request_quote" className="text-[18px]" /> Yeni Teklif Talebi
            </Link>
          </>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Açık Talepler" value={loading ? "…" : stats.open} icon="pending_actions" tone="warn" hint="İnceleme / revizyon aşamasında" />
        <StatCard label="Teklif Verildi" value={loading ? "…" : stats.quoted} icon="local_offer" hint="Onayınızı bekliyor" />
        <StatCard label="Onaylanan" value={loading ? "…" : stats.approved} icon="task_alt" tone="ok" hint="Siparişe hazır" />
        <StatCard label="Toplam Talep" value={loading ? "…" : stats.total} icon="description" hint="Tüm zamanlar" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 portal-card overflow-hidden">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-5 py-3.5" style={{ borderBottom: "1px solid var(--portal-border)" }}>
            <div className="min-w-0">
              <p className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "var(--portal-text-mute)" }}>Son Hareketler</p>
              <h2 className="text-[15px] font-black" style={{ color: "var(--portal-text)" }}>Son Teklif Talepleri</h2>
            </div>
            <Link to="/portal/tekliflerim" className="portal-btn portal-btn-ghost portal-btn-sm">Tümü <Icon name="chevron_right" className="text-[16px]" /></Link>
          </header>

          {loading ? (
            <div className="p-10 text-center text-[13px]" style={{ color: "var(--portal-text-mute)" }}>Yükleniyor…</div>
          ) : recent.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon="request_quote"
                title="Henüz teklif talebi yok"
                description="Ürün listenizle ilk teklif talebinizi hemen oluşturabilirsiniz."
                action={<Link to="/portal/teklif-al" className="portal-btn portal-btn-primary">Teklif Talebi Oluştur</Link>}
              />
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--portal-border)" }}>
              {recent.map((r) => {
                const itemsCount = Array.isArray(r.items) ? (r.items as unknown[]).length : 0;
                return (
                  <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-[13.5px] font-semibold truncate" style={{ color: "var(--portal-text)" }}>
                        Talep #{r.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[11.5px] truncate" style={{ color: "var(--portal-text-mute)" }}>
                        {shortDateTr(r.created_at)} · {r.contact_name} · {itemsCount} kalem
                      </p>
                    </div>
                    <QuoteStatusPill status={r.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside className="portal-card p-5">
          <p className="text-[10.5px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--portal-text-mute)" }}>Hızlı Erişim</p>
          <h2 className="text-[15px] font-black mb-4" style={{ color: "var(--portal-text)" }}>Kısayollar</h2>
          <div className="grid gap-2">
            <QuickLink to="/portal/teklif-al" icon="request_quote" title="Teklif Talep Et" description="Ürün ve miktarlarınızı gönderin." />
            <QuickLink to="/portal/tekliflerim" icon="description" title="Tekliflerim" description="Verilen tekliflerinizi yönetin." />
            <QuickLink to="/portal/hesap" icon="business" title="Firma Bilgileri" description="Adres ve iletişim verileri." />
          </div>
        </aside>
      </div>
    </>
  );
}

function QuickLink({ to, icon, title, description }: { to: "/portal/teklif-al" | "/portal/tekliflerim" | "/portal/hesap"; icon: string; title: string; description: string }) {
  return (
    <Link to={to} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-[var(--portal-surface-2)]" style={{ borderColor: "var(--portal-border)" }}>
      <span className="grid place-items-center h-10 w-10 rounded-lg" style={{ background: "var(--portal-yellow-soft)" }}>
        <Icon name={icon} className="text-[20px]" style={{ color: "var(--portal-navy)" }} />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-bold truncate" style={{ color: "var(--portal-text)" }}>{title}</p>
        <p className="text-[11.5px] truncate" style={{ color: "var(--portal-text-mute)" }}>{description}</p>
      </div>
      <Icon name="chevron_right" className="text-[18px]" style={{ color: "var(--portal-text-mute)" }} />
    </Link>
  );
}