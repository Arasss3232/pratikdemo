import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteShell } from "../components/site-shell";
import { supabase } from "@/integrations/supabase/client";
import { buttonStyles } from "@/lib/button-styles";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { SUBCATEGORIES, BRANDS, APPLICATIONS } from "@/data/catalog";

export const Route = createFileRoute("/teklif")({
  validateSearch: (s: Record<string, unknown>) => ({
    category: typeof s.category === "string" ? s.category : undefined,
    categoryId: typeof s.categoryId === "string" ? s.categoryId : undefined,
  }) as { category?: string; categoryId?: string },
  head: () => ({
    meta: [
      { title: "Teklif Al — Endüstriyel Alım | Pratik" },
      { name: "description", content: "Proje ölçeğinize uygun toplu teklif, özel iskonto koşulları ve teknik şartname desteği için hemen teklif isteyin." },
      { property: "og:title", content: "Teklif Al — Endüstriyel Alım | Pratik" },
      { property: "og:description", content: "Projeleriniz için özel fiyatlandırma ve teknik şartname desteği." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/teklif" }],
  }),
  component: TeklifPage,
});

const CATEGORY_OPTIONS = SUBCATEGORIES.map((c) => c.replace(/\s*\(\d+\)\s*$/, ""));

type LineItem = { id: string; category: string; brand: string; quantity: string; notes: string };

const uid = () => Math.random().toString(36).slice(2, 10);

const contactSchema = z.object({
  name: z.string().trim().min(2, "Ad soyad zorunlu").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Geçerli e-posta giriniz").max(200),
  phone: z.string().trim().min(7, "Telefon zorunlu").max(30),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  timeline: z.string().max(60).optional().or(z.literal("")),
  budget: z.string().max(60).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  kvkk: z.literal("on", { message: "KVKK onayı gereklidir" }),
});

function TeklifPage() {
  const search = Route.useSearch();
  const settings = useSiteSettings();
  const phone = settings.phone ?? "";
  const email = settings.email ?? "";
  const whatsapp = settings.whatsapp ?? phone;

  const [lines, setLines] = useState<LineItem[]>([
    { id: uid(), category: search.category || "", brand: "", quantity: "1", notes: "" },
  ]);
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errMsg, setErrMsg] = useState<string>("");

  const canRemove = lines.length > 1;
  const totalLines = useMemo(() => lines.filter((l) => l.category.trim() || l.notes.trim()).length, [lines]);

  function updateLine(id: string, patch: Partial<LineItem>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function addLine() {
    setLines((prev) => [...prev, { id: uid(), category: "", brand: "", quantity: "1", notes: "" }]);
  }
  function removeLine(id: string) {
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrMsg("");
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path.join(".")] = issue.message;
      }
      setErrors(errs);
      return;
    }
    const cleanLines = lines
      .filter((l) => l.category.trim() || l.notes.trim())
      .map((l) => ({
        category: l.category.trim(),
        brand: l.brand.trim() || null,
        quantity: Number(l.quantity) || 1,
        notes: l.notes.trim() || null,
      }));
    if (cleanLines.length === 0) {
      setErrors({ lines: "En az bir ürün satırı ekleyin" });
      return;
    }
    setErrors({});
    setState("loading");

    const payload = {
      contact_name: parsed.data.name,
      company: parsed.data.company || null,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: [
        parsed.data.message?.trim(),
        parsed.data.city ? `Şehir: ${parsed.data.city}` : null,
        parsed.data.timeline ? `Termin: ${parsed.data.timeline}` : null,
        parsed.data.budget ? `Bütçe: ${parsed.data.budget}` : null,
      ]
        .filter(Boolean)
        .join(" · ") || null,
      items: cleanLines,
    };

    const { error } = await supabase.from("quote_requests").insert(payload);
    if (error) {
      setState("err");
      setErrMsg("Talebiniz gönderilemedi. Lütfen tekrar deneyin veya bize telefonla ulaşın.");
      return;
    }
    setState("ok");
    setLines([{ id: uid(), category: "", brand: "", quantity: "1", notes: "" }]);
    (e.target as HTMLFormElement).reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <SiteShell>
      {/* Hero / breadcrumb */}
      <section className="border-b border-outline-variant" style={{ background: "var(--color-surface-container-lowest)" }}>
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pt-10 pb-16 md:pt-14 md:pb-20">
          <nav className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant mb-6" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary">Anasayfa</Link>
            <span className="mx-2 text-outline">/</span>
            <span className="text-primary">Teklif Al</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <div className="hp-eyebrow flex items-center gap-3 mb-4">
                <span className="inline-block w-8 h-px bg-primary" />
                <span>Teklif Talebi</span>
              </div>
              <h1 className="hp-display text-[40px] md:text-[56px] leading-[1.05]">
                Projeniz için kurumsal teklif hazırlayalım.
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg font-body-lg text-on-surface-variant">
                Aşağıdaki formu doldurun; satış ekibimiz aynı iş günü içinde stok, teslim süresi ve iskonto koşullarıyla dönüş yapsın.
              </p>
            </div>
            <div className="lg:col-span-4">
              <div className="border border-outline-variant p-5 bg-white">
                <div className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">Süreç</div>
                <ol className="mt-3 space-y-2 text-body-sm">
                  <li className="flex gap-3"><span className="hp-mono text-primary">01.</span>Formu gönderirsiniz</li>
                  <li className="flex gap-3"><span className="hp-mono text-primary">02.</span>Ekibimiz ihtiyacı doğrular</li>
                  <li className="flex gap-3"><span className="hp-mono text-primary">03.</span>Fiyat + termin teklifi iletilir</li>
                  <li className="flex gap-3"><span className="hp-mono text-primary">04.</span>Onayla birlikte sevkiyat başlar</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="border-b border-outline-variant" style={{ background: "var(--color-background)" }}>
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-20">
          {state === "ok" ? (
            <div className="max-w-2xl mx-auto text-center border border-outline-variant bg-white p-10">
              <div className="mx-auto w-14 h-14 grid place-items-center border-2 border-primary text-primary mb-5">
                <span className="material-symbols-outlined text-[28px]">check</span>
              </div>
              <h2 className="hp-h2">Talebiniz alındı.</h2>
              <p className="mt-3 text-on-surface-variant">
                Ekibimiz kısa süre içinde tarafınıza dönecek. Aciliyet varsa {phone && (<a href={`tel:${phone.replace(/\s+/g, "")}`} className="text-primary underline">{phone}</a>)} üzerinden bize ulaşın.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button type="button" onClick={() => setState("idle")} className={buttonStyles({ variant: "outline-dark" })}>
                  Yeni bir talep gönder
                </button>
                <Link to="/urunler" className={buttonStyles({ variant: "primary" })}>Ürün Kategorilerini incele</Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Form */}
              <form onSubmit={onSubmit} noValidate className="lg:col-span-8 space-y-10" aria-label="Teklif formu">
                {/* Line items */}
                <fieldset className="border border-outline-variant bg-white p-6 md:p-8">
                  <legend className="px-2 hp-mono text-[11px] uppercase tracking-widest text-primary">01 · Ürün Listesi</legend>
                  <p className="text-body-sm text-on-surface-variant mb-5">
                    İhtiyacınız olan ürünleri satır satır ekleyin. Marka ve adet opsiyoneldir, bilinmiyorsa boş bırakabilirsiniz.
                  </p>
                  <div className="space-y-4">
                    {lines.map((line, idx) => (
                      <div key={line.id} className="border border-outline-variant p-4 md:p-5 relative">
                        <div className="flex items-center justify-between mb-3">
                          <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                            Satır {String(idx + 1).padStart(2, "0")}
                          </span>
                          {canRemove && (
                            <button
                              type="button"
                              onClick={() => removeLine(line.id)}
                              className="text-body-sm text-on-surface-variant hover:text-primary inline-flex items-center gap-1"
                              aria-label={`Satır ${idx + 1}'i sil`}
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                              Kaldır
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                          <label className="md:col-span-5 flex flex-col gap-1.5">
                            <span className="text-label-md font-label-md">Ürün grubu / kategori</span>
                            <input
                              type="text"
                              list={`cats-${line.id}`}
                              value={line.category}
                              onChange={(e) => updateLine(line.id, { category: e.target.value })}
                              placeholder="Örn: Matkaplar"
                              className="w-full border border-outline focus:border-primary focus:outline-none px-3 py-2.5 text-body-md bg-white"
                            />
                            <datalist id={`cats-${line.id}`}>
                              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c} />)}
                              {APPLICATIONS.map((a) => <option key={a} value={a} />)}
                            </datalist>
                          </label>
                          <label className="md:col-span-4 flex flex-col gap-1.5">
                            <span className="text-label-md font-label-md">Marka (ops.)</span>
                            <input
                              type="text"
                              list={`brands-${line.id}`}
                              value={line.brand}
                              onChange={(e) => updateLine(line.id, { brand: e.target.value })}
                              placeholder="Bosch, Makita…"
                              className="w-full border border-outline focus:border-primary focus:outline-none px-3 py-2.5 text-body-md bg-white"
                            />
                            <datalist id={`brands-${line.id}`}>
                              {BRANDS.map((b) => <option key={b} value={b} />)}
                            </datalist>
                          </label>
                          <label className="md:col-span-3 flex flex-col gap-1.5">
                            <span className="text-label-md font-label-md">Adet</span>
                            <input
                              type="number"
                              min={1}
                              value={line.quantity}
                              onChange={(e) => updateLine(line.id, { quantity: e.target.value })}
                              className="w-full border border-outline focus:border-primary focus:outline-none px-3 py-2.5 text-body-md bg-white"
                            />
                          </label>
                          <label className="md:col-span-12 flex flex-col gap-1.5">
                            <span className="text-label-md font-label-md">Teknik özellik / model notu (ops.)</span>
                            <input
                              type="text"
                              value={line.notes}
                              onChange={(e) => updateLine(line.id, { notes: e.target.value })}
                              placeholder="Örn: 18V, 5.0Ah çift akü, çantalı"
                              className="w-full border border-outline focus:border-primary focus:outline-none px-3 py-2.5 text-body-md bg-white"
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={addLine}
                      className="inline-flex items-center gap-2 text-primary hover:text-secondary font-label-bold text-label-bold"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      Yeni satır ekle
                    </button>
                    <span className="hp-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
                      {totalLines} dolu satır
                    </span>
                  </div>
                  {errors.lines && <p className="mt-3 text-[13px] text-secondary">{errors.lines}</p>}
                </fieldset>

                {/* Project context */}
                <fieldset className="border border-outline-variant bg-white p-6 md:p-8">
                  <legend className="px-2 hp-mono text-[11px] uppercase tracking-widest text-primary">02 · Proje Bilgileri</legend>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <Input label="Şehir / Şantiye" name="city" placeholder="İstanbul" />
                    <Select label="Termin" name="timeline" options={["Acil (1 hafta)", "1-2 hafta", "1 ay içinde", "Esnek"]} />
                    <Select label="Yaklaşık Bütçe" name="budget" options={["25.000 ₺ altı", "25.000 – 100.000 ₺", "100.000 – 500.000 ₺", "500.000 ₺ üzeri", "Belirtmek istemiyorum"]} />
                  </div>
                  <label className="mt-4 flex flex-col gap-1.5">
                    <span className="text-label-md font-label-md">Ek açıklama</span>
                    <textarea
                      name="message"
                      rows={5}
                      maxLength={2000}
                      placeholder="Kullanım amacı, teknik gereksinim, sevkiyat adresi vb."
                      className="w-full border border-outline focus:border-primary focus:outline-none px-3 py-2.5 text-body-md bg-white resize-y"
                    />
                  </label>
                </fieldset>

                {/* Contact */}
                <fieldset className="border border-outline-variant bg-white p-6 md:p-8">
                  <legend className="px-2 hp-mono text-[11px] uppercase tracking-widest text-primary">03 · İletişim</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <Input label="Ad Soyad *" name="name" required autoComplete="name" error={errors.name} />
                    <Input label="Firma" name="company" autoComplete="organization" error={errors.company} />
                    <Input label="Telefon *" name="phone" type="tel" required autoComplete="tel" error={errors.phone} />
                    <Input label="E-posta *" name="email" type="email" required autoComplete="email" error={errors.email} />
                  </div>
                  <label className="mt-5 flex items-start gap-3 text-body-sm text-on-surface-variant">
                    <input type="checkbox" name="kvkk" required className="mt-1 accent-[color:var(--color-primary)]" />
                    <span>
                      Kişisel verilerimin{" "}
                      <Link to="/kvkk" className="underline text-primary">KVKK aydınlatma metni</Link>{" "}
                      kapsamında işlenmesini ve iletişim amacıyla kullanılmasını kabul ediyorum.
                    </span>
                  </label>
                  {errors.kvkk && <p className="mt-2 text-[13px] text-secondary">{errors.kvkk}</p>}
                  {errMsg && <p className="mt-4 text-[13px] text-secondary">{errMsg}</p>}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={state === "loading"}
                      className={buttonStyles({ variant: "primary", className: "disabled:opacity-70" })}
                    >
                      {state === "loading" ? "Gönderiliyor…" : "Teklif Talebini Gönder"}
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    <span className="text-body-sm text-on-surface-variant">Aynı iş günü içinde geri dönüş</span>
                  </div>
                </fieldset>
              </form>

              {/* Sidebar */}
              <aside className="lg:col-span-4 space-y-4">
                <div className="border border-outline-variant bg-white p-6">
                  <div className="hp-mono text-[11px] uppercase tracking-widest text-primary mb-3">Doğrudan İletişim</div>
                  {phone && (
                    <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-3 py-3 border-b border-outline-variant hover:text-primary">
                      <span className="material-symbols-outlined text-primary">call</span>
                      <span className="flex-1">
                        <span className="block hp-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Telefon</span>
                        <span className="block font-semibold">{phone}</span>
                      </span>
                    </a>
                  )}
                  {whatsapp && (
                    <a href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 py-3 border-b border-outline-variant hover:text-primary">
                      <span className="material-symbols-outlined text-primary">chat</span>
                      <span className="flex-1">
                        <span className="block hp-mono text-[10px] uppercase tracking-widest text-on-surface-variant">WhatsApp</span>
                        <span className="block font-semibold">Hemen yazın</span>
                      </span>
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="flex items-center gap-3 py-3 hover:text-primary">
                      <span className="material-symbols-outlined text-primary">mail</span>
                      <span className="flex-1">
                        <span className="block hp-mono text-[10px] uppercase tracking-widest text-on-surface-variant">E-posta</span>
                        <span className="block font-semibold break-all">{email}</span>
                      </span>
                    </a>
                  )}
                </div>

                <div className="border border-outline-variant p-6" style={{ background: "var(--color-surface-container-lowest)" }}>
                  <div className="hp-mono text-[11px] uppercase tracking-widest text-primary mb-3">Neden Pratik?</div>
                  <ul className="space-y-3 text-body-sm">
                    {[
                      "40+ yetkili marka ile tek muhatap tedarik",
                      "24 saat içinde teklif dönüşü",
                      "Kurumsal fatura, cari hesap ve vadeli ödeme",
                      "Türkiye geneli hızlı sevkiyat",
                      "Satış sonrası teknik servis desteği",
                    ].map((t) => (
                      <li key={t} className="flex gap-3">
                        <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-outline-variant bg-white p-6">
                  <div className="hp-mono text-[11px] uppercase tracking-widest text-primary mb-2">Çalışma Saatleri</div>
                  <p className="text-body-sm text-on-surface-variant">
                    {settings.working_hours || "Pzt – Cmt · 08:30 – 18:00"}
                  </p>
                  {settings.address && (
                    <>
                      <div className="hp-mono text-[11px] uppercase tracking-widest text-primary mt-4 mb-2">Adres</div>
                      <p className="text-body-sm text-on-surface-variant">{settings.address}</p>
                    </>
                  )}
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function Input({
  label, name, type = "text", required, autoComplete, placeholder, error,
}: { label: string; name: string; type?: string; required?: boolean; autoComplete?: string; placeholder?: string; error?: string; }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-label-md font-label-md">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`w-full border ${error ? "border-secondary" : "border-outline"} focus:border-primary focus:outline-none px-3 py-2.5 text-body-md bg-white`}
      />
      {error && <span className="text-[12px] text-secondary">{error}</span>}
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-label-md font-label-md">{label}</span>
      <select
        name={name}
        defaultValue=""
        className="w-full border border-outline focus:border-primary focus:outline-none px-3 py-2.5 text-body-md bg-white"
      >
        <option value="">Seçiniz…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
