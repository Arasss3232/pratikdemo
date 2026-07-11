import { createFileRoute } from "@tanstack/react-router";
import { usePortalContext, ROLE_LABELS_TR } from "@/hooks/use-portal-context";
import { PageTitle } from "@/components/portal/portal-ui";

export const Route = createFileRoute("/portal/hesap")({ component: CompanyInfo });

function CompanyInfo() {
  const ctx = usePortalContext();
  const c = ctx.activeCompany;
  if (!c) return null;
  const rows: Array<[string, string | null | undefined]> = [
    ["Ticari Ünvan", c.trade_name || c.legal_name],
    ["Yasal Ünvan", c.legal_name],
    ["Cari Kod", c.account_code],
    ["Vergi Dairesi", c.tax_office],
    ["Vergi No", c.tax_number],
    ["Yetkili", c.primary_contact_name],
    ["Yetkili Telefon", c.primary_contact_phone],
    ["Yetkili E-posta", c.primary_contact_email],
    ["Web Sitesi", c.website],
    ["Sektör", c.industry],
  ];
  return (
    <>
      <PageTitle icon="business" title="Firma Hesabım" subtitle={`Rolünüz: ${ctx.role ? ROLE_LABELS_TR[ctx.role] : "—"}`} />
      <div className="grid gap-4 md:grid-cols-2">
        <section className="portal-card p-5">
          <p className="text-[10.5px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--portal-text-mute)" }}>Firma Bilgileri</p>
          <dl className="divide-y" style={{ borderColor: "var(--portal-border)" }}>
            {rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_minmax(0,1fr)] gap-3 py-2 text-[13px]">
                <dt className="text-[11.5px] font-semibold" style={{ color: "var(--portal-text-mute)" }}>{k}</dt>
                <dd className="truncate" style={{ color: "var(--portal-text)" }}>{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="portal-card p-5">
          <p className="text-[10.5px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--portal-text-mute)" }}>Erişimleriniz</p>
          <ul className="space-y-2 text-[13px]">
            {ctx.memberships.map((m) => (
              <li key={m.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-3 rounded-lg" style={{ border: "1px solid var(--portal-border)" }}>
                <div className="min-w-0">
                  <p className="font-semibold truncate" style={{ color: "var(--portal-text)" }}>{m.company?.trade_name || m.company?.legal_name}</p>
                  <p className="text-[11.5px]" style={{ color: "var(--portal-text-mute)" }}>{ROLE_LABELS_TR[m.role]}</p>
                </div>
                {m.company_id === ctx.activeCompany?.id && (
                  <span className="portal-pill" style={{ background: "var(--portal-yellow-soft)", color: "var(--portal-navy)" }}>Aktif</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}