import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { buttonStyles } from "../../lib/button-styles";
import { Icon } from "../site-shell";
import { confirmDialog } from "./ConfirmDialog";
import { EmptyState } from "./EmptyState";

export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "date" | "checkbox" | "select" | "richtext";
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
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-headline-md font-headline-md truncate">{title}</h2>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            {description ?? `Toplam ${rows.length} kayıt`}
          </p>
        </div>
        {allowCreate && (
          <button
            onClick={() => setEditing({ ...empty })}
            className={buttonStyles({ variant: "primary", size: "sm" })}
          >
            <Icon name="add" className="text-[18px]" /> Yeni Ekle
          </button>
        )}
      </div>

      {/* Toolbar: search + sort */}
      <div className="flex flex-col sm:flex-row gap-2">
        <label className="flex items-center gap-2 h-10 px-3 rounded-md border border-outline-variant bg-surface-container-lowest flex-1 min-w-0">
          <Icon name="search" className="text-[18px] text-on-surface-variant shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bu listede ara…"
            className="bg-transparent outline-none text-body-sm flex-1 min-w-0"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-on-surface-variant hover:text-on-surface"
              aria-label="Aramayı temizle"
            >
              <Icon name="close" className="text-[16px]" />
            </button>
          )}
        </label>
        <button
          onClick={() => setSortAsc((v) => !v)}
          className="h-10 px-3 inline-flex items-center gap-2 rounded-md border border-outline-variant bg-surface-container-lowest text-body-sm hover:bg-surface-container"
          title="Sırayı değiştir"
        >
          <Icon name={sortAsc ? "arrow_upward" : "arrow_downward"} className="text-[16px]" />
          {sortAsc ? "Eski → Yeni" : "Yeni → Eski"}
        </button>
      </div>

      {error && <p className="text-error text-body-sm">{error}</p>}
      {loading ? (
        <TableSkeleton columns={columns.length} />
      ) : rows.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="Henüz kayıt eklenmedi"
          description="Aşağıdaki butonla ilk kaydı ekleyerek başlayabilirsiniz."
          action={
            allowCreate ? (
              <button
                onClick={() => setEditing({ ...empty })}
                className={buttonStyles({ variant: "primary", size: "sm" })}
              >
                <Icon name="add" className="text-[18px]" /> İlk kaydı ekle
              </button>
            ) : undefined
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="Sonuç bulunamadı"
          description={`"${query}" için eşleşen kayıt yok.`}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto border border-outline-variant rounded-lg bg-surface-container-lowest">
          <table className="w-full text-body-sm">
              <thead className="text-left border-b border-outline-variant bg-surface-container-low">
              <tr>
                  {columns.map((c) => (
                    <th key={c.key} className="px-4 py-3 font-label-bold text-body-sm text-on-surface-variant">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 w-32 text-right font-label-bold text-body-sm text-on-surface-variant">
                    İşlem
                  </th>
              </tr>
            </thead>
            <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-outline-variant hover:bg-surface-container-low transition-colors"
                  >
                  {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 align-top">
                      {c.render ? c.render(r) : String(r[c.key] ?? "—")}
                    </td>
                  ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setEditing(r)}
                        className="text-primary hover:underline font-label-bold text-body-sm"
                      >
                        Düzenle
                      </button>
                      {allowDelete && (
                        <button
                          onClick={() => remove(r.id)}
                          className="ml-4 text-error hover:underline font-label-bold text-body-sm"
                        >
                          Sil
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-2">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="border border-outline-variant rounded-lg bg-surface-container-lowest p-4"
              >
                <dl className="flex flex-col gap-1.5">
                  {columns.map((c) => (
                    <div key={c.key} className="flex items-baseline gap-2">
                      <dt className="text-[11px] font-label-bold uppercase tracking-wider text-on-surface-variant shrink-0 w-24">
                        {c.label}
                      </dt>
                      <dd className="text-body-sm min-w-0 flex-1 break-words">
                        {c.render ? c.render(r) : String(r[c.key] ?? "—")}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 pt-3 border-t border-outline-variant flex gap-4 justify-end">
                  <button
                    onClick={() => setEditing(r)}
                    className="text-primary font-label-bold text-body-sm"
                  >
                    Düzenle
                  </button>
                  {allowDelete && (
                    <button
                      onClick={() => remove(r.id)}
                      className="text-error font-label-bold text-body-sm"
                    >
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
        <CrudForm fields={fields} initial={editing} onCancel={() => setEditing(null)} onSave={save} />
      )}
    </div>
  );
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="border border-outline-variant rounded-lg bg-surface-container-lowest p-4 flex flex-col gap-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-3">
          {[...Array(columns)].map((_, j) => (
            <div
              key={j}
              className="h-4 rounded bg-surface-container flex-1 animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function CrudForm({
  fields,
  initial,
  onCancel,
  onSave,
}: {
  fields: CrudField[];
  initial: Record<string, unknown> & { id?: string };
  onCancel: () => void;
  onSave: (v: Record<string, unknown> & { id?: string }) => void;
}) {
  const [form, setForm] = useState(initial);
  function submit(e: FormEvent) {
    e.preventDefault();
    onSave(form);
  }
  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="bg-surface-container-lowest max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded p-6 flex flex-col gap-3"
      >
        <h3 className="font-headline-md text-headline-md mb-2">
          {form.id ? "Kaydı Düzenle" : "Yeni Kayıt"}
        </h3>
        {fields.map((f) => (
          <FieldRenderer
            key={f.name}
            field={f}
            value={form[f.name]}
            onChange={(v) => setForm({ ...form, [f.name]: v })}
          />
        ))}
        <div className="flex gap-2 mt-4">
          <button type="submit" className={buttonStyles({ variant: "primary", size: "sm" })}>Kaydet</button>
          <button type="button" onClick={onCancel} className={buttonStyles({ variant: "outline-dark", size: "sm" })}>İptal</button>
        </div>
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
  const cls = "border border-outline-variant rounded px-3 py-2 focus:border-secondary outline-none";
  const v = value ?? "";
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-body-sm">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }
  if (field.type === "textarea" || field.type === "richtext") {
    return (
      <label className="flex flex-col gap-1 text-body-sm">
        <span className="font-label-bold">{field.label}{field.required && " *"}</span>
        <textarea
          value={String(v)}
          required={field.required}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`${cls} min-h-32 font-mono text-body-sm`}
        />
        {field.help && <span className="text-body-sm text-on-surface-variant">{field.help}</span>}
      </label>
    );
  }
  if (field.type === "select") {
    return (
      <label className="flex flex-col gap-1 text-body-sm">
        <span className="font-label-bold">{field.label}{field.required && " *"}</span>
        <select value={String(v)} required={field.required} onChange={(e) => onChange(e.target.value)} className={cls}>
          <option value="">— Seçiniz —</option>
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </label>
    );
  }
  return (
    <label className="flex flex-col gap-1 text-body-sm">
      <span className="font-label-bold">{field.label}{field.required && " *"}</span>
      <input
        type={field.type ?? "text"}
        value={String(v)}
        required={field.required}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cls}
      />
      {field.help && <span className="text-body-sm text-on-surface-variant">{field.help}</span>}
    </label>
  );
}