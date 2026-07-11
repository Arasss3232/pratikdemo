import type { ComponentType } from "react";

export type AdminTab =
  | "dashboard"
  | "settings"
  | "products"
  | "services"
  | "references"
  | "brands"
  | "certificates"
  | "team"
  | "testimonials"
  | "faqs"
  | "blog"
  | "blogcats"
  | "jobs"
  | "applications"
  | "messages"
  | "quotes"
  | "users";

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
    title: "Genel",
    items: [
      { key: "dashboard", label: "Dashboard", icon: "dashboard", description: "Genel bakış" },
    ],
  },
  {
    title: "İçerik Yönetimi",
    items: [
      { key: "services", label: "Hizmetler", icon: "handyman" },
      { key: "products", label: "Ürünler", icon: "inventory_2" },
      { key: "references", label: "Referanslar", icon: "workspace_premium" },
      { key: "blog", label: "Blog Yazıları", icon: "article" },
      { key: "blogcats", label: "Blog Kategorileri", icon: "category" },
      { key: "faqs", label: "SSS", icon: "quiz" },
    ],
  },
  {
    title: "İletişim",
    items: [
      { key: "messages", label: "Gelen Mesajlar", icon: "mail" },
      { key: "quotes", label: "Teklif Talepleri", icon: "request_quote" },
      { key: "applications", label: "İş Başvuruları", icon: "assignment_ind" },
    ],
  },
  {
    title: "Site Yönetimi",
    items: [
      { key: "settings", label: "Site Ayarları", icon: "settings" },
      { key: "brands", label: "Markalar", icon: "storefront" },
      { key: "certificates", label: "Sertifikalar", icon: "verified" },
      { key: "team", label: "Ekip", icon: "groups" },
      { key: "testimonials", label: "Müşteri Yorumları", icon: "reviews" },
      { key: "jobs", label: "İş İlanları", icon: "work" },
    ],
  },
  {
    title: "Sistem",
    items: [
      { key: "users", label: "Kullanıcılar", icon: "group" },
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

// Marker to keep unused import from tree-shaking away — allows consumers to
// type check components lazily via ComponentType if needed later.
export type _AdminAny = ComponentType<unknown>;