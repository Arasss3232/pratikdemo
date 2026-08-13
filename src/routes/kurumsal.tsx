import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { usePageContent } from "@/hooks/use-page-content";
import { 
  CorporateIntroduction, 
  MissionVision, 
  CorporateValues, 
  WorkingProcess, 
  CorporateAdvantages, 
  CorporateCTA,
  ContactStrip
} from "../components/corporate/CorporateSections";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/kurumsal")({
  head: () => ({
    meta: [
      { title: "Kurumsal — Pratik Tedarik Yapı" },
      { name: "description", content: "Endüstriyel tedarikte güvenilir çözüm ortağınız. Pratik Tedarik Yapı olarak kurumsal değerlerimiz, misyonumuz ve çalışma prensiplerimizle yanınızdayız." },
      { property: "og:title", content: "Kurumsal — Pratik Tedarik Yapı" },
      { property: "og:description", content: "Sanayinin çözüm ortağı: Misyonumuz, vizyonumuz ve kurumsal değerlerimiz." },
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
          name: "Pratik Tedarik Yapı Kurumsal",
          url: "/kurumsal",
        }),
      },
    ],
  }),
  component: KurumsalPage,
});

function KurumsalPage() {
  const { sections, loading } = usePageContent("/kurumsal");

  if (loading) {
    return (
      <SiteShell>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-navy-900/40">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium">Kurumsal bilgiler yükleniyor...</p>
        </div>
      </SiteShell>
    );
  }

  const hero = sections["hero"];
  const introduction = sections["introduction"];
  const missionVision = sections["mission_vision"];
  const values = sections["values"];
  const process = sections["process"];
  const advantages = sections["advantages"];
  const cta = sections["cta"];

  return (
    <SiteShell>
      {hero && (
        <PageHero
          title={hero.content.title?.value_text || "Kurumsal"}
          description={hero.content.description?.value_text}
          breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Kurumsal" }]}
        />
      )}
      
      {introduction && <CorporateIntroduction section={introduction} />}
      {missionVision && <MissionVision section={missionVision} />}
      {values && <CorporateValues section={values} />}
      {process && <WorkingProcess section={process} />}
      {advantages && <CorporateAdvantages section={advantages} />}
      {cta && <CorporateCTA section={cta} />}
      
      <ContactStrip />
    </SiteShell>
  );
}