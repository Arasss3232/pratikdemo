import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/teknik-destek")({
  head: () => ({
    meta: [
      { title: "Teknik Destek — Pratik" },
      { name: "description", content: "Ürün seçimi, kurulum, arıza ve bakım için teknik destek." },
    ],
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