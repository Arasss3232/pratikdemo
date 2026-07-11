import type { Database } from "@/integrations/supabase/types";

type Account = Database["public"]["Enums"]["company_account_status"];
type Approval = Database["public"]["Enums"]["company_approval_status"];
type Risk = Database["public"]["Enums"]["risk_status"];
type Company = Database["public"]["Enums"]["company_type"];

const ACC: Record<Account, { label: string; bg: string; fg: string }> = {
  active: { label: "Aktif", bg: "rgba(34,197,94,0.14)", fg: "#166534" },
  pending: { label: "Bekliyor", bg: "rgba(244,197,66,0.20)", fg: "#78591C" },
  suspended: { label: "Askıda", bg: "rgba(249,115,22,0.16)", fg: "#9A3412" },
  closed: { label: "Kapalı", bg: "rgba(100,116,139,0.18)", fg: "#334155" },
};
const APP: Record<Approval, { label: string; bg: string; fg: string }> = {
  approved: { label: "Onaylı", bg: "rgba(34,197,94,0.14)", fg: "#166534" },
  pending: { label: "Onay Bekliyor", bg: "rgba(244,197,66,0.20)", fg: "#78591C" },
  rejected: { label: "Reddedildi", bg: "rgba(239,68,68,0.14)", fg: "#991B1B" },
};
const RISK: Record<Risk, { label: string; bg: string; fg: string }> = {
  low: { label: "Düşük Risk", bg: "rgba(34,197,94,0.14)", fg: "#166534" },
  medium: { label: "Orta Risk", bg: "rgba(244,197,66,0.20)", fg: "#78591C" },
  high: { label: "Yüksek Risk", bg: "rgba(249,115,22,0.16)", fg: "#9A3412" },
  blocked: { label: "Engelli", bg: "rgba(239,68,68,0.14)", fg: "#991B1B" },
};
const CTYPE: Record<Company, { label: string; bg: string; fg: string }> = {
  corporate: { label: "Kurumsal", bg: "rgba(8,24,44,0.08)", fg: "#08182C" },
  dealer: { label: "Bayi", bg: "rgba(244,197,66,0.20)", fg: "#78591C" },
  distributor: { label: "Distribütör", bg: "rgba(59,130,246,0.14)", fg: "#1E3A8A" },
  branch: { label: "Şube", bg: "rgba(100,116,139,0.18)", fg: "#334155" },
  end_customer: { label: "Son Kullanıcı", bg: "rgba(148,163,184,0.20)", fg: "#334155" },
};

function Pill({ conf }: { conf: { label: string; bg: string; fg: string } }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full text-[11.5px] font-semibold whitespace-nowrap"
      style={{ background: conf.bg, color: conf.fg }}
    >
      {conf.label}
    </span>
  );
}

export function AccountStatusPill({ value }: { value: Account | null | undefined }) {
  if (!value) return null;
  return <Pill conf={ACC[value]} />;
}
export function ApprovalStatusPill({ value }: { value: Approval | null | undefined }) {
  if (!value) return null;
  return <Pill conf={APP[value]} />;
}
export function RiskStatusPill({ value }: { value: Risk | null | undefined }) {
  if (!value) return null;
  return <Pill conf={RISK[value]} />;
}
export function CompanyTypePill({ value }: { value: Company | null | undefined }) {
  if (!value) return null;
  return <Pill conf={CTYPE[value]} />;
}

export function QuoteStatusPill({ value }: { value: string | null | undefined }) {
  if (!value) return null;
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    new: { label: "Yeni", bg: "rgba(59,130,246,0.14)", fg: "#1E3A8A" },
    reviewing: { label: "İncelemede", bg: "rgba(244,197,66,0.20)", fg: "#78591C" },
    quoted: { label: "Teklif Verildi", bg: "rgba(34,197,94,0.14)", fg: "#166534" },
    won: { label: "Kazanıldı", bg: "rgba(34,197,94,0.20)", fg: "#166534" },
    lost: { label: "Kaybedildi", bg: "rgba(239,68,68,0.14)", fg: "#991B1B" },
    closed: { label: "Kapalı", bg: "rgba(100,116,139,0.18)", fg: "#334155" },
  };
  const conf = map[value] ?? { label: value, bg: "rgba(100,116,139,0.18)", fg: "#334155" };
  return <Pill conf={conf} />;
}

export function money(n: number | null | undefined, currency = "TRY") {
  if (n == null) return "—";
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(n));
}

export function shortDate(s: string | null | undefined) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}