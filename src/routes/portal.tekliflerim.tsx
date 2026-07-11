import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePortalContext } from "@/hooks/use-portal-context";
import { Icon } from "@/components/site-shell";
import { PageTitle, EmptyState, QuoteStatusPill, QUOTE_STATUS_TR, shortDateTr, parseQuoteItems } from "@/components/portal/portal-ui";

export const Route = createFileRoute("/portal/tekliflerim")({
  component: MyQuotes,
});

type Quote = {
  id: string; status: string; created_at: string; updated_at: string;
  contact_name: string; email: string; phone: string | null; message: string | null;
  items: unknown; source: string; submitted_by: string | null;
};

function MyQuotes() {
  const ctx = usePortalContext();
  const companyId = ctx.activeCompany?.id ?? null;
  const [rows, setRows] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Quote | null>(null);

  useEffect(() => {
    if (!companyId) return;
    let cancel = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("quote_requests")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      if (cancel) return;
      setRows((data ?? []) as Quote[]);
      setLoading(false);
    })();
    return () => { cancel = true; };
  }, [companyId]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!term) return true;
      return (
        r.id.toLowerCase().includes(term) ||
        (r.contact_name ?? "").toLowerCase().includes(term) ||
        (r.message ?? "").toLowerCase().includes(term)
      );
    });
  }, [rows, statusFilter, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const statusOptions = ["all", ...Object.keys(QUOTE_STATUS_TR)];

  return (
    <>
      <PageTitle
        icon="description"
        title="Tekliflerim"
        subtitle={ctx.activeCompany?.trade_name || ctx.activeCompany?.legal_name || ""}
        right={
          <Link to="/portal/teklif-al" className="portal-btn portal-btn-yellow">
            <Icon name="add" className="text-[18px]" /> Yeni Teklif Talebi
          </Link>
        }
      />

      <div className="portal-card p-3 mb-4 flex flex-wrap items-center gap-2">
        <div className="relative grow min-w-[220px]">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: "var(--portal-text-mute)" }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Talep no, kişi veya not ara..." className="portal-input pl-9" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((s) => {
            const active = statusFilter === s;
            const label = s === "all" ? "Tümü" : QUOTE_STATUS_TR[s]?.label ?? s;
            const n = counts[s] ?? 0;
            return (
              <button key={s} onClick={() => setStatusFilter(s)} className="portal-btn portal-btn-xs" style={{
                background: active ? "var(--portal-navy)" : "var(--portal-surface)",
                color: active ? "#fff" : "var(--portal-text-2)",
                borderColor: active ? "var(--portal-navy)" : "var(--portal-border)",
              }}>
                {label} <span className="tabular-nums opacity-70">({n})</span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="portal-card p-10 text-center text-[13px]" style={{ color: "var(--portal-text-mute)" }}>Yükleniyor…</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="inbox"
          title={rows.length === 0 ? "Henüz teklif talebiniz yok" : "Bu filtreyle eşleşen talep yok"}
          description={rows.length === 0 ? "İlk teklif talebinizi oluşturarak süreci başlatın." : "Farklı bir filtre deneyin veya aramayı temizleyin."}
          action={rows.length === 0 && (
            <Link to="/portal/teklif-al" className="portal-btn portal-btn-primary">Teklif Talebi Oluştur</Link>
          )}
        />
      ) : (
        <div className="portal-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left" style={{ background: "var(--portal-surface-2)", color: "var(--portal-text-2)" }}>
                  <th className="px-4 py-2.5 font-bold text-[11px] uppercase tracking-wider">Talep No</th>
                  <th className="px-4 py-2.5 font-bold text-[11px] uppercase tracking-wider">Tarih</th>
                  <th className="px-4 py-2.5 font-bold text-[11px] uppercase tracking-wider">İletişim</th>
                  <th className="px-4 py-2.5 font-bold text-[11px] uppercase tracking-wider">Kalem</th>
                  <th className="px-4 py-2.5 font-bold text-[11px] uppercase tracking-wider">Durum</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const items = parseQuoteItems(r.items);
                  return (
                    <tr key={r.id} className="border-t" style={{ borderColor: "var(--portal-border)" }}>
                      <td className="px-4 py-3 font-mono text-[12px]" style={{ color: "var(--portal-text)" }}>#{r.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-4 py-3" style={{ color: "var(--portal-text-2)" }}>{shortDateTr(r.created_at)}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold" style={{ color: "var(--portal-text)" }}>{r.contact_name}</p>
                        <p className="text-[11.5px]" style={{ color: "var(--portal-text-mute)" }}>{r.email}</p>
                      </td>
                      <td className="px-4 py-3 tabular-nums" style={{ color: "var(--portal-text-2)" }}>{items.length}</td>
                      <td className="px-4 py-3"><QuoteStatusPill status={r.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setSelected(r)} className="portal-btn portal-btn-outline portal-btn-xs">
                          Detay <Icon name="chevron_right" className="text-[14px]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && <QuoteDrawer quote={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function QuoteDrawer({ quote, onClose }: { quote: Quote; onClose: () => void }) {
  const items = parseQuoteItems(quote.items);
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Teklif detayı">
      <button className="absolute inset-0" style={{ background: "rgba(6,20,38,0.55)" }} onClick={onClose} aria-label="Kapat" />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[520px] overflow-y-auto portal-scope" style={{ background: "var(--portal-surface)" }}>
        <header className="sticky top-0 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-5 py-4" style={{ background: "var(--portal-surface)", borderBottom: "1px solid var(--portal-border)" }}>
          <div className="min-w-0">
            <p className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: "var(--portal-text-mute)" }}>Teklif Detayı</p>
            <h2 className="text-[16px] font-black font-mono" style={{ color: "var(--portal-text)" }}>#{quote.id.slice(0, 8).toUpperCase()}</h2>
          </div>
          <button onClick={onClose} className="grid place-items-center h-9 w-9 rounded-lg hover:bg-black/5" aria-label="Kapat">
            <Icon name="close" className="text-[20px]" />
          </button>
        </header>
        <div className="p-5 space-y-5">
          <div className="flex items-center gap-3 flex-wrap">
            <QuoteStatusPill status={quote.status} />
            <span className="text-[12px]" style={{ color: "var(--portal-text-mute)" }}>Oluşturulma: {shortDateTr(quote.created_at)}</span>
            {quote.updated_at !== quote.created_at && (
              <span className="text-[12px]" style={{ color: "var(--portal-text-mute)" }}>Güncelleme: {shortDateTr(quote.updated_at)}</span>
            )}
          </div>

          <section>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--portal-text-mute)" }}>İletişim</p>
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div><p className="text-[11px]" style={{ color: "var(--portal-text-mute)" }}>Adı Soyadı</p><p className="font-semibold" style={{ color: "var(--portal-text)" }}>{quote.contact_name}</p></div>
              <div><p className="text-[11px]" style={{ color: "var(--portal-text-mute)" }}>E-posta</p><p style={{ color: "var(--portal-text)" }}>{quote.email}</p></div>
              {quote.phone && <div><p className="text-[11px]" style={{ color: "var(--portal-text-mute)" }}>Telefon</p><p style={{ color: "var(--portal-text)" }}>{quote.phone}</p></div>}
            </div>
          </section>

          <section>
            <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--portal-text-mute)" }}>Kalemler ({items.length})</p>
            {items.length === 0 ? (
              <p className="text-[13px]" style={{ color: "var(--portal-text-mute)" }}>Talebe kalem eklenmemiş, açıklama üzerinden değerlendirilecek.</p>
            ) : (
              <ul className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--portal-border)" }}>
                {items.map((it, i) => (
                  <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5" style={{ borderTop: i === 0 ? "none" : "1px solid var(--portal-border)" }}>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold truncate" style={{ color: "var(--portal-text)" }}>{it.name}</p>
                      {(it.sku || it.note) && (
                        <p className="text-[11.5px] truncate" style={{ color: "var(--portal-text-mute)" }}>
                          {it.sku && <>SKU: {it.sku}</>}{it.sku && it.note && " · "}{it.note}
                        </p>
                      )}
                    </div>
                    <span className="text-[13px] tabular-nums font-bold" style={{ color: "var(--portal-navy)" }}>×{it.qty}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {quote.message && (
            <section>
              <p className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--portal-text-mute)" }}>Notlar</p>
              <p className="text-[13px] whitespace-pre-wrap" style={{ color: "var(--portal-text-2)" }}>{quote.message}</p>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}