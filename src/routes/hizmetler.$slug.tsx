import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/hizmetler/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} — Hizmet` }],
    links: [{ rel: "canonical", href: `/hizmetler/${params.slug}` }],
  }),
  component: ServiceDetail,
});

type Service = { id: string; title: string; excerpt: string | null; body: string | null; cover_url: string | null };

function ServiceDetail() {
  const { slug } = Route.useParams();
  const [item, setItem] = useState<Service | null | undefined>(undefined);
  useEffect(() => {
    supabase.from("services").select("*").eq("slug", slug).eq("published", true).maybeSingle().then(({ data }) => setItem((data as Service) ?? null));
  }, [slug]);
  if (item === undefined) return <SiteShell><div className="p-16 text-center text-on-surface-variant">Yükleniyor…</div></SiteShell>;
  if (item === null) throw notFound();
  return (
    <SiteShell>
      <PageHero
        title={item.title}
        description={item.excerpt ?? undefined}
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Hizmetler", to: "/hizmetler" }, { label: item.title }]}
        bgImage={item.cover_url ?? undefined}
      />
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="text-body-lg text-on-surface-variant whitespace-pre-line">{item.body}</div>
        <div className="mt-10 flex gap-3">
          <Link to="/teklif" className="text-primary underline">Bu hizmet için teklif isteyin →</Link>
        </div>
      </div>
    </SiteShell>
  );
}