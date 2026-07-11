import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PortalShell } from "@/components/portal/PortalShell";
import { usePortalContext, type PortalContext } from "@/hooks/use-portal-context";
import { Icon } from "@/components/site-shell";

export const Route = createFileRoute("/portal")({
  ssr: false,
  head: () => ({ meta: [{ title: "B2B Portal — Pratik" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: PortalLayout,
});

function PortalLayout() {
  const [checked, setChecked] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();
  const ctx = usePortalContext();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (!data.user) {
        navigate({ to: "/giris", replace: true });
        return;
      }
      setSignedIn(true);
      setChecked(true);
    });
    return () => { mounted = false; };
  }, [navigate]);

  if (!checked || !signedIn) return <FullscreenSplash label="Portal yükleniyor..." />;
  if (ctx.loading) return <FullscreenSplash label="Firma bilgileri yükleniyor..." />;
  if (ctx.memberships.length === 0) return <NoMembership ctx={ctx} />;

  return (
    <PortalShell ctx={ctx}>
      <Outlet />
    </PortalShell>
  );
}

function FullscreenSplash({ label }: { label: string }) {
  return (
    <div className="min-h-screen grid place-items-center portal-scope" style={{ background: "var(--portal-bg)" }}>
      <div className="flex flex-col items-center gap-3">
        <span className="grid place-items-center h-12 w-12 rounded-xl animate-pulse" style={{ background: "var(--portal-navy)", color: "var(--portal-yellow)" }}>
          <Icon name="hourglass" className="text-[24px]" />
        </span>
        <p className="text-[13px]" style={{ color: "var(--portal-text-2)" }}>{label}</p>
      </div>
    </div>
  );
}

function NoMembership({ ctx }: { ctx: PortalContext }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen grid place-items-center p-6 portal-scope" style={{ background: "var(--portal-bg)" }}>
      <div className="portal-card p-8 max-w-md w-full text-center">
        <div className="mx-auto grid place-items-center h-14 w-14 rounded-full mb-4" style={{ background: "var(--portal-yellow-soft)" }}>
          <Icon name="pending_actions" className="text-[28px]" style={{ color: "var(--portal-navy)" }} />
        </div>
        <h1 className="text-[18px] font-black mb-1" style={{ color: "var(--portal-text)" }}>Firma erişiminiz henüz aktif değil</h1>
        <p className="text-[13px] mb-5" style={{ color: "var(--portal-text-2)" }}>
          <b>{ctx.email}</b> adresi için onaylanmış ve aktif bir firma bulunamadı. Bayi başvurunuz incelemede olabilir veya bir firma yöneticisinin sizi eklemesi gerekebilir.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button className="portal-btn portal-btn-primary" onClick={() => navigate({ to: "/iletisim" })}>
            <Icon name="support_agent" className="text-[18px]" /> Bize Ulaşın
          </button>
          <button className="portal-btn portal-btn-outline" onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/giris", replace: true }); }}>
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}