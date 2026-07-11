import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Icon } from "../../site-shell";
import {
  AccountStatusPill, ApprovalStatusPill, CompanyTypePill, RiskStatusPill,
  money, shortDate,
} from "./StatusPill";

type Company = Database["public"]["Tables"]["companies"]["Row"];
type CompanyUser = Database["public"]["Tables"]["company_users"]["Row"];
type CompanyAddress = Database["public"]["Tables"]["company_addresses"]["Row"];
type Rep = Database["public"]["Tables"]["sales_representatives"]["Row"];
type Group = Database["public"]["Tables"]["customer_groups"]["Row"];
type Level = Database["public"]["Tables"]["dealer_levels"]["Row"];
type CType = Database["public"]["Enums"]["company_type"];
type AStatus = Database["public"]["Enums"]["company_account_status"];
type ApprStatus = Database["public"]["Enums"]["company_approval_status"];

const COMPANY_TYPES: CType[] = ["corporate", "dealer", "distributor", "branch", "end_customer"];
const ACC_STATUSES: AStatus[] = ["active", "pending", "suspended", "closed"];
const APPR_STATUSES: ApprStatus[] = ["pending", "approved", "rejected"];

export function CompaniesWorkspace() {
  const [rows, setRows] = useState<Company[]>([]);
  const [reps, setReps] = useState<Rep[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [fType, setFType] = useState<CType | "">("");
  const [fAcc, setFAcc] = useState<AStatus | "">("");
  const [fAppr, setFAppr] = useState<ApprStatus | "">("");
  const [selected, setSelected] = useState<Company | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  async function refresh() {
    setLoading(true);
    const [c, r, g, l] = await Promise.all([
      supabase.from("companies").select("*").order("updated_at", { ascending: false }),
      supabase.from("sales_representatives").select("*").eq("is_active", true).order("full_name"),
      supabase.from("customer_groups").select("*").eq("is_active", true).order("display_order"),
      supabase.from("dealer_levels").select("*").eq("is_active", true).order("tier"),
    ]);
    setRows((c.data ?? []) as Company[]);
    setReps((r.data ?? []) as Rep[]);
    setGroups((g.data ?? []) as Group[]);
    setLevels((l.data ?? []) as Level[]);
    setLoading(false);
  }
  useEffect(() => { void refresh(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (fType && r.company_type !== fType) return false;
      if (fAcc && r.account_status !== fAcc) return false;
      if (fAppr && r.approval_status !== fAppr) return false;
      if (q) {
        const hay = [r.legal_name, r.trade_name, r.account_code, r.tax_number, r.primary_contact_name, r.primary_contact_email]
          .filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, search, fType, fAcc, fAppr]);

  const activeFilters: Array<{ label: string; onClear: () => void }> = [];
  if (search) activeFilters.push({ label: `Arama: "${search}"`, onClear: () => setSearch("") });
  if (fType) activeFilters.push({ label: `Tip: ${fType}`, onClear: () => setFType("") });
  if (fAcc) activeFilters.push({ label: `Durum: ${fAcc}`, onClear: () => setFAcc("") });
  if (fAppr) activeFilters.push({ label: `Onay: ${fAppr}`, onClear: () => setFAppr("") });

  const repMap = new Map(reps.map((r) => [r.id, r]));
  const groupMap = new Map(groups.map((g) => [g.id, g]));
  const levelMap = new Map(levels.map((l) => [l.id, l]));

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="admin-card p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-3 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] gap-2">
            <label className="relative">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px]" style={{ color: "var(--admin-text-mute)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                placeholder="Firma, cari kodu, VKN veya kişi ara..."
                className="admin-input pl-9 w-full"
                aria-label="Firma arama"
              />
            </label>
            <select value={fType} onChange={(e) => setFType(e.target.value as CType | "")} className="admin-input" aria-label="Firma tipi filtresi">
              <option value="">Tüm Tipler</option>
              {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={fAcc} onChange={(e) => setFAcc(e.target.value as AStatus | "")} className="admin-input" aria-label="Hesap durumu filtresi">
              <option value="">Tüm Durumlar</option>
              {ACC_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={fAppr} onChange={(e) => setFAppr(e.target.value as ApprStatus | "")} className="admin-input" aria-label="Onay filtresi">
              <option value="">Tüm Onaylar</option>
              {APPR_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <button onClick={() => void refresh()} className="admin-btn admin-btn-ghost admin-btn-sm" title="Yenile">
              <Icon name="refresh" className="text-[18px]" />
            </button>
            <button onClick={() => setShowCreate(true)} className="admin-btn admin-btn-primary admin-btn-sm">
              <Icon name="add" className="text-[18px]" /> <span>Yeni Firma</span>
            </button>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {activeFilters.map((f) => (
              <span key={f.label} className="inline-flex items-center gap-1.5 h-7 px-2 rounded-full text-[11.5px] font-medium" style={{ background: "var(--admin-surface-2)", color: "var(--admin-text)" }}>
                {f.label}
                <button onClick={f.onClear} className="hover:text-red-600" aria-label="Filtreyi kaldır">
                  <Icon name="close" className="text-[14px]" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sonuç sayısı */}
      <div className="flex items-center justify-between text-[12.5px]" style={{ color: "var(--admin-text-mute)" }}>
        <span>{loading ? "Yükleniyor…" : `${filtered.length} firma`}</span>
      </div>

      {/* Desktop tablo */}
      <div className="admin-card overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: "var(--admin-surface-2)" }}>
                <Th>Firma</Th>
                <Th>Tip</Th>
                <Th>Cari</Th>
                <Th>Bayi Seviyesi</Th>
                <Th>Temsilci</Th>
                <Th className="text-right">Kredi Limiti</Th>
                <Th className="text-right">Kullanılabilir</Th>
                <Th>Risk</Th>
                <Th>Hesap</Th>
                <Th>Onay</Th>
                <Th>Güncelleme</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const rep = c.sales_representative_id ? repMap.get(c.sales_representative_id) : null;
                const level = c.dealer_level_id ? levelMap.get(c.dealer_level_id) : null;
                return (
                  <tr key={c.id} className="border-t transition-colors hover:bg-[var(--admin-surface-2)]" style={{ borderColor: "var(--admin-border)" }}>
                    <Td>
                      <button onClick={() => setSelected(c)} className="text-left">
                        <p className="font-semibold truncate max-w-[220px]" style={{ color: "var(--admin-text)" }}>{c.legal_name}</p>
                        {c.trade_name && <p className="text-[11.5px] truncate max-w-[220px]" style={{ color: "var(--admin-text-mute)" }}>{c.trade_name}</p>}
                      </button>
                    </Td>
                    <Td><CompanyTypePill value={c.company_type} /></Td>
                    <Td>{c.account_code ?? "—"}</Td>
                    <Td>{level?.name ?? "—"}</Td>
                    <Td>{rep?.full_name ?? "—"}</Td>
                    <Td className="text-right tabular-nums">{money(c.credit_limit, c.currency)}</Td>
                    <Td className="text-right tabular-nums" style={{ color: Number(c.available_limit) < 0 ? "#991B1B" : undefined, fontWeight: Number(c.available_limit) < 0 ? 700 : undefined }}>
                      {money(c.available_limit, c.currency)}
                    </Td>
                    <Td><RiskStatusPill value={c.risk_status} /></Td>
                    <Td><AccountStatusPill value={c.account_status} /></Td>
                    <Td><ApprovalStatusPill value={c.approval_status} /></Td>
                    <Td className="whitespace-nowrap">{shortDate(c.updated_at)}</Td>
                    <Td>
                      <button onClick={() => setSelected(c)} className="admin-btn admin-btn-ghost admin-btn-xs">Aç</button>
                    </Td>
                  </tr>
                );
              })}
              {filtered.length === 0 && !loading && (
                <tr><td colSpan={12} className="p-8 text-center text-[13px]" style={{ color: "var(--admin-text-mute)" }}>Kriterlere uyan firma yok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobil kart */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.map((c) => (
          <button key={c.id} onClick={() => setSelected(c)} className="admin-card p-4 text-left">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-bold truncate" style={{ color: "var(--admin-text)" }}>{c.legal_name}</p>
                <p className="text-[11.5px] truncate mt-0.5" style={{ color: "var(--admin-text-mute)" }}>
                  {c.account_code || "—"} · {c.primary_contact_name || "—"}
                </p>
              </div>
              <CompanyTypePill value={c.company_type} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11.5px]">
              <div style={{ color: "var(--admin-text-mute)" }}>Kredi Limiti<br /><span className="tabular-nums font-semibold text-[12.5px]" style={{ color: "var(--admin-text)" }}>{money(c.credit_limit, c.currency)}</span></div>
              <div style={{ color: "var(--admin-text-mute)" }}>Kullanılabilir<br /><span className="tabular-nums font-semibold text-[12.5px]" style={{ color: Number(c.available_limit) < 0 ? "#991B1B" : "var(--admin-text)" }}>{money(c.available_limit, c.currency)}</span></div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <AccountStatusPill value={c.account_status} />
              <ApprovalStatusPill value={c.approval_status} />
              <RiskStatusPill value={c.risk_status} />
            </div>
          </button>
        ))}
        {filtered.length === 0 && !loading && (
          <div className="admin-card p-6 text-center text-[13px]" style={{ color: "var(--admin-text-mute)" }}>Firma yok.</div>
        )}
      </div>

      {selected && (
        <CompanyProfileDrawer
          company={selected}
          reps={reps}
          groups={groups}
          levels={levels}
          onClose={() => setSelected(null)}
          onSaved={() => { void refresh(); setSelected(null); }}
          onDeleted={() => { void refresh(); setSelected(null); }}
        />
      )}

      {showCreate && (
        <CreateCompanyDialog
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); void refresh(); }}
        />
      )}
    </div>
  );
}

function Th({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <th className={`text-left font-semibold py-3 px-3 uppercase tracking-wide text-[10.5px] ${className}`} style={{ color: "var(--admin-text-mute)" }}>
      {children}
    </th>
  );
}
function Td({ children, className = "", style }: { children?: ReactNode; className?: string; style?: React.CSSProperties }) {
  return <td className={`py-3 px-3 ${className}`} style={style}>{children}</td>;
}

/* ---------------- Create dialog (minimum viable) ---------------- */

function CreateCompanyDialog({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [legal, setLegal] = useState("");
  const [type, setType] = useState<CType>("corporate");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tax, setTax] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    if (!legal.trim()) { setErr("Firma ünvanı zorunludur."); return; }
    setSaving(true); setErr(null);
    const { error } = await supabase.from("companies").insert({
      legal_name: legal.trim(),
      company_type: type,
      primary_contact_name: contact || null,
      primary_contact_phone: phone || null,
      primary_contact_email: email || null,
      tax_number: tax || null,
      approval_status: "pending",
      account_status: "pending",
    });
    setSaving(false);
    if (error) { setErr(error.message); return; }
    onCreated();
  }

  return (
    <DrawerShell title="Yeni Firma" onClose={onClose} width="max-w-[520px]">
      <div className="flex flex-col gap-4 p-5">
        {err && <div className="text-[13px] p-3 rounded-lg" style={{ background: "rgba(239,68,68,0.08)", color: "#991B1B" }}>{err}</div>}
        <Field label="Firma Ünvanı *">
          <input value={legal} onChange={(e) => setLegal(e.target.value)} className="admin-input" placeholder="Örn: ABC Endüstriyel A.Ş." />
        </Field>
        <Field label="Firma Tipi">
          <select value={type} onChange={(e) => setType(e.target.value as CType)} className="admin-input">
            {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Yetkili Kişi"><input value={contact} onChange={(e) => setContact(e.target.value)} className="admin-input" /></Field>
          <Field label="Telefon"><input value={phone} onChange={(e) => setPhone(e.target.value)} className="admin-input" /></Field>
          <Field label="E-posta"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="admin-input" /></Field>
          <Field label="Vergi Numarası"><input value={tax} onChange={(e) => setTax(e.target.value)} className="admin-input" /></Field>
        </div>
        <p className="text-[12px]" style={{ color: "var(--admin-text-mute)" }}>
          Firma "Onay Bekliyor" statüsünde oluşturulur. Onay Merkezi üzerinden onaylandıktan sonra aktif hale gelir.
        </p>
      </div>
      <StickyBar>
        <button onClick={onClose} className="admin-btn admin-btn-ghost admin-btn-sm">Vazgeç</button>
        <button onClick={() => void save()} disabled={saving} className="admin-btn admin-btn-primary admin-btn-sm">
          {saving ? "Kaydediliyor…" : "Firma Oluştur"}
        </button>
      </StickyBar>
    </DrawerShell>
  );
}

/* ---------------- Profile drawer ---------------- */

type Tab = "overview" | "users" | "addresses" | "quotes" | "notes";

function CompanyProfileDrawer({
  company: initial, reps, groups, levels, onClose, onSaved, onDeleted,
}: {
  company: Company; reps: Rep[]; groups: Group[]; levels: Level[];
  onClose: () => void; onSaved: () => void; onDeleted: () => void;
}) {
  const [company, setCompany] = useState<Company>(initial);
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [addresses, setAddresses] = useState<CompanyAddress[]>([]);
  const [quotes, setQuotes] = useState<Array<{ id: string; contact_name: string; status: string; created_at: string; message: string | null }>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setCompany(initial); }, [initial.id, initial]);
  useEffect(() => {
    let alive = true;
    (async () => {
      const [u, a, q] = await Promise.all([
        supabase.from("company_users").select("*").eq("company_id", initial.id).order("created_at"),
        supabase.from("company_addresses").select("*").eq("company_id", initial.id).order("created_at"),
        supabase.from("quote_requests").select("id,contact_name,status,created_at,message").ilike("company", `%${initial.legal_name.slice(0, 20)}%`).order("created_at", { ascending: false }).limit(20),
      ]);
      if (!alive) return;
      setUsers((u.data ?? []) as CompanyUser[]);
      setAddresses((a.data ?? []) as CompanyAddress[]);
      setQuotes((q.data ?? []) as typeof quotes);
    })();
    return () => { alive = false; };
  }, [initial.id, initial.legal_name]);

  async function saveOverview() {
    setSaving(true);
    const { error } = await supabase.from("companies").update({
      legal_name: company.legal_name,
      trade_name: company.trade_name,
      account_code: company.account_code,
      company_type: company.company_type,
      sector: company.sector,
      tax_number: company.tax_number,
      tax_office: company.tax_office,
      primary_contact_name: company.primary_contact_name,
      primary_contact_email: company.primary_contact_email,
      primary_contact_phone: company.primary_contact_phone,
      credit_limit: company.credit_limit,
      available_limit: company.available_limit,
      payment_term_days: company.payment_term_days,
      currency: company.currency,
      customer_group_id: company.customer_group_id,
      dealer_level_id: company.dealer_level_id,
      sales_representative_id: company.sales_representative_id,
      internal_notes: company.internal_notes,
      account_status: company.account_status,
      approval_status: company.approval_status,
      risk_status: company.risk_status,
    }).eq("id", company.id);
    setSaving(false);
    if (error) { alert(error.message); return; }
    onSaved();
  }

  async function approve() {
    await supabase.from("companies").update({ approval_status: "approved", account_status: "active", approved_at: new Date().toISOString() }).eq("id", company.id);
    onSaved();
  }
  async function suspend() {
    if (!confirm("Firmayı askıya almak istediğinize emin misiniz?")) return;
    await supabase.from("companies").update({ account_status: "suspended" }).eq("id", company.id);
    onSaved();
  }
  async function removeCompany() {
    if (!confirm(`${company.legal_name} kalıcı olarak silinsin mi?`)) return;
    await supabase.from("companies").delete().eq("id", company.id);
    onDeleted();
  }

  const rep = company.sales_representative_id ? reps.find((r) => r.id === company.sales_representative_id) : null;
  const level = company.dealer_level_id ? levels.find((l) => l.id === company.dealer_level_id) : null;

  return (
    <DrawerShell title={company.legal_name} onClose={onClose} width="max-w-[900px]">
      {/* Header özeti */}
      <div className="p-5" style={{ borderBottom: "1px solid var(--admin-border)" }}>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <CompanyTypePill value={company.company_type} />
          <AccountStatusPill value={company.account_status} />
          <ApprovalStatusPill value={company.approval_status} />
          <RiskStatusPill value={company.risk_status} />
          {level && <span className="text-[11.5px] font-semibold h-6 px-2 rounded-full inline-flex items-center" style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}>{level.name}</span>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
          <Stat label="Kredi Limiti" value={money(company.credit_limit, company.currency)} />
          <Stat label="Kullanılabilir" value={money(company.available_limit, company.currency)} tone={Number(company.available_limit) < 0 ? "danger" : undefined} />
          <Stat label="Vade" value={`${company.payment_term_days} gün`} />
          <Stat label="Temsilci" value={rep?.full_name || "—"} />
        </div>
        {/* Hızlı işlemler */}
        <div className="mt-4 flex flex-wrap gap-2">
          {company.approval_status === "pending" && (
            <button onClick={() => void approve()} className="admin-btn admin-btn-primary admin-btn-sm">
              <Icon name="check_circle" className="text-[18px]" /> <span>Onayla ve Aktifleştir</span>
            </button>
          )}
          <button className="admin-btn admin-btn-secondary admin-btn-sm" title="Faz 3'te aktifleşecek" disabled>
            <Icon name="request_quote" className="text-[18px]" /> <span>Teklif Oluştur</span>
          </button>
          <button className="admin-btn admin-btn-secondary admin-btn-sm" title="Faz 3'te aktifleşecek" disabled>
            <Icon name="shopping_bag" className="text-[18px]" /> <span>Sipariş Oluştur</span>
          </button>
          {company.account_status === "active" && (
            <button onClick={() => void suspend()} className="admin-btn admin-btn-ghost admin-btn-sm">
              <Icon name="pause_circle" className="text-[18px]" /> <span>Askıya Al</span>
            </button>
          )}
          <button onClick={() => void removeCompany()} className="admin-btn admin-btn-ghost admin-btn-sm" style={{ color: "#991B1B" }}>
            <Icon name="delete" className="text-[18px]" /> <span>Sil</span>
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-3 overflow-x-auto" style={{ borderBottom: "1px solid var(--admin-border)" }}>
        {([
          ["overview", "Genel Bakış"],
          ["users", `Yetkililer (${users.length})`],
          ["addresses", `Adresler (${addresses.length})`],
          ["quotes", `Teklifler (${quotes.length})`],
          ["notes", "Notlar"],
        ] as Array<[Tab, string]>).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className="whitespace-nowrap h-11 px-3 text-[13px] font-medium transition-all"
            style={{
              color: tab === k ? "var(--admin-navy)" : "var(--admin-text-2)",
              borderBottom: tab === k ? "2px solid var(--admin-yellow)" : "2px solid transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab içerik */}
      <div className="p-5">
        {tab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Firma Ünvanı"><input value={company.legal_name ?? ""} onChange={(e) => setCompany({ ...company, legal_name: e.target.value })} className="admin-input" /></Field>
            <Field label="Ticari Ad"><input value={company.trade_name ?? ""} onChange={(e) => setCompany({ ...company, trade_name: e.target.value })} className="admin-input" /></Field>
            <Field label="Cari Kodu"><input value={company.account_code ?? ""} onChange={(e) => setCompany({ ...company, account_code: e.target.value })} className="admin-input" /></Field>
            <Field label="Firma Tipi">
              <select value={company.company_type} onChange={(e) => setCompany({ ...company, company_type: e.target.value as CType })} className="admin-input">
                {COMPANY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Sektör"><input value={company.sector ?? ""} onChange={(e) => setCompany({ ...company, sector: e.target.value })} className="admin-input" /></Field>
            <Field label="Para Birimi">
              <select value={company.currency} onChange={(e) => setCompany({ ...company, currency: e.target.value })} className="admin-input">
                <option value="TRY">TRY</option><option value="EUR">EUR</option><option value="USD">USD</option>
              </select>
            </Field>
            <Field label="Vergi Numarası"><input value={company.tax_number ?? ""} onChange={(e) => setCompany({ ...company, tax_number: e.target.value })} className="admin-input" /></Field>
            <Field label="Vergi Dairesi"><input value={company.tax_office ?? ""} onChange={(e) => setCompany({ ...company, tax_office: e.target.value })} className="admin-input" /></Field>

            <Field label="Müşteri Grubu">
              <select value={company.customer_group_id ?? ""} onChange={(e) => setCompany({ ...company, customer_group_id: e.target.value || null })} className="admin-input">
                <option value="">—</option>
                {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </Field>
            <Field label="Bayi Seviyesi">
              <select value={company.dealer_level_id ?? ""} onChange={(e) => setCompany({ ...company, dealer_level_id: e.target.value || null })} className="admin-input">
                <option value="">—</option>
                {levels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </Field>
            <Field label="Satış Temsilcisi">
              <select value={company.sales_representative_id ?? ""} onChange={(e) => setCompany({ ...company, sales_representative_id: e.target.value || null })} className="admin-input">
                <option value="">—</option>
                {reps.map((r) => <option key={r.id} value={r.id}>{r.full_name}</option>)}
              </select>
            </Field>
            <Field label="Vade (Gün)"><input type="number" value={company.payment_term_days ?? 0} onChange={(e) => setCompany({ ...company, payment_term_days: Number(e.target.value) || 0 })} className="admin-input" /></Field>

            <Field label="Kredi Limiti"><input type="number" value={company.credit_limit ?? 0} onChange={(e) => setCompany({ ...company, credit_limit: Number(e.target.value) || 0 })} className="admin-input" /></Field>
            <Field label="Kullanılabilir Limit"><input type="number" value={company.available_limit ?? 0} onChange={(e) => setCompany({ ...company, available_limit: Number(e.target.value) || 0 })} className="admin-input" /></Field>

            <Field label="Hesap Durumu">
              <select value={company.account_status} onChange={(e) => setCompany({ ...company, account_status: e.target.value as AStatus })} className="admin-input">
                {ACC_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Onay Durumu">
              <select value={company.approval_status} onChange={(e) => setCompany({ ...company, approval_status: e.target.value as ApprStatus })} className="admin-input">
                {APPR_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Risk">
              <select value={company.risk_status} onChange={(e) => setCompany({ ...company, risk_status: e.target.value as Company["risk_status"] })} className="admin-input">
                <option value="low">low</option><option value="medium">medium</option><option value="high">high</option><option value="blocked">blocked</option>
              </select>
            </Field>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Yetkili Kişi"><input value={company.primary_contact_name ?? ""} onChange={(e) => setCompany({ ...company, primary_contact_name: e.target.value })} className="admin-input" /></Field>
              <Field label="Telefon"><input value={company.primary_contact_phone ?? ""} onChange={(e) => setCompany({ ...company, primary_contact_phone: e.target.value })} className="admin-input" /></Field>
              <Field label="E-posta"><input type="email" value={company.primary_contact_email ?? ""} onChange={(e) => setCompany({ ...company, primary_contact_email: e.target.value })} className="admin-input" /></Field>
            </div>
          </div>
        )}

        {tab === "users" && (
          <CompanyUsersTab companyId={company.id} users={users} onRefresh={async () => {
            const { data } = await supabase.from("company_users").select("*").eq("company_id", company.id);
            setUsers((data ?? []) as CompanyUser[]);
          }} />
        )}

        {tab === "addresses" && (
          <CompanyAddressesTab companyId={company.id} addresses={addresses} onRefresh={async () => {
            const { data } = await supabase.from("company_addresses").select("*").eq("company_id", company.id);
            setAddresses((data ?? []) as CompanyAddress[]);
          }} />
        )}

        {tab === "quotes" && (
          <div>
            {quotes.length === 0 ? (
              <p className="text-[13px] text-center py-8" style={{ color: "var(--admin-text-mute)" }}>Bu firmayla eşleşen teklif talebi bulunamadı.</p>
            ) : (
              <ul className="flex flex-col divide-y" style={{ borderColor: "var(--admin-border)" }}>
                {quotes.map((q) => (
                  <li key={q.id} className="py-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className="text-[13.5px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>{q.contact_name}</p>
                        {q.message && <p className="mt-0.5 text-[12px] line-clamp-2" style={{ color: "var(--admin-text-mute)" }}>{q.message}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-[11.5px] mb-1" style={{ color: "var(--admin-text-mute)" }}>{shortDate(q.created_at)}</p>
                        <span className="text-[11.5px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--admin-surface-2)", color: "var(--admin-navy)" }}>{q.status}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "notes" && (
          <div>
            <Field label="Dahili Notlar (yalnızca ekip görür)">
              <textarea value={company.internal_notes ?? ""} onChange={(e) => setCompany({ ...company, internal_notes: e.target.value })} rows={10} className="admin-input admin-textarea" placeholder="Bu firmayla ilgili notlar..." />
            </Field>
          </div>
        )}
      </div>

      {(tab === "overview" || tab === "notes") && (
        <StickyBar>
          <button onClick={onClose} className="admin-btn admin-btn-ghost admin-btn-sm">Kapat</button>
          <button onClick={() => void saveOverview()} disabled={saving} className="admin-btn admin-btn-primary admin-btn-sm">
            {saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
          </button>
        </StickyBar>
      )}
    </DrawerShell>
  );
}

/* ---------------- Users tab ---------------- */

function CompanyUsersTab({ companyId, users, onRefresh }: { companyId: string; users: CompanyUser[]; onRefresh: () => Promise<void> }) {
  const [uid, setUid] = useState("");
  const [role, setRole] = useState<Database["public"]["Enums"]["company_role"]>("purchasing");
  const [title, setTitle] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function invite() {
    if (!uid.trim()) { setErr("Kullanıcı ID zorunludur (Sistem → Kullanıcılar)."); return; }
    setBusy(true); setErr(null);
    const { error } = await supabase.from("company_users").insert({ company_id: companyId, user_id: uid.trim(), role, title: title || null, is_primary: isPrimary, is_active: true, invited_at: new Date().toISOString() });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setUid(""); setTitle(""); setIsPrimary(false);
    await onRefresh();
  }
  async function remove(id: string) {
    if (!confirm("Yetkiyi kaldırmak istediğinize emin misiniz?")) return;
    await supabase.from("company_users").delete().eq("id", id);
    await onRefresh();
  }
  async function toggleActive(u: CompanyUser) {
    await supabase.from("company_users").update({ is_active: !u.is_active }).eq("id", u.id);
    await onRefresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="admin-card p-4" style={{ background: "var(--admin-surface-2)" }}>
        <p className="text-[12.5px] font-semibold mb-3" style={{ color: "var(--admin-text)" }}>Yeni Yetkili Ekle</p>
        {err && <p className="text-[12px] mb-2" style={{ color: "#991B1B" }}>{err}</p>}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] gap-2">
          <input value={uid} onChange={(e) => setUid(e.target.value)} placeholder="Kullanıcı UUID" className="admin-input" />
          <select value={role} onChange={(e) => setRole(e.target.value as Database["public"]["Enums"]["company_role"])} className="admin-input">
            <option value="company_admin">Yönetici</option>
            <option value="purchasing">Satın Alma</option>
            <option value="order_creator">Sipariş Yetkilisi</option>
            <option value="finance_viewer">Finans</option>
            <option value="viewer">Görüntüleyici</option>
          </select>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Görev" className="admin-input" />
          <label className="flex items-center gap-2 text-[12.5px] px-2"><input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} /> Birincil</label>
          <button onClick={() => void invite()} disabled={busy} className="admin-btn admin-btn-primary admin-btn-sm">Davet Et</button>
        </div>
      </div>

      {users.length === 0 ? (
        <p className="text-[13px] text-center py-6" style={{ color: "var(--admin-text-mute)" }}>Bu firmaya bağlı yetkili yok.</p>
      ) : (
        <ul className="flex flex-col divide-y" style={{ borderColor: "var(--admin-border)" }}>
          {users.map((u) => (
            <li key={u.id} className="py-3 grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-3">
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>{u.title || u.role}</p>
                <p className="text-[11.5px] truncate" style={{ color: "var(--admin-text-mute)" }}>UUID: {u.user_id.slice(0, 8)}… • {u.role}</p>
              </div>
              {u.is_primary && <span className="text-[10.5px] font-semibold h-5 px-2 rounded-full" style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}>BİRİNCİL</span>}
              <button onClick={() => void toggleActive(u)} className="admin-btn admin-btn-ghost admin-btn-xs">{u.is_active ? "Askıya Al" : "Aktifleştir"}</button>
              <button onClick={() => void remove(u.id)} className="admin-btn admin-btn-ghost admin-btn-xs" style={{ color: "#991B1B" }}>Kaldır</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Addresses tab ---------------- */

function CompanyAddressesTab({ companyId, addresses, onRefresh }: { companyId: string; addresses: CompanyAddress[]; onRefresh: () => Promise<void> }) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<Database["public"]["Enums"]["address_type"]>("shipping");
  const [line, setLine] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  async function add() {
    if (!line.trim()) return;
    setBusy(true);
    await supabase.from("company_addresses").insert({
      company_id: companyId,
      label: label || (type === "billing" ? "Fatura Adresi" : "Sevkiyat Adresi"),
      address_type: type,
      address_line1: line,
      city: city || null,
      district: district || null,
      phone: phone || null,
    });
    setBusy(false);
    setLabel(""); setLine(""); setCity(""); setDistrict(""); setPhone("");
    await onRefresh();
  }
  async function remove(id: string) {
    if (!confirm("Adres silinsin mi?")) return;
    await supabase.from("company_addresses").delete().eq("id", id);
    await onRefresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="admin-card p-4" style={{ background: "var(--admin-surface-2)" }}>
        <p className="text-[12.5px] font-semibold mb-3" style={{ color: "var(--admin-text)" }}>Yeni Adres</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <select value={type} onChange={(e) => setType(e.target.value as Database["public"]["Enums"]["address_type"])} className="admin-input">
            <option value="shipping">Sevkiyat</option>
            <option value="billing">Fatura</option>
          </select>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Etiket (ör. Ana Depo)" className="admin-input" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon" className="admin-input" />
          <input value={line} onChange={(e) => setLine(e.target.value)} placeholder="Adres satırı *" className="admin-input md:col-span-3" />
          <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="İlçe" className="admin-input" />
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="İl" className="admin-input" />
          <button onClick={() => void add()} disabled={busy} className="admin-btn admin-btn-primary admin-btn-sm">Adres Ekle</button>
        </div>
      </div>
      {addresses.length === 0 ? (
        <p className="text-[13px] text-center py-6" style={{ color: "var(--admin-text-mute)" }}>Kayıtlı adres yok.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addresses.map((a) => (
            <li key={a.id} className="admin-card p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                <p className="text-[13px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>{a.label}</p>
                <span className="text-[10.5px] font-semibold h-5 px-2 rounded-full whitespace-nowrap" style={{ background: "var(--admin-surface-2)", color: "var(--admin-navy)" }}>
                  {a.address_type === "billing" ? "Fatura" : "Sevkiyat"}
                </span>
              </div>
              <p className="mt-2 text-[12.5px]" style={{ color: "var(--admin-text-2)" }}>{a.address_line1}</p>
              {(a.district || a.city) && <p className="text-[12px]" style={{ color: "var(--admin-text-mute)" }}>{[a.district, a.city].filter(Boolean).join(" / ")}</p>}
              {a.phone && <p className="text-[12px] mt-1" style={{ color: "var(--admin-text-mute)" }}>{a.phone}</p>}
              <div className="mt-3 flex justify-end">
                <button onClick={() => void remove(a.id)} className="admin-btn admin-btn-ghost admin-btn-xs" style={{ color: "#991B1B" }}>Sil</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Shared ---------------- */

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: "var(--admin-text-mute)" }}>{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "danger" }) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold uppercase tracking-wide" style={{ color: "var(--admin-text-mute)" }}>{label}</p>
      <p className="mt-1 text-[14px] font-bold tabular-nums truncate" style={{ color: tone === "danger" ? "#991B1B" : "var(--admin-text)" }}>{value}</p>
    </div>
  );
}

function StickyBar({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 flex items-center justify-end gap-2 p-4"
      style={{ background: "var(--admin-surface)", borderTop: "1px solid var(--admin-border)" }}>
      {children}
    </div>
  );
}

function DrawerShell({ title, onClose, width, children }: { title: string; onClose: () => void; width: string; children: ReactNode }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0" style={{ background: "rgba(8,24,44,0.55)" }} onClick={onClose} aria-label="Kapat" />
      <aside className={`relative w-full ${width} h-full flex flex-col overflow-y-auto`} style={{ background: "var(--admin-surface)" }}>
        <header className="sticky top-0 z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-4"
          style={{ background: "var(--admin-surface)", borderBottom: "1px solid var(--admin-border)" }}>
          <h2 className="text-[16px] font-bold truncate" style={{ color: "var(--admin-text)" }}>{title}</h2>
          <button onClick={onClose} className="grid place-items-center h-9 w-9 rounded-lg hover:bg-[var(--admin-surface-2)]" aria-label="Paneli kapat">
            <Icon name="close" className="text-[20px]" />
          </button>
        </header>
        {children}
      </aside>
    </div>
  );
}