import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { Icon } from "../components/site-shell";
import { usePageContent } from "@/hooks/use-page-content";
import { supabase } from "@/integrations/supabase/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/kataloglar")({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData({
      queryKey: ["catalogs", "public"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("catalogs")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });
        if (error) throw error;
        return data;
      },
    });
  },
  head: () => ({
    meta: [
      { title: "Dijital Kataloglar — Pratik Endüstriyel" },
      { name: "description", content: "Endüstriyel ürün gruplarımıza ait güncel dijital kataloglarimizi inceleyin ve indirin." },
      { property: "og:title", content: "Dijital Kataloglar — Pratik Endüstriyel" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/kataloglar" }],
  }),
  component: KataloglarPage,
});

function KataloglarPage() {
  const { data: catalogs } = useSuspenseQuery({
    queryKey: ["catalogs", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalogs")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { sections } = usePageContent("/kataloglar");
  const hero = sections["hero"]?.content || {};

  return (
    <SiteShell>
      <PageHero
        title={hero.title?.value_text || "Dijital Kataloglar"}
        description={hero.description?.value_text || "Profesyonel ürün gruplarımıza ait teknik kataloglarımızı online inceleyebilir veya PDF olarak indirebilirsiniz."}
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Kataloglar" }]}
      />
      
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {catalogs?.map((k) => (
            <div key={k.id} className="group flex flex-col">
              <div className="relative aspect-a4 w-full bg-public-navy-950 overflow-hidden pub-ticks shadow-md transition-all group-hover:shadow-xl group-hover:-translate-y-1">
                <span className="pub-tick-bl" aria-hidden />
                <span className="pub-tick-br" aria-hidden />
                
                <img 
                  src={k.cover_image_url || "/placeholder.svg"} 
                  alt={k.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
                
                <div className="absolute top-4 left-4 z-10">
                   <span className="pub-mono px-3 py-1 bg-public-yellow-500 text-public-navy-950 text-[10px]">
                     {k.year}
                   </span>
                </div>

                <div className="absolute inset-0 bg-public-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a 
                    href={k.pdf_url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-public-yellow-500 text-public-navy-950 flex items-center justify-center hover:scale-110 transition-transform"
                    title="İndir"
                  >
                    <Icon name="download" />
                  </a>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <h3 className="text-[18px] font-bold text-public-navy-950 leading-tight group-hover:text-public-navy-700 transition-colors">
                  {k.title}
                </h3>
                <div className="flex items-center gap-3 pub-mono text-[10px] text-public-steel">
                  <span>{k.pages}</span>
                  <span className="w-1 h-1 rounded-full bg-public-border" />
                  <span>{k.file_size} PDF</span>
                </div>
                
                <a 
                  href={k.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-public-navy-700 font-bold text-[13px] flex items-center gap-2 hover:underline"
                >
                  İndir
                  <Icon name="download" className="text-[16px]" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 md:p-10 bg-public-navy-950 text-white relative overflow-hidden pub-ticks">
          <div className="absolute inset-0 pub-blueprint opacity-20 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="pub-h3 text-white mb-3">Basılı Katalog Talebi</h2>
              <p className="text-white/70 text-[15px] leading-relaxed">
                Kurumsal projeleriniz için basılı ürün kataloglarımızı adresinize gönderebiliriz. 
                Lütfen iletişim formumuz üzerinden veya doğrudan arayarak talepte bulunun.
              </p>
            </div>
            <Link to="/iletisim" className="pub-btn pub-btn-primary shrink-0">
              İletişime Geçin
              <Icon name="mail" />
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
