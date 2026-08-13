import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "../components/site-shell";
import { usePageContent } from "@/hooks/use-page-content";
import { PageHero } from "../components/marketing/PageHero";

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
  const { sections } = usePageContent("/kvkk");
  const hero = sections["hero"]?.content || {};
  const content = sections["content"]?.content || {};

  return (
    <SiteShell>
      <PageHero
        title={hero.title?.value_text || "KVKK ve Gizlilik"}
        description={hero.description?.value_text || "Kişisel verilerinizin işlenmesine ilişkin haklarınız ve gizlilik politikamızın detayları."}
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "KVKK" }]}
      />
      {content.body?.value_text && (
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-20">
          <div className="prose prose-slate max-w-none prose-lg">
            <div dangerouslySetInnerHTML={{ __html: content.body.value_text }} />
          </div>
        </div>
      )}
    </SiteShell>
  );
}