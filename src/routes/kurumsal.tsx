import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { usePageContent } from "@/hooks/use-page-content";

export const Route = createFileRoute("/kurumsal")({
  head: () => ({
    meta: [
      { title: "Kurumsal — Pratik Endüstriyel Hakkında" },
      { name: "description", content: "Pratik Endüstriyel: 25 yılı aşkın deneyim, güvenilir tedarik ağı ve uzman ekibimizle sanayinin çözüm ortağı." },
      { property: "og:title", content: "Kurumsal — Pratik Endüstriyel Hakkında" },
      { property: "og:description", content: "Misyonumuz, ekibimiz ve değerlerimizle sanayinin çözüm ortağı." },
      { property: "og:url", content: "/kurumsal" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/kurumsal" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Pratik Endüstriyel Hakkında",
          url: "/kurumsal",
        }),
      },
    ],
  }),
  component: KurumsalPage,
});

function KurumsalPage() {
  const { sections } = usePageContent("/kurumsal");
  const hero = sections["hero"]?.content || {};
  const intro = sections["intro"]?.content || {};

  return (
    <SiteShell>
      <PageHero
        title={hero.title?.value_text || "Kurumsal"}
        description={hero.description?.value_text || "Endüstriyel donanım tedarikinde güvenilir çözüm ortağı olarak hikâyemizi ve değerlerimizi keşfedin."}
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Kurumsal" }]}
      />
      
      {intro.content?.value_text && (
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
          <div className="prose prose-slate max-w-none prose-lg">
            <div dangerouslySetInnerHTML={{ __html: intro.content.value_text }} />
          </div>
        </div>
      )}
    </SiteShell>
  );
}