import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Icon } from "../site-shell";
import { ADMIN_NAV, type AdminTab } from "./nav";
import { supabase } from "@/integrations/supabase/client";

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  icon: string;
  group: string;
  run: () => void;
  keywords?: string;
};

export function CommandPalette({
  onClose,
  onGoTab,
  onQuickAdd,
}: {
  onClose: () => void;
  onGoTab: (t: AdminTab) => void;
  onQuickAdd: (t: AdminTab) => void;
}) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [dbResults, setDbResults] = useState<Cmd[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounced record search across a few tables
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setDbResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const pattern = `%${term}%`;
      const [p, b, m] = await Promise.all([
        supabase.from("products").select("id,name,sku").ilike("name", pattern).limit(4),
        supabase.from("blog_posts").select("id,title,slug").ilike("title", pattern).limit(3),
        supabase.from("contact_messages").select("id,name,subject").ilike("subject", pattern).limit(3),
      ]);
      const out: Cmd[] = [];
      (p.data ?? []).forEach((r: { id: string; name: string; sku: string }) =>
        out.push({
          id: `p-${r.id}`,
          label: r.name,
          hint: `Ürün · ${r.sku}`,
          icon: "inventory_2",
          group: "Kayıtlar",
          run: () => onGoTab("products"),
        }),
      );
      (b.data ?? []).forEach((r: { id: string; title: string }) =>
        out.push({ id: `b-${r.id}`, label: r.title, hint: "Blog yazısı", icon: "article", group: "Kayıtlar", run: () => onGoTab("blog") }),
      );
      (m.data ?? []).forEach((r: { id: string; name: string; subject: string | null }) =>
        out.push({
          id: `m-${r.id}`,
          label: r.subject || r.name,
          hint: `Mesaj · ${r.name}`,
          icon: "mail",
          group: "Kayıtlar",
          run: () => onGoTab("messages"),
        }),
      );
      setDbResults(out);
    }, 220);
    return () => clearTimeout(t);
  }, [q, onGoTab]);

  const commands = useMemo<Cmd[]>(() => {
    const nav: Cmd[] = ADMIN_NAV.flatMap((g) =>
      g.items.map((i) => ({
        id: `nav-${i.key}`,
        label: i.label,
        hint: g.title,
        icon: i.icon,
        group: "Sayfalar",
        run: () => onGoTab(i.key),
        keywords: `${g.title} ${i.label}`.toLowerCase(),
      })),
    );
    const create: Cmd[] = [
      { id: "c-product", label: "Yeni Ürün Oluştur", icon: "add", group: "Oluştur", run: () => onQuickAdd("products") },
      { id: "c-catalog", label: "Yeni Katalog Yükle", icon: "add", group: "Oluştur", run: () => onQuickAdd("catalogs") },
      { id: "c-ref", label: "Yeni Bayilik Ekle", icon: "add", group: "Oluştur", run: () => onQuickAdd("references") },
    ];
    const shortcuts: Cmd[] = [
      {
        id: "s-preview",
        label: "Web sitesini yeni sekmede aç",
        icon: "open_in_new",
        group: "Kısayollar",
        run: () => window.open("/", "_blank"),
      },
      {
        id: "s-settings",
        label: "Site Ayarlarını Aç",
        icon: "settings",
        group: "Kısayollar",
        run: () => onGoTab("settings"),
      },
      {
        id: "s-messages",
        label: "Gelen Mesajları Aç",
        icon: "mail",
        group: "Kısayollar",
        run: () => onGoTab("messages"),
      },
      {
        id: "s-logout",
        label: "Çıkış Yap",
        icon: "logout",
        group: "Kısayollar",
        run: async () => {
          await supabase.auth.signOut();
          navigate({ to: "/" });
        },
      },
    ];
    return [...create, ...nav, ...shortcuts];
  }, [navigate, onGoTab, onQuickAdd]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const base = term
      ? commands.filter(
          (c) =>
            c.label.toLowerCase().includes(term) ||
            (c.keywords && c.keywords.includes(term)) ||
            (c.hint && c.hint.toLowerCase().includes(term)),
        )
      : commands.filter((c) => c.group !== "Kayıtlar");
    return [...dbResults, ...base];
  }, [commands, dbResults, q]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[active];
        if (cmd) cmd.run();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, filtered]);

  // Group results in-render
  const grouped = useMemo(() => {
    const map = new Map<string, Cmd[]>();
    filtered.forEach((c) => {
      const arr = map.get(c.group) ?? [];
      arr.push(c);
      map.set(c.group, arr);
    });
    return Array.from(map.entries());
  }, [filtered]);

  let runningIdx = -1;

  return (
    <div
      className="admin-scope fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      style={{ background: "rgba(8,24,44,0.55)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Komut merkezi"
    >
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          boxShadow: "var(--admin-shadow-3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-14" style={{ borderBottom: "1px solid var(--admin-border)" }}>
          <span style={{ color: "var(--admin-text-mute)" }}>
            <Icon name="search" className="text-[20px]" />
          </span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Sayfa, ürün, mesaj ara veya işlem yaz…"
            className="flex-1 bg-transparent outline-none text-[15px]"
            style={{ color: "var(--admin-text)" }}
          />
          <kbd
            className="text-[10px] font-semibold rounded-md px-1.5 py-0.5"
            style={{
              color: "var(--admin-text-2)",
              border: "1px solid var(--admin-border)",
              background: "var(--admin-surface-2)",
            }}
          >
            ESC
          </kbd>
        </div>
        <div className="max-h-[52vh] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-6 py-10 text-center text-sm" style={{ color: "var(--admin-text-2)" }}>
              Eşleşen komut veya kayıt bulunamadı.
            </div>
          )}
          {grouped.map(([group, items]) => (
            <div key={group} className="mb-1">
              <p
                className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-wider font-semibold"
                style={{ color: "var(--admin-text-mute)" }}
              >
                {group}
              </p>
              {items.map((c) => {
                runningIdx += 1;
                const idx = runningIdx;
                const isActive = idx === active;
                return (
                  <button
                    key={c.id}
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => c.run()}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
                    style={{
                      background: isActive ? "var(--admin-surface-2)" : "transparent",
                      color: "var(--admin-text)",
                    }}
                  >
                    <span
                      className="grid place-items-center h-8 w-8 rounded-lg"
                      style={{
                        background: isActive ? "var(--admin-yellow-soft)" : "var(--admin-surface-2)",
                        color: "var(--admin-navy)",
                      }}
                    >
                      <Icon name={c.icon} className="text-[18px]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium truncate">{c.label}</span>
                      {c.hint && (
                        <span className="block text-[12px] truncate" style={{ color: "var(--admin-text-2)" }}>
                          {c.hint}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <span style={{ color: "var(--admin-text-mute)" }}>
                        <Icon name="subdirectory_arrow_left" className="text-[16px]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div
          className="px-4 py-2 text-[11px] flex items-center justify-between"
          style={{ borderTop: "1px solid var(--admin-border)", color: "var(--admin-text-mute)" }}
        >
          <span>↑ ↓ gezin · Enter aç · ESC kapat</span>
          <span>Komut Merkezi</span>
        </div>
      </div>
    </div>
  );
}