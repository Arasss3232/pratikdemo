/**
 * SectionMarker — the small numbered/eyebrow label used above headings across
 * the public site (e.g. "01 / Endüstriyel Tedarik").
 *
 * Typography: Manrope, 13/12px, weight 700, letter-spacing 0.04em, not uppercase.
 * The number is accented in brand yellow; the separator uses a muted brand tone;
 * the label uses white or navy depending on background. An optional short
 * yellow line accent can be shown before the marker.
 */
export type SectionMarkerTone = "dark" | "light";

export function SectionMarker({
  number,
  label,
  tone = "dark",
  line = true,
  className = "",
  as: Tag = "span",
}: {
  number?: string | number;
  label: string;
  tone?: SectionMarkerTone;
  line?: boolean;
  className?: string;
  as?: "span" | "div" | "p";
}) {
  const isDark = tone === "dark";
  const labelColor = isDark ? "rgba(255,255,255,0.92)" : "var(--public-navy-900)";
  const separatorColor = isDark ? "rgba(255,255,255,0.35)" : "rgba(6,20,38,0.35)";
  const lineColor = "var(--public-yellow-500)";
  const numberColor = "var(--public-yellow-500)";
  return (
    <Tag
      className={`section-marker inline-flex items-center flex-wrap ${className}`}
      style={{
        fontFamily: '"Manrope", "Segoe UI", Arial, sans-serif',
        fontWeight: 700,
        fontSize: "clamp(12px, 0.9vw, 13px)",
        lineHeight: 1.4,
        letterSpacing: "0.04em",
        color: labelColor,
        columnGap: 8,
        rowGap: 4,
      }}
    >
      {line && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: 28,
            height: 2,
            marginRight: 4,
            background: lineColor,
            borderRadius: 1,
          }}
        />
      )}
      {number != null && (
        <>
          <span style={{ color: numberColor, letterSpacing: "0.02em" }}>
            {typeof number === "number" ? String(number).padStart(2, "0") : number}
          </span>
          <span aria-hidden="true" style={{ color: separatorColor, margin: "0 2px" }}>
            /
          </span>
        </>
      )}
      <span style={{ color: labelColor }}>{label}</span>
    </Tag>
  );
}
