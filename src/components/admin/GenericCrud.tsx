import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buttonStyles } from "../../lib/button-styles";
import { Icon } from "../site-shell";

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
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Row | (Record<string, unknown> & { id?: string }) | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    const { data, error } = await supabase
      .from(table as never)
      .select("*")
      .order(orderBy, { ascending });
    if (error) setError(error.message);
    else setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

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
    if (error) return setError(error.message);
    setEditing(null);
    refresh();
  }

  async function remove(id: string) {
    if (!confirm("Silinsin mi?")) return;
    const { error } = await supabase.from(table as never).delete().eq("id", id);
    if (error) setError(error.message);
    else refresh();
  }

  const empty: Record<string, unknown> = {};
  for (const f of fields) empty[f.name] = f.type === "checkbox" ? true : "";
  Object.assign(empty, defaults);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <h2 className="font-headline-md text-headline-md">{title} ({rows.length})</h2>
        {allowCreate && (
          <button onClick={() => setEditing({ ...empty })} className={buttonStyles({ variant: "primary", size: "sm" })}>
            <Icon name="add" className="text-[18px]" /> Yeni Ekle
          </button>
        )}
      </div>
      {error && <p className="text-error text-body-sm">{error}</p>}
      {loading ? (
        <p>Yükleniyor…</p>
      ) : rows.length === 0 ? (
        <p className="text-on-surface-variant">Henüz kayıt yok.</p>
      ) : (
        <div className="overflow-x-auto border border-outline-variant rounded bg-surface-container-lowest">
          <table className="w-full text-body-sm">
            <thead className="bg-surface-variant text-left">
              <tr>
                {columns.map((c) => <th key={c.key} className="p-3">{c.label}</th>)}
                <th className="p-3 w-32">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-outline-variant">
                  {columns.map((c) => (
                    <td key={c.key} className="p-3 align-top">
                      {c.render ? c.render(r) : String(r[c.key] ?? "—")}
                    </td>
                  ))}
                  <td className="p-3 flex gap-2">
                    <button onClick={() => setEditing(r)} className="text-primary hover:underline">Düzenle</button>
                    {allowDelete && (
                      <button onClick={() => remove(r.id)} className="text-error hover:underline">Sil</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <CrudForm fields={fields} initial={editing} onCancel={() => setEditing(null)} onSave={save} />
      )}
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