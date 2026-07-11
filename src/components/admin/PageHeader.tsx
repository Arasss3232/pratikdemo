import type { ReactNode } from "react";
import { Icon } from "../site-shell";
import { findNavGroup, findNavItem, type AdminTab } from "./nav";

const DESCRIPTIONS: Partial<Record<AdminTab, string>> = {
  dashboard: "Sitenizin genel durumu, öncelikleriniz ve son hareketler.",
  settings: "Site kimliği, iletişim bilgileri, sosyal medya ve genel ayarlar.",
  products: "Ürün kataloğunuzu buradan yönetin. Yeni ürün ekleyin veya mevcutları düzenleyin.",
  services: "Sunduğunuz hizmetleri ekleyin, kapak görsellerini ve açıklamalarını güncelleyin.",
  references: "Tamamlanan projeleriniz ve referans müşterileriniz.",
  brands: "Ana sayfada gösterilen marka logoları.",
  certificates: "Kurumsal sertifikalarınızı ve belgelerinizi yönetin.",
  team: "Ekip üyelerinizi ve görev tanımlarını buradan yönetin.",
  testimonials: "Müşteri yorumları ve puanlar.",
  faqs: "Sık sorulan sorular. Kategoriye göre gruplandırabilirsiniz.",
  blog: "Haberler, duyurular ve blog yazıları.",
  blogcats: "Blog yazılarını kategorilere ayırın.",
  jobs: "Açık iş ilanlarınızı yönetin.",
  applications: "Kariyer sayfanızdan gelen iş başvuruları.",
  messages: "Web sitenizden gelen iletişim mesajları.",
  quotes: "Teklif sepetinden gelen fiyat talepleri.",
  users: "Yönetici yetkileri ve kullanıcı rolleri.",
};

export function PageHeader({
  tab,
  title,
  description,
  action,
  eyebrow,
}: {
  tab: AdminTab;
  title?: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  const item = findNavItem(tab);
  const group = findNavGroup(tab);
  const displayTitle = title ?? item?.label ?? "";
  const displayDesc = description ?? DESCRIPTIONS[tab];

  return (
    <header className="mb-6 flex flex-col gap-3">
      <nav
        className="flex items-center gap-1.5 text-[12px]"
        style={{ color: "var(--admin-text-2)" }}
        aria-label="Sayfa yolu"
      >
        <span className="inline-flex items-center gap-1">
          <Icon name="dashboard" className="text-[14px]" />
          Yönetim
        </span>
        {group && (
          <>
            <Icon name="chevron_right" className="text-[14px]" />
            <span>{group.title}</span>
          </>
        )}
        <Icon name="chevron_right" className="text-[14px]" />
        <span className="font-semibold" style={{ color: "var(--admin-text)" }}>
          {displayTitle}
        </span>
      </nav>
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6 sm:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-1"
              style={{ color: "var(--admin-navy)" }}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className="text-[26px] sm:text-[30px] font-bold tracking-tight leading-tight truncate"
            style={{ color: "var(--admin-text)" }}
          >
            {displayTitle}
          </h1>
          {displayDesc && (
            <p className="mt-1.5 text-[14px] max-w-2xl" style={{ color: "var(--admin-text-2)" }}>
              {displayDesc}
            </p>
          )}
        </div>
        {action && <div className="shrink-0 flex items-center gap-2 flex-wrap">{action}</div>}
      </div>
    </header>
  );
}