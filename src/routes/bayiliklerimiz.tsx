import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/bayiliklerimiz")({
  head: () => ({
    meta: [
      { title: "Bayiliklerimiz — Pratik Endüstriyel" },
      { name: "description", content: "Yetkili bayisi olduğumuz dünya çapında profesyonel endüstriyel donanım markaları." },
      { property: "og:title", content: "Bayiliklerimiz — Pratik Endüstriyel" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/bayiliklerimiz" }],
  }),
  component: BayiliklerimizPage,
});

type Bayilik = { 
  id: string; 
  slug: string; 
  title: string; 
  client_name: string | null; 
  cover_url: string | null; 
  category: string | null;
  website_url: string | null;
};

function BayiliklerimizPage() {
  const [items, setItems] = useState<Bayilik[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("project_references")
      .select("id, slug, title, client_name, cover_url, category, website_url")
      .eq("published", true)
      .order("display_order")
      .then(({ data }) => {
        setItems((data as Bayilik[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <SiteShell>
      <PageHero
        title="Bayiliklerimiz"
        description="Yetkili bayisi olduğumuz güçlü marka iş birliklerimiz."
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Bayiliklerimiz" }]}
      />
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="pub-marker">YETKİLİ BAYİLİKLER</span>
            <h2 className="pub-h2 text-public-navy-950">Güçlü Marka İş Birliklerimiz</h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-public-border/30 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-public-steel">
              Henüz bayilik bilgisi eklenmedi.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="group relative aspect-square bg-white border border-public-border p-6 flex items-center justify-center transition-all hover:shadow-md hover:border-public-navy-700"
                >
                  {item.cover_url ? (
                    <img 
                      src={item.cover_url} 
                      alt={item.title} 
                      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300" 
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-bold text-public-navy-900 text-center">{item.title}</span>
                  )}
                  
                  {item.website_url && (
                    <a 
                      href={item.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-10"
                      aria-label={`${item.title} web sitesini ziyaret et`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
