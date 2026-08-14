import { useSiteContent } from "@/hooks/use-site-content";
import { usePageContent, type PageSection } from "@/hooks/use-page-content";
import { CorporateIntroduction, MissionVision, CorporateValues, WorkingProcess, CorporateAdvantages, CorporateCTA, ContactStrip } from "@/components/corporate/CorporateSections";
import { SiteShell } from "@/components/site-shell";
import { PageHero } from "@/components/marketing/PageHero";
import { Loader2 } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

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
  const { data: cmsCorporate } = useSiteContent("corporate");

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
          title={cmsCorporate?.page_title || hero.content.title?.value_text || "Kurumsal"}
          description={cmsCorporate?.page_subtitle || hero.content.description?.value_text ?? undefined}
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
