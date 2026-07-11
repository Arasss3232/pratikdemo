import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "../site-shell";
import { ROLE_LABELS_TR, type PortalContext } from "@/hooks/use-portal-context";

type NavItem = { to: string; label: string; icon: string; badge?: number };

function useNav(ctx: PortalContext): NavItem[] {
  const base: NavItem[] = [
    { to: "/portal", label: "Panelim", icon: "space_dashboard" },
    { to: "/portal/urunler", label: "Ürün Kataloğu", icon: "inventory_2" },
    { to: "/portal/hizli-siparis", label: "Hızlı Sipariş", icon: "bolt" },
    { to: "/portal/teklif-al", label: "Teklif Talep Et", icon: "request_quote" },
    { to: "/portal/tekliflerim", label: "Tekliflerim", icon: "description" },
    { to: "/portal/siparislerim", label: "Siparişlerim", icon: "shopping_bag" },
  ];
  if (ctx.can("view_finance")) {
    base.push({ to: "/portal/finans", label: "Finansım", icon: "account_balance_wallet" });
  }
  base.push({ to: "/portal/hesap", label: "Firma Hesabım", icon: "business" });
  return base;
}

export function PortalShell({ ctx, children }: { ctx: PortalContext; children: ReactNode }) {
  const nav = useNav(ctx);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/giris", replace: true });
  }

  const initials = ctx.email
    ? ctx.email.slice(0, 2).toUpperCase()
    : "??";

  const activeName = ctx.activeCompany?.trade_name || ctx.activeCompany?.legal_name || "—";

  return (
    <div className="min-h-screen portal-scope" style={{ background: "var(--portal-bg)" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-30 h-14 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6"
        style={{ background: "var(--portal-surface)", borderBottom: "1px solid var(--portal-border)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => setMobileOpen((v) => !v)} className="md:hidden grid place-items-center h-9 w-9 rounded-lg hover:bg-black/5" aria-label="Menü">
            <Icon name={mobileOpen ? "close" : "menu"} className="text-[22px]" />
          </button>
          <Link to="/portal" className="flex items-center gap-2 min-w-0">
            <span className="grid place-items-center h-8 w-8 rounded-lg font-black text-[13px]" style={{ background: "var(--portal-navy)", color: "var(--portal-yellow)" }}>P</span>
            <span className="hidden sm:flex flex-col leading-tight min-w-0">
              <span className="text-[13px] font-black tracking-tight truncate" style={{ color: "var(--portal-navy)" }}>Pratik B2B Portal</span>
              <span className="text-[10.5px] uppercase tracking-wider font-semibold truncate" style={{ color: "var(--portal-text-mute)" }}>Endüstriyel Hırdavat</span>
            </span>
          </Link>
        </div>

        {/* Company switcher */}
        <div className="relative min-w-0 justify-self-end md:justify-self-center md:w-[360px]">
          <button
            onClick={() => setSwitcherOpen((v) => !v)}
            className="w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 h-10 px-3 rounded-lg border text-left"
            style={{ borderColor: "var(--portal-border)", background: "var(--portal-bg)" }}
            aria-haspopup="listbox" aria-expanded={switcherOpen}
          >
            <Icon name="business" className="text-[18px]" style={{ color: "var(--portal-navy)" }} />
            <div className="min-w-0">
              <p className="text-[12.5px] font-bold truncate" style={{ color: "var(--portal-text)" }}>{activeName}</p>
              <p className="text-[10.5px] truncate" style={{ color: "var(--portal-text-mute)" }}>
                {ctx.role ? ROLE_LABELS_TR[ctx.role] : ""} · {ctx.memberships.length} firma
              </p>
            </div>
            <Icon name="unfold_more" className="text-[18px]" style={{ color: "var(--portal-text-mute)" }} />
          </button>
          {switcherOpen && (
            <>
              <button className="fixed inset-0 z-40" onClick={() => setSwitcherOpen(false)} aria-label="Kapat" />
              <ul role="listbox" className="absolute z-50 top-full mt-1 left-0 right-0 rounded-lg overflow-hidden shadow-lg" style={{ background: "var(--portal-surface)", border: "1px solid var(--portal-border)" }}>
                {ctx.memberships.map((m) => {
                  const isActive = m.company_id === ctx.activeCompany?.id;
                  return (
                    <li key={m.id}>
                      <button
                        onClick={() => { ctx.setActiveCompany(m.company_id); setSwitcherOpen(false); }}
                        className="w-full grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 text-left hover:bg-black/5"
                        style={{ background: isActive ? "var(--portal-yellow-soft)" : undefined }}
                        role="option" aria-selected={isActive}
                      >
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold truncate" style={{ color: "var(--portal-text)" }}>{m.company?.trade_name || m.company?.legal_name}</p>
                          <p className="text-[11px] truncate" style={{ color: "var(--portal-text-mute)" }}>{ROLE_LABELS_TR[m.role]}</p>
                        </div>
                        {isActive && <Icon name="check" className="text-[18px]" style={{ color: "var(--portal-navy)" }} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/" className="hidden sm:inline-flex items-center gap-1 text-[12.5px] font-medium h-9 px-3 rounded-lg hover:bg-black/5" style={{ color: "var(--portal-text-2)" }}>
            <Icon name="public" className="text-[16px]" /> Kamu Sitesi
          </Link>
          <div className="grid place-items-center h-8 w-8 rounded-full text-[11px] font-black" style={{ background: "var(--portal-navy)", color: "var(--portal-yellow)" }} title={ctx.email ?? ""}>
            {initials}
          </div>
          <button onClick={() => void signOut()} className="grid place-items-center h-9 w-9 rounded-lg hover:bg-black/5" title="Çıkış">
            <Icon name="logout" className="text-[20px]" style={{ color: "var(--portal-text-2)" }} />
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="grid md:grid-cols-[240px_minmax(0,1fr)]">
        {/* Sidebar desktop */}
        <aside className="hidden md:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto p-3" style={{ background: "var(--portal-surface)", borderRight: "1px solid var(--portal-border)" }}>
          <SidebarNav nav={nav} pathname={pathname} />
        </aside>

        {/* Sidebar mobile */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40" role="dialog" aria-modal="true">
            <button className="absolute inset-0" style={{ background: "rgba(6,20,38,0.5)" }} onClick={() => setMobileOpen(false)} aria-label="Kapat" />
            <aside className="relative w-[280px] h-full overflow-y-auto p-3" style={{ background: "var(--portal-surface)" }}>
              <SidebarNav nav={nav} pathname={pathname} />
            </aside>
          </div>
        )}

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarNav({ nav, pathname }: { nav: NavItem[]; pathname: string }) {
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Portal navigasyonu">
      {nav.map((n) => {
        const isActive = pathname === n.to || (n.to !== "/portal" && pathname.startsWith(n.to));
        return (
          <Link
            key={n.to}
            to={n.to}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 h-10 px-3 rounded-lg text-[13px] font-medium transition-colors"
            style={{
              background: isActive ? "var(--portal-yellow-soft)" : "transparent",
              color: isActive ? "var(--portal-navy)" : "var(--portal-text-2)",
              fontWeight: isActive ? 700 : 500,
            }}
          >
            <Icon name={n.icon} className="text-[20px]" />
            <span className="truncate">{n.label}</span>
            {typeof n.badge === "number" && n.badge > 0 && (
              <span className="min-w-[20px] h-5 grid place-items-center px-1.5 rounded-full text-[10.5px] font-bold" style={{ background: "var(--portal-navy)", color: "var(--portal-yellow)" }}>
                {n.badge}
              </span>
            )}
          </Link>
        );
      })}
      <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--portal-border)" }}>
        <p className="px-3 text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--portal-text-mute)" }}>Yardım</p>
        <Link to="/iletisim" className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 h-9 px-3 rounded-lg text-[12.5px] hover:bg-black/5" style={{ color: "var(--portal-text-2)" }}>
          <Icon name="support_agent" className="text-[18px]" />
          Satış Temsilcime Yaz
        </Link>
      </div>
    </nav>
  );
}