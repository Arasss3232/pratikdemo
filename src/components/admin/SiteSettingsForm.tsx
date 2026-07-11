import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buttonStyles } from "../../lib/button-styles";

type Settings = Record<string, string | null>;

const FIELDS: { name: string; label: string; type?: "textarea" | "url" }[] = [
  { name: "company_name", label: "Firma Adı" },
  { name: "tagline", label: "Slogan" },
  { name: "description", label: "Kısa Tanım", type: "textarea" },
  { name: "hero_title", label: "Ana Sayfa Başlığı" },
  { name: "hero_description", label: "Ana Sayfa Alt Metni", type: "textarea" },
  { name: "hero_image_url", label: "Ana Sayfa Görsel URL", type: "url" },
  { name: "hero_cta_primary_text", label: "Birincil Buton Metni" },
  { name: "hero_cta_primary_url", label: "Birincil Buton URL" },
  { name: "hero_cta_secondary_text", label: "İkincil Buton Metni" },
  { name: "hero_cta_secondary_url", label: "İkincil Buton URL" },
  { name: "phone", label: "Telefon" },
  { name: "email", label: "E-posta" },
  { name: "whatsapp", label: "WhatsApp" },
  { name: "address", label: "Adres", type: "textarea" },
  { name: "map_url", label: "Google Haritalar Linki", type: "url" },
  { name: "map_embed", label: "Google Haritalar Gömme URL", type: "url" },
  { name: "working_hours", label: "Çalışma Saatleri" },
  { name: "social_linkedin", label: "LinkedIn", type: "url" },
  { name: "social_instagram", label: "Instagram", type: "url" },
  { name: "social_youtube", label: "YouTube", type: "url" },
  { name: "social_facebook", label: "Facebook", type: "url" },
  { name: "social_twitter", label: "Twitter / X", type: "url" },
  { name: "footer_text", label: "Footer Metni" },
];

export function SiteSettingsForm() {
  const [form, setForm] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", true).maybeSingle().then(({ data }) => {
      if (data) setForm(data as unknown as Settings);
      setLoading(false);
    });
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const payload: Settings = {};
    for (const f of FIELDS) payload[f.name] = (form[f.name] as string) || null;
    const { error } = await supabase.from("site_settings").update(payload as never).eq("id", true);
    setSaving(false);
    setMsg(error ? `Hata: ${error.message}` : "Kaydedildi.");
  }

  if (loading) return <p>Yükleniyor…</p>;
  return (
    <form onSubmit={submit} className="flex flex-col gap-4 max-w-3xl">
      <h2 className="font-headline-md text-headline-md">Site Ayarları</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {FIELDS.map((f) => (
          <label key={f.name} className={`flex flex-col gap-1 text-body-sm ${f.type === "textarea" ? "md:col-span-2" : ""}`}>
            <span className="font-label-bold">{f.label}</span>
            {f.type === "textarea" ? (
              <textarea
                value={String(form[f.name] ?? "")}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="border border-outline-variant rounded px-3 py-2 min-h-24"
              />
            ) : (
              <input
                type={f.type ?? "text"}
                value={String(form[f.name] ?? "")}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="border border-outline-variant rounded px-3 py-2"
              />
            )}
          </label>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button disabled={saving} type="submit" className={buttonStyles({ variant: "primary", size: "sm" })}>
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
        {msg && <span className="text-body-sm">{msg}</span>}
      </div>
    </form>
  );
}