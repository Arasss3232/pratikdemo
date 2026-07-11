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
  "En son gelen mesajları özetle",
  "SEO eksiklerini bul",
  "Mobil ekranda taşan bölümleri bul",
  "Broşür sliderına yeni bir slayt hazırla",
];

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
    try {
      await createT({ data: { title_tr: text, description_tr: "Yapay Zekâ asistanında ele alınacak istek.", priority: "normal" } });
      toast.success("İsteğiniz Görev Kuyruğuna eklendi. AI Asistan ekranında ele alabilirsiniz.");
      setCommand("");
      await reloadTasks();
    } catch (e: any) {
      toast.error(e?.message ?? "Kaydedilemedi.");
    }
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
    <div className="admin-scope flex flex-col gap-6 p-4 md:p-6">
      {/* Üst şerit */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2" style={{ color: "var(--admin-text-mute)" }}>
            <Icon name="auto_awesome" className="text-[18px]" />
            <span className="text-[12px] uppercase tracking-wider font-semibold">Yapay Zekâ Kontrol Merkezi</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-1" style={{ color: "var(--admin-text)" }}>
            Bugün web sitenizde ne yapmak istersiniz?
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--admin-text-2)" }}>
            Sitenizin tamamını buradan yönetin. Yapay Zekâ her değişikliği önce taslak olarak hazırlar; siz onaylamadan yayınlanmaz.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle mode={mode} onChange={setMode} />
          <button
            className="admin-btn admin-btn-sm"
            onClick={handleAudit}
            disabled={auditRunning}
            title="Site içeriğini eksik görsel, SEO ve tutarlılık için tarar."
          >
            <Icon name="health_and_safety" className="text-[16px]" />
            {auditRunning ? "Taranıyor…" : "Siteyi Tara"}
          </button>
        </div>
      </div>

      {/* Zekâ şeridi */}
      <IntelligenceBar data={data} onNavigate={onNavigate} />

      {/* Akıllı komut alanı */}
      <section
        className="rounded-2xl p-4 md:p-5 border"
        style={{ background: "var(--admin-surface)", borderColor: "var(--admin-border)" }}
      >
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold" style={{ color: "var(--admin-text)" }}>
            Yapay Zekâ Asistanına ne yapmak istediğinizi yazın
          </span>
          <div className="flex flex-col md:flex-row gap-2">
            <textarea
              rows={2}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Ana sayfayı düzenle, yeni ürün ekle, eksikleri bul veya yapmak istediğiniz işlemi yazın..."
              className="admin-input flex-1 resize-y"
              style={{ minHeight: 60 }}
            />
            <div className="flex md:flex-col gap-2">
              <button className="admin-btn admin-btn-primary" onClick={handleSendCommand} disabled={!command.trim()}>
                <Icon name="send" className="text-[16px]" />
                Gönder
              </button>
              <button className="admin-btn admin-btn-sm" onClick={() => setCommand("")} disabled={!command} title="Metni temizle">
                <Icon name="close" className="text-[16px]" />
                Temizle
              </button>
              <button className="admin-btn admin-btn-sm" onClick={() => onNavigate("aiAssistant")}>
                <Icon name="chat" className="text-[16px]" />
                Asistanı Aç
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
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
          {mode === "easy" && (
            <span className="text-[12px]" style={{ color: "var(--admin-text-mute)" }}>
              İpucu: Doğal Türkçe kullanabilirsiniz. En güvenli seçeneği öneririz ve tüm değişiklikler onayınıza sunulur.
            </span>
          )}
        </label>
      </section>

      {/* Görev kartları */}
      <section>
        <SectionHeader icon="rocket_launch" title="Hızlı işlemler" subtitle="En sık yapılan işlere tek tıkla başlayın." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-3">
          {TASK_CARDS.map((c) => (
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
                <div>
                  <div className="text-[14px] font-semibold" style={{ color: "var(--admin-text)" }}>{c.title}</div>
                  <div className="text-[12px] mt-0.5" style={{ color: "var(--admin-text-2)" }}>{c.hint}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Site Haritası */}
      <section>
        <SectionHeader icon="map" title="Site haritası" subtitle="Bir bölüme tıklayın: doğrudan düzenleyin veya Yapay Zekâ'ya sorun." />
        <SiteMap onEdit={(t) => onNavigate(t)} onAsk={(label) => { setCommand(`${label} bölümünü düzenle`); }} />
      </section>

      {/* İki kolonlu: sağlık + öneriler */}
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

      {workflow && (
        <GuidedWorkflow
          kind={workflow.kind}
          title={workflow.title}
          onClose={() => setWorkflow(null)}
          onSubmit={async (summary) => {
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

      {/* Bekleyen değişiklikler + görevler */}
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

      {/* Son etkinlik */}
      <section>
        <SectionHeader icon="history" title="Son AI etkinlikleri" subtitle="Yapay Zekâ'nın son işlemleri." />
        <RecentActivity items={data?.recentActivity ?? []} onOpen={() => onNavigate("aiHistory")} />
      </section>
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