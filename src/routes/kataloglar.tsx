import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/kataloglar")({
  head: () => ({
    meta: [
      { title: "Ürün Katalogları ve Teknik Dokümanlar — Pratik" },
      { name: "description", content: "Marka bazlı güncel ürün kataloglarını ve teknik dokümanları indirin. Bosch, Makita, DeWalt, Hilti kataloglarına tek noktadan ulaşın." },
      { property: "og:title", content: "Ürün Katalogları ve Teknik Dokümanlar — Pratik" },
      { property: "og:description", content: "Marka bazlı güncel ürün katalogları ve teknik dokümanlar tek noktada." },
      { property: "og:url", content: "/kataloglar" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/kataloglar" }],
  }),
  component: KataloglarPage,
});

function KataloglarPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Kataloglar"
        crumb="Kataloglar"
        description="Marka bazlı güncel ürün kataloglarımıza ve teknik dokümanlarımıza buradan ulaşabilirsiniz."
      />
    </SiteShell>
  );
}