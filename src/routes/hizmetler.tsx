import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/hizmetler")({
  head: () => ({
    meta: [
      { title: "Hizmetler — Pratik" },
      { name: "description", content: "Teknik servis, bakım, kalibrasyon ve saha destek hizmetleri." },
    ],
  }),
  component: HizmetlerPage,
});

function HizmetlerPage() {
  return (
    <SiteShell>
      <PagePlaceholder
        title="Hizmetler"
        crumb="Hizmetler"
        description="Teknik servis, bakım, kalibrasyon ve saha destek dahil olmak üzere uçtan uca hizmetlerimiz."
      />
    </SiteShell>
  );
}