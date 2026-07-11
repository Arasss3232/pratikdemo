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
    <div className="min-h-screen bg-surface-container-low text-on-surface flex">
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
        <header className="sticky top-0 z-30 h-14 bg-surface-container-lowest border-b border-outline-variant flex items-center gap-2 px-3 md:px-4">
          <button
            onClick={() => (window.innerWidth < 768 ? setMobileOpen(true) : toggleSidebar())}
            className="grid place-items-center h-9 w-9 rounded hover:bg-surface-container text-on-surface"
            aria-label="Menüyü aç/kapat"
          >
            <Icon name="menu" className="text-[20px]" />
          </button>

          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-md border border-outline-variant bg-surface-container-low min-w-0 flex-1 max-w-md">
              <Icon name="search" className="text-[18px] text-on-surface-variant shrink-0" />
              <input
                type="search"
                placeholder="Ara: sayfa, ürün, mesaj…"
                className="bg-transparent outline-none text-body-sm flex-1 min-w-0"
              />
              <kbd className="hidden md:inline text-[10px] text-on-surface-variant border border-outline-variant rounded px-1.5 py-0.5">/</kbd>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Quick add */}
            <div className="relative">
              <button
                onClick={() => setQuickOpen((v) => !v)}
                className="hidden sm:inline-flex items-center gap-1 h-9 px-3 rounded-md bg-primary text-on-primary text-body-sm hover:bg-primary-container hover:text-on-primary-container transition"
              >
                <Icon name="add" className="text-[18px]" />
                Hızlı Ekle
              </button>
              <button
                onClick={() => setQuickOpen((v) => !v)}
                className="sm:hidden grid place-items-center h-9 w-9 rounded bg-primary text-on-primary"
                aria-label="Hızlı ekle"
              >
                <Icon name="add" className="text-[20px]" />
              </button>
              {quickOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setQuickOpen(false)} />
                  <div className="absolute right-0 top-11 z-50 w-56 rounded-md border border-outline-variant bg-surface-container-lowest shadow-lg py-1">
                    {quickAddItems.map((q) => (
                      <button
                        key={q.key}
                        onClick={() => {
                          setQuickOpen(false);
                          onQuickAdd(q.key);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-body-sm hover:bg-surface-container text-left"
                      >
                        <Icon name={q.icon} className="text-[18px] text-on-surface-variant" />
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
              className="hidden md:inline-flex items-center gap-1 h-9 px-3 rounded-md text-body-sm hover:bg-surface-container text-on-surface-variant"
              aria-label="Siteyi görüntüle"
            >
              <Icon name="open_in_new" className="text-[18px]" />
              Siteyi görüntüle
            </Link>

            <button
              onClick={toggleTheme}
              className="grid place-items-center h-9 w-9 rounded hover:bg-surface-container text-on-surface-variant"
              aria-label="Temayı değiştir"
              title="Tema"
            >
              <Icon name={dark ? "light_mode" : "dark_mode"} className="text-[18px]" />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 h-9 px-2 rounded hover:bg-surface-container"
                aria-label="Profil menüsü"
              >
                <div className="h-7 w-7 rounded-full bg-primary text-on-primary grid place-items-center text-body-sm font-label-bold">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="hidden lg:inline text-body-sm max-w-[160px] truncate">{userEmail}</span>
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-11 z-50 w-56 rounded-md border border-outline-variant bg-surface-container-lowest shadow-lg py-1">
                    <div className="px-3 py-2 border-b border-outline-variant">
                      <p className="text-body-sm truncate">{userEmail}</p>
                      <p className="text-[11px] text-on-surface-variant">Yönetici</p>
                    </div>
                    <Link
                      to="/"
                      target="_blank"
                      className="w-full flex items-center gap-2 px-3 py-2 text-body-sm hover:bg-surface-container"
                    >
                      <Icon name="open_in_new" className="text-[18px] text-on-surface-variant" />
                      Siteyi aç
                    </Link>
                    <button
                      onClick={signOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-body-sm hover:bg-surface-container text-error"
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
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${width} shrink-0 border-r border-outline-variant bg-surface-container-lowest
          fixed md:sticky top-0 z-50 md:z-auto h-dvh md:h-auto md:min-h-screen
          w-64 transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          flex flex-col`}
      >
        {/* Brand */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-outline-variant shrink-0">
          <div className="h-8 w-8 rounded bg-primary text-on-primary grid place-items-center shrink-0">
            <Icon name="shield" className="text-[18px]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-label-bold text-body-sm text-on-surface truncate">Pratik</p>
              <p className="text-[11px] text-on-surface-variant leading-none">Yönetim Paneli</p>
            </div>
          )}
          <button
            onClick={onMobileClose}
            className="md:hidden ml-auto grid place-items-center h-8 w-8 rounded hover:bg-surface-container"
            aria-label="Kapat"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 flex flex-col gap-4">
          {ADMIN_NAV.map((group) => (
            <div key={group.title} className="flex flex-col gap-0.5">
              {!collapsed && (
                <p className="px-4 pb-1 text-[11px] font-label-bold uppercase tracking-wider text-on-surface-variant">
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
                    className={`group relative flex items-center gap-3 px-3 mx-2 h-10 rounded-md text-body-sm transition-colors
                      ${active
                        ? "bg-primary/10 text-primary font-label-bold"
                        : "text-on-surface hover:bg-surface-container"}`}
                  >
                    {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-primary" />}
                    <Icon
                      name={n.icon}
                      className={`text-[20px] shrink-0 ${active ? "text-primary" : "text-on-surface-variant"}`}
                    />
                    {!collapsed && <span className="truncate">{n.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="border-t border-outline-variant p-3 text-[11px] text-on-surface-variant">
            © {new Date().getFullYear()} Pratik Endüstriyel
          </div>
        )}
      </aside>
    </>
  );
}