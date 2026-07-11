import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Icon } from "../../site-shell";
import { CompanyTypePill, money, shortDate } from "./StatusPill";

type Company = Database["public"]["Tables"]["companies"]["Row"];

export function ApprovalCenter() {
  const [pending, setPending] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("companies").select("*").eq("approval_status", "pending").order("created_at", { ascending: false });
    setPending((data ?? []) as Company[]);
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);

  async function approve(c: Company) {
    setBusy(c.id);
    await supabase.from("companies").update({ approval_status: "approved", account_status: "active", approved_at: new Date().toISOString() }).eq("id", c.id);
    setBusy(null);
    await load();
  }
  async function reject(c: Company) {
    const reason = prompt(`${c.legal_name} — Red gerekçesi:`);
    if (reason === null) return;
    setBusy(c.id);
    await supabase.from("companies").update({ approval_status: "rejected", account_status: "closed", internal_notes: `Red: ${reason}\n\n${c.internal_notes ?? ""}` }).eq("id", c.id);
    setBusy(null);
    await load();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="admin-card p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Metric label="Yeni Firma Onayı" value={pending.length} icon="pending_actions" />
        <Metric label="Kredi Limiti Talebi" value={0} icon="request_quote" tone="muted" hint="Faz 2" />
        <Metric label="Özel İndirim Talebi" value={0} icon="percent" tone="muted" hint="Faz 3" />
      </div>

      <div className="admin-card">
        <header className="p-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2" style={{ borderBottom: "1px solid var(--admin-border)" }}>
          <div>
            <h3 className="text-[14px] font-bold" style={{ color: "var(--admin-text)" }}>Bekleyen Firma Başvuruları</h3>
            <p className="text-[12px]" style={{ color: "var(--admin-text-mute)" }}>Yeni bayi ve müşteri kayıtları burada onay bekler.</p>
          </div>
          <button onClick={() => void load()} className="admin-btn admin-btn-ghost admin-btn-xs"><Icon name="refresh" className="text-[16px]" /> Yenile</button>
        </header>

        {loading ? (
          <p className="p-8 text-center text-[13px]" style={{ color: "var(--admin-text-mute)" }}>Yükleniyor…</p>
        ) : pending.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto grid place-items-center h-12 w-12 rounded-full mb-3" style={{ background: "var(--admin-yellow-soft)" }}>
              <Icon name="check_circle" className="text-[22px]" style={{ color: "var(--admin-navy)" }} />
            </div>
            <p className="text-[13.5px] font-semibold" style={{ color: "var(--admin-text)" }}>Bekleyen onay yok.</p>
            <p className="text-[12px] mt-1" style={{ color: "var(--admin-text-mute)" }}>Yeni firma başvurusu geldiğinde burada listelenir.</p>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
            {pending.map((c) => (
              <li key={c.id} className="p-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3 items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <p className="text-[14px] font-bold truncate" style={{ color: "var(--admin-text)" }}>{c.legal_name}</p>
                    <CompanyTypePill value={c.company_type} />
                  </div>
                  <p className="text-[12.5px] truncate" style={{ color: "var(--admin-text-2)" }}>
                    {[c.primary_contact_name, c.primary_contact_email, c.primary_contact_phone].filter(Boolean).join(" · ") || "İletişim bilgisi yok"}
                  </p>
                  <p className="text-[11.5px] mt-1" style={{ color: "var(--admin-text-mute)" }}>
                    {c.tax_number ? `VKN: ${c.tax_number}` : "VKN yok"} · Başvuru: {shortDate(c.created_at)} · Talep edilen limit: {money(c.credit_limit, c.currency)}
                  </p>
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => void reject(c)} disabled={busy === c.id} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: "#991B1B" }}>
                    <Icon name="close" className="text-[16px]" /> <span>Reddet</span>
                  </button>
                  <button onClick={() => void approve(c)} disabled={busy === c.id} className="admin-btn admin-btn-primary admin-btn-sm">
                    <Icon name="check_circle" className="text-[16px]" /> <span>Onayla</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, icon, tone, hint }: { label: string; value: number; icon: string; tone?: "muted"; hint?: string }) {
  const muted = tone === "muted";
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
      <div className="grid place-items-center h-11 w-11 rounded-xl" style={{ background: muted ? "var(--admin-surface-2)" : "var(--admin-yellow-soft)" }}>
        <Icon name={icon} className="text-[22px]" style={{ color: "var(--admin-navy)" }} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--admin-text-mute)" }}>{label}</p>
        <p className="text-[20px] font-black tabular-nums leading-tight" style={{ color: muted ? "var(--admin-text-mute)" : "var(--admin-text)" }}>{value}</p>
        {hint && <p className="text-[10.5px]" style={{ color: "var(--admin-text-mute)" }}>{hint}</p>}
      </div>
    </div>
  );
}