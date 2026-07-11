import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/referanslar")({
  head: () => ({
    meta: [
      { title: "Referanslar — Pratik Endüstriyel" },
      { name: "description", content: "Otomotiv, petrokimya, inşaat ve gıda sektörlerinden tamamladığımız endüstriyel donanım projeleri." },
      { property: "og:title", content: "Referanslar — Pratik Endüstriyel" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/referanslar" }],
  }),
  component: ReferanslarPage,
});

type Ref = { id: string; slug: string; title: string; client_name: string | null; cover_url: string | null; description: string | null; category: string | null; project_date: string | null };

function ReferanslarPage() {
  const [items, setItems] = useState<Ref[]>([]);
  useEffect(() => {
    supabase.from("project_references").select("*").eq("published", true).order("display_order").then(({ data }) => setItems((data as Ref[]) ?? []));
  }, []);
  return (
    <SiteShell>
      <PageHero
        title="Referanslarımız"
        description="Farklı sektörlerdeki müşterilerimizle tamamladığımız projeler."
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Referanslar" }]}
      />
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((r) => (
          <article key={r.id} className="bg-surface-container-lowest border border-outline-variant flex flex-col">
            {r.cover_url && <img src={r.cover_url} alt={r.title} className="aspect-video w-full object-cover" loading="lazy" />}
            <div className="p-5 flex flex-col gap-2 flex-grow">
              {r.category && <span className="text-body-sm text-primary font-label-bold uppercase tracking-wide">{r.category}</span>}
              <h3 className="font-headline-sm text-headline-sm">{r.title}</h3>
              {r.client_name && <p className="text-body-sm text-on-surface-variant">{r.client_name}</p>}
              {r.description && <p className="text-body-sm text-on-surface-variant line-clamp-3">{r.description}</p>}
            </div>
          </article>
        ))}
        {items.length === 0 && <p className="text-on-surface-variant col-span-full">Henüz referans yayınlanmadı.</p>}
      </div>
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pb-16">
        <Link to="/teklif" className="text-primary underline">Sizin de projeniz için teklif isteyin →</Link>
      </div>
    </SiteShell>
  );
}