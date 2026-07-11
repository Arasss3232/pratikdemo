import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Icon } from "../site-shell";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_NAV, findNavGroup, findNavItem, type AdminTab } from "./nav";

const STORAGE_KEY = "admin_sidebar_collapsed";
const THEME_KEY = "admin_theme";

export function AdminShell({
  tab,
  onTabChange,
  userEmail,
  onQuickAdd,
  children,
}: {
  tab: AdminTab;
  onTabChange: (t: AdminTab) => void;
  userEmail: string;
  onQuickAdd: (t: AdminTab) => void;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    const t = localStorage.getItem(THEME_KEY);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  function handleTab(t: AdminTab) {
    onTabChange(t);
    setMobileOpen(false);
  }

  const quickAddItems: { key: AdminTab; label: string; icon: string }[] = [
    { key: "products", label: "Yeni Ürün", icon: "inventory_2" },
    { key: "services", label: "Yeni Hizmet", icon: "handyman" },
    { key: "blog", label: "Yeni Blog Yazısı", icon: "article" },
    { key: "references", label: "Yeni Referans", icon: "workspace_premium" },
    { key: "jobs", label: "Yeni İş İlanı", icon: "work" },
  ];

  return (
    <div className="admin-scope min-h-screen flex" style={{ background: "var(--admin-bg)", color: "var(--admin-text)" }}>
      {/* Sidebar */}
      <SidebarPanel
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        tab={tab}
        onTab={handleTab}
      />

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center gap-2 px-3 md:px-5 backdrop-blur"
          style={{
            background: "color-mix(in oklab, var(--admin-surface) 92%, transparent)",
            borderBottom: "1px solid var(--admin-border)",
          }}
        >
          <button
            onClick={() => (window.innerWidth < 768 ? setMobileOpen(true) : toggleSidebar())}
            className="grid place-items-center h-9 w-9 rounded-lg hover:bg-[var(--admin-surface-2)]"
            style={{ color: "var(--admin-text-2)" }}
            aria-label="Menüyü aç/kapat"
          >
            <Icon name="menu" className="text-[20px]" />
          </button>

          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className="hidden sm:flex items-center gap-2 h-10 px-3 rounded-lg min-w-0 flex-1 max-w-lg focus-within:ring-2"
              style={{
                background: "var(--admin-surface-2)",
                border: "1px solid var(--admin-border)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4)",
              }}
            >
              <span className="shrink-0" style={{ color: "var(--admin-text-mute)" }}>
                <Icon name="search" className="text-[18px]" />
              </span>
              <input
                type="search"
                placeholder="Ara: sayfa, ürün, mesaj…"
                className="bg-transparent outline-none text-sm flex-1 min-w-0"
              />
              <kbd
                className="hidden md:inline text-[10px] rounded px-1.5 py-0.5"
                style={{ color: "var(--admin-text-mute)", border: "1px solid var(--admin-border)", background: "var(--admin-surface)" }}
              >
                /
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick add */}
            <div className="relative">
              <button
                onClick={() => setQuickOpen((v) => !v)}
                className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-lg text-sm font-semibold transition shadow-sm hover:brightness-95"
                style={{ background: "var(--admin-yellow)", color: "var(--admin-navy)" }}
              >
                <Icon name="add" className="text-[18px]" />
                Hızlı Ekle
              </button>
              <button
                onClick={() => setQuickOpen((v) => !v)}
                className="sm:hidden grid place-items-center h-9 w-9 rounded-lg"
                style={{ background: "var(--admin-yellow)", color: "var(--admin-navy)" }}
                aria-label="Hızlı ekle"
              >
                <Icon name="add" className="text-[20px]" />
              </button>
              {quickOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setQuickOpen(false)} />
                  <div
                    className="absolute right-0 top-12 z-50 w-60 rounded-xl shadow-xl py-1.5"
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                  >
                    {quickAddItems.map((q) => (
                      <button
                        key={q.key}
                        onClick={() => {
                          setQuickOpen(false);
                          onQuickAdd(q.key);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-[var(--admin-yellow-soft)]"
                      >
                        <span style={{ color: "var(--admin-navy)" }}>
                          <Icon name={q.icon} className="text-[18px]" />
                        </span>
                        {q.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link
              to="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm hover:bg-[var(--admin-surface-2)]"
              style={{ color: "var(--admin-text-2)" }}
              aria-label="Siteyi görüntüle"
            >
              <Icon name="open_in_new" className="text-[18px]" />
              Siteyi görüntüle
            </Link>

            <button
              onClick={toggleTheme}
              className="grid place-items-center h-10 w-10 rounded-lg hover:bg-[var(--admin-surface-2)]"
              style={{ color: "var(--admin-text-2)" }}
              aria-label="Temayı değiştir"
              title="Tema"
            >
              <Icon name={dark ? "light_mode" : "dark_mode"} className="text-[18px]" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 h-10 px-2 rounded-lg hover:bg-[var(--admin-surface-2)]"
                aria-label="Profil menüsü"
              >
                <div
                  className="h-8 w-8 rounded-full grid place-items-center text-sm font-bold ring-2"
                  style={{ background: "var(--admin-navy)", color: "var(--admin-yellow)", boxShadow: "0 0 0 2px var(--admin-yellow-soft)" }}
                >
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline text-sm max-w-[160px] truncate" style={{ color: "var(--admin-text)" }}>{userEmail}</span>
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div
                    className="absolute right-0 top-12 z-50 w-60 rounded-xl shadow-xl py-1.5"
                    style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
                  >
                    <div className="px-3 py-2.5" style={{ borderBottom: "1px solid var(--admin-border)" }}>
                      <p className="text-sm truncate font-medium">{userEmail}</p>
                      <p className="text-[11px]" style={{ color: "var(--admin-text-2)" }}>Yönetici</p>
                    </div>
                    <Link
                      to="/"
                      target="_blank"
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--admin-surface-2)]"
                    >
                      <span style={{ color: "var(--admin-text-2)" }}>
                        <Icon name="open_in_new" className="text-[18px]" />
                      </span>
                      Siteyi aç
                    </Link>
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50"
                      style={{ color: "var(--admin-danger)" }}
                    >
                      <Icon name="logout" className="text-[18px]" />
                      Çıkış yap
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar helpers use closure state via SidebarPanel above */}
      {/* Suppress unused-var warnings */}
      {(() => {
        void findNavGroup;
        void findNavItem;
        return null;
      })()}
    </div>
  );
}

function SidebarPanel({
  collapsed,
  mobileOpen,
  onMobileClose,
  tab,
  onTab,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  tab: AdminTab;
  onTab: (t: AdminTab) => void;
}) {
  const width = collapsed ? "md:w-16" : "md:w-64";

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${width} shrink-0
          fixed md:sticky top-0 z-50 md:z-auto h-dvh md:h-auto md:min-h-screen
          w-64 transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          flex flex-col`}
        style={{
          background: "linear-gradient(180deg, var(--admin-navy) 0%, var(--admin-navy-dark) 100%)",
          color: "#E7ECF3",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-2.5 px-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div
            className="h-9 w-9 rounded-lg grid place-items-center shrink-0 shadow-md"
            style={{ background: "var(--admin-yellow)", color: "var(--admin-navy)" }}
          >
            <Icon name="bolt" className="text-[20px]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-sm text-white truncate leading-tight">Pratik Endüstriyel</p>
              <p className="text-[11px] leading-tight mt-0.5" style={{ color: "var(--admin-yellow)" }}>Yönetim Paneli</p>
            </div>
          )}
          <button
            onClick={onMobileClose}
            className="md:hidden ml-auto grid place-items-center h-8 w-8 rounded hover:bg-white/10 text-white"
            aria-label="Kapat"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-5 admin-sidebar-scroll">
          {ADMIN_NAV.map((group) => (
            <div key={group.title} className="flex flex-col gap-0.5">
              {!collapsed && (
                <p className="px-5 pb-2 text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {group.title}
                </p>
              )}
              {group.items.map((n) => {
                const active = tab === n.key;
                return (
                  <button
                    key={n.key}
                    onClick={() => onTab(n.key)}
                    title={collapsed ? n.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-3 px-3 mx-2 h-10 rounded-lg text-sm transition-all
                      ${active ? "font-semibold" : "hover:bg-white/5"}`}
                    style={
                      active
                        ? { background: "color-mix(in oklab, var(--admin-yellow) 18%, transparent)", color: "var(--admin-yellow)" }
                        : { color: "rgba(255,255,255,0.75)" }
                    }
                  >
                    {active && (
                      <span
                        className="absolute -left-0 top-1.5 bottom-1.5 w-1 rounded-full"
                        style={{ background: "var(--admin-yellow)" }}
                      />
                    )}
                    <span
                      className="shrink-0 grid place-items-center"
                      style={{ color: active ? "var(--admin-yellow)" : "rgba(255,255,255,0.7)" }}
                    >
                      <Icon name={n.icon} className="text-[20px]" />
                    </span>
                    {!collapsed && <span className="truncate">{n.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 text-[11px]" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}>
            © {new Date().getFullYear()} Pratik Endüstriyel
          </div>
        )}
      </aside>
    </>
  );
}