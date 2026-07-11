import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "../components/site-shell";
import { HomeHero } from "../components/home/HomeHero";
import { CategoryExplorer } from "../components/home/CategoryExplorer";
import {
  BrandStrip,
  FeaturedProducts,
  HomeUtilityStrip,
  InsightsPreview,
  MobileContactBar,
  ProcessTimeline,
  QuoteCTA,
  SectorGrid,
  SelectedReferences,
  ServicesStrip,
  ValueProps,
} from "../components/home/HomeSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Endüstriyel Donanım Tedariki — Pratik" },
      {
        name: "description",
        content:
          "Elektrikli el aletlerinden bağlantı elemanlarına, endüstriyel tesisleriniz ve şantiyeleriniz için profesyonel donanım tedariki, teknik destek ve toplu teklif hizmetleri.",
      },
      { property: "og:title", content: "Endüstriyel Donanım Tedariki — Pratik" },
      {
        property: "og:description",
        content:
          "Elektrikli el aletlerinden bağlantı elemanlarına, endüstriyel tesisleriniz ve şantiyeleriniz için profesyonel donanım tedariki, teknik destek ve toplu teklif hizmetleri.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "/" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteShell>
      <>
        <HomeUtilityStrip />
        <HomeHero />
        <CategoryExplorer />
        <ValueProps />
        <SectorGrid />
        <FeaturedProducts />
        <ProcessTimeline />
        <ServicesStrip />
        <BrandStrip />
        <SelectedReferences />
        <InsightsPreview />
        <QuoteCTA />
        <MobileContactBar />
      </>
    </SiteShell>
  );
}