import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../../site-shell";
import type { AdminTab } from "../nav";
import type { PrimaryProfile, B2BContext } from "@/hooks/use-b2b-context";
import { PROFILE_LABELS } from "@/hooks/use-b2b-context";
import { money, shortDate, QuoteStatusPill, ApprovalStatusPill } from "./StatusPill";

/* =================================================================
   Rol-farkında dashboard. Kullanıcının birincil profiline göre
   uygun metrik panelini render eder. Tüm sayaçlar CANLI olarak
   Supabase'ten çekilir; sahte veri yok.
   ================================================================= */

type Metric = { label: string; value: string | number; hint?: string; icon: string; tab?: AdminTab; tone?: "neutral" | "warn" | "danger" | "ok" };

function MetricCard({ m, onNavigate }: { m: Metric; onNavigate?: (t: AdminTab) => void }) {
  const toneBg =
    m.tone === "warn" ? "rgba(244,197,66,0.14)"
    : m.tone === "danger" ? "rgba(239,68,68,0.10)"
    : m.tone === "ok" ? "rgba(34,197,94,0.10)"
    : "var(--admin-yellow-soft)";
  const toneFg =
    m.tone === "warn" ? "#78591C"
    : m.tone === "danger" ? "#991B1B"
    : m.tone === "ok" ? "#166534"
    : "var(--admin-navy)";
  return (
    <button
      type="button"
      onClick={() => m.tab && onNavigate?.(m.tab)}
      className="admin-card p-4 sm:p-5 text-left transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{ cursor: m.tab ? "pointer" : "default" }}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-medium truncate" style={{ color: "var(--admin-text-2)" }}>{m.label}</p>
          <p className="mt-1 text-[24px] sm:text-[28px] font-bold tracking-tight" style={{ color: "var(--admin-text)" }}>
            {m.value}
          </p>
          {m.hint && <p className="mt-1 text-[11.5px]" style={{ color: "var(--admin-text-mute)" }}>{m.hint}</p>}
        </div>
        <div className="shrink-0 h-10 w-10 rounded-xl grid place-items-center" style={{ background: toneBg, color: toneFg }}>
          <Icon name={m.icon} className="text-[20px]" />
        </div>
      </div>
    </button>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="admin-card p-4 sm:p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 mb-4">
        <h3 className="text-[15px] font-bold truncate" style={{ color: "var(--admin-text)" }}>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="text-[12.5px] py-6 text-center" style={{ color: "var(--admin-text-mute)" }}>{text}</div>
  );
}

/* ---------------- Management Dashboard ---------------- */

function ManagementDashboard({ onNavigate }: { onNavigate: (t: AdminTab) => void }) {
  const [m, setM] = useState({
    corporateCount: 0,
    dealerCount: 0,
    pendingCompanies: 0,
    newQuotes: 0,
    pendingQuoteApprovals: 0,
    newMessages: 0,
    salesReps: 0,
    products: 0,
  });
  const [topCompanies, setTopCompanies] = useState<Array<{ id: string; legal_name: string; company_type: string; account_code: string | null }>>([]);
  const [topProducts, setTopProducts] = useState<Array<{ id: string; name: string; category: string | null; price: number | null }>>([]);
  const [recentQuotes, setRecentQuotes] = useState<Array<{ id: string; contact_name: string; company: string | null; status: string; created_at: string }>>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [corp, dealer, pc, nq, nm, reps, prod, tc, tp, rq] = await Promise.all([
        supabase.from("companies").select("*", { count: "exact", head: true }).eq("company_type", "corporate"),
        supabase.from("companies").select("*", { count: "exact", head: true }).in("company_type", ["dealer", "distributor"]),
        supabase.from("companies").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
        supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("sales_representatives").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("companies").select("id,legal_name,company_type,account_code").eq("account_status", "active").order("updated_at", { ascending: false }).limit(5),
        supabase.from("products").select("id,name,category,price").order("updated_at", { ascending: false }).limit(5),
        supabase.from("quote_requests").select("id,contact_name,company,status,created_at").order("created_at", { ascending: false }).limit(6),
      ]);
      if (!alive) return;
      setM({
        corporateCount: corp.count ?? 0,
        dealerCount: dealer.count ?? 0,
        pendingCompanies: pc.count ?? 0,
        newQuotes: nq.count ?? 0,
        pendingQuoteApprovals: 0,
        newMessages: nm.count ?? 0,
        salesReps: reps.count ?? 0,
        products: prod.count ?? 0,
      });
      setTopCompanies((tc.data ?? []) as typeof topCompanies);
      setTopProducts((tp.data ?? []) as typeof topProducts);
      setRecentQuotes((rq.data ?? []) as typeof recentQuotes);
    })();
    return () => { alive = false; };
  }, []);

  const metrics: Metric[] = [
    { label: "Kurumsal Müşteri", value: m.corporateCount, icon: "domain", tab: "companies" },
    { label: "Aktif Bayi / Distribütör", value: m.dealerCount, icon: "storefront", tab: "companies" },
    { label: "Onay Bekleyen Firma", value: m.pendingCompanies, icon: "approval", tab: "approvals", tone: m.pendingCompanies > 0 ? "warn" : "neutral" },
    { label: "Yeni Teklif Talebi", value: m.newQuotes, icon: "request_quote", tab: "quotations", tone: m.newQuotes > 0 ? "warn" : "neutral" },
    { label: "Yeni Mesaj", value: m.newMessages, icon: "mail", tab: "messages" },
    { label: "Aktif Satış Temsilcisi", value: m.salesReps, icon: "badge", tab: "salesReps" },
    { label: "Ürün Kataloğu", value: m.products, icon: "inventory_2", tab: "products" },
    { label: "Onay Bekleyen Teklif", value: m.pendingQuoteApprovals, icon: "gavel", tab: "approvals", hint: "Faz 3'te aktifleşecek" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((mm) => <MetricCard key={mm.label} m={mm} onNavigate={onNavigate} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Section title="Son Teklif Talepleri" action={
          <button onClick={() => onNavigate("quotations")} className="admin-btn admin-btn-ghost admin-btn-xs">Tümünü Gör</button>
        }>
          {recentQuotes.length === 0 ? <EmptyRow text="Henüz talep yok." /> : (
            <ul className="flex flex-col divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {recentQuotes.map((q) => (
                <li key={q.id} className="py-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>
                      {q.company || q.contact_name}
                    </p>
                    <p className="text-[11.5px] truncate" style={{ color: "var(--admin-text-mute)" }}>
                      {q.contact_name} • {shortDate(q.created_at)}
                    </p>
                  </div>
                  <QuoteStatusPill value={q.status} />
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Son Aktif Firmalar" action={
          <button onClick={() => onNavigate("companies")} className="admin-btn admin-btn-ghost admin-btn-xs">Firma Listesi</button>
        }>
          {topCompanies.length === 0 ? <EmptyRow text="Henüz firma kaydı yok." /> : (
            <ul className="flex flex-col divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {topCompanies.map((c) => (
                <li key={c.id} className="py-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>
                      {c.legal_name}
                    </p>
                    <p className="text-[11.5px] truncate" style={{ color: "var(--admin-text-mute)" }}>
                      {c.account_code || "—"} • {c.company_type}
                    </p>
                  </div>
                  <button onClick={() => onNavigate("companies")} className="admin-btn admin-btn-ghost admin-btn-xs">Aç</button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Katalogdan Son Ürünler" action={
          <button onClick={() => onNavigate("products")} className="admin-btn admin-btn-ghost admin-btn-xs">Ürünler</button>
        }>
          {topProducts.length === 0 ? <EmptyRow text="Katalogda ürün yok." /> : (
            <ul className="flex flex-col divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {topProducts.map((p) => (
                <li key={p.id} className="py-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>{p.name}</p>
                    <p className="text-[11.5px] truncate" style={{ color: "var(--admin-text-mute)" }}>{p.category || "—"}</p>
                  </div>
                  <span className="text-[12.5px] font-semibold" style={{ color: "var(--admin-navy)" }}>{money(p.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="İş Listem" action={
          <button onClick={() => onNavigate("approvals")} className="admin-btn admin-btn-ghost admin-btn-xs">Onay Merkezi</button>
        }>
          <ul className="flex flex-col gap-2">
            {m.pendingCompanies > 0 && (
              <TaskRow icon="approval" label={`${m.pendingCompanies} firma onay bekliyor`} action="Onayla" tone="warn" onClick={() => onNavigate("approvals")} />
            )}
            {m.newQuotes > 0 && (
              <TaskRow icon="request_quote" label={`${m.newQuotes} yeni teklif talebi`} action="Ata" tone="warn" onClick={() => onNavigate("quotations")} />
            )}
            {m.newMessages > 0 && (
              <TaskRow icon="mail" label={`${m.newMessages} okunmamış mesaj`} action="Aç" onClick={() => onNavigate("messages")} />
            )}
            {m.pendingCompanies === 0 && m.newQuotes === 0 && m.newMessages === 0 && (
              <EmptyRow text="Şu an bekleyen göreviniz yok." />
            )}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function TaskRow({ icon, label, action, tone, onClick }: { icon: string; label: string; action: string; tone?: "warn"; onClick: () => void }) {
  const bg = tone === "warn" ? "rgba(244,197,66,0.10)" : "var(--admin-surface-2)";
  return (
    <li>
      <button onClick={onClick} className="w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 rounded-xl text-left hover:opacity-90 transition-opacity" style={{ background: bg }}>
        <span className="h-8 w-8 shrink-0 grid place-items-center rounded-lg" style={{ background: "rgba(8,24,44,0.08)", color: "var(--admin-navy)" }}>
          <Icon name={icon} className="text-[18px]" />
        </span>
        <span className="text-[13px] font-medium truncate" style={{ color: "var(--admin-text)" }}>{label}</span>
        <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: "var(--admin-navy)" }}>{action}</span>
      </button>
    </li>
  );
}

/* ---------------- Sales Dashboard ---------------- */

function SalesDashboard({ ctx, onNavigate }: { ctx: B2BContext; onNavigate: (t: AdminTab) => void }) {
  const [m, setM] = useState({ myCustomers: 0, openQuotes: 0, newOrders: 0, riskyCustomers: 0 });
  const [recentCustomers, setRecentCustomers] = useState<Array<{ id: string; legal_name: string; updated_at: string }>>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!ctx.userId) return;
      // Bu satış temsilcisine atanmış firmalar
      const { data: repData } = await supabase.from("sales_representatives").select("id").eq("user_id", ctx.userId).maybeSingle();
      const repId = repData?.id ?? null;
      const myQuery = repId ? supabase.from("companies").select("*", { count: "exact", head: true }).eq("sales_representative_id", repId) : Promise.resolve({ count: 0 } as { count: number });
      const [mc, oq, no, rc, list] = await Promise.all([
        myQuery,
        supabase.from("quote_requests").select("*", { count: "exact", head: true }).in("status", ["new", "reviewing"]),
        supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "quoted"),
        supabase.from("companies").select("*", { count: "exact", head: true }).in("risk_status", ["high", "blocked"]),
        repId
          ? supabase.from("companies").select("id,legal_name,updated_at").eq("sales_representative_id", repId).order("updated_at", { ascending: false }).limit(8)
          : supabase.from("companies").select("id,legal_name,updated_at").order("updated_at", { ascending: false }).limit(8),
      ]);
      if (!alive) return;
      setM({
        myCustomers: (mc as { count?: number }).count ?? 0,
        openQuotes: oq.count ?? 0,
        newOrders: no.count ?? 0,
        riskyCustomers: rc.count ?? 0,
      });
      setRecentCustomers((list.data ?? []) as typeof recentCustomers);
    })();
    return () => { alive = false; };
  }, [ctx.userId]);

  const metrics: Metric[] = [
    { label: "Müşterilerim", value: m.myCustomers, icon: "diversity_3", tab: "companies" },
    { label: "Açık Teklifler", value: m.openQuotes, icon: "request_quote", tab: "quotations", tone: m.openQuotes > 0 ? "warn" : "neutral" },
    { label: "Kazanılan Teklifler", value: m.newOrders, icon: "shopping_bag", tab: "orders", tone: "ok" },
    { label: "Riskli Müşteriler", value: m.riskyCustomers, icon: "warning", tab: "companies", tone: m.riskyCustomers > 0 ? "danger" : "neutral" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((mm) => <MetricCard key={mm.label} m={mm} onNavigate={onNavigate} />)}
      </div>
      <Section title="Son Müşteri Hareketleri" action={<button onClick={() => onNavigate("companies")} className="admin-btn admin-btn-ghost admin-btn-xs">Portföyüm</button>}>
        {recentCustomers.length === 0 ? <EmptyRow text="Portföyünüzde henüz firma yok." /> : (
          <ul className="flex flex-col divide-y" style={{ borderColor: "var(--admin-border)" }}>
            {recentCustomers.map((c) => (
              <li key={c.id} className="py-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <p className="text-[13.5px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>{c.legal_name}</p>
                <p className="text-[11.5px]" style={{ color: "var(--admin-text-mute)" }}>{shortDate(c.updated_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

/* ---------------- Finance Dashboard ---------------- */

function FinanceDashboard({ onNavigate }: { onNavigate: (t: AdminTab) => void }) {
  const [m, setM] = useState({ totalLimit: 0, usedLimit: 0, availableLimit: 0, overLimit: 0, blocked: 0, risky: 0, pendingApprovals: 0 });
  const [overLimitList, setOverLimitList] = useState<Array<{ id: string; legal_name: string; credit_limit: number; available_limit: number }>>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [all, blocked, risky, pending] = await Promise.all([
        supabase.from("companies").select("id,legal_name,credit_limit,available_limit"),
        supabase.from("companies").select("*", { count: "exact", head: true }).eq("account_status", "suspended"),
        supabase.from("companies").select("*", { count: "exact", head: true }).in("risk_status", ["high", "blocked"]),
        supabase.from("companies").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
      ]);
      if (!alive) return;
      const rows = (all.data ?? []) as Array<{ id: string; legal_name: string; credit_limit: number; available_limit: number }>;
      let totalLimit = 0, usedLimit = 0, availableLimit = 0, overLimit = 0;
      const over: typeof overLimitList = [];
      rows.forEach((r) => {
        totalLimit += Number(r.credit_limit ?? 0);
        availableLimit += Number(r.available_limit ?? 0);
        const used = Number(r.credit_limit ?? 0) - Number(r.available_limit ?? 0);
        usedLimit += used;
        if (Number(r.available_limit ?? 0) < 0) {
          overLimit++;
          over.push(r);
        }
      });
      setM({ totalLimit, usedLimit, availableLimit, overLimit, blocked: blocked.count ?? 0, risky: risky.count ?? 0, pendingApprovals: pending.count ?? 0 });
      setOverLimitList(over.slice(0, 8));
    })();
    return () => { alive = false; };
  }, []);

  const metrics: Metric[] = [
    { label: "Toplam Kredi Limiti", value: money(m.totalLimit), icon: "credit_score" },
    { label: "Kullanılan Limit", value: money(m.usedLimit), icon: "trending_up" },
    { label: "Kullanılabilir Limit", value: money(m.availableLimit), icon: "account_balance", tone: "ok" },
    { label: "Limit Aşımı", value: m.overLimit, icon: "warning", tone: m.overLimit > 0 ? "danger" : "neutral", tab: "creditLimits" },
    { label: "Askıdaki Firmalar", value: m.blocked, icon: "block", tone: m.blocked > 0 ? "danger" : "neutral", tab: "companies" },
    { label: "Yüksek Riskli", value: m.risky, icon: "warning_amber", tone: m.risky > 0 ? "warn" : "neutral", tab: "risk" },
    { label: "Onay Bekleyen Talep", value: m.pendingApprovals, icon: "approval", tab: "approvals" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((mm) => <MetricCard key={mm.label} m={mm} onNavigate={onNavigate} />)}
      </div>
      <Section title="Limit Aşımında Olan Firmalar" action={<button onClick={() => onNavigate("companies")} className="admin-btn admin-btn-ghost admin-btn-xs">Tümünü Gör</button>}>
        {overLimitList.length === 0 ? <EmptyRow text="Limit aşımında firma yok." /> : (
          <ul className="flex flex-col divide-y" style={{ borderColor: "var(--admin-border)" }}>
            {overLimitList.map((c) => (
              <li key={c.id} className="py-3 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
                <p className="text-[13.5px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>{c.legal_name}</p>
                <p className="text-[12px] tabular-nums" style={{ color: "var(--admin-text-mute)" }}>{money(c.credit_limit)}</p>
                <p className="text-[12px] font-semibold tabular-nums" style={{ color: "#991B1B" }}>{money(c.available_limit)}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

/* ---------------- Warehouse Dashboard ---------------- */

function WarehouseDashboard({ onNavigate }: { onNavigate: (t: AdminTab) => void }) {
  const [m, setM] = useState({ products: 0, newQuotes: 0, dealers: 0 });
  useEffect(() => {
    let alive = true;
    (async () => {
      const [p, q, d] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "quoted"),
        supabase.from("companies").select("*", { count: "exact", head: true }).in("company_type", ["dealer", "distributor"]),
      ]);
      if (!alive) return;
      setM({ products: p.count ?? 0, newQuotes: q.count ?? 0, dealers: d.count ?? 0 });
    })();
    return () => { alive = false; };
  }, []);

  const metrics: Metric[] = [
    { label: "Sevke Hazır Siparişler", value: m.newQuotes, icon: "local_shipping", tab: "orders", hint: "Faz 3'te tam sipariş modülü aktifleşecek" },
    { label: "Ürün Kataloğu", value: m.products, icon: "inventory_2", tab: "products" },
    { label: "Aktif Bayi Sayısı", value: m.dealers, icon: "storefront", tab: "companies" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((mm) => <MetricCard key={mm.label} m={mm} onNavigate={onNavigate} />)}
      </div>
      <div className="admin-card p-6 text-center">
        <p className="text-[13px]" style={{ color: "var(--admin-text-2)" }}>
          Depo modülleri (hazırlık listeleri, sevkiyat, transfer) Faz 4'te aktifleşecek.
          Şu anda mevcut sipariş talepleri Teklifler üzerinden takip edilir.
        </p>
      </div>
    </div>
  );
}

/* ---------------- Router ---------------- */

export function RoleDashboard({ ctx, onNavigate }: { ctx: B2BContext; onNavigate: (t: AdminTab) => void }) {
  const [greeting, setGreeting] = useState("Hoş geldiniz");
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 6 ? "İyi geceler" : h < 12 ? "Günaydın" : h < 18 ? "İyi günler" : "İyi akşamlar");
  }, []);

  const profile: PrimaryProfile = ctx.primary;

  return (
    <div className="flex flex-col gap-5">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--admin-navy)" }}>
            {PROFILE_LABELS[profile]} Paneli
          </p>
          <h1 className="mt-1 text-[22px] sm:text-[26px] font-bold tracking-tight truncate" style={{ color: "var(--admin-text)" }}>
            {greeting}{ctx.email ? `, ${ctx.email.split("@")[0]}` : ""}
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: "var(--admin-text-2)" }}>
            {new Date().toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button onClick={() => onNavigate("companies")} className="admin-btn admin-btn-secondary admin-btn-sm">
            <Icon name="domain" className="text-[18px]" /> <span>Firmalar</span>
          </button>
          <button onClick={() => onNavigate("quotations")} className="admin-btn admin-btn-primary admin-btn-sm">
            <Icon name="request_quote" className="text-[18px]" /> <span>Teklifler</span>
          </button>
        </div>
      </header>

      {profile === "management" && <ManagementDashboard onNavigate={onNavigate} />}
      {profile === "sales" && <SalesDashboard ctx={ctx} onNavigate={onNavigate} />}
      {profile === "finance" && <FinanceDashboard onNavigate={onNavigate} />}
      {profile === "warehouse" && <WarehouseDashboard onNavigate={onNavigate} />}
      {(profile === "content" || profile === "viewer") && (
        <ManagementDashboard onNavigate={onNavigate} />
      )}

      {/* Küçük onay özeti (Approval'a giriş) */}
      {ctx.badges.totalPending > 0 && (
        <button
          onClick={() => onNavigate("approvals")}
          className="admin-card p-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 text-left hover:shadow-lg transition-shadow"
          style={{ borderLeft: "3px solid var(--admin-yellow)" }}
        >
          <div className="h-10 w-10 rounded-xl grid place-items-center shrink-0" style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}>
            <Icon name="approval" className="text-[20px]" />
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>
              {ctx.badges.totalPending} işlem onayınızı bekliyor
            </p>
            <p className="text-[11.5px] truncate" style={{ color: "var(--admin-text-mute)" }}>
              {ctx.badges.pendingCompanies} firma · {ctx.badges.pendingQuotes} teklif talebi
            </p>
          </div>
          <ApprovalStatusPill value="pending" />
        </button>
      )}
    </div>
  );
}