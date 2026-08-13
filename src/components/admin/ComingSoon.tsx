import { Icon } from "../site-shell";
import type { AdminTab } from "./nav";
import { findNavItem } from "./nav";

/**
 * Fazlı geliştirme sırasında henüz uygulanmamış modüller için birleşik
 * "yakında" görünümü. Sidebar'da gizlemek yerine kullanıcıya yol haritasını
 * göstererek beklentiyi netleştirir.
 */
export function ComingSoon({
  tab,
  phase,
  bullets,
}: {
  tab: AdminTab;
  phase: string;
  bullets?: string[];
}) {
  const item = findNavItem(tab);
  return (
    <div
      className="admin-card p-6 sm:p-8 flex flex-col gap-5 max-w-3xl"
      style={{ border: "1px dashed var(--admin-border)" }}
    >
      <div className="flex items-start gap-4">
        <div
          className="h-12 w-12 rounded-2xl grid place-items-center shrink-0"
          style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}
        >
          <Icon name={item?.icon ?? "auto_awesome"} className="text-[24px]" />
        </div>
        <div className="min-w-0">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em] mb-1"
            style={{ color: "var(--admin-navy)" }}
          >
            {phase}
          </p>
          <h2
            className="text-[20px] font-bold tracking-tight"
            style={{ color: "var(--admin-text)" }}
          >
            {item?.label ?? "Modül"} — Yol Haritasında
          </h2>
          <p className="text-[14px] mt-1" style={{ color: "var(--admin-text-2)" }}>
            Bu modül sitenizin ilerideki yönetim planları kapsamında geliştirilecek. Şu anda
            veri şeması, yetki kuralları ve navigasyon iskeleti hazırlanmıştır.
          </p>
        </div>
      </div>

      {bullets && bullets.length > 0 && (
        <ul
          className="flex flex-col gap-2 rounded-xl p-4"
          style={{ background: "var(--admin-surface-2)" }}
        >
          {bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[13.5px]"
              style={{ color: "var(--admin-text-2)" }}
            >
              <Icon
                name="check_circle"
                className="text-[16px] mt-0.5"
                style={{ color: "var(--admin-navy)" }}
              />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      <div
        className="text-[12.5px] flex items-center gap-2"
        style={{ color: "var(--admin-text-mute)" }}
      >
        <Icon name="info" className="text-[16px]" />
        Bu ekran hazır olduğunda mevcut verileriniz otomatik olarak buraya bağlanacak.
      </div>
    </div>
  );
}