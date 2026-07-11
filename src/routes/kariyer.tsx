import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell, Icon } from "../components/site-shell";
import { PageHero } from "../components/marketing/PageHero";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/kariyer")({
  head: () => ({
    meta: [
      { title: "Kariyer — Pratik Endüstriyel" },
      { name: "description", content: "Pratik Endüstriyel'de açık pozisyonlar. Endüstriyel tedarikte kariyerinizi büyütün." },
      { property: "og:title", content: "Kariyer — Pratik Endüstriyel" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/kariyer" }],
  }),
  component: KariyerPage,
});

type Job = { id: string; slug: string; title: string; department: string | null; location: string | null; employment_type: string | null; summary: string | null };

function KariyerPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    supabase.from("job_posts").select("*").eq("published", true).order("display_order").then(({ data }) => setJobs((data as Job[]) ?? []));
  }, []);
  return (
    <SiteShell>
      <PageHero
        title="Kariyer Fırsatları"
        description="Ekibimize katılın, endüstriyel tedarikte fark yaratın."
        breadcrumb={[{ label: "Ana Sayfa", to: "/" }, { label: "Kariyer" }]}
      />
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col gap-4">
        {jobs.map((j) => (
          <Link
            key={j.id}
            to="/kariyer/$slug"
            params={{ slug: j.slug }}
            className="border border-outline-variant hover:border-primary p-6 flex flex-col md:flex-row md:items-center gap-4 bg-surface-container-lowest transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-headline-sm text-headline-sm mb-1">{j.title}</h3>
              <p className="text-body-sm text-on-surface-variant">
                {[j.department, j.location, j.employment_type].filter(Boolean).join(" · ")}
              </p>
              {j.summary && <p className="text-body-sm mt-2">{j.summary}</p>}
            </div>
            <Icon name="arrow_forward" className="text-primary" />
          </Link>
        ))}
        {jobs.length === 0 && <p className="text-on-surface-variant">Şu anda açık pozisyon bulunmuyor.</p>}
      </div>
    </SiteShell>
  );
}