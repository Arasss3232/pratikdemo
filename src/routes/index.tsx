import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "../components/site-shell";
import { HomeHero } from "../components/home/HomeHero";
import { BrochureSlider } from "../components/home/BrochureSlider";
import { CategoryExplorer } from "../components/home/CategoryExplorer";
import {
  BrandStrip,
  ContactInfo,
  FeaturedProducts,
  InsightsPreview,
  MobileContactBar,
  ProcessTimeline,
  QuoteCTA,
  SectorGrid,
  SelectedReferences,
  ServicesStrip,
  ValueProps,
  WhyChoose,
} from "../components/home/HomeSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Endüstriyel Donanım Tedariki — Pratik" },
      {
        name: "description",
        content:
          "Elektrikli el aletlerinden bağlantı elemanlarına, endüstriyel tesisleriniz ve şantiyeleriniz için profesyonel donanım tedariki, teknik destek ve kurumsal teklif hizmetleri.",
      },
      { property: "og:title", content: "Endüstriyel Donanım Tedariki — Pratik" },
      {
        property: "og:description",
        content:
          "Elektrikli el aletlerinden bağlantı elemanlarına, endüstriyel tesisleriniz ve şantiyeleriniz için profesyonel donanım tedariki ve kurumsal teklif hizmetleri.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <>
        <BrochureSlider />
        <HomeHero />
        <CategoryExplorer />
        <ValueProps />
        <SectorGrid />
        <FeaturedProducts />
        <WhyChoose />
        <BrandStrip />
        <SelectedReferences />
        <ProcessTimeline />
        <QuoteCTA />
        <ContactInfo />
        <MobileContactBar />
      </>
    </SiteShell>
  );
}
