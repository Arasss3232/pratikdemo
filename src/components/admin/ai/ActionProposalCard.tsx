import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/site-shell";
import { ACTION_REGISTRY, RISK_LABEL, STATUS_LABEL, type ActionType } from "@/lib/ai-assistant-registry";
import type { Proposal } from "@/hooks/use-ai-assistant";

type Props = {
  proposal: Proposal;
  onApprove: (id: string, force?: boolean) => Promise<any>;
  onReject: (id: string) => Promise<any>;
  onUndo: (id: string) => Promise<any>;
};

function short(v: any, max = 160): string {
  if (v == null) return "—";
  const s = String(v);
  return s.length > max ? s.slice(0, max) + "…" : s;
}

export function ActionProposalCard({ proposal, onApprove, onReject, onUndo }: Props) {
  const [busy, setBusy] = useState(false);
  const entry = ACTION_REGISTRY[proposal.action_type as ActionType];
  const changes = proposal.proposed_changes ?? {};
  const before = proposal.before_value ?? {};
  const fields = Object.keys(changes);

  const isPending = proposal.status === "pending";
  const isApplied = proposal.status === "applied";

  async function guard(fn: () => Promise<any>, ok: string) {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
      toast.success(ok);
    } catch (e: any) {
      toast.error(e?.message ?? "İşlem başarısız oldu.");
    } finally {
      setBusy(false);
    }
  }

  async function handleApprove() {
    if (proposal.risk_level !== "low") {
      const ok = window.confirm(
        `Bu değişiklik ${RISK_LABEL[proposal.risk_level] ?? proposal.risk_level} seviyesindedir. Uygulamak istediğinize emin misiniz?\n\n${proposal.summary}`,
      );
      if (!ok) return;
    }
    if (busy) return;
    setBusy(true);
    try {
      await onApprove(proposal.id, false);
      toast.success("Değişiklik uygulandı.");
    } catch (e: any) {
      const msg = String(e?.message ?? "İşlem başarısız oldu.");
      if (msg.includes("değişmiş")) {
        const ok = window.confirm(`${msg}\n\nGerçek değeri önerilenle değiştirmek için "Tamam"a basın.`);
        if (ok) {
          try {
            await onApprove(proposal.id, true);
            toast.success("Değişiklik uygulandı.");
          } catch (e2: any) {
            toast.error(e2?.message ?? "İşlem başarısız oldu.");
          }
        }
      } else {
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleUndo() {
    const ok = window.confirm("Bu değişikliği geri almak istediğinize emin misiniz?");
    if (!ok) return;
    await guard(() => onUndo(proposal.id), "Değişiklik geri alındı.");
  }

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: "var(--admin-surface)",
        border: "1px solid var(--admin-border)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--admin-text-mute)" }}>
            <Icon name="auto_awesome" className="text-[14px]" />
            <span>{entry?.label ?? proposal.action_type}</span>
            <span>•</span>
            <span>{RISK_LABEL[proposal.risk_level] ?? proposal.risk_level}</span>
          </div>
          <p className="mt-1 text-sm font-semibold" style={{ color: "var(--admin-text)" }}>
            {proposal.summary}
          </p>
        </div>
        <span
          className="text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
          style={{
            background: isApplied ? "#DCFCE7" : isPending ? "var(--admin-yellow-soft)" : "#F1F5F9",
            color: isApplied ? "#166534" : isPending ? "var(--admin-navy)" : "var(--admin-text-2)",
          }}
        >
          {STATUS_LABEL[proposal.status] ?? proposal.status}
        </span>
      </div>

      <div className="grid gap-2">
        {fields.map((f) => (
          <div key={f} className="rounded-lg p-3" style={{ background: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
            <div className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--admin-text-mute)" }}>
              {entry?.fieldLabels[f] ?? f}
            </div>
            <div className="grid md:grid-cols-2 gap-2 text-[13px]">
              <div>
                <div className="text-[10px] uppercase mb-1" style={{ color: "var(--admin-text-mute)" }}>Mevcut</div>
                <div className="rounded p-2 whitespace-pre-wrap" style={{ background: "#FEF2F2", color: "#7F1D1D", border: "1px solid #FEE2E2" }}>
                  {short(before[f], 400)}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase mb-1" style={{ color: "var(--admin-text-mute)" }}>Önerilen</div>
                <div className="rounded p-2 whitespace-pre-wrap" style={{ background: "#ECFDF5", color: "#065F46", border: "1px solid #D1FAE5" }}>
                  {short(changes[f], 400)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {proposal.error_message && (
        <div className="text-[12px] p-2 rounded" style={{ background: "#FEF2F2", color: "#991B1B" }}>
          {proposal.error_message}
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        {isPending && (
          <>
            <button
              disabled={busy}
              onClick={handleApprove}
              className="admin-btn admin-btn-primary admin-btn-sm"
            >
              <Icon name="check" className="text-[16px]" /> Onayla ve Uygula
            </button>
            <button
              disabled={busy}
              onClick={() => guard(() => onReject(proposal.id), "Öneri reddedildi.")}
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              <Icon name="close" className="text-[16px]" /> Reddet
            </button>
          </>
        )}
        {isApplied && (
          <button
            disabled={busy}
            onClick={handleUndo}
            className="admin-btn admin-btn-ghost admin-btn-sm"
          >
            <Icon name="undo" className="text-[16px]" /> Geri Al
          </button>
        )}
      </div>
    </div>
  );
}
