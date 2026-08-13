import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Icon } from "@/components/site-shell";
import type { AdminTab } from "../nav";
import { useUserMode } from "@/hooks/use-user-mode";
import { useAiAssistant, type Proposal } from "@/hooks/use-ai-assistant";
import { ActionProposalCard } from "../ai/ActionProposalCard";
import {
  RichText,
  ResponseTypePill,
  OptionsGrid,
  WarningsList,
  ClarifyBlock,
  FollowUps,
  type OptionCard,
} from "../ai/RichMessage";
import {
  getControlCenterSnapshot,
  runSiteAudit,
} from "@/lib/control-center.functions";

type Snapshot = {
  counts: Record<string, number>;
  healthScore: number;
  recentActivity: any[];
  preferences: any;
  pendingChanges: any[];
  recommendations: any[];
};

const SUGGESTIONS = [
  { label: "Ana Sayfayı Düzenle", prompt: "Ana sayfayı daha sade ve kurumsal göster. Önce mevcut bölümleri değerlendir, sonra 3 seçenek sun.", icon: "home" },
  { label: "Yeni Ürün Hazırla", prompt: "Yeni bir ürün için kısa ama etkileyici bir açıklama taslağı hazırla. Önce hangi ürün olduğunu sor.", icon: "add_box" },
  { label: "Broşür Oluştur", prompt: "Ana sayfadaki slider için yeni bir broşür slaytı hazırla. Bana 3 farklı yaklaşım öner.", icon: "view_carousel" },
  { label: "Siteyi Kontrol Et", prompt: "Sitede eksik görsel, SEO ve tutarlılık sorunlarını tara ve bulguları önem sırasına göre listele.", icon: "health_and_safety" },
];

const MORE_ACTIONS = [
  { label: "SEO Eksiklerini Bul", prompt: "Sitede eksik SEO başlık ve açıklamaları listele, düzeltme önerileri sun.", icon: "trending_up" },
  { label: "Mobil Görünümü Kontrol Et", prompt: "Sitenin mobil görünümünde taşan alanları, küçük yazıları ve dokunma sorunlarını tespit et.", icon: "smartphone" },
  { label: "Yazım Hatalarını Bul", prompt: "Site metinlerinde yazım ve dilbilgisi hatalarını tara, düzeltme önerileriyle listele.", icon: "spellcheck" },
  { label: "Eksik Ürün Görsellerini Bul", prompt: "Ana görseli olmayan ürünleri listele. Öncelik sırası önerisi ver.", icon: "image_search" },
  { label: "Mesajları Özetle", prompt: "Son iletişim mesajlarını özetle ve önem sırasına göre önceliklendir.", icon: "mail" },
  { label: "Yeni Blog Yazısı", prompt: "Yeni bir blog yazısı için başlık ve giriş paragrafı önerileri hazırla.", icon: "post_add" },
  { label: "Tasarım Tutarlılığı", prompt: "Sitedeki renk, tipografi ve buton tutarsızlıklarını denetle ve önerilerde bulun.", icon: "palette" },
  { label: "Ürün Açıklaması", prompt: "Belirli bir ürün için daha kurumsal, arama motoru dostu bir açıklama hazırla.", icon: "description" },
];

function formatDate(s: string) {
  try {
    return new Date(s).toLocaleString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch { return s; }
}

type ComposerProps = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
  big?: boolean;
};

const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  { value, onChange, onSend, disabled, placeholder, big },
  ref,
) {
  return (
    <div className={`cc-composer ${big ? "cc-composer-big" : ""}`}>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        rows={big ? 3 : 2}
        placeholder={placeholder}
        className="cc-composer-input"
        aria-label="Kurumsal mesajı"
      />
      <div className="cc-composer-actions">
        <span className="text-[11.5px]" style={{ color: "var(--admin-text-mute)" }}>Enter ile gönder</span>
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="cc-send-btn"
          aria-label="Gönder"
          title="Gönder"
        >
          <Icon name="arrow_upward" className="text-[18px]" />
        </button>
      </div>
    </div>
  );
});

function useSnapshot() {
  const call = useServerFn(getControlCenterSnapshot);
  const [data, setData] = useState<Snapshot | null>(null);
  const load = useCallback(async () => {
    try { setData((await call()) as Snapshot); } catch { /* soft */ }
  }, [call]);
  useEffect(() => { void load(); }, [load]);
  return { data, reload: load };
}

export function ControlCenter({ onNavigate }: { onNavigate: (t: AdminTab) => void }) {
  const [mode, setMode] = useUserMode();
  const [input, setInput] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const asst = useAiAssistant();
  const { data, reload } = useSnapshot();
  const runAudit = useServerFn(runSiteAudit);
  const [auditRunning, setAuditRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [asst.activeId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [asst.messages.length, asst.sending]);

  const hasChat = asst.messages.length > 0;

  const handleSend = useCallback(
    async (text?: string) => {
      const value = (text ?? input).trim();
      if (!value || asst.sending) return;
      if (!asst.activeId) {
        try { await asst.newConversation(); }
        catch (e: any) { toast.error(e?.message ?? "Görüşme başlatılamadı."); return; }
      }
      if (!text) setInput("");
      try { await asst.send(value, null); }
      catch (e: any) { toast.error(e?.message ?? "Mesaj gönderilemedi."); }
    },
    [asst, input],
  );

  async function handleNewConversation() {
    try {
      await asst.newConversation();
      setHistoryOpen(false);
      setInput("");
      inputRef.current?.focus();
    } catch (e: any) {
      toast.error(e?.message ?? "Görüşme oluşturulamadı.");
    }
  }

  async function handleDeleteConversation(id: string) {
    if (!confirm("Bu görüşmeyi silmek istediğinize emin misiniz?")) return;
    try { await asst.deleteConversation(id); }
    catch (e: any) { toast.error(e?.message ?? "Silinemedi."); }
  }

  async function handleAudit() {
    setAuditRunning(true);
    try {
      const r: any = await runAudit();
      toast.success(`Site taraması tamamlandı: ${r?.insertedCount ?? 0} bulgu.`);
      await reload();
    } catch (e: any) {
      toast.error(e?.message ?? "Tarama başarısız oldu.");
    } finally {
      setAuditRunning(false);
    }
  }

  function handleOptionSelect(o: OptionCard, index: number) {
    void handleSend(`"${o.name}" seçeneğini (${index + 1}. seçenek) uygula. Bu yönde bir değişiklik önerisi hazırla.`);
  }

  const c = data?.counts ?? {};
  const score = data?.healthScore ?? 0;
  const statusTone = score >= 85 ? "İyi" : score >= 65 ? "Orta" : "Dikkat";
  const pendingCount = Number(c.pendingProposals ?? 0);
  const newMessages = Number(c.newMessages ?? 0);

  return (
    <div className="cc-scope admin-scope relative flex flex-col" style={{ minHeight: "calc(100vh - 120px)", background: "var(--admin-bg)" }}>
      <header
        className="sticky top-0 z-20 border-b"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
      >
        <div className="mx-auto max-w-[1000px] w-full px-4 md:px-6 py-3 flex items-center gap-3">
          <button onClick={() => setHistoryOpen(true)} className="cc-icon-btn" aria-label="Geçmiş görüşmeler" title="Geçmiş görüşmeler">
            <Icon name="history" className="text-[18px]" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] md:text-[16px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>
              Kurumsal Kontrol Merkezi
            </h1>
            <p className="text-[12px] truncate" style={{ color: "var(--admin-text-mute)" }}>
              Web sitenizde yapmak istediğinizi normal cümlelerle yazın.
            </p>
          </div>
          <button onClick={() => setStatusOpen((v) => !v)} className="cc-status-chip" aria-label="Site durumu" title="Site durumu">
            <span className={`cc-dot cc-dot-${score >= 85 ? "ok" : score >= 65 ? "warn" : "bad"}`} />
            <span className="hidden sm:inline">{statusTone}</span>
            {(pendingCount + newMessages) > 0 && (
              <span className="cc-badge">{pendingCount + newMessages}</span>
            )}
          </button>
          <button onClick={handleNewConversation} className="cc-icon-btn" aria-label="Yeni görüşme" title="Yeni görüşme">
            <Icon name="edit_square" className="text-[18px]" />
          </button>
          <div className="hidden md:block">
            <ModeToggle mode={mode} onChange={setMode} />
          </div>
        </div>

        {statusOpen && (
          <div className="mx-auto max-w-[1000px] w-full px-4 md:px-6 pb-3">
            <div className="rounded-xl border p-3 flex flex-wrap gap-3 text-[13px]" style={{ borderColor: "var(--admin-border)", background: "var(--admin-bg)" }}>
              <StatusItem icon="monitor_heart" label="Site Sağlığı" value={`%${score}`} onClick={handleAudit} action={auditRunning ? "Taranıyor…" : "Yeniden Tara"} />
              <StatusItem icon="approval" label="Bekleyen Değişiklik" value={pendingCount} onClick={() => onNavigate("seo")} action="Aç" />
              <StatusItem icon="mark_email_unread" label="Yeni Mesaj" value={newMessages} onClick={() => onNavigate("messages")} action="Aç" />
              <StatusItem icon="request_quote" label="Bekleyen Teklif" value={Number(c.pendingQuotes ?? 0)} onClick={() => onNavigate("quotes")} action="Aç" />
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1000px] w-full px-4 md:px-6 py-6 md:py-10">
            {!hasChat ? (
              <Welcome onPick={(p) => handleSend(p)} onMore={() => setMoreOpen(true)} sending={asst.sending} />
            ) : (
              <div className="space-y-6">
                {asst.messages.map((m) => {
                  const isUser = m.role === "user";
                  const proposal = m.proposal_id ? asst.proposals[m.proposal_id] : null;
                  const meta = (m.metadata ?? {}) as any;
                  const options: OptionCard[] | undefined = Array.isArray(meta.options) ? meta.options : undefined;
                  const followUps: string[] | undefined = Array.isArray(meta.follow_ups) ? meta.follow_ups : undefined;
                  const warnings: string[] | undefined = Array.isArray(meta.warnings) ? meta.warnings : undefined;
                  const clarify = meta.clarify && typeof meta.clarify === "object" ? meta.clarify : null;

                  if (isUser) {
                    return (
                      <div key={m.id} className="flex justify-end">
                        <div className="cc-user-bubble">{m.content}</div>
                      </div>
                    );
                  }
                  return (
                    <div key={m.id} className="flex gap-3">
                      <div className="cc-ai-mark" aria-hidden>
                        <Icon name="auto_awesome" className="text-[15px]" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-3">
                        <ResponseTypePill type={meta.response_type} confidence={meta.confidence} />
                        <div className="text-[15px] leading-relaxed" style={{ color: "var(--admin-text)" }}>
                          <RichText text={m.content} />
                        </div>
                        {warnings && <WarningsList items={warnings} />}
                        {options && <OptionsGrid options={options} onSelect={handleOptionSelect} />}
                        {clarify && clarify.question && (
                          <ClarifyBlock
                            clarify={{
                              question: String(clarify.question),
                              choices: Array.isArray(clarify.choices) && clarify.choices.length ? clarify.choices : ["Sen Öner"],
                            }}
                            onChoose={(cc) => handleSend(cc === "Sen Öner" ? "Sen en uygununu öner." : cc)}
                          />
                        )}
                        {followUps && <FollowUps items={followUps} onChoose={(f) => handleSend(f)} />}
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
                  <div className="flex gap-3 items-center">
                    <div className="cc-ai-mark cc-ai-mark-pulse" aria-hidden><Icon name="auto_awesome" className="text-[15px]" /></div>
                    <span className="text-[14px]" style={{ color: "var(--admin-text-mute)" }}>Düşünüyorum…</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {hasChat && (
          <div className="sticky bottom-0 z-10 border-t" style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
            <div className="mx-auto max-w-[1000px] w-full px-4 md:px-6 py-3">
              <Composer
                ref={inputRef}
                value={input}
                onChange={setInput}
                onSend={() => handleSend()}
                disabled={asst.sending}
                placeholder="Bir istek yazın… (Enter ile gönder, Shift+Enter satır sonu)"
              />
            </div>
          </div>
        )}
      </main>

      <Drawer open={historyOpen} onClose={() => setHistoryOpen(false)} title="Geçmiş Görüşmeler" side="left">
        <div className="p-3 border-b" style={{ borderColor: "var(--admin-border)" }}>
          <button onClick={handleNewConversation} className="admin-btn admin-btn-primary admin-btn-sm w-full justify-center">
            <Icon name="add" className="text-[16px]" /> Yeni Görüşme
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {asst.conversations.length === 0 && (
            <div className="p-6 text-[13px] text-center" style={{ color: "var(--admin-text-mute)" }}>
              Henüz görüşme yok. Yeni bir istekle başlayın.
            </div>
          )}
          {asst.conversations.map((cv) => (
            <div
              key={cv.id}
              onClick={() => { void asst.selectConversation(cv.id); setHistoryOpen(false); }}
              className={`group px-4 py-3 cursor-pointer border-b transition-colors ${cv.id === asst.activeId ? "bg-[color:var(--admin-yellow-soft)]" : "hover:bg-[color:var(--admin-bg)]"}`}
              style={{ borderColor: "var(--admin-border)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>{cv.title}</div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: "var(--admin-text-mute)" }}>{formatDate(cv.last_message_at)}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); void handleDeleteConversation(cv.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white"
                  aria-label="Görüşmeyi sil"
                >
                  <Icon name="delete" className="text-[15px]" style={{ color: "var(--admin-text-mute)" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Drawer>

      <Drawer open={moreOpen} onClose={() => setMoreOpen(false)} title="Diğer İşlemler" side="right">
        <div className="p-3 space-y-1.5">
          {[...SUGGESTIONS, ...MORE_ACTIONS].map((a) => (
            <button
              key={a.label}
              onClick={() => { setMoreOpen(false); void handleSend(a.prompt); }}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-[color:var(--admin-bg)]"
            >
              <div className="h-8 w-8 rounded-md grid place-items-center shrink-0" style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}>
                <Icon name={a.icon} className="text-[16px]" />
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold" style={{ color: "var(--admin-text)" }}>{a.label}</div>
              </div>
            </button>
          ))}
          {mode === "advanced" && (
            <>
              <div className="h-px my-2" style={{ background: "var(--admin-border)" }} />
              <button
                onClick={() => { setMoreOpen(false); onNavigate("seo"); }}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[color:var(--admin-bg)]"
              >
                <Icon name="fact_check" className="text-[18px]" style={{ color: "var(--admin-navy)" }} />
                <span className="text-[13.5px] font-semibold" style={{ color: "var(--admin-text)" }}>Değişiklik Geçmişi</span>
              </button>
              <button
                onClick={() => { void handleAudit(); }}
                disabled={auditRunning}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[color:var(--admin-bg)]"
              >
                <Icon name="health_and_safety" className="text-[18px]" style={{ color: "var(--admin-navy)" }} />
                <span className="text-[13.5px] font-semibold" style={{ color: "var(--admin-text)" }}>
                  {auditRunning ? "Site taranıyor…" : "Siteyi Şimdi Tara"}
                </span>
              </button>
            </>
          )}
        </div>
      </Drawer>

      <CcStyles />
    </div>
  );
}

function Welcome({
  onPick,
  onMore,
  sending,
}: {
  onPick: (prompt: string) => void;
  onMore: () => void;
  sending: boolean;
}) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);

  function submit() {
    const t = text.trim();
    if (!t) return;
    setText("");
    onPick(t);
  }

  return (
    <div className="pt-4 md:pt-10">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-[26px] md:text-[36px] font-bold leading-tight" style={{ color: "var(--admin-text)" }}>
          Bugün web sitenizde ne yapmak istersiniz?
        </h2>
        <p className="text-[14px] md:text-[15px] mt-3 max-w-[600px] mx-auto" style={{ color: "var(--admin-text-2)" }}>
          İsteğinizi kendi cümlelerinizle yazabilirsiniz. Yapay zekâ size seçenekler sunar, sonucu önceden gösterir ve yalnızca onayınızla uygular.
        </p>
      </div>

      <Composer
        ref={ref}
        value={text}
        onChange={setText}
        onSend={submit}
        disabled={sending}
        placeholder="Örneğin: Ana sayfayı daha sade yap, eksik ürün görsellerini bul veya yeni bir broşür hazırla..."
        big
      />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SUGGESTIONS.map((s) => (
          <button key={s.label} onClick={() => onPick(s.prompt)} className="cc-suggest">
            <div className="cc-suggest-icon">
              <Icon name={s.icon} className="text-[17px]" />
            </div>
            <span className="text-[14px] font-medium" style={{ color: "var(--admin-text)" }}>{s.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button onClick={onMore} className="text-[13px] font-medium underline underline-offset-4" style={{ color: "var(--admin-navy)" }}>
          Diğer İşlemleri Gör
        </button>
      </div>
    </div>
  );
}

function StatusItem({
  icon, label, value, onClick, action,
}: { icon: string; label: string; value: string | number; onClick: () => void; action: string }) {
  return (
    <div className="flex-1 min-w-[160px] flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg grid place-items-center shrink-0" style={{ background: "var(--admin-surface)", color: "var(--admin-navy)", border: "1px solid var(--admin-border)" }}>
        <Icon name={icon} className="text-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11.5px] uppercase tracking-wide font-semibold" style={{ color: "var(--admin-text-mute)" }}>{label}</div>
        <div className="text-[15px] font-bold leading-tight" style={{ color: "var(--admin-text)" }}>{value}</div>
      </div>
      <button onClick={onClick} className="admin-btn admin-btn-sm shrink-0">{action}</button>
    </div>
  );
}

function ModeToggle({ mode, onChange }: { mode: "easy" | "advanced"; onChange: (m: "easy" | "advanced") => void }) {
  return (
    <div
      role="group"
      aria-label="Kullanım modu"
      className="inline-flex rounded-lg overflow-hidden border"
      style={{ borderColor: "var(--admin-border)", background: "var(--admin-surface)" }}
    >
      {(["easy", "advanced"] as const).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            className="px-2.5 py-1 text-[11.5px] font-semibold"
            style={{
              background: active ? "var(--admin-navy)" : "transparent",
              color: active ? "#fff" : "var(--admin-text-2)",
            }}
          >
            {m === "easy" ? "Kolay" : "Gelişmiş"}
          </button>
        );
      })}
    </div>
  );
}

function Drawer({
  open, onClose, title, side, children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  side: "left" | "right";
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        className={`relative flex flex-col w-full sm:w-[360px] shadow-2xl ${side === "left" ? "mr-auto" : "ml-auto"}`}
        style={{ background: "var(--admin-surface)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--admin-border)" }}>
          <div className="text-[14px] font-semibold" style={{ color: "var(--admin-text)" }}>{title}</div>
          <button onClick={onClose} className="cc-icon-btn" aria-label="Kapat">
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

function CcStyles() {
  return (
    <style>{`
      .cc-scope { --cc-radius: 14px; }
      .cc-icon-btn {
        display: inline-flex; align-items: center; justify-content: center;
        height: 36px; width: 36px; border-radius: 10px;
        color: var(--admin-text-2);
        transition: background .15s ease, color .15s ease;
      }
      .cc-icon-btn:hover { background: var(--admin-bg); color: var(--admin-text); }
      .cc-status-chip {
        display: inline-flex; align-items: center; gap: 8px;
        height: 32px; padding: 0 10px; border-radius: 999px;
        border: 1px solid var(--admin-border); background: var(--admin-surface);
        color: var(--admin-text); font-size: 12.5px; font-weight: 600;
      }
      .cc-status-chip:hover { background: var(--admin-bg); }
      .cc-dot { height: 8px; width: 8px; border-radius: 999px; display: inline-block; }
      .cc-dot-ok { background: #059669; }
      .cc-dot-warn { background: #EA580C; }
      .cc-dot-bad { background: #DC2626; }
      .cc-badge {
        min-width: 18px; height: 18px; padding: 0 5px;
        display: inline-flex; align-items: center; justify-content: center;
        border-radius: 999px; font-size: 11px; font-weight: 700;
        background: var(--admin-navy); color: #fff;
      }
      .cc-user-bubble {
        max-width: 78%; background: var(--admin-navy); color: #fff;
        border-radius: 16px; border-top-right-radius: 6px;
        padding: 10px 14px; font-size: 14.5px; line-height: 1.5; white-space: pre-wrap;
      }
      .cc-ai-mark {
        height: 28px; width: 28px; border-radius: 999px;
        display: inline-flex; align-items: center; justify-content: center;
        background: var(--admin-yellow-soft); color: var(--admin-navy); flex-shrink: 0;
      }
      .cc-ai-mark-pulse { animation: cc-pulse 1.4s ease-in-out infinite; }
      @keyframes cc-pulse { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
      .cc-composer {
        border: 1px solid var(--admin-border); background: var(--admin-surface);
        border-radius: 16px; padding: 6px 6px 6px 14px;
        transition: border-color .15s ease, box-shadow .15s ease;
      }
      .cc-composer:focus-within {
        border-color: var(--admin-navy);
        box-shadow: 0 0 0 3px color-mix(in oklab, var(--admin-navy) 15%, transparent);
      }
      .cc-composer-big { padding: 10px 10px 10px 18px; border-radius: 20px; }
      .cc-composer-input {
        width: 100%; background: transparent; border: 0; outline: none; resize: none;
        font-size: 15px; line-height: 1.55; color: var(--admin-text);
        padding: 8px 0; min-height: 44px;
      }
      .cc-composer-input::placeholder { color: var(--admin-text-mute); }
      .cc-composer-big .cc-composer-input { font-size: 16px; min-height: 72px; }
      .cc-composer-actions {
        display: flex; align-items: center; justify-content: space-between;
        padding: 4px 4px 4px 0;
      }
      .cc-send-btn {
        height: 36px; width: 36px;
        display: inline-flex; align-items: center; justify-content: center;
        border-radius: 12px; background: var(--admin-navy); color: #fff;
        transition: opacity .15s ease, transform .15s ease;
      }
      .cc-send-btn:disabled { opacity: .35; cursor: not-allowed; }
      .cc-send-btn:not(:disabled):hover { transform: translateY(-1px); }
      .cc-suggest {
        display: flex; align-items: center; gap: 12px; text-align: left;
        padding: 12px 14px; border-radius: 12px;
        border: 1px solid var(--admin-border); background: var(--admin-surface);
        transition: background .15s ease, border-color .15s ease;
      }
      .cc-suggest:hover {
        background: var(--admin-bg);
        border-color: color-mix(in oklab, var(--admin-navy) 30%, var(--admin-border));
      }
      .cc-suggest-icon {
        height: 34px; width: 34px; border-radius: 10px;
        display: inline-flex; align-items: center; justify-content: center;
        background: var(--admin-yellow-soft); color: var(--admin-navy); flex-shrink: 0;
      }
      @media (max-width: 640px) { .cc-user-bubble { max-width: 88%; } }
    `}</style>
  );
}
