import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell, Icon } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/use-site-settings";

export const Route = createFileRoute("/hakkimizda")({
  head: () => ({
    meta: [
      { title: "Hakkımızda — Pratik Endüstriyel" },
      { name: "description", content: "Pratik Endüstriyel; endüstriyel donanım tedarikinde deneyimli ekibi ve saha desteğiyle üretim tesislerinin çözüm ortağıdır." },
      { property: "og:title", content: "Hakkımızda — Pratik Endüstriyel" },
      { property: "og:description", content: "Kurumsal kimliğimiz, misyonumuz, vizyonumuz ve değerlerimiz." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/hakkimizda" }],
  }),
  component: HakkimizdaPage,
});

function HakkimizdaPage() {
  const settings = useSiteSettings();


  return (
    <SiteShell>
      <PageHero
        title="Hakkımızda"
        description={settings.description ?? "Endüstriyel donanımda güvenilir çözüm ortağınız."}
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Hakkımızda" }]}
      />
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col gap-16">
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest border border-outline-variant p-8">
            <Icon name="rocket_launch" className="text-[36px] text-primary mb-3" />
            <h2 className="font-headline-md text-headline-md mb-2">Misyonumuz</h2>
            <p className="text-on-surface-variant">Üretim ve şantiyelerin ihtiyacı olan her kalem endüstriyel donanımı zamanında, doğru ürünle ve rekabetçi maliyetle tedarik etmek; sahada ekipman verimliliğini teknik destekle sürekli iyileştirmek.</p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-8">
            <Icon name="visibility" className="text-[36px] text-primary mb-3" />
            <h2 className="font-headline-md text-headline-md mb-2">Vizyonumuz</h2>
            <p className="text-on-surface-variant">Türkiye’de endüstriyel donanım tedarikinin dijital ve saha destekli standardını belirleyen; müşterileri için en güvenilir tek adres olarak tanınan çözüm ortağı olmak.</p>
          </div>
        </section>

      </div>
    </SiteShell>
  );
}