import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { buttonStyles } from "../lib/button-styles";

export const Route = createFileRoute("/kariyer/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} — Kariyer` }],
    links: [{ rel: "canonical", href: `/kariyer/${params.slug}` }],
  }),
  component: JobDetail,
});

type Job = { id: string; title: string; department: string | null; location: string | null; employment_type: string | null; summary: string | null; body: string | null };

function JobDetail() {
  const { slug } = Route.useParams();
  const [job, setJob] = useState<Job | null | undefined>(undefined);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cover_letter: "", cv_url: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("job_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle().then(({ data }) => setJob((data as Job) ?? null));
  }, [slug]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);
    setMsg(null);
    const { error } = await supabase.from("job_applications").insert({
      job_id: job.id,
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      cover_letter: form.cover_letter || null,
      cv_url: form.cv_url || null,
    });
    setSubmitting(false);
    if (error) setMsg(`Hata: ${error.message}`);
    else {
      setMsg("Başvurunuz alındı. En kısa sürede geri dönüş yapacağız.");
      setForm({ name: "", email: "", phone: "", cover_letter: "", cv_url: "" });
    }
  }

  if (job === undefined) return <SiteShell><div className="p-16 text-center text-on-surface-variant">Yükleniyor…</div></SiteShell>;
  if (job === null) throw notFound();

  return (
    <SiteShell>
      <PageHero
        title={job.title}
        description={[job.department, job.location, job.employment_type].filter(Boolean).join(" · ")}
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Kariyer", to: "/kariyer" }, { label: job.title }]}
      />
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 grid gap-10">
        {job.summary && <p className="text-body-lg text-on-surface-variant">{job.summary}</p>}
        {job.body && (
          <div
            className="max-w-none [&_h3]:font-headline-sm [&_h3]:text-headline-sm [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_p]:mb-3"
            dangerouslySetInnerHTML={{ __html: job.body }}
          />
        )}

        <form onSubmit={submit} className="border border-outline-variant p-6 bg-surface-container-lowest flex flex-col gap-3">
          <h2 className="font-headline-md text-headline-md">Bu Pozisyona Başvur</h2>
          <input required placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-outline-variant rounded px-3 py-2" />
          <input required type="email" placeholder="E-posta" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border border-outline-variant rounded px-3 py-2" />
          <input placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border border-outline-variant rounded px-3 py-2" />
          <input type="url" placeholder="CV Linki (Google Drive / LinkedIn)" value={form.cv_url} onChange={(e) => setForm({ ...form, cv_url: e.target.value })} className="border border-outline-variant rounded px-3 py-2" />
          <textarea placeholder="Kısa ön yazı (opsiyonel)" value={form.cover_letter} onChange={(e) => setForm({ ...form, cover_letter: e.target.value })} className="border border-outline-variant rounded px-3 py-2 min-h-24" />
          <button disabled={submitting} type="submit" className={buttonStyles({ variant: "primary", size: "md" })}>
            {submitting ? "Gönderiliyor…" : "Başvuruyu Gönder"}
          </button>
          {msg && <p className="text-body-sm">{msg}</p>}
        </form>
      </div>
    </SiteShell>
  );
}