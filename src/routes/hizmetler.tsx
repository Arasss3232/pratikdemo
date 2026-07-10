import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PagePlaceholder } from "../components/site-shell";

export const Route = createFileRoute("/hizmetler")({
  head: () => ({
    meta: [
      { title: "Endüstriyel Tedarik ve Servis Hizmetleri — Pratik" },
      { name: "description", content: "Teknik servis, bakım, kalibrasyon, saha destek ve toplu tedarik. Uçtan uca endüstriyel hizmetlerle projelerinize güç katın." },
      { property: "og:title", content: "Endüstriyel Tedarik ve Servis Hizmetleri — Pratik" },
      { property: "og:description", content: "Teknik servis, bakım, kalibrasyon ve saha destek dahil uçtan uca hizmetler." },
      { property: "og:url", content: "/hizmetler" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/hizmetler" }],
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