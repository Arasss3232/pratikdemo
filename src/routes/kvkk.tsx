import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/kvkk")({
  head: () => ({
    meta: [
      { title: "KVKK ve Gizlilik — Pratik" },
      { name: "description", content: "Kişisel verilerin korunması ve gizlilik politikamız." },
    ],
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