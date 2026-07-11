import { useCallback, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Icon } from "../../site-shell";
import type { AdminTab } from "../nav";
import { useUserMode } from "@/hooks/use-user-mode";
import {
  getControlCenterSnapshot,
  runSiteAudit,
  updateFindingStatus,
  listMyTasks,
  createTask,
  completeTask,
} from "@/lib/control-center.functions";

type Snapshot = {
  counts: Record<string, number>;
  healthScore: number;
  recentActivity: any[];
  preferences: any;
  pendingChanges: any[];
  recommendations: any[];
};

const SEVERITY_META: Record<string, { label: string; tone: string; icon: string }> = {
  acil: { label: "Acil", tone: "#DC2626", icon: "priority_high" },
  onemli: { label: "Önemli", tone: "#EA580C", icon: "warning" },
  iyilestirme: { label: "İyileştirme", tone: "#0EA5E9", icon: "auto_fix_high" },
  oneri: { label: "Öneri", tone: "#059669", icon: "lightbulb" },
};

const TASK_CARDS: {
  key: string;
  title: string;
  hint: string;
  icon: string;
  target: AdminTab;
  workflow?: "homepage" | "product" | "brochure" | "seo" | "mobile" | "spelling" | "images" | "messages" | "newpage" | "design";
}[] = [
  { key: "homepage", title: "Ana Sayfayı Düzenle", hint: "Adım adım ana sayfa bölümlerini iyileştirin.", icon: "home", target: "brochures", workflow: "homepage" },
  { key: "new-product", title: "Yeni Ürün Ekle", hint: "Katalog için yeni bir ürün oluşturun.", icon: "add_box", target: "products" },
  { key: "product-desc", title: "Ürün Açıklaması Hazırla", hint: "Yapay Zekâ ile açıklama taslağı üretin.", icon: "description", target: "aiAssistant", workflow: "product" },
  { key: "new-brochure", title: "Yeni Broşür Oluştur", hint: "Ana sayfa slider için yeni bir slayt hazırlayın.", icon: "view_carousel", target: "brochures", workflow: "brochure" },
  { key: "audit", title: "Siteyi Kontrol Et", hint: "Eksik görsel, SEO ve tutarlılık taraması çalıştırın.", icon: "health_and_safety", target: "dashboard" },
  { key: "seo", title: "SEO Eksiklerini Bul", hint: "Google'da görünen başlık ve açıklamaları iyileştirin.", icon: "trending_up", target: "aiAssistant", workflow: "seo" },
  { key: "mobile", title: "Mobil Görünümü Kontrol Et", hint: "Küçük ekranda taşan alanları ve sorunları bulun.", icon: "smartphone", target: "dashboard", workflow: "mobile" },
  { key: "spelling", title: "Yazım Hatalarını Düzelt", hint: "Site metinlerinde yazım/dilbilgisi taraması yapın.", icon: "spellcheck", target: "aiAssistant", workflow: "spelling" },
  { key: "images", title: "Eksik Görselleri Bul", hint: "Görseli olmayan ürün ve içerikleri listeleyin.", icon: "image_search", target: "products", workflow: "images" },
  { key: "messages", title: "Mesajları Özetle", hint: "Yeni iletişim mesajlarını özetleyip önceliklendirin.", icon: "mail", target: "messages", workflow: "messages" },
  { key: "new-page", title: "Yeni Sayfa Oluştur", hint: "Yeni bir blog yazısı veya sayfa taslağı hazırlayın.", icon: "post_add", target: "blog", workflow: "newpage" },
  { key: "design", title: "Tasarım Tutarlılığını Kontrol Et", hint: "Renk, tipografi ve buton tutarlılığını denetleyin.", icon: "palette", target: "aiAssistant", workflow: "design" },
];

const SUGGESTED_PROMPTS: string[] = [
  "Ana sayfayı daha modern göster",
  "Eksik ürün açıklamalarını listele",
  "SEO eksiklerini bul",
  "Mobilde taşan bölümleri bul",
];

// Sadeleştirilmiş modda gösterilecek 6 temel hızlı işlem
const EASY_TASK_KEYS = new Set([
  "homepage",
  "product-desc",
  "new-brochure",
  "audit",
  "seo",
  "mobile",
]);

const SITE_MAP: { key: string; label: string; icon: string; tab: AdminTab; hint: string }[] = [
  { key: "header", label: "Header", icon: "view_headline", tab: "settings", hint: "Menü, logo ve üst şerit." },
  { key: "home", label: "Ana Sayfa", icon: "home", tab: "brochures", hint: "Slider ve öne çıkan bölümler." },
  { key: "slider", label: "Broşür Slider", icon: "view_carousel", tab: "brochures", hint: "Ana sayfadaki slaytlar." },
  { key: "products", label: "Ürün Grupları", icon: "inventory_2", tab: "products", hint: "Kategoriler ve ürünler." },
  { key: "about", label: "Hakkımızda", icon: "info", tab: "settings", hint: "Kurumsal tanıtım metinleri." },
  { key: "services", label: "Hizmetler", icon: "handyman", tab: "services", hint: "Hizmet sayfaları." },
  { key: "brands", label: "Markalar", icon: "workspace_premium", tab: "brands", hint: "Yer alan markalar." },
  { key: "references", label: "Referanslar", icon: "star", tab: "references", hint: "Proje referansları." },
  { key: "blog", label: "Blog", icon: "article", tab: "blog", hint: "Yazılar." },
  { key: "contact", label: "İletişim", icon: "contact_phone", tab: "settings", hint: "Telefon, e-posta, adres." },
  { key: "footer", label: "Footer", icon: "table_rows", tab: "settings", hint: "Alt kısım ve iletişim." },
];

function useSnapshot() {
  const call = useServerFn(getControlCenterSnapshot);
  const [data, setData] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await call();
      setData(r as Snapshot);
    } catch (e: any) {
      setError(e?.message ?? "Yüklenemedi");
    } finally {
      setLoading(false);
    }
  }, [call]);
  useEffect(() => { void load(); }, [load]);
  return { data, loading, error, reload: load };
}

function useTasks() {
  const call = useServerFn(listMyTasks);
  const [items, setItems] = useState<any[]>([]);
  const load = useCallback(async () => {
    try {
      const r = await call();
      setItems(r as any[]);
    } catch {}
  }, [call]);
  useEffect(() => { void load(); }, [load]);
  return { items, reload: load };
}

export function ControlCenter({ onNavigate }: { onNavigate: (t: AdminTab) => void }) {
  const [mode, setMode] = useUserMode();
  const [command, setCommand] = useState("");
  const { data, loading, error, reload } = useSnapshot();
  const { items: tasks, reload: reloadTasks } = useTasks();
  const [auditRunning, setAuditRunning] = useState(false);
  const [workflow, setWorkflow] = useState<null | { kind: string; title: string }>(null);
  const runAudit = useServerFn(runSiteAudit);
  const updFinding = useServerFn(updateFindingStatus);
  const createT = useServerFn(createTask);
  const doneT = useServerFn(completeTask);

  const grouped = useMemo(() => {
    const g: Record<string, any[]> = { acil: [], onemli: [], iyilestirme: [], oneri: [] };
    for (const r of data?.recommendations ?? []) {
      const s = (r.severity as string) ?? "oneri";
      (g[s] ??= []).push(r);
    }
    return g;
  }, [data]);

  async function handleAudit() {
    setAuditRunning(true);
    try {
      const r: any = await runAudit();
      toast.success(`Site taraması tamamlandı: ${r.insertedCount} bulgu.`);
      await reload();
    } catch (e: any) {
      toast.error(e?.message ?? "Tarama başarısız oldu.");
    } finally {
      setAuditRunning(false);
    }
  }

  async function handleSendCommand() {
    const text = command.trim();
    if (!text) return;
    const params = new URLSearchParams({ tab: "aiAssistant", aiPrompt: text });
    setCommand("");
    window.location.assign(`/admin?${params.toString()}`);
  }

  async function handleFinding(id: string, status: "dismissed" | "snoozed" | "resolved") {
    try {
      await updFinding({ data: { id, status } });
      toast.success(status === "dismissed" ? "Öneri kapatıldı." : status === "snoozed" ? "Öneri 7 gün ertelendi." : "Öneri çözüldü olarak işaretlendi.");
      await reload();
    } catch (e: any) {
      toast.error(e?.message ?? "Güncellenemedi.");
    }
  }

  async function handleCompleteTask(id: string) {
    try {
      await doneT({ data: { id } });
      await reloadTasks();
    } catch (e: any) {
      toast.error(e?.message ?? "Güncellenemedi.");
    }
  }

  return (
    <div className="admin-scope flex flex-col gap-6 p-4 md:p-6 max-w-[1100px] mx-auto w-full">
      {/* Kompakt üst şerit */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0" style={{ color: "var(--admin-text-mute)" }}>
          <Icon name="auto_awesome" className="text-[16px]" />
          <span className="text-[11px] uppercase tracking-wider font-semibold truncate">Yapay Zekâ Kontrol Merkezi</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ModeToggle mode={mode} onChange={setMode} />
        </div>
      </div>

      {/* HERO — AI input ana odak */}
      <section className="flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: "var(--admin-text)" }}>
            Bugün ne yapmak istersiniz?
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--admin-text-2)" }}>
            Türkçe yazın, önce taslak hazırlansın. Siz onaylamadan hiçbir değişiklik yayına alınmaz.
          </p>
        </div>
        <div
          className="rounded-2xl border p-3 md:p-4 shadow-sm"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        >
          <textarea
            rows={3}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSendCommand();
              }
            }}
            placeholder="Örn: Ana sayfayı sadeleştir, ürün açıklamasını yeniden yaz, mobilde taşan yerleri bul…"
            className="admin-input w-full resize-none border-0 focus:ring-0 text-base"
            style={{ minHeight: 84, background: "transparent" }}
            aria-label="Yapay Zekâ komutu"
          />
          <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t" style={{ borderColor: "var(--admin-border)" }}>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setCommand(p)}
                  className="text-[12px] px-2.5 py-1 rounded-full border"
                  style={{ background: "var(--admin-yellow-soft)", borderColor: "var(--admin-yellow-border)", color: "var(--admin-navy)" }}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                className="admin-btn admin-btn-sm"
                onClick={() => onNavigate("aiHistory")}
                title="Geçmiş görüşmeler ve değişiklikler"
              >
                <Icon name="history" className="text-[16px]" />
                <span className="hidden sm:inline">Geçmiş</span>
              </button>
              <button className="admin-btn admin-btn-primary" onClick={handleSendCommand} disabled={!command.trim()}>
                <Icon name="send" className="text-[16px]" />
                Gönder
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hızlı işlemler — easy'de 6, gelişmişte tümü */}
      <section>
        <SectionHeader icon="rocket_launch" title="Hızlı işlemler" subtitle="Ne yapmak istediğinize karar veremediyseniz buradan başlayın." />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 mt-3">
          {TASK_CARDS.filter((c) => mode === "advanced" || EASY_TASK_KEYS.has(c.key)).map((c) => (
            <button
              key={c.key}
              onClick={() => {
                if (c.key === "audit" || c.key === "mobile") { void handleAudit(); return; }
                if (mode === "easy" && c.workflow) { setWorkflow({ kind: c.workflow, title: c.title }); return; }
                onNavigate(c.target);
              }}
              className="text-left rounded-xl border p-4 hover:shadow-sm transition-all"
              style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-10 w-10 rounded-lg grid place-items-center shrink-0"
                  style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}
                >
                  <Icon name={c.icon} className="text-[20px]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold" style={{ color: "var(--admin-text)" }}>{c.title}</div>
                  <div className="text-[12px] mt-0.5" style={{ color: "var(--admin-text-2)" }}>{c.hint}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Mini sağlık şeridi — her modda tek satır */}
      <MiniHealthStrip data={data} auditRunning={auditRunning} onAudit={handleAudit} onNavigate={onNavigate} />

      {/* Detaylar — easy'de kapalı, advanced'da açık accordion */}
      <Details summary="Site sağlığı ve öneriler" defaultOpen={mode === "advanced"}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section>
            <SectionHeader icon="monitor_heart" title="Site sağlık özeti" subtitle="Sitenizin genel durumuna hızlı bir bakış." />
            <HealthSummary loading={loading} error={error} data={data} onNavigate={onNavigate} />
          </section>
          <section>
            <SectionHeader
              icon="tips_and_updates"
              title="Yapay Zekâ önerileri"
              subtitle={mode === "easy" ? "Sitenizde iyileştirebileceğimiz noktalar." : "Site taramasından çıkan aksiyon önerileri."}
            />
            <Recommendations grouped={grouped} onHandle={handleFinding} onNavigate={onNavigate} />
          </section>
        </div>
      </Details>

      <Details summary="Bekleyen değişiklikler ve görevler" defaultOpen={false}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section>
            <SectionHeader icon="fact_check" title="Bekleyen AI değişiklikleri" subtitle="Onayınızı bekleyen taslak değişiklikler." />
            <PendingChanges items={data?.pendingChanges ?? []} onOpen={() => onNavigate("aiHistory")} />
          </section>
          <section>
            <SectionHeader icon="task_alt" title="Görev kuyruğu" subtitle="Sizin için not aldığımız işler." />
            <TaskQueue items={tasks} onComplete={handleCompleteTask} />
          </section>
        </div>
      </Details>

      {mode === "advanced" && (
        <Details summary="Site haritası" defaultOpen={false}>
          <SiteMapGrid onEdit={(t: AdminTab) => onNavigate(t)} onAsk={(label: string) => { setCommand(`${label} bölümünü düzenle`); }} />
        </Details>
      )}

      <Details summary="Son AI etkinlikleri" defaultOpen={false}>
        <RecentActivity items={data?.recentActivity ?? []} onOpen={() => onNavigate("aiHistory")} />
      </Details>

      {workflow && (
        <GuidedWorkflow
          kind={workflow.kind}
          title={workflow.title}
          onClose={() => setWorkflow(null)}
          onSubmit={async (summary: string) => {
            try {
              await createT({ data: { title_tr: summary, description_tr: `Rehberli akış: ${workflow.title}`, priority: "normal" } });
              toast.success("İsteğiniz alındı. Yapay Zekâ Asistanı hazırlıyor.");
              await reloadTasks();
              setWorkflow(null);
              onNavigate("aiAssistant");
            } catch (e: any) {
              toast.error(e?.message ?? "Kaydedilemedi.");
            }
          }}
        />
      )}
    </div>
  );
}

function Details({ summary, defaultOpen, children }: { summary: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details
      className="rounded-xl border overflow-hidden"
      style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary
        className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer select-none list-none"
        style={{ color: "var(--admin-text)" }}
      >
        <span className="text-[13px] font-semibold">{summary}</span>
        <Icon name="expand_more" className="text-[18px]" style={{ color: "var(--admin-text-mute)" }} />
      </summary>
      <div className="p-4 border-t" style={{ borderColor: "var(--admin-border)" }}>
        {children}
      </div>
    </details>
  );
}

function MiniHealthStrip({
  data, auditRunning, onAudit, onNavigate,
}: {
  data: Snapshot | null;
  auditRunning: boolean;
  onAudit: () => void;
  onNavigate: (t: AdminTab) => void;
}) {
  const c = data?.counts ?? {} as Record<string, number>;
  const score = data?.healthScore ?? 0;
  const scoreColor = score >= 85 ? "#059669" : score >= 65 ? "#EA580C" : "#DC2626";
  const chips: { label: string; value: number | string; icon: string; tab?: AdminTab; tone?: string }[] = [
    { label: "Sağlık", value: score, icon: "monitor_heart", tone: scoreColor },
    { label: "Bekleyen AI", value: c.pendingProposals ?? 0, icon: "approval", tab: "aiHistory" },
    { label: "Yeni mesaj", value: c.newMessages ?? 0, icon: "mark_email_unread", tab: "messages" },
    { label: "Bekleyen teklif", value: c.pendingQuotes ?? 0, icon: "request_quote", tab: "quotes" },
  ];
  return (
    <div
      className="rounded-xl border px-3 py-2 flex items-center gap-2 overflow-x-auto"
      style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
    >
      {chips.map((ch) => (
        <button
          key={ch.label}
          onClick={() => ch.tab && onNavigate(ch.tab)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] shrink-0"
          style={{ background: "var(--admin-surface-2)", color: "var(--admin-text)" }}
        >
          <Icon name={ch.icon} className="text-[14px]" style={{ color: ch.tone ?? "var(--admin-navy)" }} />
          <span className="font-semibold">{ch.value}</span>
          <span style={{ color: "var(--admin-text-2)" }}>{ch.label}</span>
        </button>
      ))}
      <button
        className="admin-btn admin-btn-xs ml-auto shrink-0"
        onClick={onAudit}
        disabled={auditRunning}
        title="Site içeriğini eksik görsel, SEO ve tutarlılık için tarar."
      >
        <Icon name="health_and_safety" className="text-[14px]" />
        {auditRunning ? "Taranıyor…" : "Siteyi Tara"}
      </button>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="h-9 w-9 rounded-lg grid place-items-center shrink-0"
        style={{ background: "var(--admin-navy)", color: "#fff" }}
      >
        <Icon name={icon} className="text-[18px]" />
      </div>
      <div>
        <h2 className="text-lg font-bold leading-tight" style={{ color: "var(--admin-text)" }}>{title}</h2>
        {subtitle && <p className="text-[13px]" style={{ color: "var(--admin-text-2)" }}>{subtitle}</p>}
      </div>
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
            className="px-3 py-1.5 text-[12px] font-semibold"
            style={{
              background: active ? "var(--admin-navy)" : "transparent",
              color: active ? "#fff" : "var(--admin-text-2)",
            }}
          >
            {m === "easy" ? "Kolay Kullanım" : "Gelişmiş"}
          </button>
        );
      })}
    </div>
  );
}

function HealthSummary({
  loading, error, data, onNavigate,
}: { loading: boolean; error: string | null; data: Snapshot | null; onNavigate: (t: AdminTab) => void }) {
  if (loading) {
    return <div className="mt-3 text-[13px]" style={{ color: "var(--admin-text-mute)" }}>Veriler yükleniyor…</div>;
  }
  if (error) {
    return <div className="mt-3 text-[13px]" style={{ color: "#DC2626" }}>Yüklenemedi: {error}</div>;
  }
  if (!data) return null;
  const c = data.counts;
  const score = data.healthScore;
  const scoreColor = score >= 85 ? "#059669" : score >= 65 ? "#EA580C" : "#DC2626";

  const tiles: { label: string; value: number; icon: string; tab: AdminTab; hint?: string }[] = [
    { label: "Yayındaki Ürünler", value: c.publishedProducts, icon: "inventory_2", tab: "products" },
    { label: "Taslak Ürünler", value: c.draftProducts, icon: "edit_note", tab: "products" },
    { label: "Eksik Ürün Görseli", value: c.missingProductImages, icon: "image_not_supported", tab: "products", hint: "Ürünler için ana görsel eksik." },
    { label: "Aktif Broşür", value: c.activeBrochures, icon: "view_carousel", tab: "brochures" },
    { label: "Yeni Mesajlar", value: c.newMessages, icon: "mark_email_unread", tab: "messages" },
    { label: "Bekleyen Teklif", value: c.pendingQuotes, icon: "request_quote", tab: "quotes" },
    { label: "Yeni Başvuru", value: c.jobApplications, icon: "assignment_ind", tab: "applications" },
    { label: "Blog Yazıları", value: c.blogPosts, icon: "article", tab: "blog" },
    { label: "Açık Öneri", value: c.openFindings, icon: "tips_and_updates", tab: "dashboard" },
    { label: "Onay Bekleyen AI", value: c.pendingProposals, icon: "approval", tab: "aiHistory" },
  ];

  return (
    <div className="mt-3 grid grid-cols-1 gap-3">
      <div
        className="rounded-xl border p-4 flex items-center gap-4"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
      >
        <div className="h-14 w-14 rounded-full grid place-items-center" style={{ background: scoreColor, color: "#fff" }}>
          <span className="text-lg font-bold">{score}</span>
        </div>
        <div>
          <div className="text-[14px] font-semibold" style={{ color: "var(--admin-text)" }}>Site sağlık puanı</div>
          <div className="text-[12px]" style={{ color: "var(--admin-text-2)" }}>
            {score >= 85 ? "Harika görünüyor." : score >= 65 ? "Bazı iyileştirmeler önerilir." : "Acil dikkat gerektiren konular var."}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
        {tiles.map((t) => (
          <button
            key={t.label}
            onClick={() => onNavigate(t.tab)}
            className="text-left rounded-lg border p-3 hover:shadow-sm"
            style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
            title={t.hint}
          >
            <div className="flex items-center gap-2" style={{ color: "var(--admin-text-mute)" }}>
              <Icon name={t.icon} className="text-[16px]" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">{t.label}</span>
            </div>
            <div className="text-2xl font-bold mt-1" style={{ color: "var(--admin-text)" }}>{t.value}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Recommendations({
  grouped, onHandle, onNavigate,
}: {
  grouped: Record<string, any[]>;
  onHandle: (id: string, status: "dismissed" | "snoozed" | "resolved") => void;
  onNavigate: (t: AdminTab) => void;
}) {
  const total = Object.values(grouped).reduce((a, b) => a + b.length, 0);
  if (total === 0) {
    return (
      <div
        className="mt-3 rounded-xl border p-6 text-center text-[13px]"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-text-2)" }}
      >
        <Icon name="check_circle" className="text-[28px]" style={{ color: "#059669" }} />
        <div className="mt-2 font-semibold" style={{ color: "var(--admin-text)" }}>Şu an öneri yok.</div>
        <div>Detaylı bir kontrol için "Siteyi Tara" düğmesini kullanın.</div>
      </div>
    );
  }
  return (
    <div className="mt-3 flex flex-col gap-2">
      {(["acil", "onemli", "iyilestirme", "oneri"] as const).flatMap((sev) =>
        (grouped[sev] ?? []).map((r) => {
          const meta = SEVERITY_META[sev];
          return (
            <div
              key={r.id}
              className="rounded-xl border p-3 flex items-start gap-3"
              style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
            >
              <div className="h-9 w-9 rounded-lg grid place-items-center shrink-0" style={{ background: `${meta.tone}20`, color: meta.tone }}>
                <Icon name={meta.icon} className="text-[18px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold" style={{ color: meta.tone }}>{meta.label}</span>
                  <span className="text-[13px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>{r.message_tr}</span>
                </div>
                {r.suggestion_tr && (
                  <div className="text-[12px] mt-1" style={{ color: "var(--admin-text-2)" }}>{r.suggestion_tr}</div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {r.target_table === "products" && (
                    <button className="admin-btn admin-btn-xs" onClick={() => onNavigate("products")}>
                      <Icon name="open_in_new" className="text-[14px]" />
                      Ürünü Aç
                    </button>
                  )}
                  {r.target_table === "blog_posts" && (
                    <button className="admin-btn admin-btn-xs" onClick={() => onNavigate("blog")}>
                      <Icon name="open_in_new" className="text-[14px]" />
                      Yazıyı Aç
                    </button>
                  )}
                  {r.target_table === "homepage_brochures" && (
                    <button className="admin-btn admin-btn-xs" onClick={() => onNavigate("brochures")}>
                      <Icon name="open_in_new" className="text-[14px]" />
                      Broşürü Aç
                    </button>
                  )}
                  {r.target_table === "faqs" && (
                    <button className="admin-btn admin-btn-xs" onClick={() => onNavigate("faqs")}>
                      <Icon name="open_in_new" className="text-[14px]" />
                      SSS'yi Aç
                    </button>
                  )}
                  {r.target_table === "site_settings" && (
                    <button className="admin-btn admin-btn-xs" onClick={() => onNavigate("settings")}>
                      <Icon name="open_in_new" className="text-[14px]" />
                      Ayarları Aç
                    </button>
                  )}
                  <button className="admin-btn admin-btn-xs" onClick={() => onHandle(r.id, "resolved")}>
                    <Icon name="check" className="text-[14px]" />
                    Çözüldü
                  </button>
                  <button className="admin-btn admin-btn-xs" onClick={() => onHandle(r.id, "snoozed")}>
                    <Icon name="snooze" className="text-[14px]" />
                    7 Gün Ertele
                  </button>
                  <button className="admin-btn admin-btn-xs" onClick={() => onHandle(r.id, "dismissed")}>
                    <Icon name="close" className="text-[14px]" />
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function PendingChanges({ items, onOpen }: { items: any[]; onOpen: () => void }) {
  if (items.length === 0) {
    return (
      <div
        className="mt-3 rounded-xl border p-6 text-center text-[13px]"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-text-2)" }}
      >
        Bekleyen yapay zekâ değişikliği bulunmuyor.
      </div>
    );
  }
  return (
    <div className="mt-3 flex flex-col gap-2">
      {items.map((p) => (
        <div
          key={p.id}
          className="rounded-xl border p-3 flex items-center gap-3"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        >
          <Icon name="draft" className="text-[18px]" style={{ color: "var(--admin-navy)" }} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate" style={{ color: "var(--admin-text)" }}>
              {p.request_summary || p.action_type}
            </div>
            <div className="text-[12px]" style={{ color: "var(--admin-text-2)" }}>
              Modül: {p.target_table} · Durum: {p.status}
            </div>
          </div>
          <button className="admin-btn admin-btn-xs" onClick={onOpen}>
            <Icon name="visibility" className="text-[14px]" />
            İncele
          </button>
        </div>
      ))}
    </div>
  );
}

function TaskQueue({ items, onComplete }: { items: any[]; onComplete: (id: string) => void }) {
  if (items.length === 0) {
    return (
      <div
        className="mt-3 rounded-xl border p-6 text-center text-[13px]"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-text-2)" }}
      >
        Şu an aktif göreviniz yok. Üstteki komut alanından yeni bir görev ekleyebilirsiniz.
      </div>
    );
  }
  return (
    <div className="mt-3 flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className="rounded-xl border p-3 flex items-start gap-3"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        >
          <Icon name="task_alt" className="text-[18px]" style={{ color: "var(--admin-navy)" }} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold" style={{ color: "var(--admin-text)" }}>{t.title_tr}</div>
            {t.description_tr && (
              <div className="text-[12px] mt-0.5" style={{ color: "var(--admin-text-2)" }}>{t.description_tr}</div>
            )}
          </div>
          <button className="admin-btn admin-btn-xs" onClick={() => onComplete(t.id)}>
            <Icon name="check" className="text-[14px]" />
            Tamamlandı
          </button>
        </div>
      ))}
    </div>
  );
}

function RecentActivity({ items, onOpen }: { items: any[]; onOpen: () => void }) {
  if (items.length === 0) {
    return (
      <div
        className="mt-3 rounded-xl border p-6 text-center text-[13px]"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-text-2)" }}
      >
        Henüz kayıtlı yapay zekâ etkinliği yok.
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-xl border overflow-hidden" style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}>
      {items.slice(0, 8).map((a) => (
        <div key={a.id} className="flex items-center gap-3 px-3 py-2 border-b last:border-b-0" style={{ borderColor: "var(--admin-border)" }}>
          <Icon name="history" className="text-[16px]" style={{ color: "var(--admin-text-mute)" }} />
          <div className="flex-1 min-w-0 text-[12px]" style={{ color: "var(--admin-text-2)" }}>
            <span className="font-semibold" style={{ color: "var(--admin-text)" }}>{a.action_type}</span>
            {" · "}{a.target_table}{" · "}{a.status}
          </div>
          <span className="text-[11px]" style={{ color: "var(--admin-text-mute)" }}>
            {new Date(a.created_at).toLocaleString("tr-TR")}
          </span>
        </div>
      ))}
      <button className="w-full text-[12px] py-2 font-semibold" onClick={onOpen} style={{ color: "var(--admin-navy)" }}>
        Tüm geçmişi aç →
      </button>
    </div>
  );
}

function IntelligenceBar({ data, onNavigate }: { data: Snapshot | null; onNavigate: (t: AdminTab) => void }) {
  const c = data?.counts ?? {};
  const score = data?.healthScore ?? 0;
  const scoreColor = score >= 85 ? "#059669" : score >= 65 ? "#EA580C" : "#DC2626";
  const chips: { label: string; value: number | string; icon: string; tab?: AdminTab; tone?: string }[] = [
    { label: "Site durumu", value: score >= 85 ? "İyi" : score >= 65 ? "Orta" : "Dikkat", icon: "circle", tone: scoreColor },
    { label: "Sağlık puanı", value: score, icon: "monitor_heart", tone: scoreColor },
    { label: "Bekleyen görev", value: (c.pendingProposals ?? 0), icon: "task_alt", tab: "myTasks" },
    { label: "Bekleyen AI değişiklik", value: (c.pendingProposals ?? 0), icon: "approval", tab: "aiHistory" },
    { label: "Yeni mesaj", value: (c.newMessages ?? 0), icon: "mark_email_unread", tab: "messages" },
    { label: "Bekleyen teklif", value: (c.pendingQuotes ?? 0), icon: "request_quote", tab: "quotes" },
  ];
  return (
    <div
      className="rounded-xl border px-3 py-2 flex items-center gap-2 overflow-x-auto"
      style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
    >
      {chips.map((ch) => (
        <button
          key={ch.label}
          onClick={() => ch.tab && onNavigate(ch.tab)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] shrink-0"
          style={{ background: "var(--admin-surface-2)", color: "var(--admin-text)" }}
          title={ch.label}
        >
          <Icon name={ch.icon} className="text-[14px]" style={{ color: ch.tone ?? "var(--admin-navy)" }} />
          <span className="font-semibold">{ch.value}</span>
          <span style={{ color: "var(--admin-text-2)" }}>{ch.label}</span>
        </button>
      ))}
      <div className="ml-auto flex items-center gap-1">
        <button className="admin-btn admin-btn-xs" onClick={() => onNavigate("notifications" as AdminTab)} title="Bildirimler">
          <Icon name="notifications" className="text-[14px]" />
        </button>
        <button
          className="admin-btn admin-btn-xs"
          title="Yardım: Bu sayfada sitenizin sağlık durumu, öneriler ve hızlı işlemler yer alır."
        >
          <Icon name="help" className="text-[14px]" />
        </button>
      </div>
    </div>
  );
}

function SiteMapGrid({ onEdit, onAsk }: { onEdit: (t: AdminTab) => void; onAsk: (label: string) => void }) {
  return (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
      {SITE_MAP.map((s) => (
        <div
          key={s.key}
          className="rounded-xl border p-3 flex items-start gap-3"
          style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        >
          <div
            className="h-9 w-9 rounded-lg grid place-items-center shrink-0"
            style={{ background: "var(--admin-navy)", color: "#fff" }}
          >
            <Icon name={s.icon} className="text-[18px]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold" style={{ color: "var(--admin-text)" }}>{s.label}</div>
            <div className="text-[12px]" style={{ color: "var(--admin-text-2)" }}>{s.hint}</div>
            <div className="flex gap-1.5 mt-2">
              <button className="admin-btn admin-btn-xs" onClick={() => onEdit(s.tab)}>
                <Icon name="edit" className="text-[14px]" />
                Düzenle
              </button>
              <button className="admin-btn admin-btn-xs" onClick={() => onAsk(s.label)}>
                <Icon name="auto_awesome" className="text-[14px]" />
                AI'ye Sor
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const WORKFLOW_STEPS: Record<string, { question: string; options: { key: string; label: string }[] }[]> = {
  homepage: [
    {
      question: "Ana sayfada hangi alanı değiştirmek istiyorsunuz?",
      options: [
        { key: "hero", label: "Üst Tanıtım Alanı" },
        { key: "slider", label: "Broşür Slider" },
        { key: "groups", label: "Ürün Grupları" },
        { key: "about", label: "Hakkımızda" },
        { key: "services", label: "Hizmetler" },
        { key: "brands", label: "Markalar" },
        { key: "contact", label: "İletişim Alanı" },
        { key: "auto", label: "Emin Değilim, Siteyi İncele" },
      ],
    },
    {
      question: "Nasıl görünmesini istersiniz?",
      options: [
        { key: "sade", label: "Daha Sade" },
        { key: "dikkat", label: "Daha Dikkat Çekici" },
        { key: "kurumsal", label: "Daha Kurumsal" },
        { key: "modern", label: "Daha Modern" },
        { key: "okunur", label: "Daha Kolay Okunur" },
        { key: "koru", label: "Mevcut Tasarımı Koru" },
      ],
    },
  ],
  product: [
    { question: "Hangi tür ürün açıklaması hazırlanacak?", options: [
      { key: "kisa", label: "Kısa (satır arası)" }, { key: "detay", label: "Detaylı (teknik)" }, { key: "seo", label: "SEO odaklı" },
    ] },
    { question: "Dil tonu?", options: [
      { key: "kurumsal", label: "Kurumsal" }, { key: "samimi", label: "Samimi" }, { key: "teknik", label: "Teknik" },
    ] },
  ],
  brochure: [
    { question: "Broşür temasını seçin", options: [
      { key: "kampanya", label: "Kampanya" }, { key: "yeni", label: "Yeni Ürün" }, { key: "marka", label: "Marka Öne Çıkarma" },
    ] },
  ],
  seo: [
    { question: "SEO taraması nerede çalışsın?", options: [
      { key: "urunler", label: "Ürünler" }, { key: "blog", label: "Blog" }, { key: "tumu", label: "Tüm site" },
    ] },
  ],
  mobile: [{ question: "Mobil taramayı başlatalım mı?", options: [{ key: "evet", label: "Evet, taramayı başlat" }] }],
  spelling: [{ question: "Yazım kontrolü hangi alanda?", options: [
    { key: "urunler", label: "Ürün metinleri" }, { key: "blog", label: "Blog yazıları" }, { key: "tumu", label: "Tüm site" },
  ] }],
  images: [{ question: "Eksik görsel taraması hangi alanda?", options: [
    { key: "urunler", label: "Ürünler" }, { key: "blog", label: "Blog" }, { key: "brosur", label: "Broşürler" },
  ] }],
  messages: [{ question: "Mesaj özeti nasıl olsun?", options: [
    { key: "kisa", label: "Kısa özet" }, { key: "oncelikli", label: "Öncelikli olanlar" }, { key: "yanit", label: "Yanıt önerisi" },
  ] }],
  newpage: [{ question: "Ne tür bir sayfa hazırlanacak?", options: [
    { key: "blog", label: "Blog yazısı" }, { key: "hizmet", label: "Hizmet sayfası" }, { key: "kampanya", label: "Kampanya sayfası" },
  ] }],
  design: [{ question: "Hangi tasarım denetimi?", options: [
    { key: "renk", label: "Renk tutarlılığı" }, { key: "tipografi", label: "Tipografi" }, { key: "buton", label: "Butonlar" },
  ] }],
};

function GuidedWorkflow({
  kind, title, onClose, onSubmit,
}: { kind: string; title: string; onClose: () => void; onSubmit: (summary: string) => void }) {
  const steps = WORKFLOW_STEPS[kind] ?? [];
  const [answers, setAnswers] = useState<string[]>([]);
  const stepIndex = answers.length;
  const done = stepIndex >= steps.length;

  function pick(label: string) {
    setAnswers((prev) => [...prev, label]);
  }

  function submit() {
    const summary = `${title}: ${answers.join(" → ")}`;
    onSubmit(summary);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,24,44,0.55)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border p-5"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[12px] uppercase tracking-wider font-semibold" style={{ color: "var(--admin-text-mute)" }}>
              Rehberli Akış
            </div>
            <h3 className="text-lg font-bold" style={{ color: "var(--admin-text)" }}>{title}</h3>
          </div>
          <button className="admin-btn admin-btn-xs" onClick={onClose} aria-label="Kapat">
            <Icon name="close" className="text-[14px]" />
          </button>
        </div>

        {!done ? (
          <div className="mt-4">
            <div className="text-[13px] font-semibold" style={{ color: "var(--admin-text)" }}>
              {steps[stepIndex].question}
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {steps[stepIndex].options.map((o) => (
                <button
                  key={o.key}
                  onClick={() => pick(o.label)}
                  className="text-left rounded-lg border p-3 hover:shadow-sm"
                  style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)", color: "var(--admin-text)" }}
                >
                  {o.label}
                </button>
              ))}
            </div>
            <div className="mt-3 text-[12px]" style={{ color: "var(--admin-text-mute)" }}>
              {stepIndex + 1} / {steps.length}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="text-[13px]" style={{ color: "var(--admin-text)" }}>
              Seçimleriniz özetlendi. Yapay Zekâ Asistanı bir taslak hazırlayacak; siz onaylamadan yayınlanmaz.
            </div>
            <div
              className="mt-2 rounded-lg border p-3 text-[13px]"
              style={{ background: "var(--admin-yellow-soft)", borderColor: "var(--admin-yellow-border)", color: "var(--admin-navy)" }}
            >
              {title}: {answers.join(" → ")}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="admin-btn admin-btn-sm" onClick={() => setAnswers([])}>Baştan Başla</button>
              <button className="admin-btn admin-btn-sm admin-btn-primary" onClick={submit}>
                <Icon name="send" className="text-[14px]" />
                Yapay Zekâ'ya Gönder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}