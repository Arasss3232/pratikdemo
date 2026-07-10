import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/teknik-destek")({
  head: () => ({
    meta: [
      { title: "Teknik Destek ve Servis — Pratik" },
      { name: "description", content: "Ürün seçimi, kurulum, arıza tespiti ve düzenli bakım için uzman teknik destek ekibimiz yanınızda." },
      { property: "og:title", content: "Teknik Destek ve Servis — Pratik" },
      { property: "og:description", content: "Ürün seçimi, kurulum, arıza ve bakım için uzman teknik destek." },
      { property: "og:url", content: "/teknik-destek" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/teknik-destek" }],
  }),
  component: TeknikDestekPage,
});

function TeknikDestekPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Teknik Destek"
        crumb="Teknik Destek"
        description="Ürün seçimi, kurulum, arıza tespiti ve düzenli bakım için uzman ekibimiz yanınızda."
      />
    </SiteShell>
  );
}