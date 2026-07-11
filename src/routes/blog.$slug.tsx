import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Blog` },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
  }),
  component: BlogDetail,
});

type Post = { id: string; title: string; body: string | null; excerpt: string | null; cover_url: string | null; author: string | null; published_at: string | null };

function BlogDetail() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  useEffect(() => {
    supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle().then(({ data }) => setPost((data as Post) ?? null));
  }, [slug]);
  if (post === undefined) return <SiteShell><div className="p-16 text-center text-on-surface-variant">Yükleniyor…</div></SiteShell>;
  if (post === null) throw notFound();
  return (
    <SiteShell>
      <PageHero
        title={post.title}
        description={post.excerpt ?? undefined}
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Blog", to: "/blog" }, { label: post.title }]}
      />
      <article className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16">
        {post.cover_url && <img src={post.cover_url} alt={post.title} className="w-full aspect-video object-cover mb-8" />}
        <p className="text-body-sm text-on-surface-variant mb-6">
          {post.author} · {post.published_at && new Date(post.published_at).toLocaleDateString("tr-TR")}
        </p>
        <div
          className="max-w-none [&_h2]:font-headline-md [&_h2]:text-headline-md [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4"
          dangerouslySetInnerHTML={{ __html: post.body ?? "" }}
        />
        <Link to="/blog" className="text-primary underline mt-8 inline-block">← Tüm yazılar</Link>
      </article>
    </SiteShell>
  );
}