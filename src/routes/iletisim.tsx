import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteShell, Icon } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/use-site-settings";
import { buttonStyles } from "../lib/button-styles";
import { usePageContent } from "@/hooks/use-page-content";
import { useSiteContent } from "@/hooks/use-site-content";

export const Route = createFileRoute("/iletisim")({
  head: () => ({
    meta: [
      { title: "İletişim — Pratik Endüstriyel" },
      { name: "description", content: "Pratik Endüstriyel ile iletişime geçin: satış, teknik destek, kurumsal talepler için telefon, e-posta ve ofis bilgileri." },
      { property: "og:title", content: "İletişim — Pratik Endüstriyel" },
      { property: "og:description", content: "Satış, teknik destek ve kurumsal talepler için ekibimize ulaşın." },
      { property: "og:url", content: "/iletisim" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/iletisim" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "İletişim — Pratik Endüstriyel",
          url: "/iletisim",
        }),
      },
    ],
  }),
  component: IletisimPage,
});

function IletisimPage() {
  const { settings: s } = useSiteSettings();
  const safeS = s || {} as any;
  const { sections } = usePageContent("/iletisim");
  const hero = sections["hero"]?.content || {};
  
  const { data: cmsContact } = useSiteContent("contact");
  const { data: cmsTopBar } = useSiteContent("top_bar");
  
  const address = cmsTopBar?.address || safeS.address;
  const phone = cmsTopBar?.phone || safeS.phone;
  const email = safeS.email;
  const workingHours = cmsTopBar?.working_hours || safeS.working_hours;
  const mapUrl = cmsContact?.map_embed_url || safeS.map_embed;

  const [form, setForm] = useState({ name: "", email: "", phone: "", department: "", subject: "", message: "", kvkk: false });
  const [msg, setMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.kvkk) {
      setMsg("Lütfen KVKK Aydınlatma Metni'ni kabul edin.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert([{
      name: form.name,
      email: form.email,
      phone: form.phone,
      department: form.department,
      subject: form.subject,
      message: form.message
    }]);
    setSubmitting(false);
    if (error) {
      setMsg("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } else {
      setMsg("Mesajınız başarıyla gönderildi.");
      setForm({ name: "", email: "", phone: "", department: "", subject: "", message: "", kvkk: false });
    }
  }

  return (
    <SiteShell>
      <PageHero
        title={cmsContact?.page_title || hero.title?.value_text || "Bize Ulaşın"}
        description={cmsContact?.contact_subtitle || hero.description?.value_text || "Satış, teknik destek ve kurumsal talepleriniz için ekibimize ulaşın."}
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "İletişim" }]}
      />
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-16 grid lg:grid-cols-3 gap-10">
        <aside className="lg:col-span-1 flex flex-col gap-6">
          {address && (
            <div className="flex gap-3">
              <Icon name="location_on" className="text-primary" />
              <div><p className="font-label-bold">Adres</p><p className="text-body-sm text-on-surface-variant whitespace-pre-line">{address}</p></div>
            </div>
          )}
          {phone && (
            <div className="flex gap-3">
              <Icon name="call" className="text-primary" />
              <div><p className="font-label-bold">Telefon</p><a href={`tel:${phone.replace(/[^\d]/g, "")}`} className="text-body-sm text-on-surface-variant hover:text-primary">{phone}</a></div>
            </div>
          )}
          {email && (
            <div className="flex gap-3">
              <Icon name="mail" className="text-primary" />
              <div><p className="font-label-bold">E-posta</p><a href={`mailto:${email}`} className="text-body-sm text-on-surface-variant hover:text-primary">{email}</a></div>
            </div>
          )}
          {workingHours && (
            <div className="flex gap-3">
              <Icon name="schedule" className="text-primary" />
              <div><p className="font-label-bold">Çalışma Saatleri</p><p className="text-body-sm text-on-surface-variant">{workingHours}</p></div>
            </div>
          )}
          {mapUrl && (
            <iframe
              src={mapUrl}
              className="w-full aspect-video border border-outline-variant"
              loading="lazy"
              title="Konum haritası"
            />
          )}
        </aside>
        <form onSubmit={submit} className="lg:col-span-2 border border-outline-variant p-6 bg-surface-container-lowest grid sm:grid-cols-2 gap-3">
          <input required placeholder="Ad Soyad *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-outline-variant rounded px-3 py-2 sm:col-span-1" />
          <input required type="email" placeholder="E-posta *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-outline-variant rounded px-3 py-2 sm:col-span-1" />
          <input placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-outline-variant rounded px-3 py-2 sm:col-span-1" />
          <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="border border-outline-variant rounded px-3 py-2 sm:col-span-1">
            <option value="">Departman</option>
            <option value="Satış">Satış</option>
            <option value="Teknik Destek">Teknik Destek</option>
            <option value="Kurumsal">Kurumsal</option>
            <option value="Diğer">Diğer</option>
          </select>
          <input placeholder="Konu" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="border border-outline-variant rounded px-3 py-2 sm:col-span-2" />
          <textarea required placeholder="Mesajınız *" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="border border-outline-variant rounded px-3 py-2 min-h-32 sm:col-span-2" />
          <label className="flex items-center gap-2 text-body-sm sm:col-span-2">
            <input type="checkbox" checked={form.kvkk} onChange={(e) => setForm({ ...form, kvkk: e.target.checked })} />
            KVKK Aydınlatma Metni'ni okudum, kabul ediyorum.
          </label>
          <button disabled={submitting} type="submit" className={buttonStyles({ variant: "primary", size: "md", className: "sm:col-span-2" })}>
            {submitting ? "Gönderiliyor…" : "Mesaj Gönder"}
          </button>
          {msg && <p className="text-body-sm sm:col-span-2">{msg}</p>}
        </form>
      </div>
    </SiteShell>
  );
}