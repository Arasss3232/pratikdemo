import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/teklif")({
  head: () => ({
    meta: [
      { title: "Toplu Teklif Formu — Endüstriyel Alım | Pratik" },
      { name: "description", content: "Proje ölçeğinize uygun toplu teklif, özel iskonto koşulları ve teknik şartname desteği için hemen teklif isteyin." },
      { property: "og:title", content: "Toplu Teklif Formu — Endüstriyel Alım | Pratik" },
      { property: "og:description", content: "Projeleriniz için özel fiyatlandırma ve teknik şartname desteği." },
      { property: "og:url", content: "/teklif" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/teklif" }],
  }),
  component: TeklifPage,
});

function TeklifPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Teklif Al"
        crumb="Teklif Al"
        description="Proje ölçeğinize uygun özel fiyatlandırma ve teknik şartname desteği için ekibimizle iletişime geçin."
      />
    </SiteShell>
  );
}