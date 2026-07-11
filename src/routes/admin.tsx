import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Icon } from "../components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { GenericCrud, type CrudField, type CrudColumn } from "../components/admin/GenericCrud";
import { SiteSettingsForm } from "../components/admin/SiteSettingsForm";
import { AdminShell } from "../components/admin/AdminShell";
import { Dashboard } from "../components/admin/Dashboard";
import { PageHeader } from "../components/admin/PageHeader";
import { EmptyState } from "../components/admin/EmptyState";
import { ConfirmDialogHost, confirmDialog } from "../components/admin/ConfirmDialog";
import type { AdminTab } from "../components/admin/nav";

const TAB_KEYS: AdminTab[] = [
  "dashboard","settings","products","services","references","brands",
  "certificates","team","testimonials","faqs","blog","blogcats","jobs",
  "applications","messages","quotes","users",
];

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Paneli — Pratik Endüstriyel" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    tab: (TAB_KEYS.includes(s.tab as AdminTab) ? s.tab : "dashboard") as AdminTab,
  }),
  component: AdminPage,
});

type Tab = AdminTab;

type QuoteRequest = {
  id: string;
  contact_name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  items: unknown;
  status: string;
  created_at: string;
};

type UserRoleRow = {
  id: string;
  user_id: string;
  role: "admin" | "user";
  created_at: string;
};

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { tab } = Route.useSearch();

  function setTab(t: Tab) {
    navigate({ to: "/admin", search: { tab: t } });
  }

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/giris" });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div
        className="admin-scope min-h-screen grid place-items-center"
        style={{ background: "var(--admin-bg)", color: "var(--admin-text-2)" }}
      >
        <div className="flex items-center gap-3 text-sm">
          <span
            className="h-5 w-5 rounded-full border-2 animate-spin"
            style={{ borderColor: "var(--admin-navy)", borderTopColor: "transparent" }}
          />
          Yönetim paneli yükleniyor…
        </div>
      </div>
    );
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div
        className="admin-scope min-h-screen grid place-items-center p-8 text-center"
        style={{ background: "var(--admin-bg)" }}
      >
        <div
          className="max-w-md w-full flex flex-col gap-4 items-center rounded-2xl p-8 shadow-sm"
          style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
        >
          <div
            className="h-14 w-14 rounded-full grid place-items-center"
            style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}
          >
            <Icon name="lock" className="text-[28px]" />
          </div>
          <p className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>
            Yetkisiz erişim
          </p>
          <p className="text-sm" style={{ color: "var(--admin-text-2)" }}>
            Bu sayfayı görüntülemek için yönetici yetkiniz olmalı. Yetki için sistem sorumlunuzla iletişime geçin.
          </p>
          <Link to="/" className="admin-btn admin-btn-primary admin-btn-sm">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    );
  }

  function handleQuickAdd(t: AdminTab) {
    setTab(t);
    // Give tab time to mount, then dispatch a "create" event that tabs can listen to.
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("admin:quick-add", { detail: { tab: t } }));
    }, 50);
  }

  return (
    <>
      <AdminShell
        tab={tab}
        onTabChange={setTab}
        userEmail={user.email ?? ""}
        onQuickAdd={handleQuickAdd}
      >
        {tab !== "dashboard" && <PageHeader tab={tab} />}
        {tab === "dashboard" && <Dashboard onNavigate={setTab} />}
        {tab === "settings" && <SiteSettingsForm />}
        {tab === "products" && <ProductsTab />}
        {tab === "quotes" && <QuotesTab />}
        {tab === "users" && <UsersTab currentUserId={user.id} />}
        {tab === "services" && <ServicesTab />}
        {tab === "references" && <ReferencesTab />}
        {tab === "brands" && <BrandsTab />}
        {tab === "certificates" && <CertificatesTab />}
        {tab === "team" && <TeamTab />}
        {tab === "testimonials" && <TestimonialsTab />}
        {tab === "faqs" && <FaqsTab />}
        {tab === "blogcats" && <BlogCategoriesTab />}
        {tab === "blog" && <BlogPostsTab />}
        {tab === "jobs" && <JobsTab />}
        {tab === "applications" && <ApplicationsTab />}
        {tab === "messages" && <MessagesTab />}
      </AdminShell>
      <ConfirmDialogHost />
    </>
  );
}

/* ================= Products ================= */

function ProductsTab() {
  return (
    <GenericCrud
      table="products"
      quickAddKey="products"
      title="Ürünler"
      description="Ürün kataloğunuz. Sitede görünen tüm ürünleri buradan yönetin."
      fields={[
        { name: "sku", label: "Ürün Kodu (SKU)", required: true, help: "Örn: PRT-2024-001" },
        { name: "name", label: "Ürün Adı", required: true },
        { name: "brand", label: "Marka", required: true },
        { name: "category", label: "Kategori", required: true, help: "Örn: elektrikli-el-aletleri" },
        { name: "image_url", label: "Kapak Görseli (URL)", type: "url" },
        { name: "description", label: "Kısa Açıklama", type: "textarea" },
        { name: "price", label: "Fiyat (₺)", type: "number", help: "Boş bırakırsanız 'Fiyat için teklif alın' gösterilir" },
        { name: "is_active", label: "Sitede yayında göster", type: "checkbox" },
      ]}
      columns={[
        { key: "sku", label: "Kod", render: (r) => (
          <span className="font-mono text-[12px]" style={{ color: "var(--admin-text-2)" }}>
            {String(r.sku ?? "—")}
          </span>
        ) },
        { key: "name", label: "Ürün Adı", render: (r) => (
          <span className="font-medium">{String(r.name ?? "—")}</span>
        ) },
        { key: "brand", label: "Marka" },
        { key: "category", label: "Kategori" },
        { key: "price", label: "Fiyat", render: (r) =>
          r.price != null ? `₺${Number(r.price).toLocaleString("tr-TR")}` : "—",
        },
        { key: "is_active", label: "Durum", render: (r) => (
          <StatusBadge tone={r.is_active ? "success" : "neutral"}>
            {r.is_active ? "Yayında" : "Gizli"}
          </StatusBadge>
        ) },
      ]}
    />
  );
}

/* ================= Quotes (inbox) ================= */

const QUOTE_STATUSES = [
  { value: "new", label: "Yeni", tone: "accent" as const },
  { value: "in_progress", label: "İşleme Alındı", tone: "warning" as const },
  { value: "completed", label: "Tamamlandı", tone: "success" as const },
  { value: "cancelled", label: "İptal", tone: "danger" as const },
];

function QuotesTab() {
  const [items, setItems] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setItems((data as QuoteRequest[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
    if (error) {
      toast.error("Durum güncellenemedi", { description: error.message });
    } else {
      toast.success("Durum güncellendi");
      refresh();
    }
  }

  async function handleDelete(id: string) {
    const ok = await confirmDialog({
      title: "Bu teklif talebini silmek istediğinize emin misiniz?",
      description: "Bu işlem geri alınamaz.",
      confirmLabel: "Evet, sil",
      destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("quote_requests").delete().eq("id", id);
    if (error) toast.error("Silinemedi", { description: error.message });
    else { toast.success("Teklif talebi silindi"); refresh(); }
  }

  const filtered = items.filter((q) => {
    if (filter !== "all" && q.status !== filter) return false;
    if (!query.trim()) return true;
    const t = query.trim().toLowerCase();
    return [q.contact_name, q.company, q.email, q.phone, q.message]
      .some((v) => (v ?? "").toString().toLowerCase().includes(t));
  });

  const counts = QUOTE_STATUSES.reduce<Record<string, number>>((acc, s) => {
    acc[s.value] = items.filter((i) => i.status === s.value).length;
    return acc;
  }, { all: items.length });

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="admin-card p-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} count={counts.all}>
            Tümü
          </FilterChip>
          {QUOTE_STATUSES.map((s) => (
            <FilterChip
              key={s.value}
              active={filter === s.value}
              onClick={() => setFilter(s.value)}
              count={counts[s.value] ?? 0}
              tone={s.tone}
            >
              {s.label}
            </FilterChip>
          ))}
        </div>
        <div
          className="flex items-center gap-2 h-10 px-3 rounded-xl sm:w-72"
          style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)" }}
        >
          <Icon name="search" className="text-[18px]" style={{ color: "var(--admin-text-mute)" }} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="İsim, e-posta, firma ara…"
            className="bg-transparent outline-none text-sm flex-1 min-w-0"
            style={{ color: "var(--admin-text)" }}
          />
        </div>
      </div>

      {error && (
        <div
          className="rounded-xl p-3 text-sm"
          style={{ background: "var(--admin-danger-soft)", color: "var(--admin-danger)" }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-card p-5 flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-skel h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={items.length === 0 ? "mail" : "search_off"}
          title={items.length === 0 ? "Henüz teklif talebi yok" : "Sonuç bulunamadı"}
          description={items.length === 0
            ? "Web sitesinden gelen teklif talepleri burada listelenir."
            : "Farklı bir filtre veya anahtar kelime deneyin."}
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((q) => {
            const itemsList = Array.isArray(q.items)
              ? (q.items as Array<{ name?: string; sku?: string; quantity?: number }>)
              : [];
            const initials = (q.contact_name || "?")
              .split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
            const statusMeta = QUOTE_STATUSES.find((s) => s.value === q.status);
            return (
              <article key={q.id} className="admin-card p-4 sm:p-5 flex flex-col gap-3">
                <header className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div
                    className="h-11 w-11 rounded-xl grid place-items-center font-semibold text-[15px] shrink-0"
                    style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <p className="font-semibold text-[15px]" style={{ color: "var(--admin-text)" }}>
                        {q.contact_name}
                      </p>
                      {q.company && (
                        <span className="text-[13px]" style={{ color: "var(--admin-text-2)" }}>
                          · {q.company}
                        </span>
                      )}
                      {statusMeta && (
                        <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
                      )}
                    </div>
                    <p className="text-[13px] mt-0.5 flex flex-wrap gap-x-3" style={{ color: "var(--admin-text-2)" }}>
                      <a href={`mailto:${q.email}`} className="hover:underline">{q.email}</a>
                      {q.phone && <a href={`tel:${q.phone}`} className="hover:underline">{q.phone}</a>}
                      <span>{new Date(q.created_at).toLocaleString("tr-TR")}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={q.status}
                      onChange={(e) => updateStatus(q.id, e.target.value)}
                      className="admin-input h-9 text-[13px]"
                      style={{ padding: "0 30px 0 10px" }}
                      aria-label="Durum"
                    >
                      {QUOTE_STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="admin-btn admin-btn-ghost admin-btn-sm admin-btn-icon"
                      style={{ color: "var(--admin-danger)" }}
                      aria-label="Sil"
                      title="Sil"
                    >
                      <Icon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </header>
                {q.message && (
                  <p
                    className="text-[14px] p-3 rounded-lg"
                    style={{ background: "var(--admin-surface-2)", color: "var(--admin-text)" }}
                  >
                    {q.message}
                  </p>
                )}
                {itemsList.length > 0 && (
                  <div>
                    <p
                      className="text-[11px] uppercase tracking-wider font-semibold mb-1.5"
                      style={{ color: "var(--admin-text-mute)" }}
                    >
                      Talep edilen ürünler ({itemsList.length})
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {itemsList.map((it, i) => (
                        <li
                          key={i}
                          className="text-[12.5px] px-2.5 py-1 rounded-md"
                          style={{
                            background: "var(--admin-navy-soft)",
                            color: "var(--admin-navy)",
                          }}
                        >
                          {it.name ?? it.sku ?? "Ürün"} × {it.quantity ?? 1}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================= Users ================= */

function UsersTab({ currentUserId }: { currentUserId: string }) {
  const [roles, setRoles] = useState<UserRoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setRoles((data as UserRoleRow[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  async function makeAdmin(userId: string) {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) toast.error("Yetki verilemedi", { description: error.message });
    else { toast.success("Kullanıcı yönetici yapıldı"); refresh(); }
  }
  async function removeRole(id: string) {
    const ok = await confirmDialog({
      title: "Bu yetkiyi kaldırmak istediğinize emin misiniz?",
      description: "Kullanıcı bu yetkinin sağladığı erişimi kaybeder.",
      confirmLabel: "Kaldır",
      destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) toast.error("Kaldırılamadı", { description: error.message });
    else { toast.success("Yetki kaldırıldı"); refresh(); }
  }

  const grouped = new Map<string, UserRoleRow[]>();
  for (const r of roles) {
    const list = grouped.get(r.user_id) ?? [];
    list.push(r);
    grouped.set(r.user_id, list);
  }
  const entries = Array.from(grouped.entries());

  return (
    <div className="flex flex-col gap-4">
      <div
        className="admin-card p-4 flex items-start gap-3"
        style={{ background: "var(--admin-yellow-soft)", borderColor: "var(--admin-yellow-border)" }}
      >
        <span
          className="h-9 w-9 rounded-lg grid place-items-center shrink-0"
          style={{ background: "var(--admin-yellow)", color: "var(--admin-navy)" }}
        >
          <Icon name="info" className="text-[18px]" />
        </span>
        <p className="text-[13.5px]" style={{ color: "var(--admin-navy)" }}>
          Yeni bir kullanıcıyı yönetici yapmak için önce o kişinin{" "}
          <Link to="/giris" className="underline font-semibold">/giris</Link>{" "}
          üzerinden kayıt olması gerekir. Ardından listede User ID'sini görüp{" "}
          <strong>Yönetici Yap</strong> butonunu kullanın.
        </p>
      </div>

      {error && (
        <div className="rounded-xl p-3 text-sm" style={{ background: "var(--admin-danger-soft)", color: "var(--admin-danger)" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-card p-5 flex flex-col gap-3">
          {[...Array(3)].map((_, i) => <div key={i} className="admin-skel h-12" />)}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState icon="group" title="Henüz kullanıcı yok" description="Kayıt olan kullanıcılar burada görünür." />
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[14px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th
                    className="text-left px-5 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold"
                    style={{ color: "var(--admin-text-2)", background: "var(--admin-surface-2)", borderBottom: "1px solid var(--admin-border)" }}
                  >
                    Kullanıcı
                  </th>
                  <th
                    className="text-left px-5 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold"
                    style={{ color: "var(--admin-text-2)", background: "var(--admin-surface-2)", borderBottom: "1px solid var(--admin-border)" }}
                  >
                    Yetkiler
                  </th>
                  <th
                    className="text-right px-5 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold"
                    style={{ color: "var(--admin-text-2)", background: "var(--admin-surface-2)", borderBottom: "1px solid var(--admin-border)" }}
                  >
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map(([uid, rs], i) => {
                  const isAdminRow = rs.some((r) => r.role === "admin");
                  return (
                    <tr key={uid}>
                      <td className="px-5 py-4" style={{ borderTop: i === 0 ? 0 : "1px solid var(--admin-border)" }}>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-[12px] px-2 py-1 rounded"
                            style={{ background: "var(--admin-surface-2)", color: "var(--admin-text)" }}
                          >
                            {uid.slice(0, 8)}…{uid.slice(-4)}
                          </span>
                          {uid === currentUserId && (
                            <StatusBadge tone="accent">Siz</StatusBadge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4" style={{ borderTop: i === 0 ? 0 : "1px solid var(--admin-border)" }}>
                        <div className="flex flex-wrap gap-1.5">
                          {rs.map((r) => (
                            <span
                              key={r.id}
                              className="inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1 rounded-full text-[12px] font-medium"
                              style={{
                                background: r.role === "admin" ? "var(--admin-navy-soft)" : "var(--admin-surface-2)",
                                color: r.role === "admin" ? "var(--admin-navy)" : "var(--admin-text-2)",
                                border: "1px solid var(--admin-border)",
                              }}
                            >
                              {r.role === "admin" ? "Yönetici" : "Kullanıcı"}
                              <button
                                onClick={() => removeRole(r.id)}
                                className="h-5 w-5 rounded-full grid place-items-center hover:bg-[var(--admin-surface)]"
                                style={{ color: "var(--admin-danger)" }}
                                aria-label="Yetkiyi kaldır"
                                title="Kaldır"
                              >
                                <Icon name="close" className="text-[13px]" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td
                        className="px-5 py-4 text-right whitespace-nowrap"
                        style={{ borderTop: i === 0 ? 0 : "1px solid var(--admin-border)" }}
                      >
                        {!isAdminRow && (
                          <button
                            onClick={() => makeAdmin(uid)}
                            className="admin-btn admin-btn-outline admin-btn-sm"
                          >
                            <Icon name="shield_person" className="text-[16px]" />
                            Yönetici Yap
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ManualAdminGrant onGrant={makeAdmin} />
    </div>
  );
}

function ManualAdminGrant({ onGrant }: { onGrant: (id: string) => void }) {
  const [uid, setUid] = useState("");
  return (
    <div className="admin-card p-4 flex flex-col gap-2 max-w-2xl">
      <div className="flex items-center gap-2">
        <span
          className="h-8 w-8 rounded-lg grid place-items-center"
          style={{ background: "var(--admin-navy-soft)", color: "var(--admin-navy)" }}
        >
          <Icon name="key" className="text-[16px]" />
        </span>
        <p className="font-semibold text-[14px]" style={{ color: "var(--admin-text)" }}>
          User ID ile Yönetici Yetkisi Ver
        </p>
      </div>
      <p className="text-[12.5px]" style={{ color: "var(--admin-text-2)" }}>
        Kayıtlı bir kullanıcının UUID'sini yapıştırın; anında yönetici yetkisi verilir.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 mt-1">
        <input
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          placeholder="00000000-0000-0000-0000-000000000000"
          className="admin-input font-mono flex-1"
        />
        <button
          onClick={() => {
            if (!uid.trim()) return;
            onGrant(uid.trim());
            setUid("");
          }}
          className="admin-btn admin-btn-primary admin-btn-sm"
          disabled={!uid.trim()}
        >
          <Icon name="add" className="text-[16px]" />
          Yetki Ver
        </button>
      </div>
    </div>
  );
}

/* ================= Shared ================= */

function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger";
}) {
  const cls = `admin-badge admin-badge-${tone}`;
  return <span className={cls}>{children}</span>;
}

function FilterChip({
  active,
  onClick,
  count,
  tone,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  tone?: "accent" | "warning" | "success" | "danger";
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 h-9 px-3 rounded-full text-[13px] font-medium transition-colors"
      style={
        active
          ? { background: "var(--admin-navy)", color: "#fff", border: "1px solid var(--admin-navy)" }
          : { background: "var(--admin-surface-2)", color: "var(--admin-text-2)", border: "1px solid var(--admin-border)" }
      }
    >
      {children}
      <span
        className="h-5 min-w-[20px] px-1.5 rounded-full grid place-items-center text-[11px] font-semibold"
        style={
          active
            ? { background: "var(--admin-yellow)", color: "var(--admin-navy)" }
            : tone
              ? { background: `var(--admin-${tone === "accent" ? "yellow" : tone}-soft)`, color: `var(--admin-${tone === "accent" ? "navy" : tone})` }
              : { background: "var(--admin-surface)", color: "var(--admin-text-2)" }
        }
      >
        {count}
      </span>
    </button>
  );
}

/* ================= CMS Tabs (GenericCrud) ================= */

const PUBLISHED_FIELD: CrudField = { name: "published", label: "Yayında", type: "checkbox" };
const ORDER_FIELD: CrudField = { name: "display_order", label: "Sıra", type: "number" };

function pubCol(): CrudColumn {
  return { key: "published", label: "Yayında", render: (r) => (r.published ? "✓" : "—") };
}

export function ServicesTab() {
  return (
    <GenericCrud
      table="services"
      quickAddKey="services"
      title="Hizmetler"
      orderBy="display_order"
      ascending
      fields={[
        { name: "slug", label: "Slug (URL)", required: true, help: "Örn: kurumsal-tedarik" },
        { name: "title", label: "Başlık", required: true },
        { name: "excerpt", label: "Kısa Özet", type: "textarea" },
        { name: "body", label: "İçerik", type: "textarea" },
        { name: "cover_url", label: "Kapak Görsel URL", type: "url" },
        { name: "icon", label: "İkon (Material Symbols)", help: "Örn: engineering, build, shield" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[
        { key: "title", label: "Başlık" },
        { key: "slug", label: "Slug" },
        { key: "display_order", label: "Sıra" },
        pubCol(),
      ]}
    />
  );
}

export function ReferencesTab() {
  return (
    <GenericCrud
      table="project_references"
      quickAddKey="references"
      title="Referanslar"
      orderBy="display_order"
      ascending
      fields={[
        { name: "slug", label: "Slug", required: true },
        { name: "title", label: "Başlık", required: true },
        { name: "client_name", label: "Müşteri" },
        { name: "category", label: "Sektör" },
        { name: "cover_url", label: "Kapak Görsel URL", type: "url" },
        { name: "logo_url", label: "Logo URL", type: "url" },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "project_date", label: "Proje Tarihi", type: "date" },
        { name: "website_url", label: "Website", type: "url" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[
        { key: "title", label: "Başlık" },
        { key: "client_name", label: "Müşteri" },
        { key: "category", label: "Sektör" },
        pubCol(),
      ]}
    />
  );
}

export function BrandsTab() {
  return (
    <GenericCrud
      table="brands"
      quickAddKey="brands"
      title="Markalar"
      orderBy="display_order"
      ascending
      fields={[
        { name: "name", label: "Marka Adı", required: true },
        { name: "logo_url", label: "Logo URL", type: "url" },
        { name: "website_url", label: "Website", type: "url" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[{ key: "name", label: "Marka" }, { key: "display_order", label: "Sıra" }, pubCol()]}
    />
  );
}

export function CertificatesTab() {
  return (
    <GenericCrud
      table="certificates"
      quickAddKey="certificates"
      title="Sertifikalar"
      orderBy="display_order"
      ascending
      fields={[
        { name: "name", label: "Ad", required: true },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "image_url", label: "Görsel URL", type: "url" },
        { name: "issued_at", label: "Veriliş Tarihi", type: "date" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[{ key: "name", label: "Ad" }, pubCol()]}
    />
  );
}

export function TeamTab() {
  return (
    <GenericCrud
      table="team_members"
      quickAddKey="team"
      title="Ekip Üyeleri"
      orderBy="display_order"
      ascending
      fields={[
        { name: "name", label: "Ad Soyad", required: true },
        { name: "role", label: "Görev", required: true },
        { name: "photo_url", label: "Fotoğraf URL", type: "url" },
        { name: "bio", label: "Kısa Biyografi", type: "textarea" },
        { name: "email", label: "E-posta" },
        { name: "linkedin_url", label: "LinkedIn", type: "url" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[{ key: "name", label: "Ad" }, { key: "role", label: "Görev" }, pubCol()]}
    />
  );
}

export function TestimonialsTab() {
  return (
    <GenericCrud
      table="testimonials"
      quickAddKey="testimonials"
      title="Müşteri Yorumları"
      orderBy="display_order"
      ascending
      fields={[
        { name: "name", label: "Ad", required: true },
        { name: "company", label: "Firma" },
        { name: "role", label: "Görev" },
        { name: "quote", label: "Yorum", type: "textarea", required: true },
        { name: "avatar_url", label: "Avatar URL", type: "url" },
        { name: "rating", label: "Puan (1-5)", type: "number" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[{ key: "name", label: "Ad" }, { key: "company", label: "Firma" }, pubCol()]}
    />
  );
}

export function FaqsTab() {
  return (
    <GenericCrud
      table="faqs"
      quickAddKey="faqs"
      title="Sık Sorulan Sorular"
      orderBy="display_order"
      ascending
      fields={[
        { name: "question", label: "Soru", required: true },
        { name: "answer", label: "Cevap", type: "textarea", required: true },
        { name: "category", label: "Kategori" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[{ key: "question", label: "Soru" }, { key: "category", label: "Kategori" }, pubCol()]}
    />
  );
}

export function BlogCategoriesTab() {
  return (
    <GenericCrud
      table="blog_categories"
      quickAddKey="blogcats"
      title="Blog Kategorileri"
      orderBy="display_order"
      ascending
      fields={[
        { name: "slug", label: "Slug", required: true },
        { name: "name", label: "Ad", required: true },
        { name: "description", label: "Açıklama", type: "textarea" },
        ORDER_FIELD,
      ]}
      columns={[{ key: "name", label: "Ad" }, { key: "slug", label: "Slug" }]}
    />
  );
}

export function BlogPostsTab() {
  const [cats, setCats] = useState<{ id: string; name: string }[]>([]);
  useEffect(() => {
    supabase.from("blog_categories").select("id,name").order("name").then(({ data }) => setCats(data ?? []));
  }, []);
  return (
    <GenericCrud
      table="blog_posts"
      quickAddKey="blog"
      title="Blog Yazıları"
      orderBy="published_at"
      fields={[
        { name: "slug", label: "Slug", required: true },
        { name: "title", label: "Başlık", required: true },
        { name: "excerpt", label: "Özet", type: "textarea" },
        { name: "body", label: "İçerik (HTML)", type: "richtext", help: "HTML etiketleri kullanabilirsiniz (<h2>, <p>, <ul>, <li>)" },
        { name: "cover_url", label: "Kapak Görsel URL", type: "url" },
        { name: "category_id", label: "Kategori", type: "select", options: cats.map((c) => ({ value: c.id, label: c.name })) },
        { name: "author", label: "Yazar" },
        { name: "published_at", label: "Yayın Tarihi", type: "date" },
        { name: "seo_title", label: "SEO Başlık" },
        { name: "seo_description", label: "SEO Açıklama", type: "textarea" },
        { name: "featured", label: "Öne Çıkan", type: "checkbox" },
        PUBLISHED_FIELD,
      ]}
      columns={[
        { key: "title", label: "Başlık" },
        { key: "author", label: "Yazar" },
        { key: "published_at", label: "Tarih", render: (r) => (r.published_at ? new Date(String(r.published_at)).toLocaleDateString("tr-TR") : "—") },
        pubCol(),
      ]}
    />
  );
}

export function JobsTab() {
  return (
    <GenericCrud
      table="job_posts"
      quickAddKey="jobs"
      title="Açık Pozisyonlar"
      orderBy="display_order"
      ascending
      fields={[
        { name: "slug", label: "Slug", required: true },
        { name: "title", label: "Pozisyon", required: true },
        { name: "department", label: "Departman" },
        { name: "location", label: "Konum" },
        { name: "employment_type", label: "İstihdam Tipi" },
        { name: "summary", label: "Özet", type: "textarea" },
        { name: "body", label: "Detay (HTML)", type: "richtext" },
        ORDER_FIELD,
        PUBLISHED_FIELD,
      ]}
      columns={[
        { key: "title", label: "Pozisyon" },
        { key: "department", label: "Departman" },
        { key: "location", label: "Konum" },
        pubCol(),
      ]}
    />
  );
}

export function ApplicationsTab() {
  return (
    <GenericCrud
      table="job_applications"
      title="İş Başvuruları"
      allowCreate={false}
      fields={[
        { name: "name", label: "Ad Soyad" },
        { name: "email", label: "E-posta" },
        { name: "phone", label: "Telefon" },
        { name: "cv_url", label: "CV Linki", type: "url" },
        { name: "cover_letter", label: "Ön Yazı", type: "textarea" },
        { name: "status", label: "Durum", type: "select", options: [
          { value: "new", label: "Yeni" },
          { value: "reviewing", label: "İnceleniyor" },
          { value: "interviewed", label: "Görüşüldü" },
          { value: "hired", label: "İşe Alındı" },
          { value: "rejected", label: "Reddedildi" },
        ] },
        { name: "admin_notes", label: "Notlar", type: "textarea" },
      ]}
      columns={[
        { key: "name", label: "Ad" },
        { key: "email", label: "E-posta" },
        { key: "status", label: "Durum" },
        { key: "created_at", label: "Tarih", render: (r) => new Date(String(r.created_at)).toLocaleString("tr-TR") },
      ]}
    />
  );
}

export function MessagesTab() {
  return (
    <GenericCrud
      table="contact_messages"
      title="İletişim Mesajları"
      allowCreate={false}
      fields={[
        { name: "name", label: "Ad" },
        { name: "email", label: "E-posta" },
        { name: "phone", label: "Telefon" },
        { name: "department", label: "Departman" },
        { name: "subject", label: "Konu" },
        { name: "message", label: "Mesaj", type: "textarea" },
        { name: "status", label: "Durum", type: "select", options: [
          { value: "new", label: "Yeni" },
          { value: "in_progress", label: "İşlemde" },
          { value: "resolved", label: "Çözüldü" },
          { value: "archived", label: "Arşiv" },
        ] },
        { name: "admin_notes", label: "Notlar", type: "textarea" },
      ]}
      columns={[
        { key: "name", label: "Ad" },
        { key: "subject", label: "Konu" },
        { key: "status", label: "Durum" },
        { key: "created_at", label: "Tarih", render: (r) => new Date(String(r.created_at)).toLocaleString("tr-TR") },
      ]}
    />
  );
}