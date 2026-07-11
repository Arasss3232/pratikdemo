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
      { property: "og:description", content: "Kurumsal kimliğimiz, ekibimiz, sertifikalarımız ve değerlerimiz." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/hakkimizda" }],
  }),
  component: HakkimizdaPage,
});

type Team = { id: string; name: string; role: string; photo_url: string | null; bio: string | null };
type Cert = { id: string; name: string; description: string | null; image_url: string | null };

function HakkimizdaPage() {
  const settings = useSiteSettings();
  const [team, setTeam] = useState<Team[]>([]);
  const [certs, setCerts] = useState<Cert[]>([]);

  useEffect(() => {
    supabase.from("team_members").select("*").eq("is_active", true).order("display_order").then(({ data }) => setTeam((data as Team[]) ?? []));
    supabase.from("certificates").select("*").order("display_order").then(({ data }) => setCerts((data as Cert[]) ?? []));
  }, []);

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

        {team.length > 0 && (
          <section>
            <h2 className="font-headline-lg text-headline-lg mb-6">Ekibimiz</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((t) => (
                <article key={t.id} className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col items-center text-center">
                  {t.photo_url && <img src={t.photo_url} alt={t.name} className="w-28 h-28 rounded-full object-cover mb-4" loading="lazy" />}
                  <h3 className="font-label-bold text-headline-sm">{t.name}</h3>
                  <p className="text-primary text-body-sm mb-2">{t.role}</p>
                  {t.bio && <p className="text-body-sm text-on-surface-variant">{t.bio}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {certs.length > 0 && (
          <section>
            <h2 className="font-headline-lg text-headline-lg mb-6">Sertifikalarımız</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((c) => (
                <article key={c.id} className="bg-surface-container-lowest border border-outline-variant p-6">
                  {c.image_url && <img src={c.image_url} alt={c.name} className="w-full h-40 object-cover mb-4" loading="lazy" />}
                  <h3 className="font-label-bold mb-1">{c.name}</h3>
                  {c.description && <p className="text-body-sm text-on-surface-variant">{c.description}</p>}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteShell>
  );
}