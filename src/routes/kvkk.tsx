import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/kvkk")({
  head: () => ({
    meta: [
      { title: "KVKK Aydınlatma Metni — Pratik" },
      { name: "description", content: "Kişisel verilerin korunması ve gizlilik politikamız hakkında bilgi ve haklarınız." },
      { property: "og:title", content: "KVKK Aydınlatma Metni — Pratik" },
      { property: "og:description", content: "Kişisel verilerin işlenmesine ilişkin haklarınız ve politikamız." },
      { property: "og:url", content: "/kvkk" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/kvkk" }],
  }),
  component: KvkkPage,
});

function KvkkPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="KVKK ve Gizlilik"
        crumb="KVKK"
        description="Kişisel verilerinizin işlenmesine ilişkin haklarınız ve gizlilik politikamızın detayları."
      />
    </SiteShell>
  );
}