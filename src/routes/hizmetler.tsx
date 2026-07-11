import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell, Icon } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { supabase } from "@/integrations/supabase/client";

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

type Service = { id: string; slug: string; title: string; excerpt: string | null; icon: string | null; cover_url: string | null };

function HizmetlerPage() {
  const [items, setItems] = useState<Service[]>([]);
  useEffect(() => {
    supabase.from("services").select("*").eq("published", true).order("display_order").then(({ data }) => setItems((data as Service[]) ?? []));
  }, []);
  return (
    <SiteShell>
      <PageHero
        title="Hizmetlerimiz"
        description="Teknik servis, bakım, kalibrasyon ve saha destek dahil olmak üzere uçtan uca endüstriyel hizmetler."
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Hizmetler" }]}
      />
      <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((s) => (
          <Link
            key={s.id}
            to="/hizmetler/$slug"
            params={{ slug: s.slug }}
            className="group flex flex-col bg-surface-container-lowest border border-outline-variant hover:border-primary transition-colors"
          >
            {s.cover_url && (
              <img src={s.cover_url} alt={s.title} className="aspect-video w-full object-cover" loading="lazy" />
            )}
            <div className="p-6 flex flex-col gap-3 flex-grow">
              {s.icon && <Icon name={s.icon} className="text-[32px] text-primary" />}
              <h3 className="font-headline-sm text-headline-sm group-hover:text-primary">{s.title}</h3>
              {s.excerpt && <p className="text-body-sm text-on-surface-variant">{s.excerpt}</p>}
              <span className="text-primary text-body-sm font-label-bold mt-auto">Detayı gör →</span>
            </div>
          </Link>
        ))}
        {items.length === 0 && <p className="text-on-surface-variant col-span-full">Henüz hizmet eklenmedi.</p>}
      </div>
    </SiteShell>
  );
}