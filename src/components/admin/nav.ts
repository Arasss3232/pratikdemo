import type { ComponentType } from "react";

export type AdminTab =
  // ANA YÖNETİM
  | "dashboard"
  | "myTasks"
  | "approvals"
  | "notifications"
  // İÇERİK YÖNETİMİ
  | "categories"
  | "catalogs"
  | "brands"
  | "slider"
  | "media"
  // İŞLEMLER
  | "quotes"
  | "messages"
  // KURUMSAL VE SİTE
  | "content"
  | "seo"
  | "settings"
  // SİSTEM
  | "users"
  | "roles"
  | "activityLogs";

export type AdminNavItem = {
  key: AdminTab;
  label: string;
  icon: string;
  description?: string;
};

export type AdminNavGroup = {
  title: string;
  items: AdminNavItem[];
};

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    title: "ANA YÖNETİM",
    items: [
      { key: "dashboard", label: "Genel Bakış", icon: "dashboard", description: "Dashboard ve özet veriler" },
      { key: "myTasks", label: "Görevlerim", icon: "task_alt", description: "Size atanmış görevler" },
      { key: "approvals", label: "Onay Bekleyenler", icon: "approval", description: "Onay bekleyen işlemler" },
      { key: "notifications", label: "Bildirimler", icon: "notifications", description: "Sistem bildirimleri" },
    ],
  },
  {
    title: "İÇERİK YÖNETİMİ",
    items: [
      { key: "categories", label: "Kategori Yönetimi", icon: "category", description: "Ürün kategorileri" },
      { key: "catalogs", label: "Katalog Yönetimi", icon: "menu_book", description: "PDF kataloglar" },
      { key: "brands", label: "Bayilik Yönetimi", icon: "workspace_premium", description: "Bayilik ve markalar" },
      { key: "slider", label: "Slider Yönetimi", icon: "slideshow", description: "Ana sayfa slider yönetimi" },
      { key: "media", label: "Medya Yönetimi", icon: "image", description: "Medya kütüphanesi" },
    ],
  },
  {
    title: "İŞLEMLER",
    items: [
      { key: "quotes", label: "Teklif Talepleri", icon: "request_quote", description: "Gelen teklif talepleri" },
      { key: "messages", label: "İletişim Mesajları", icon: "mail", description: "İletişim formu mesajları" },
    ],
  },
  {
    title: "KURUMSAL VE SİTE",
    items: [
      { key: "content", label: "Site İçerik Yönetimi", icon: "edit_note", description: "Sayfa içerikleri ve metinler" },
      { key: "seo", label: "SEO Yönetimi", icon: "trending_up", description: "Arama motoru ayarları" },
      { key: "settings", label: "Genel İçerikler", icon: "settings", description: "İletişim, logo ve çalışma saatleri" },
    ],
  },
  {
    title: "SİSTEM",
    items: [
      { key: "users", label: "Kullanıcılar", icon: "manage_accounts", description: "Admin kullanıcıları" },
      { key: "roles", label: "Roller ve Yetkiler", icon: "admin_panel_settings", description: "Yetkilendirme yönetimi" },
      { key: "activityLogs", label: "İşlem Geçmişi", icon: "history", description: "Sistem günlükleri" },
    ],
  },
];

export const ADMIN_ITEMS: AdminNavItem[] = ADMIN_NAV.flatMap((g) => g.items);

export function findNavItem(tab: AdminTab): AdminNavItem | undefined {
  return ADMIN_ITEMS.find((i) => i.key === tab);
}

export function findNavGroup(tab: AdminTab): AdminNavGroup | undefined {
  return ADMIN_NAV.find((g) => g.items.some((i) => i.key === tab));
}

export type _AdminAny = ComponentType<unknown>;
