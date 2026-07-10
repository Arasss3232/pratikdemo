import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/markalar")({
  head: () => ({
    meta: [
      { title: "Yetkili Distribütör Markalar — Pratik" },
      { name: "description", content: "Bosch, Makita, DeWalt, Hilti, Milwaukee ve daha fazlası — Pratik güvencesiyle sunulan profesyonel endüstriyel donanım markaları." },
      { property: "og:title", content: "Yetkili Distribütör Markalar — Pratik" },
      { property: "og:description", content: "Dünyanın önde gelen endüstriyel donanım markalarının orijinal, garantili ürünleri Pratik'te." },
      { property: "og:url", content: "/markalar" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/markalar" }],
  }),
  component: MarkalarPage,
});

function MarkalarPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Markalar"
        crumb="Markalar"
        description="Pratik güvencesiyle sunduğumuz dünya çapında profesyonel endüstriyel donanım markaları."
      />
    </SiteShell>
  );
}