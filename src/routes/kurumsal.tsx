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
import { Helmet } from "react-helmet-async";

export const Route = createFileRoute("/kurumsal")({
  head: () => ({
    title: "Kurumsal | Pratik Tedarik Yapı - Endüstriyel Donanım Çözümleri",
    meta: [
      { name: "description", content: "Endüstriyel donanım tedariki, profesyonel çözüm ortaklığı ve kurumsal değerlerimiz hakkında bilgi edinin." },
      { property: "og:title", content: "Kurumsal - Pratik Tedarik Yapı" },
      { property: "og:description", content: "Endüstriyel donanım tedariki ve profesyonel çözüm ortaklığımız." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
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
  const missionVision = sections["mission-vision"];
  const values = sections["values"];
  const process = sections["process"];
  const advantages = sections["advantages"];
  const cta = sections["cta"];

  return (
    <SiteShell>
      {hero && (
        <PageHero
          title={hero.content.title?.value_text || "Kurumsal"}
          description={hero.content.description?.value_text ?? undefined}
          breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Kurumsal" }]}
        />
      )}

      {introduction && (
        <CorporateIntroduction 
          title={introduction.content.title?.value_text}
          description={introduction.content.description?.value_text}
          image={introduction.content.image?.media_url}
        />
      )}

      {missionVision && (
        <MissionVision 
          missionTitle={missionVision.content.mission_title?.value_text}
          missionText={missionVision.content.mission_text?.value_text}
          visionTitle={missionVision.content.vision_title?.value_text}
          visionText={missionVision.content.vision_text?.value_text}
        />
      )}

      {values && (
        <CorporateValues 
          title={values.content.title?.value_text}
          values={values.content.values_list?.value_json as any[]}
        />
      )}

      {process && (
        <WorkingProcess 
          title={process.content.title?.value_text}
          steps={process.content.steps?.value_json as any[]}
        />
      )}

      {advantages && (
        <CorporateAdvantages 
          title={advantages.content.title?.value_text}
          advantages={advantages.content.advantages_list?.value_json as any[]}
        />
      )}

      {cta && (
        <CorporateCTA 
          title={cta.content.title?.value_text}
          description={cta.content.description?.value_text}
          buttonLabel={cta.content.button_label?.value_text}
        />
      )}
      
      <ContactStrip />
    </SiteShell>
  );
}
