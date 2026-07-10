import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/sektorel")({
  head: () => ({
    meta: [
      { title: "Sektörel Çözümler — Pratik" },
      { name: "description", content: "İnşaat, metal, otomotiv, enerji ve üretim sektörlerine özel donanım çözümleri." },
    ],
  }),
  component: SektorelPage,
});

function SektorelPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Sektörel Çözümler"
        crumb="Sektörel"
        description="Sektörünüze özel seçilmiş donanım paketleri ve uygulama uzmanı desteğimiz."
      />
    </SiteShell>
  );
}