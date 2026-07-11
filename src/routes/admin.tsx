import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Icon } from "../components/site-shell";
import { buttonStyles } from "../lib/button-styles";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { GenericCrud, type CrudField, type CrudColumn } from "../components/admin/GenericCrud";
import { SiteSettingsForm } from "../components/admin/SiteSettingsForm";
import { AdminShell } from "../components/admin/AdminShell";
import { Dashboard } from "../components/admin/Dashboard";
import { PageHeader } from "../components/admin/PageHeader";
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

type Product = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  is_active: boolean;
  specs: Record<string, unknown>;
};

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
      <div className="min-h-screen grid place-items-center text-on-surface-variant">Yükleniyor…</div>
    );
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-8 text-center">
        <div className="flex flex-col gap-4 items-center">
          <p className="font-headline-sm text-headline-sm">Yetkisiz erişim</p>
          <p className="text-on-surface-variant text-body-sm">Bu sayfayı görüntülemek için admin yetkiniz olmalı.</p>
          <Link to="/" className={buttonStyles({ variant: "primary", size: "sm" })}>Ana sayfaya dön</Link>
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

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  sku: "",
  name: "",
  brand: "",
  category: "",
  description: "",
  image_url: "",
  price: null,
  is_active: true,
  specs: {},
};

function ProductsTab() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | (Omit<Product, "id"> & { id?: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setItems((data as Product[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    function onQuickAdd(e: Event) {
      const d = (e as CustomEvent<{ tab: string }>).detail;
      if (d?.tab === "products") setEditing({ ...EMPTY_PRODUCT });
    }
    window.addEventListener("admin:quick-add", onQuickAdd);
    return () => window.removeEventListener("admin:quick-add", onQuickAdd);
  }, []);

  async function handleSave(p: Omit<Product, "id"> & { id?: string }) {
    setError(null);
    const payload = {
      sku: p.sku,
      name: p.name,
      brand: p.brand,
      category: p.category,
      description: p.description || null,
      image_url: p.image_url || null,
      price: p.price,
      is_active: p.is_active,
      specs: (p.specs ?? {}) as never,
    };
    const { error } = p.id
      ? await supabase.from("products").update(payload).eq("id", p.id)
      : await supabase.from("products").insert(payload);
    if (error) {
      setError(error.message);
      toast.error("Kaydedilemedi", { description: error.message });
      return;
    }
    toast.success(p.id ? "Ürün güncellendi" : "Ürün eklendi");
    setEditing(null);
    refresh();
  }

  async function handleDelete(id: string) {
    const ok = await confirmDialog({
      title: "Bu ürünü silmek istediğinize emin misiniz?",
      description: "Bu işlem geri alınamaz.",
      confirmLabel: "Evet, sil",
      destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      setError(error.message);
      toast.error("Silinemedi", { description: error.message });
    } else {
      toast.success("Ürün silindi");
      refresh();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-md text-headline-md">Ürünler ({items.length})</h2>
        <button
          onClick={() => setEditing({ ...EMPTY_PRODUCT })}
          className={buttonStyles({ variant: "primary", size: "sm" })}
        >
          <Icon name="add" className="text-[18px]" /> Yeni Ürün
        </button>
      </div>
      {error && <p className="text-error text-body-sm">{error}</p>}
      {loading ? (
        <p>Yükleniyor…</p>
      ) : items.length === 0 ? (
        <p className="text-on-surface-variant">Henüz ürün eklenmedi.</p>
      ) : (
        <div className="overflow-x-auto border border-outline-variant rounded">
          <table className="w-full text-body-sm">
            <thead className="bg-surface-variant text-left">
              <tr>
                <th className="p-3">SKU</th>
                <th className="p-3">Ad</th>
                <th className="p-3">Marka</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Fiyat</th>
                <th className="p-3">Aktif</th>
                <th className="p-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-outline-variant">
                  <td className="p-3 font-mono text-body-sm">{p.sku}</td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.brand}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.price ?? "-"}</td>
                  <td className="p-3">{p.is_active ? "✓" : "—"}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => setEditing(p)} className="text-primary hover:underline">Düzenle</button>
                    <button onClick={() => handleDelete(p.id)} className="text-error hover:underline">Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <ProductForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ProductForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: Omit<Product, "id"> & { id?: string };
  onCancel: () => void;
  onSave: (p: Omit<Product, "id"> & { id?: string }) => void;
}) {
  const [form, setForm] = useState(initial);

  function submit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-surface-container-lowest max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded p-6 flex flex-col gap-3">
        <h3 className="font-headline-md text-headline-md mb-2">
          {form.id ? "Ürünü Düzenle" : "Yeni Ürün"}
        </h3>
        <Field label="SKU" required value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
        <Field label="Ad" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <Field label="Marka" required value={form.brand} onChange={(v) => setForm({ ...form, brand: v })} />
        <Field label="Kategori" required value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
        <Field label="Görsel URL" value={form.image_url ?? ""} onChange={(v) => setForm({ ...form, image_url: v })} />
        <label className="flex flex-col gap-1 text-body-sm">
          <span className="font-label-bold">Açıklama</span>
          <textarea
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-outline-variant rounded px-3 py-2 min-h-24"
          />
        </label>
        <Field
          label="Fiyat (₺)"
          type="number"
          value={form.price?.toString() ?? ""}
          onChange={(v) => setForm({ ...form, price: v ? Number(v) : null })}
        />
        <label className="flex items-center gap-2 text-body-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Aktif (sitede göster)
        </label>
        <div className="flex gap-2 mt-4">
          <button type="submit" className={buttonStyles({ variant: "primary", size: "sm" })}>Kaydet</button>
          <button type="button" onClick={onCancel} className={buttonStyles({ variant: "outline-dark", size: "sm" })}>İptal</button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-body-sm">
      <span className="font-label-bold">{label}{required && " *"}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="border border-outline-variant rounded px-3 py-2 focus:border-secondary outline-none"
      />
    </label>
  );
}

/* ================= Quotes ================= */

function QuotesTab() {
  const [items, setItems] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  useEffect(() => {
    refresh();
  }, []);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
    if (error) setError(error.message);
    else refresh();
  }

  async function handleDelete(id: string) {
    const ok = await confirmDialog({
      title: "Bu teklif talebini silmek istediğinize emin misiniz?",
      confirmLabel: "Evet, sil",
      destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("quote_requests").delete().eq("id", id);
    if (error) {
      setError(error.message);
      toast.error("Silinemedi", { description: error.message });
    } else {
      toast.success("Teklif talebi silindi");
      refresh();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-headline-md text-headline-md">Teklif Talepleri ({items.length})</h2>
      {error && <p className="text-error text-body-sm">{error}</p>}
      {loading ? (
        <p>Yükleniyor…</p>
      ) : items.length === 0 ? (
        <p className="text-on-surface-variant">Henüz teklif talebi yok.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((q) => {
            const itemsList = Array.isArray(q.items) ? (q.items as Array<{ name?: string; sku?: string; quantity?: number }>) : [];
            return (
              <div key={q.id} className="border border-outline-variant rounded p-4 bg-surface-container-lowest">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <p className="font-label-bold">{q.contact_name} {q.company && <span className="text-on-surface-variant">— {q.company}</span>}</p>
                    <p className="text-body-sm text-on-surface-variant">{q.email}{q.phone && ` · ${q.phone}`}</p>
                    <p className="text-body-sm text-on-surface-variant">{new Date(q.created_at).toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={q.status}
                      onChange={(e) => updateStatus(q.id, e.target.value)}
                      className="border border-outline-variant rounded px-2 py-1 text-body-sm"
                    >
                      <option value="new">Yeni</option>
                      <option value="in_progress">İşlemde</option>
                      <option value="completed">Tamamlandı</option>
                      <option value="cancelled">İptal</option>
                    </select>
                    <button onClick={() => handleDelete(q.id)} className="text-error hover:underline text-body-sm">Sil</button>
                  </div>
                </div>
                {q.message && <p className="text-body-sm mt-2 italic">{q.message}</p>}
                {itemsList.length > 0 && (
                  <ul className="mt-2 text-body-sm list-disc list-inside">
                    {itemsList.map((it, i) => (
                      <li key={i}>
                        {it.name ?? it.sku ?? "Ürün"} × {it.quantity ?? 1}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
  useEffect(() => {
    refresh();
  }, []);

  async function makeAdmin(userId: string) {
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    if (error) setError(error.message);
    else refresh();
  }
  async function removeRole(id: string) {
    const ok = await confirmDialog({
      title: "Bu yetkiyi kaldırmak istediğinize emin misiniz?",
      confirmLabel: "Kaldır",
      destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) {
      setError(error.message);
      toast.error("Kaldırılamadı", { description: error.message });
    } else {
      toast.success("Yetki kaldırıldı");
      refresh();
    }
  }

  const grouped = new Map<string, UserRoleRow[]>();
  for (const r of roles) {
    const list = grouped.get(r.user_id) ?? [];
    list.push(r);
    grouped.set(r.user_id, list);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-headline-md text-headline-md">Kullanıcı Yetkileri</h2>
      <p className="text-body-sm text-on-surface-variant">
        Yeni bir kullanıcıyı admin yapmak için önce o kişinin <Link to="/giris" className="underline">/giris</Link> üzerinden kayıt olması gerekir. Ardından buradaki listede User ID'yi görüp aşağıdan admin yapabilirsiniz.
      </p>
      {error && <p className="text-error text-body-sm">{error}</p>}
      {loading ? (
        <p>Yükleniyor…</p>
      ) : (
        <div className="overflow-x-auto border border-outline-variant rounded">
          <table className="w-full text-body-sm">
            <thead className="bg-surface-variant text-left">
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Roller</th>
                <th className="p-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(grouped.entries()).map(([uid, rs]) => (
                <tr key={uid} className="border-t border-outline-variant">
                  <td className="p-3 font-mono text-body-sm">{uid}{uid === currentUserId && " (siz)"}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    {rs.map((r) => (
                      <span key={r.id} className="inline-flex items-center gap-1 bg-primary-container text-on-primary-container px-2 py-1 rounded text-body-sm">
                        {r.role}
                        <button
                          onClick={() => removeRole(r.id)}
                          className="text-error"
                          title="Kaldır"
                        >×</button>
                      </span>
                    ))}
                  </td>
                  <td className="p-3">
                    {!rs.some((r) => r.role === "admin") && (
                      <button onClick={() => makeAdmin(uid)} className="text-primary hover:underline">Admin yap</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ManualAdminGrant onGrant={makeAdmin} />
    </div>
  );
}

function ManualAdminGrant({ onGrant }: { onGrant: (id: string) => void }) {
  const [uid, setUid] = useState("");
  return (
    <div className="border border-outline-variant rounded p-4 flex flex-col gap-2 max-w-lg">
      <p className="font-label-bold">User ID ile admin ata</p>
      <div className="flex gap-2">
        <input
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          placeholder="UUID"
          className="flex-1 border border-outline-variant rounded px-3 py-2 text-body-sm font-mono"
        />
        <button
          onClick={() => uid && (onGrant(uid), setUid(""))}
          className={buttonStyles({ variant: "primary", size: "sm" })}
        >
          Ata
        </button>
      </div>
    </div>
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