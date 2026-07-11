import type { ReactNode, CSSProperties } from "react";
import { Icon } from "../site-shell";

export function PageTitle({ title, subtitle, icon, right }: { title: string; subtitle?: string; icon?: string; right?: ReactNode }) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 mb-6">
      <div className="min-w-0 flex items-start gap-3">
        {icon && (
          <span className="grid place-items-center h-11 w-11 rounded-xl shrink-0" style={{ background: "var(--portal-yellow-soft)" }}>
            <Icon name={icon} className="text-[22px]" style={{ color: "var(--portal-navy)" }} />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-[20px] sm:text-[22px] font-black tracking-tight truncate" style={{ color: "var(--portal-text)" }}>{title}</h1>
          {subtitle && <p className="mt-0.5 text-[13px]" style={{ color: "var(--portal-text-mute)" }}>{subtitle}</p>}
        </div>
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </header>
  );
}

export function StatCard({ label, value, hint, icon, tone }: { label: string; value: ReactNode; hint?: string; icon: string; tone?: "warn" | "danger" | "ok" }) {
  const bg =
    tone === "warn" ? "var(--portal-warning-soft)"
    : tone === "danger" ? "var(--portal-danger-soft)"
    : tone === "ok" ? "var(--portal-success-soft)"
    : "var(--portal-yellow-soft)";
  const fg =
    tone === "warn" ? "var(--portal-warning)"
    : tone === "danger" ? "var(--portal-danger)"
    : tone === "ok" ? "var(--portal-success)"
    : "var(--portal-navy)";
  return (
    <div className="portal-card p-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <span className="grid place-items-center h-11 w-11 rounded-xl" style={{ background: bg }}>
          <Icon name={icon} className="text-[22px]" style={{ color: fg }} />
        </span>
        <div className="min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-wider truncate" style={{ color: "var(--portal-text-mute)" }}>{label}</p>
          <p className="text-[20px] font-black tabular-nums leading-tight truncate" style={{ color: "var(--portal-text)" }}>{value}</p>
          {hint && <p className="text-[11px] truncate" style={{ color: "var(--portal-text-mute)" }}>{hint}</p>}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ icon = "inbox", title, description, action }: { icon?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="portal-card p-10 text-center">
      <div className="mx-auto grid place-items-center h-14 w-14 rounded-full mb-4" style={{ background: "var(--portal-surface-2)" }}>
        <Icon name={icon} className="text-[26px]" style={{ color: "var(--portal-text-mute)" }} />
      </div>
      <p className="text-[15px] font-bold mb-1" style={{ color: "var(--portal-text)" }}>{title}</p>
      {description && <p className="text-[13px] max-w-md mx-auto" style={{ color: "var(--portal-text-mute)" }}>{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export const QUOTE_STATUS_TR: Record<string, { label: string; style: CSSProperties }> = {
  new:                { label: "Yeni",            style: { background: "var(--portal-info-soft)",    color: "var(--portal-info)" } },
  reviewing:          { label: "İnceleniyor",     style: { background: "var(--portal-info-soft)",    color: "var(--portal-info)" } },
  pending:            { label: "Beklemede",       style: { background: "var(--portal-warning-soft)", color: "var(--portal-warning)" } },
  quoted:             { label: "Teklif Verildi",  style: { background: "var(--portal-yellow-soft)",  color: "var(--portal-navy)" } },
  approved:           { label: "Onaylandı",       style: { background: "var(--portal-success-soft)", color: "var(--portal-success)" } },
  rejected:           { label: "Reddedildi",      style: { background: "var(--portal-danger-soft)",  color: "var(--portal-danger)" } },
  revision_requested: { label: "Revizyon İsteniyor", style: { background: "var(--portal-warning-soft)", color: "var(--portal-warning)" } },
  cancelled:          { label: "İptal",            style: { background: "var(--portal-surface-2)",    color: "var(--portal-text-mute)" } },
  converted:          { label: "Siparişe Dönüştü", style: { background: "var(--portal-success-soft)", color: "var(--portal-success)" } },
};
export function QuoteStatusPill({ status }: { status: string }) {
  const s = QUOTE_STATUS_TR[status] ?? { label: status, style: { background: "var(--portal-surface-2)", color: "var(--portal-text-2)" } };
  return <span className="portal-pill" style={s.style}>{s.label}</span>;
}

export function shortDateTr(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return "—"; }
}

export function money(v: number | string | null | undefined, currency = "TRY") {
  const n = typeof v === "string" ? Number(v) : v ?? 0;
  if (!Number.isFinite(n)) return "—";
  try {
    return new Intl.NumberFormat("tr-TR", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch { return `${n} ${currency}`; }
}

export type QuoteItem = { sku?: string; name: string; qty: number; note?: string };

export function parseQuoteItems(items: unknown): QuoteItem[] {
  if (!Array.isArray(items)) return [];
  const out: QuoteItem[] = [];
  for (const it of items as unknown[]) {
    if (!it || typeof it !== "object") continue;
    const r = it as Record<string, unknown>;
    const name = typeof r.name === "string" ? r.name : typeof r.sku === "string" ? r.sku : null;
    if (!name) continue;
    const qty = typeof r.qty === "number" ? r.qty : typeof r.quantity === "number" ? r.quantity : Number(r.qty ?? r.quantity ?? 0) || 0;
    const sku = typeof r.sku === "string" ? r.sku : undefined;
    const note = typeof r.note === "string" ? r.note : undefined;
    out.push({ name, qty, sku, note });
  }
  return out;
}