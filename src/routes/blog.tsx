import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Pratik Endüstriyel" },
      { name: "description", content: "Endüstriyel tedarik, saha uygulamaları ve ürün rehberleri hakkında güncel içerikler." },
      { property: "og:title", content: "Blog — Pratik Endüstriyel" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

type Post = { id: string; slug: string; title: string; excerpt: string | null; cover_url: string | null; author: string | null; published_at: string | null };

function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false }).then(({ data }) => setPosts((data as Post[]) ?? []));
  }, []);
  return (
    <SiteShell>
      <PageHero
        title="Blog"
        description="Endüstriyel dünyadan haberler, teknik rehberler ve sektörel analizler."
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Blog" }]}
      />
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article key={p.id} className="bg-surface-container-lowest border border-outline-variant flex flex-col">
            {p.cover_url && (
              <Link to="/blog/$slug" params={{ slug: p.slug }}>
                <img src={p.cover_url} alt={p.title} className="aspect-video w-full object-cover" loading="lazy" />
              </Link>
            )}
            <div className="p-5 flex flex-col gap-2 flex-grow">
              <h3 className="font-headline-sm text-headline-sm">
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-primary">{p.title}</Link>
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                {p.author} · {p.published_at && new Date(p.published_at).toLocaleDateString("tr-TR")}
              </p>
              {p.excerpt && <p className="text-body-sm text-on-surface-variant line-clamp-3">{p.excerpt}</p>}
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="text-primary text-body-sm font-label-bold mt-auto">Devamını oku →</Link>
            </div>
          </article>
        ))}
        {posts.length === 0 && <p className="text-on-surface-variant col-span-full">Henüz yayınlanmış yazı yok.</p>}
      </div>
    </SiteShell>
  );
}