import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/urunler/endustriyel-makineler")({
  head: () => ({
    meta: [
      { title: "Endüstriyel Makineler — Kompresör, Jeneratör | Pratik" },
      { name: "description", content: "Kompresör, jeneratör ve atölye ekipmanları. Profesyonel endüstriyel makine çözümleri." },
      { property: "og:title", content: "Endüstriyel Makineler | Pratik" },
      { property: "og:description", content: "Kompresör, jeneratör ve atölye ekipmanları." },
      { property: "og:url", content: "/urunler/endustriyel-makineler" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/urunler/endustriyel-makineler" }],
  }),
  component: () => (
    <SiteShell>
      <PagePlaceholder
        title="Endüstriyel Makineler"
        crumb="Endüstriyel Makineler"
        description="Kompresör, jeneratör ve atölye ekipmanları. Profesyonel endüstriyel makine çözümleri."
      />
    </SiteShell>
  ),
});