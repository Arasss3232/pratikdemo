import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Icon } from "../site-shell";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_NAV, findNavGroup, findNavItem, type AdminTab } from "./nav";
import { CommandPalette } from "./CommandPalette";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

const STORAGE_KEY = "admin_sidebar_collapsed";
const THEME_KEY = "admin_theme";

const QUICK_ADD_ITEMS: { key: AdminTab; label: string; icon: string; hint: string }[] = [
  { key: "categories", label: "Yeni Kategori", icon: "category", hint: "Ürün grubu ekle" },
  { key: "catalogs", label: "Yeni Katalog", icon: "menu_book", hint: "Dijital PDF yükle" },
  { key: "brands", label: "Yeni Bayilik", icon: "workspace_premium", hint: "Bayilik bilgisi ekle" },
  { key: "messages", label: "Mesaj Yanıtla", icon: "mail", hint: "Gelen kutusu" },
];

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
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: 'exact', head: true })
        .eq("recipient_id", user.id)
        .eq("is_read", false);
      return count || 0;
    },
    enabled: !!user?.id
  });

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "1");
    const t = localStorage.getItem(THEME_KEY);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  // Ctrl/Cmd + K opens the command palette
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setQuickOpen(false);
        setProfileOpen(false);
        setNotifyOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

  const activeGroup = useMemo(() => findNavGroup(tab), [tab]);
  const activeItem = useMemo(() => findNavItem(tab), [tab]);

  return (
    <div className="admin-scope min-h-screen flex">
      {/* Sidebar */}
      <SidebarPanel
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onToggleCollapse={toggleSidebar}
        tab={tab}
        onTab={handleTab}
        userEmail={userEmail}
        onSignOut={signOut}
      />

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <CommandTopbar
          onOpenMobile={() => setMobileOpen(true)}
          onToggleCollapse={toggleSidebar}
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenNotify={() => handleTab("notifications")}
          notifyOpen={notifyOpen}
          unreadCount={unreadCount}
          onCloseNotify={() => setNotifyOpen(false)}
          quickOpen={quickOpen}
          onToggleQuick={() => setQuickOpen((v) => !v)}
          onCloseQuick={() => setQuickOpen(false)}
          onQuickAdd={onQuickAdd}
          profileOpen={profileOpen}
          onToggleProfile={() => setProfileOpen((v) => !v)}
          onCloseProfile={() => setProfileOpen(false)}
          userEmail={userEmail}
          onSignOut={signOut}
          dark={dark}
          onToggleTheme={toggleTheme}
          groupTitle={activeGroup?.title ?? "Yönetim Merkezi"}
          itemTitle={activeItem?.label ?? "Genel Bakış"}
        />

        <main className="flex-1 min-w-0">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-9">
            {children}
          </div>
        </main>
      </div>

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onGoTab={(t) => {
            setPaletteOpen(false);
            handleTab(t);
          }}
          onQuickAdd={(t) => {
            setPaletteOpen(false);
            onQuickAdd(t);
          }}
        />
      )}
    </div>
  );
}

/* ================= Sidebar ================= */
function SidebarPanel({
  collapsed,
  mobileOpen,
  onMobileClose,
  onToggleCollapse,
  tab,
  onTab,
  userEmail,
  onSignOut,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onToggleCollapse: () => void;
  tab: AdminTab;
  onTab: (t: AdminTab) => void;
  userEmail: string;
  onSignOut: () => void;
}) {
  const desktopWidth = collapsed ? "md:w-[84px]" : "md:w-[280px]";
  return (
    <>
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-[color:rgba(8,24,44,0.55)] backdrop-blur-sm"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${desktopWidth} shrink-0 fixed md:sticky top-0 z-50 md:z-auto
          h-dvh md:h-screen w-[280px]
          transition-[width,transform] duration-200 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          flex flex-col`}
        style={{
          background:
            "linear-gradient(180deg, var(--admin-navy) 0%, var(--admin-navy-deep) 100%)",
          color: "#E7ECF3",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
        aria-label="Yönetim navigasyonu"
      >
        {/* Brand */}
        <div
          className="h-[72px] flex items-center gap-3 px-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="h-10 w-10 rounded-xl grid place-items-center shrink-0"
            style={{
              background: "var(--admin-yellow)",
              color: "var(--admin-navy-deep)",
              boxShadow: "0 6px 20px -6px rgba(244,197,66,0.55)",
            }}
          >
            <Icon name="bolt" className="text-[22px]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-white truncate leading-tight">
                Pratik Endüstriyel
              </p>
              <p
                className="text-[11px] leading-tight mt-1 uppercase tracking-[0.14em]"
                style={{ color: "var(--admin-yellow)" }}
              >
                Yönetim Merkezi
              </p>
            </div>
          )}
          <button
            onClick={onMobileClose}
            className="md:hidden ml-auto grid place-items-center h-9 w-9 rounded-lg hover:bg-white/10 text-white"
            aria-label="Menüyü kapat"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto py-4 admin-sidebar-scroll">
          {ADMIN_NAV.map((group) => (
            <div key={group.title} className="mb-5 last:mb-0">
              {!collapsed && (
                <p
                  className="px-6 mb-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  {group.title}
                </p>
              )}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((n) => {
                  const active = tab === n.key;
                  return (
                    <li key={n.key} className="px-3">
                      <button
                        onClick={() => onTab(n.key)}
                        title={collapsed ? n.label : undefined}
                        aria-current={active ? "page" : undefined}
                        className={`group relative w-full flex items-center gap-3 h-11 rounded-xl text-[14px] transition-all
                          ${collapsed ? "justify-center px-0" : "px-3"}
                          ${active ? "font-semibold" : "hover:bg-white/6"}
                        `}
                        style={
                          active
                            ? {
                                background: "rgba(244,197,66,0.14)",
                                color: "var(--admin-yellow)",
                              }
                            : { color: "rgba(231,236,243,0.78)" }
                        }
                      >
                        {active && (
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                            style={{ background: "var(--admin-yellow)" }}
                          />
                        )}
                        <span
                          className="shrink-0 grid place-items-center h-8 w-8 rounded-lg"
                          style={
                            active
                              ? {
                                  background: "rgba(244,197,66,0.16)",
                                  color: "var(--admin-yellow)",
                                }
                              : { color: "rgba(231,236,243,0.7)" }
                          }
                        >
                          <Icon name={n.icon} className="text-[20px]" />
                        </span>
                        {!collapsed && <span className="truncate">{n.label}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer: collapse + user */}
        <div
          className="px-3 py-3 flex flex-col gap-2 shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          {!collapsed ? (
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div
                className="h-9 w-9 rounded-full grid place-items-center text-sm font-bold shrink-0"
                style={{ background: "var(--admin-yellow)", color: "var(--admin-navy-deep)" }}
              >
                {(userEmail.charAt(0) || "?").toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] truncate text-white/90">{userEmail || "Yönetici"}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/45">Yönetici</p>
              </div>
              <button
                onClick={onSignOut}
                className="grid place-items-center h-8 w-8 rounded-lg text-white/60 hover:text-white hover:bg-white/10"
                title="Çıkış yap"
                aria-label="Çıkış yap"
              >
                <Icon name="logout" className="text-[18px]" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignOut}
              className="mx-auto grid place-items-center h-9 w-9 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              title="Çıkış yap"
              aria-label="Çıkış yap"
            >
              <Icon name="logout" className="text-[18px]" />
            </button>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden md:flex items-center gap-2 h-9 px-2 rounded-lg text-[12px] text-white/55 hover:text-white hover:bg-white/6"
            aria-label={collapsed ? "Menüyü genişlet" : "Menüyü daralt"}
          >
            <Icon name={collapsed ? "chevron_right" : "chevron_left"} className="text-[18px]" />
            {!collapsed && <span>Menüyü daralt</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

/* ================= Topbar ================= */
function CommandTopbar({
  onOpenMobile,
  onToggleCollapse,
  onOpenPalette,
  onOpenNotify,
  notifyOpen,
  unreadCount,
  onCloseNotify,
  quickOpen,
  onToggleQuick,
  onCloseQuick,
  onQuickAdd,
  profileOpen,
  onToggleProfile,
  onCloseProfile,
  userEmail,
  onSignOut,
  dark,
  onToggleTheme,
  groupTitle,
  itemTitle,
}: {
  onOpenMobile: () => void;
  onToggleCollapse: () => void;
  onOpenPalette: () => void;
  onOpenNotify: () => void;
  notifyOpen: boolean;
  unreadCount: number;
  onCloseNotify: () => void;
  quickOpen: boolean;
  onToggleQuick: () => void;
  onCloseQuick: () => void;
  onQuickAdd: (t: AdminTab) => void;
  profileOpen: boolean;
  onToggleProfile: () => void;
  onCloseProfile: () => void;
  userEmail: string;
  onSignOut: () => void;
  dark: boolean;
  onToggleTheme: () => void;
  groupTitle: string;
  itemTitle: string;
}) {
  return (
    <header
      className="sticky top-0 z-30 h-[68px] flex items-center gap-3 px-3 md:px-6"
      style={{
        background: "color-mix(in oklab, var(--admin-surface) 90%, transparent)",
        borderBottom: "1px solid var(--admin-border)",
        backdropFilter: "saturate(1.1) blur(8px)",
      }}
    >
      {/* Menu toggle */}
      <button
        onClick={() => (window.innerWidth < 768 ? onOpenMobile() : onToggleCollapse())}
        className="grid place-items-center h-10 w-10 rounded-lg hover:bg-[var(--admin-surface-2)]"
        style={{ color: "var(--admin-text-2)" }}
        aria-label="Menü"
      >
        <Icon name="menu" className="text-[22px]" />
      </button>

      {/* Breadcrumb */}
      <div className="hidden md:flex flex-col justify-center min-w-0">
        <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--admin-text-mute)" }}>
          {groupTitle}
        </p>
        <p className="text-[15px] font-semibold leading-tight truncate" style={{ color: "var(--admin-text)" }}>
          {itemTitle}
        </p>
      </div>

      {/* Search / palette trigger */}
      <button
        onClick={onOpenPalette}
        className="ml-2 hidden sm:flex items-center gap-2 h-10 px-3 rounded-xl flex-1 min-w-0 max-w-xl text-left"
        style={{
          background: "var(--admin-surface-2)",
          border: "1px solid var(--admin-border)",
          color: "var(--admin-text-mute)",
        }}
        aria-label="Global arama"
      >
        <Icon name="search" className="text-[18px]" />
        <span className="flex-1 text-sm truncate">Ara veya bir işlem çalıştır…</span>
        <kbd
          className="hidden md:inline text-[10px] font-semibold rounded-md px-1.5 py-0.5"
          style={{
            color: "var(--admin-text-2)",
            border: "1px solid var(--admin-border)",
            background: "var(--admin-surface)",
          }}
        >
          Ctrl + K
        </kbd>
      </button>
      <button
        onClick={onOpenPalette}
        className="sm:hidden grid place-items-center h-10 w-10 rounded-lg hover:bg-[var(--admin-surface-2)]"
        style={{ color: "var(--admin-text-2)" }}
        aria-label="Global arama"
      >
        <Icon name="search" className="text-[20px]" />
      </button>

      <div className="ml-auto flex items-center gap-1">
        {/* Quick add */}
        <div className="relative">
          <button
            onClick={onToggleQuick}
            className="admin-btn admin-btn-accent hidden sm:inline-flex"
            style={{ height: 40, padding: "0 14px" }}
          >
            <Icon name="add" className="text-[18px]" />
            Hızlı Ekle
          </button>
          <button
            onClick={onToggleQuick}
            className="sm:hidden grid place-items-center h-10 w-10 rounded-lg"
            style={{ background: "var(--admin-yellow)", color: "var(--admin-navy-deep)" }}
            aria-label="Hızlı ekle"
          >
            <Icon name="add" className="text-[20px]" />
          </button>
          {quickOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={onCloseQuick} />
              <div
                className="absolute right-0 top-12 z-50 w-72 rounded-2xl py-2"
                style={{
                  background: "var(--admin-surface)",
                  border: "1px solid var(--admin-border)",
                  boxShadow: "var(--admin-shadow-3)",
                }}
                role="menu"
              >
                <p className="px-4 py-2 text-[11px] uppercase tracking-wider" style={{ color: "var(--admin-text-mute)" }}>
                  Yeni içerik oluştur
                </p>
                {QUICK_ADD_ITEMS.map((q) => (
                  <button
                    key={q.key}
                    onClick={() => {
                      onCloseQuick();
                      onQuickAdd(q.key);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--admin-surface-2)]"
                    role="menuitem"
                  >
                    <span
                      className="grid place-items-center h-9 w-9 rounded-lg"
                      style={{
                        background: "var(--admin-yellow-soft)",
                        color: "var(--admin-navy)",
                      }}
                    >
                      <Icon name={q.icon} className="text-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold" style={{ color: "var(--admin-text)" }}>
                        {q.label}
                      </span>
                      <span className="block text-[12px]" style={{ color: "var(--admin-text-2)" }}>
                        {q.hint}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* View site */}
        <Link
          to="/"
          target="_blank"
          className="hidden md:inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-sm hover:bg-[var(--admin-surface-2)]"
          style={{ color: "var(--admin-text-2)" }}
        >
          <Icon name="open_in_new" className="text-[18px]" />
          Siteyi Görüntüle
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={onOpenNotify}
            className="relative grid place-items-center h-10 w-10 rounded-lg hover:bg-[var(--admin-surface-2)]"
            style={{ color: "var(--admin-text-2)" }}
            aria-label="Bildirimler"
          >
            <Icon name="notifications" className="text-[20px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 bg-red-500 text-white text-[9px] font-bold rounded-full border-2 border-[var(--admin-surface)] flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {notifyOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={onCloseNotify} />
              <div
                className="absolute right-0 top-12 z-50 w-80 rounded-2xl overflow-hidden"
                style={{
                  background: "var(--admin-surface)",
                  border: "1px solid var(--admin-border)",
                  boxShadow: "var(--admin-shadow-3)",
                }}
              >
                <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <p className="text-sm font-semibold">Bildirimler</p>
                  <span className="admin-badge admin-badge-neutral">{unreadCount} yeni</span>
                </div>
                <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--admin-text-2)" }}>
                  <span
                    className="mx-auto mb-2 grid place-items-center h-10 w-10 rounded-full"
                    style={{ background: "var(--admin-surface-2)", color: "var(--admin-text-mute)" }}
                  >
                    <Icon name="notifications_off" className="text-[20px]" />
                  </span>
                  {unreadCount > 0 ? `${unreadCount} okunmamış bildiriminiz var.` : "Henüz yeni bildirim yok."}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Theme */}
        <button
          onClick={onToggleTheme}
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
            onClick={onToggleProfile}
            className="flex items-center gap-2 h-10 pl-1 pr-2 rounded-lg hover:bg-[var(--admin-surface-2)]"
            aria-label="Profil menüsü"
          >
            <div
              className="h-8 w-8 rounded-full grid place-items-center text-sm font-bold"
              style={{
                background: "var(--admin-navy)",
                color: "var(--admin-yellow)",
                boxShadow: "0 0 0 2px var(--admin-yellow-soft)",
              }}
            >
              {(userEmail.charAt(0) || "?").toUpperCase()}
            </div>
            <Icon name="expand_more" className="text-[18px] hidden lg:inline" />
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={onCloseProfile} />
              <div
                className="absolute right-0 top-12 z-50 w-64 rounded-2xl py-1 overflow-hidden"
                style={{
                  background: "var(--admin-surface)",
                  border: "1px solid var(--admin-border)",
                  boxShadow: "var(--admin-shadow-3)",
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <p className="text-sm truncate font-semibold">{userEmail}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--admin-text-2)" }}>
                    Sistem yöneticisi
                  </p>
                </div>
                <Link
                  to="/"
                  target="_blank"
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--admin-surface-2)]"
                >
                  <span style={{ color: "var(--admin-text-2)" }}>
                    <Icon name="open_in_new" className="text-[18px]" />
                  </span>
                  Siteyi yeni sekmede aç
                </Link>
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-[var(--admin-danger-soft,#FBE9E9)]"
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
  );
}