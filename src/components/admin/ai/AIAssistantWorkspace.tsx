import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Icon } from "@/components/site-shell";
import { useAiAssistant, type Proposal } from "@/hooks/use-ai-assistant";
import { ActionProposalCard } from "./ActionProposalCard";
import { CONTEXT_MODULES, ACTION_REGISTRY, type ActionType } from "@/lib/ai-assistant-registry";
import { aiListTargets } from "@/lib/ai-assistant.functions";

function formatDate(s: string) {
  try {
    return new Date(s).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return s; }
}

const QUICK_PROMPTS = [
  "Bu içeriği daha kurumsal bir dile göre yeniden yaz.",
  "SEO açısından geliştir, anahtar kelimeleri koru.",
  "Daha kısa ve etkileyici bir başlık öner.",
  "Türkçe dilbilgisi ve noktalama hatalarını düzelt.",
];

type TargetOption = { id: string; label: string };

export function AIAssistantWorkspace({
  initialContext,
  initialPrompt,
}: {
  initialContext?: { actionType: string; targetId: string } | null;
  initialPrompt?: string | null;
} = {}) {
  const listTargetsFn = useServerFn(aiListTargets);
  const asst = useAiAssistant();
  const [input, setInput] = useState(initialPrompt ?? "");
  const [selectedAction, setSelectedAction] = useState<ActionType | "">(
    (initialContext?.actionType as ActionType) ?? "",
  );
  const [selectedTarget, setSelectedTarget] = useState<string>(initialContext?.targetId ?? "");
  const [targets, setTargets] = useState<TargetOption[]>([]);
  const [targetSearch, setTargetSearch] = useState("");
  const [loadingTargets, setLoadingTargets] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bootedContextRef = useRef(false);

  // Apply initial URL-driven context/prompt on first render only
  useEffect(() => {
    if (bootedContextRef.current) return;
    bootedContextRef.current = true;
    if (initialContext?.actionType) {
      setSelectedAction(initialContext.actionType as ActionType);
      setSelectedTarget(initialContext.targetId);
    }
    if (initialPrompt) setInput(initialPrompt);
  }, [initialContext, initialPrompt]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [asst.messages.length, asst.sending]);

  useEffect(() => {
    setSelectedTarget("");
    setTargets([]);
    if (!selectedAction) return;
    setLoadingTargets(true);
    (async () => {
      try {
        const rows = (await listTargetsFn({ data: { actionType: selectedAction, search: targetSearch } })) as TargetOption[];
        setTargets(rows);
      } finally { setLoadingTargets(false); }
    })().catch(() => setLoadingTargets(false));
  }, [selectedAction, targetSearch, listTargetsFn]);

  const ctx = useMemo(() => {
    if (!selectedAction || !selectedTarget) return null;
    return { actionType: selectedAction, targetId: selectedTarget };
  }, [selectedAction, selectedTarget]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    if (asst.sending) return;
    if (!asst.activeId) {
      await asst.newConversation();
    }
    setInput("");
    try {
      await asst.send(text, ctx);
    } catch (e: any) {
      toast.error(e?.message ?? "Mesaj gönderilemedi.");
    }
  }

  async function handleNewConversation() {
    try { await asst.newConversation(); }
    catch (e: any) { toast.error(e?.message ?? "Görüşme oluşturulamadı."); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bu görüşmeyi silmek istediğinize emin misiniz?")) return;
    try { await asst.deleteConversation(id); }
    catch (e: any) { toast.error(e?.message ?? "Silinemedi."); }
  }

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "260px minmax(0,1fr) 320px", minHeight: "min(78vh, 780px)" }}>
      {/* LEFT: conversations */}
      <aside className="rounded-xl overflow-hidden flex flex-col" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
        <div className="p-3 border-b" style={{ borderColor: "var(--admin-border)" }}>
          <button onClick={handleNewConversation} className="admin-btn admin-btn-primary admin-btn-sm w-full justify-center">
            <Icon name="add" className="text-[16px]" /> Yeni Görüşme
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {asst.conversations.length === 0 && (
            <div className="p-4 text-[12px] text-center" style={{ color: "var(--admin-text-mute)" }}>
              Henüz görüşme yok.
            </div>
          )}
          {asst.conversations.map((c) => (
            <div
              key={c.id}
              className={`group px-3 py-2.5 cursor-pointer border-b transition-colors ${c.id === asst.activeId ? "bg-[color:var(--admin-yellow-soft)]" : "hover:bg-[color:var(--admin-bg)]"}`}
              style={{ borderColor: "var(--admin-border)" }}
              onClick={() => asst.selectConversation(c.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>
                    {c.title}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--admin-text-mute)" }}>
                    {formatDate(c.last_message_at)}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white"
                  aria-label="Görüşmeyi sil"
                >
                  <Icon name="delete" className="text-[15px]" style={{ color: "var(--admin-text-mute)" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* CENTER: chat */}
      <section className="rounded-xl flex flex-col overflow-hidden" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "var(--admin-border)" }}>
          <div className="h-8 w-8 rounded-full grid place-items-center" style={{ background: "var(--admin-navy)", color: "var(--admin-yellow)" }}>
            <Icon name="smart_toy" className="text-[18px]" />
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold" style={{ color: "var(--admin-text)" }}>
              {asst.active?.title ?? "Yapay Zekâ Site Asistanı"}
            </div>
            <div className="text-[11px]" style={{ color: "var(--admin-text-mute)" }}>
              Değişiklikler her zaman taslak olarak sunulur, onaylanmadan uygulanmaz.
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "var(--admin-bg)" }}>
          {asst.messages.length === 0 && !asst.loading && (
            <div className="max-w-md mx-auto text-center py-10">
              <div className="h-12 w-12 rounded-full grid place-items-center mx-auto mb-3" style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}>
                <Icon name="auto_awesome" className="text-[22px]" />
              </div>
              <p className="text-[14px] font-semibold" style={{ color: "var(--admin-text)" }}>
                Site içeriğinizi sohbetle yönetin
              </p>
              <p className="text-[12px] mt-1" style={{ color: "var(--admin-text-mute)" }}>
                Sağ paneldeki bağlamdan bir modül ve kayıt seçin, ardından ne yapmak istediğinizi Türkçe olarak yazın.
              </p>
            </div>
          )}

          {asst.messages.map((m) => {
            const isUser = m.role === "user";
            const proposal = m.proposal_id ? asst.proposals[m.proposal_id] : null;
            return (
              <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-[13.5px] whitespace-pre-wrap leading-relaxed`}
                    style={
                      isUser
                        ? { background: "var(--admin-navy)", color: "#fff", borderTopRightRadius: 4 }
                        : { background: "var(--admin-surface)", color: "var(--admin-text)", border: "1px solid var(--admin-border)", borderTopLeftRadius: 4 }
                    }
                  >
                    {m.content}
                  </div>
                  {proposal && (
                    <ActionProposalCard
                      proposal={proposal as Proposal}
                      onApprove={asst.approve}
                      onReject={asst.reject}
                      onUndo={asst.undo}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {asst.sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-2.5 text-[13px] flex items-center gap-2" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", color: "var(--admin-text-mute)" }}>
                <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: "var(--admin-navy)" }} />
                Asistan düşünüyor…
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-3 space-y-2" style={{ borderColor: "var(--admin-border)" }}>
          {ctx && (
            <div className="text-[11px] flex items-center gap-2 px-2.5 py-1.5 rounded" style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}>
              <Icon name="link" className="text-[14px]" />
              <span className="font-semibold">Bağlam:</span>
              <span>{ACTION_REGISTRY[ctx.actionType as ActionType]?.label ?? ctx.actionType}</span>
              <span>·</span>
              <span className="truncate">{targets.find((t) => t.id === ctx.targetId)?.label ?? ctx.targetId}</span>
            </div>
          )}
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Bir istek yazın… (Enter ile gönder, Shift+Enter satır sonu)"
              rows={2}
              className="flex-1 rounded-lg px-3 py-2 text-[13.5px] resize-none focus:outline-none focus:ring-2"
              style={{ background: "var(--admin-bg)", border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
            />
            <button
              onClick={handleSend}
              disabled={asst.sending || !input.trim()}
              className="admin-btn admin-btn-primary self-stretch px-4"
              aria-label="Gönder"
            >
              <Icon name="send" className="text-[18px]" />
            </button>
          </div>
        </div>
      </section>

      {/* RIGHT: context + quick prompts */}
      <aside className="rounded-xl p-4 space-y-4 overflow-y-auto" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", maxHeight: "min(78vh, 780px)" }}>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--admin-text-mute)" }}>
            Bağlam
          </div>
          <label className="text-[12px] font-semibold" style={{ color: "var(--admin-text-2)" }}>Modül</label>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value as ActionType | "")}
            className="w-full mt-1 rounded-lg px-3 py-2 text-[13px]"
            style={{ background: "var(--admin-bg)", border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
          >
            <option value="">— Modül seçin —</option>
            {CONTEXT_MODULES.map((m) => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>

          {selectedAction && (
            <>
              <label className="block text-[12px] font-semibold mt-3" style={{ color: "var(--admin-text-2)" }}>Kayıt ara</label>
              <input
                value={targetSearch}
                onChange={(e) => setTargetSearch(e.target.value)}
                placeholder="Ad ile ara…"
                className="w-full mt-1 rounded-lg px-3 py-2 text-[13px]"
                style={{ background: "var(--admin-bg)", border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
              />
              <div className="mt-2 rounded-lg overflow-hidden" style={{ border: "1px solid var(--admin-border)" }}>
                {loadingTargets && <div className="p-3 text-[12px]" style={{ color: "var(--admin-text-mute)" }}>Yükleniyor…</div>}
                {!loadingTargets && targets.length === 0 && (
                  <div className="p-3 text-[12px]" style={{ color: "var(--admin-text-mute)" }}>Kayıt bulunamadı.</div>
                )}
                {!loadingTargets && targets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTarget(t.id)}
                    className={`w-full text-left px-3 py-2 text-[12.5px] border-b transition-colors ${t.id === selectedTarget ? "bg-[color:var(--admin-yellow-soft)] font-semibold" : "hover:bg-[color:var(--admin-bg)]"}`}
                    style={{ borderColor: "var(--admin-border)", color: "var(--admin-text)" }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--admin-text-mute)" }}>
            Hazır istekler
          </div>
          <div className="space-y-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => setInput(p)}
                className="w-full text-left text-[12.5px] rounded-lg px-3 py-2 transition-colors"
                style={{ background: "var(--admin-bg)", border: "1px solid var(--admin-border)", color: "var(--admin-text-2)" }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] leading-relaxed p-3 rounded-lg" style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}>
          <Icon name="shield" className="text-[14px] align-middle mr-1" />
          Asistanın önerileri hiçbir zaman otomatik uygulanmaz. Her değişiklik önce taslak olarak sunulur, onaylandığında uygulanır ve gerekirse geri alınabilir.
        </div>
      </aside>
    </div>
  );
}
