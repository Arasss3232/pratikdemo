import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/kataloglar")({
  head: () => ({
    meta: [
      { title: "Kataloglar — Pratik" },
      { name: "description", content: "Ürün katalogları ve teknik dokümantasyon." },
    ],
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