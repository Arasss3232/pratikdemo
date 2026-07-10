import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/markalar")({
  head: () => ({
    meta: [
      { title: "Markalar — Pratik Endüstriyel Donanım" },
      { name: "description", content: "Bosch, Makita, DeWalt, Hilti, Milwaukee ve daha fazlası — Pratik'in çalıştığı profesyonel markalar." },
    ],
  }),
  component: MarkalarPage,
});

function MarkalarPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Markalar"
        crumb="Markalar"
        description="Pratik güvencesiyle sunduğumuz dünya çapında profesyonel endüstriyel donanım markaları."
      />
    </SiteShell>
  );
}