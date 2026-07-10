import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/kurumsal")({
  head: () => ({
    meta: [
      { title: "Kurumsal — Pratik" },
      { name: "description", content: "Pratik hakkında: misyonumuz, ekibimiz ve kurumsal değerlerimiz." },
    ],
  }),
  component: KurumsalPage,
});

function KurumsalPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Kurumsal"
        crumb="Kurumsal"
        description="Endüstriyel donanım tedarikinde güvenilir çözüm ortağı olarak hikâyemizi ve değerlerimizi keşfedin."
      />
    </SiteShell>
  );
}