import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/teklif")({
  head: () => ({
    meta: [
      { title: "Teklif Al — Pratik" },
      { name: "description", content: "Projeleriniz için özel fiyat teklifi alın." },
    ],
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