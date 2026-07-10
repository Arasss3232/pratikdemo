import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/sektorel")({
  head: () => ({
    meta: [
      { title: "Sektörel Çözümler — İnşaat, İmalat, Enerji | Pratik" },
      { name: "description", content: "İnşaat, metal, otomotiv, enerji ve üretim sektörlerine özel seçilmiş donanım paketleri ve uygulama uzmanı desteği." },
      { property: "og:title", content: "Sektörel Çözümler — İnşaat, İmalat, Enerji" },
      { property: "og:description", content: "Sektörünüze özel donanım paketleri ve uygulama desteği." },
      { property: "og:url", content: "/sektorel" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/sektorel" }],
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