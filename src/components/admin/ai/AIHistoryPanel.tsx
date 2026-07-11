import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Icon } from "@/components/site-shell";
import { aiListHistory, aiUndoProposal } from "@/lib/ai-assistant.functions";
import { ACTION_REGISTRY, STATUS_LABEL, RISK_LABEL, type ActionType } from "@/lib/ai-assistant-registry";
import type { Proposal } from "@/hooks/use-ai-assistant";

function formatDate(s: string) {
  try {
    return new Date(s).toLocaleString("tr-TR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return s; }
}

const STATUSES: { key: string; label: string }[] = [
  { key: "", label: "Tümü" },
  { key: "pending", label: "Bekliyor" },
  { key: "applied", label: "Uygulandı" },
  { key: "rejected", label: "Reddedildi" },
  { key: "undone", label: "Geri Alındı" },
  { key: "failed", label: "Başarısız" },
];

export function AIHistoryPanel() {
  const listFn = useServerFn(aiListHistory);
  const undoFn = useServerFn(aiUndoProposal);
  const [rows, setRows] = useState<Proposal[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = (await listFn({ data: { status: status || undefined, limit: 200 } })) as Proposal[];
      setRows(data);
    } catch (e: any) {
      toast.error(e?.message ?? "Kayıtlar alınamadı.");
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status]);

  async function handleUndo(id: string) {
    if (!confirm("Bu değişikliği geri almak istediğinize emin misiniz?")) return;
    setBusyId(id);
    try {
      await undoFn({ data: { id } });
      toast.success("Değişiklik geri alındı.");
      await load();
    } catch (e: any) {
      toast.error(e?.message ?? "Geri alınamadı.");
    } finally { setBusyId(null); }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatus(s.key)}
            className={`text-[12px] px-3 py-1.5 rounded-full font-semibold transition-colors ${status === s.key ? "" : "hover:bg-[color:var(--admin-bg)]"}`}
            style={
              status === s.key
                ? { background: "var(--admin-navy)", color: "#fff" }
                : { background: "var(--admin-surface)", color: "var(--admin-text-2)", border: "1px solid var(--admin-border)" }
            }
          >
            {s.label}
          </button>
        ))}
        <button onClick={load} className="admin-btn admin-btn-ghost admin-btn-sm ml-auto">
          <Icon name="refresh" className="text-[16px]" /> Yenile
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
        {loading && <div className="p-6 text-[13px] text-center" style={{ color: "var(--admin-text-mute)" }}>Yükleniyor…</div>}
        {!loading && rows.length === 0 && (
          <div className="p-8 text-[13px] text-center" style={{ color: "var(--admin-text-mute)" }}>
            Bu filtre için kayıt bulunamadı.
          </div>
        )}
        {!loading && rows.map((r) => {
          const entry = ACTION_REGISTRY[r.action_type as ActionType];
          return (
            <div key={r.id} className="p-4 border-b" style={{ borderColor: "var(--admin-border)" }}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--admin-text-mute)" }}>
                    <Icon name="auto_awesome" className="text-[14px]" />
                    <span>{entry?.label ?? r.action_type}</span>
                    <span>•</span>
                    <span>{RISK_LABEL[r.risk_level] ?? r.risk_level}</span>
                    <span>•</span>
                    <span>{formatDate(r.created_at)}</span>
                  </div>
                  <p className="mt-1 text-[13.5px] font-semibold" style={{ color: "var(--admin-text)" }}>{r.summary}</p>
                  <p className="mt-0.5 text-[12px]" style={{ color: "var(--admin-text-mute)" }}>
                    {Object.keys(r.proposed_changes ?? {}).length} alan · Hedef: {r.target_table}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{
                      background: r.status === "applied" ? "#DCFCE7" : r.status === "pending" ? "var(--admin-yellow-soft)" : "#F1F5F9",
                      color: r.status === "applied" ? "#166534" : r.status === "pending" ? "var(--admin-navy)" : "var(--admin-text-2)",
                    }}
                  >
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                  {r.status === "applied" && (
                    <button
                      disabled={busyId === r.id}
                      onClick={() => handleUndo(r.id)}
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                    >
                      <Icon name="undo" className="text-[16px]" /> Geri Al
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
