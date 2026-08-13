import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../site-shell";
import { confirmDialog } from "./ConfirmDialog";
import { EmptyState } from "./EmptyState";
import { ImageUploadField } from "./ImageUploadField";


export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "date" | "checkbox" | "select" | "richtext" | "file";
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
};

export type CrudColumn = {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => React.ReactNode;
};

export type CrudRowAction = {
  key: string;
  label: string;
  icon?: string;
  tone?: "default" | "primary" | "danger" | "success";
  onRun: (row: Record<string, unknown> & { id: string }, ctx: { refresh: () => void }) => unknown | Promise<unknown>;
  visible?: (row: Record<string, unknown> & { id: string }) => boolean;
};

type Row = Record<string, unknown> & { id: string };

export function GenericCrud({
  table,
  title,
  fields,
  columns,
  orderBy = "created_at",
  ascending = false,
  defaults = {},
  allowCreate = true,
  allowDelete = true,
  quickAddKey,
  description,
  extraRowActions,
}: {
  table: string;
  title: string;
  fields: CrudField[];
  columns: CrudColumn[];
  orderBy?: string;
  ascending?: boolean;
  defaults?: Record<string, unknown>;
  allowCreate?: boolean;
  allowDelete?: boolean;
  quickAddKey?: string;
  description?: string;
  extraRowActions?: CrudRowAction[];
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | (Record<string, unknown> & { id?: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(ascending);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from(table as never)
      .select("*")
      .order(orderBy, { ascending: sortAsc });
    if (error) setError(error.message);
    else setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, sortAsc]);

  // Empty defaults for a new record
  const empty = useMemo(() => {
    const base: Record<string, unknown> = {};
    for (const f of fields) base[f.name] = f.type === "checkbox" ? true : "";
    Object.assign(base, defaults);
    return base;
  }, [fields, defaults]);

  // Quick-add global event listener
  const emptyRef = useRef(empty);
  emptyRef.current = empty;
  useEffect(() => {
    if (!quickAddKey) return;
    function onQuickAdd(e: Event) {
      const d = (e as CustomEvent<{ tab: string }>).detail;
      if (d?.tab === quickAddKey) setEditing({ ...emptyRef.current });
    }
    window.addEventListener("admin:quick-add", onQuickAdd);
    return () => window.removeEventListener("admin:quick-add", onQuickAdd);
  }, [quickAddKey]);

  async function save(form: Record<string, unknown> & { id?: string }) {
    setError(null);
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const v = form[f.name];
      if (f.type === "number") payload[f.name] = v === "" || v === undefined || v === null ? null : Number(v);
      else if (f.type === "checkbox") payload[f.name] = !!v;
      else if (f.type === "date") payload[f.name] = v || null;
      else payload[f.name] = v === "" ? null : v ?? null;
    }
    const { id, ...rest } = payload as { id?: string } & Record<string, unknown>;
    void id;
    const q = form.id
      ? supabase.from(table as never).update(rest as never).eq("id", form.id)
      : supabase.from(table as never).insert(rest as never);
    const { error } = await q;
    if (error) {
      setError(error.message);
      toast.error("Kaydedilemedi", { description: error.message });
      return;
    }
    toast.success(form.id ? "Değişiklikler kaydedildi" : "Yeni kayıt eklendi");
    setEditing(null);
    refresh();
  }

  async function remove(id: string) {
    const ok = await confirmDialog({
      title: "Bu kaydı silmek istediğinize emin misiniz?",
      description: "Bu işlem geri alınamaz. İçerik kalıcı olarak silinecek.",
      confirmLabel: "Evet, sil",
      cancelLabel: "Vazgeç",
      destructive: true,
    });
    if (!ok) return;
    const { error } = await supabase.from(table as never).delete().eq("id", id);
    if (error) {
      setError(error.message);
      toast.error("Silinemedi", { description: error.message });
    } else {
      toast.success("Kayıt silindi");
      refresh();
    }
  }

  // Filter rows client-side by any string column matching the query
  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.trim().toLowerCase();
    return rows.filter((r) =>
      columns.some((c) => {
        const v = r[c.key];
        return typeof v === "string" && v.toLowerCase().includes(q);
      }),
    );
  }, [rows, query, columns]);

  return (
    <div className="flex flex-col gap-4">
      {/* Title + create */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[22px] font-bold tracking-tight truncate" style={{ color: "var(--admin-text)" }}>
            {title}
          </h2>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--admin-text-2)" }}>
            {description ?? `Toplam ${rows.length} kayıt`}
            {query && filtered.length !== rows.length && ` · ${filtered.length} sonuç`}
          </p>
        </div>
        {allowCreate && (
          <button
            onClick={() => setEditing({ ...empty })}
            className="admin-btn admin-btn-primary"
            style={{ height: 40 }}
          >
            <Icon name="add" className="text-[18px]" />
            Yeni Ekle
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="admin-card p-3 flex flex-col sm:flex-row gap-2">
        <div
          className="flex items-center gap-2 h-10 px-3 rounded-xl flex-1 min-w-0"
          style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)" }}
        >
          <span style={{ color: "var(--admin-text-mute)" }}>
            <Icon name="search" className="text-[18px]" />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bu listede ara…"
            className="bg-transparent outline-none text-sm flex-1 min-w-0"
            style={{ color: "var(--admin-text)" }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="grid place-items-center h-6 w-6 rounded hover:bg-[var(--admin-surface)]"
              style={{ color: "var(--admin-text-mute)" }}
              aria-label="Aramayı temizle"
            >
              <Icon name="close" className="text-[16px]" />
            </button>
          )}
        </div>
        <button
          onClick={() => setSortAsc((v) => !v)}
          className="admin-btn admin-btn-outline"
          style={{ height: 40 }}
          title="Sırayı değiştir"
        >
          <Icon name={sortAsc ? "arrow_upward" : "arrow_downward"} className="text-[16px]" />
          {sortAsc ? "Eski → Yeni" : "Yeni → Eski"}
        </button>
      </div>

      {error && (
        <div
          className="rounded-xl p-3 text-sm flex items-start gap-2"
          style={{ background: "var(--admin-danger-soft)", color: "var(--admin-danger)" }}
          role="alert"
        >
          <Icon name="error" className="text-[18px] mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <TableSkeleton columns={columns.length} />
      ) : rows.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="Henüz kayıt eklenmedi"
          description="Aşağıdaki butonla ilk kaydınızı ekleyerek başlayabilirsiniz."
          action={
            allowCreate ? (
              <button
                onClick={() => setEditing({ ...empty })}
                className="admin-btn admin-btn-primary"
                style={{ height: 40 }}
              >
                <Icon name="add" className="text-[18px]" />
                İlk kaydı ekle
              </button>
            ) : undefined
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="Sonuç bulunamadı"
          description={`"${query}" için eşleşen kayıt yok. Farklı bir anahtar kelime deneyin.`}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block admin-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[14px] border-separate border-spacing-0">
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th
                        key={c.key}
                        className="text-left px-5 py-3 text-[11px] uppercase tracking-[0.08em] font-semibold"
                        style={{
                          color: "var(--admin-text-2)",
                          background: "var(--admin-surface-2)",
                          borderBottom: "1px solid var(--admin-border)",
                        }}
                      >
                        {c.label}
                      </th>
                    ))}
                    <th
                      className="px-5 py-3 w-40 text-right text-[11px] uppercase tracking-[0.08em] font-semibold"
                      style={{
                        color: "var(--admin-text-2)",
                        background: "var(--admin-surface-2)",
                        borderBottom: "1px solid var(--admin-border)",
                      }}
                    >
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      className="transition-colors hover:bg-[var(--admin-surface-2)]"
                    >
                      {columns.map((c) => (
                        <td
                          key={c.key}
                          className="px-5 py-3.5 align-middle"
                          style={{
                            borderTop: i === 0 ? "0" : "1px solid var(--admin-border)",
                            color: "var(--admin-text)",
                          }}
                        >
                          {c.render ? c.render(r) : String(r[c.key] ?? "—")}
                        </td>
                      ))}
                      <td
                        className="px-5 py-3.5 text-right whitespace-nowrap"
                        style={{
                          borderTop: i === 0 ? "0" : "1px solid var(--admin-border)",
                        }}
                      >
                        <button
                          onClick={() => setEditing(r)}
                          className="admin-btn admin-btn-ghost admin-btn-sm"
                          style={{ color: "var(--admin-navy)" }}
                        >
                          <Icon name="edit" className="text-[16px]" />
                          Düzenle
                        </button>
                        {extraRowActions?.filter(a => !a.visible || a.visible(r)).map((a) => (
                          <button
                            key={a.key}
                            onClick={() => a.onRun(r, { refresh })}
                            className="admin-btn admin-btn-ghost admin-btn-sm ml-1"
                            style={{
                              color:
                                a.tone === "danger" ? "var(--admin-danger)" :
                                a.tone === "success" ? "var(--admin-success, #0a7c3a)" :
                                a.tone === "primary" ? "var(--admin-navy)" :
                                "var(--admin-text-2)",
                            }}
                            title={a.label}
                          >
                            {a.icon ? <Icon name={a.icon} className="text-[16px]" /> : null}
                            {a.label}
                          </button>
                        ))}
                        {allowDelete && (
                          <button
                            onClick={() => remove(r.id)}
                            className="admin-btn admin-btn-ghost admin-btn-sm ml-1"
                            style={{ color: "var(--admin-danger)" }}
                          >
                            <Icon name="delete" className="text-[16px]" />
                            Sil
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-2.5">
            {filtered.map((r) => (
              <div key={r.id} className="admin-card p-4">
                <dl className="flex flex-col gap-2">
                  {columns.map((c, ci) => (
                    <div key={c.key} className={ci === 0 ? "flex items-center gap-2" : "flex items-baseline gap-2"}>
                      <dt
                        className="text-[10px] font-semibold uppercase tracking-wider shrink-0 w-24"
                        style={{ color: "var(--admin-text-mute)" }}
                      >
                        {c.label}
                      </dt>
                      <dd
                        className="text-[14px] min-w-0 flex-1 break-words"
                        style={{ color: "var(--admin-text)" }}
                      >
                        {c.render ? c.render(r) : String(r[c.key] ?? "—")}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div
                  className="mt-3 pt-3 flex gap-2 justify-end"
                  style={{ borderTop: "1px solid var(--admin-border)" }}
                >
                  <button
                    onClick={() => setEditing(r)}
                    className="admin-btn admin-btn-outline admin-btn-sm"
                  >
                    <Icon name="edit" className="text-[16px]" />
                    Düzenle
                  </button>
                  {extraRowActions?.filter(a => !a.visible || a.visible(r)).map((a) => (
                    <button
                      key={a.key}
                      onClick={() => a.onRun(r, { refresh })}
                      className="admin-btn admin-btn-outline admin-btn-sm"
                    >
                      {a.icon ? <Icon name={a.icon} className="text-[16px]" /> : null}
                      {a.label}
                    </button>
                  ))}
                  {allowDelete && (
                    <button
                      onClick={() => remove(r.id)}
                      className="admin-btn admin-btn-sm"
                      style={{ color: "var(--admin-danger)", background: "var(--admin-danger-soft)" }}
                    >
                      <Icon name="delete" className="text-[16px]" />
                      Sil
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editing && (
        <CrudForm
          title={title}
          fields={fields}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="admin-card p-5 flex flex-col gap-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex gap-3">
          {[...Array(columns)].map((_, j) => (
            <div key={j} className="admin-skel h-4 flex-1" />
          ))}
          <div className="admin-skel h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

function CrudForm({
  title,
  fields,
  initial,
  onCancel,
  onSave,
}: {
  title: string;
  fields: CrudField[];
  initial: Record<string, unknown> & { id?: string };
  onCancel: () => void;
  onSave: (v: Record<string, unknown> & { id?: string }) => void;
}) {
  const [form, setForm] = useState(initial);
  const [dirty, setDirty] = useState(false);
  function submit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
  }
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onCancel]);
  return (
    <div
      className="admin-scope fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(8,24,44,0.5)", backdropFilter: "blur(2px)" }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label={form.id ? "Kaydı düzenle" : "Yeni kayıt"}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-3xl max-h-[92vh] flex flex-col overflow-hidden sm:rounded-2xl rounded-t-2xl"
        style={{
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          boxShadow: "var(--admin-shadow-3)",
        }}
      >
        {/* Header */}
        <header
          className="px-6 py-4 flex items-start gap-3"
          style={{ borderBottom: "1px solid var(--admin-border)" }}
        >
          <div
            className="grid place-items-center h-10 w-10 rounded-xl shrink-0"
            style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}
          >
            <Icon name={form.id ? "edit" : "add"} className="text-[20px]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[18px] font-semibold" style={{ color: "var(--admin-text)" }}>
              {form.id ? `${title} — Düzenle` : `${title} — Yeni Kayıt`}
            </h3>
            <p className="text-[12px]" style={{ color: "var(--admin-text-2)" }}>
              Zorunlu alanları doldurun. Değişiklikler kaydedilene kadar uygulanmaz.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="grid place-items-center h-9 w-9 rounded-lg hover:bg-[var(--admin-surface-2)]"
            style={{ color: "var(--admin-text-2)" }}
            aria-label="Kapat"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {fields.map((f) => (
            <FieldRenderer
              key={f.name}
              field={f}
              value={form[f.name]}
              onChange={(v) => {
                setForm({ ...form, [f.name]: v });
                setDirty(true);
              }}
            />
          ))}
        </div>

        {/* Sticky save bar */}
        <footer
          className="px-6 py-3 flex items-center justify-between gap-3"
          style={{
            borderTop: "1px solid var(--admin-border)",
            background: "var(--admin-surface-2)",
          }}
        >
          <p className="text-[12px]" style={{ color: "var(--admin-text-2)" }}>
            {dirty ? (
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--admin-warning)" }}
                />
                Kaydedilmemiş değişiklikler var
              </span>
            ) : form.id ? (
              "Değişiklik yok"
            ) : (
              "Alanları doldurup kaydedin"
            )}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="admin-btn admin-btn-ghost admin-btn-sm"
            >
              Vazgeç
            </button>
            <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm">
              <Icon name="save" className="text-[16px]" />
              Kaydet
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: CrudField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const v = value ?? "";
  if (field.type === "checkbox") {
    return (
      <label
        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
        style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)" }}
      >
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4"
        />
        <span className="text-[14px] font-medium" style={{ color: "var(--admin-text)" }}>
          {field.label}
        </span>
        {field.help && (
          <span className="text-[12px] ml-auto" style={{ color: "var(--admin-text-2)" }}>
            {field.help}
          </span>
        )}
      </label>
    );
  }
  const labelBlock = (
    <div className="flex items-baseline justify-between gap-2 mb-1">
      <span className="text-[13px] font-semibold" style={{ color: "var(--admin-text)" }}>
        {field.label}
        {field.required && <span style={{ color: "var(--admin-danger)" }}> *</span>}
      </span>
    </div>
  );
  if (field.type === "textarea" || field.type === "richtext") {
    return (
      <label className="flex flex-col">
        {labelBlock}
        <textarea
          value={String(v)}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`admin-input admin-textarea ${field.type === "richtext" ? "font-mono" : ""}`}
          rows={field.type === "richtext" ? 8 : 4}
        />
        {field.help && (
          <span className="text-[12px] mt-1" style={{ color: "var(--admin-text-2)" }}>
            {field.help}
          </span>
        )}
      </label>
    );
  }
  if (field.type === "select") {
    return (
      <label className="flex flex-col">
        {labelBlock}
        <select
          value={String(v)}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input"
        >
          <option value="">— Seçiniz —</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {field.help && (
          <span className="text-[12px] mt-1" style={{ color: "var(--admin-text-2)" }}>
            {field.help}
          </span>
        )}
      </label>
    );
  }
  if (field.type === "file") {
    return (
      <ImageUploadField 
        label={field.label}
        value={String(v)}
        help={field.help}
        onChange={onChange}
      />
    );
  }

  return (
    <label className="flex flex-col">
      {labelBlock}
      <input
        type={field.type ?? "text"}
        value={String(v)}
        required={field.required}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="admin-input"
      />
      {field.help && (
        <span className="text-[12px] mt-1" style={{ color: "var(--admin-text-2)" }}>
          {field.help}
        </span>
      )}
    </label>
  );
}