import { CategoryExplorer } from "./components/home/CategoryExplorer";
import { ValueProps, SectorGrid, WhyChoose, ContactMap } from "./components/home/HomeSections";
import { SiteShell } from "./components/site-shell";
import { HomeHero } from "./components/home/HomeHero";
import { BrandStrip } from "./components/home/HomeSections";
import { BrochureSlider } from "./components/home/BrochureSlider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pratik Tedarik Yapı — Endüstriyel Alım ve Tedarik Çözümleri" },
      { name: "description", content: "Sanayi, inşaat ve üretim tesisleri için profesyonel donanım tedariki. Elektrikli el aletlerinden bağlantı elemanlarına kurumsal çözümler." },
      { property: "og:title", content: "Pratik Tedarik Yapı — Endüstriyel Alım ve Tedarik Çözümleri" },
      { property: "og:description", content: "Sanayi, inşaat ve üretim tesisleri için profesyonel donanım tedariki." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteShell>
      <main>
        <BrochureSlider />
        <HomeHero />
        <BrandStrip />
        <CategoryExplorer />
        <ValueProps />
        <SectorGrid />
        <WhyChoose />
        <ContactMap />
      </main>
    </SiteShell>
  );
}
