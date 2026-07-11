import pratikLogo from "@/assets/pratik-logo.asset.json";

type Size = "sm" | "md" | "lg";

const LOGO_HEIGHT: Record<Size, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
};

const FRAME_PADDING: Record<Size, string> = {
  sm: "px-2.5 py-1.5",
  md: "px-3 py-2",
  lg: "px-3.5 py-2.5",
};

/**
 * PublicBrandLockup — "Industrial Precision Frame"
 *
 * A machined nameplate for the Pratik wordmark: a recessed navy chassis with
 * four corner bolt-dots, an inset sticker frame with an inner shadow, and the
 * real logo image centered inside. Optical balance is achieved through the
 * two nested plates (chassis + frame), NOT by resizing the raster asset.
 */
export function PublicBrandLockup({
  logoUrl,
  companyName,
  size = "md",
  tone = "dark",
  className = "",
}: {
  logoUrl?: string | null;
  companyName?: string | null;
  size?: Size;
  /** dark = on navy header; light = on light surfaces (e.g. print/PDF) */
  tone?: "dark" | "light";
  className?: string;
}) {
  const src = logoUrl || pratikLogo.url;
  const alt = companyName || "Pratik";

  const chassisBg = tone === "dark" ? "var(--public-navy-950)" : "#ffffff";
  const frameBg = tone === "dark" ? "var(--public-navy-900)" : "#f8fafc";
  const boltColor = tone === "dark" ? "rgba(255,255,255,0.14)" : "rgba(10,35,66,0.18)";
  const frameBorder = tone === "dark" ? "rgba(255,255,255,0.10)" : "rgba(10,35,66,0.10)";
  const chassisBorder = tone === "dark" ? "rgba(255,255,255,0.06)" : "rgba(10,35,66,0.08)";
  const insetShadow =
    tone === "dark"
      ? "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 2px 8px rgba(0,0,0,0.5)"
      : "inset 0 1px 0 rgba(255,255,255,0.9), inset 0 2px 8px rgba(10,35,66,0.08)";

  return (
    <span
      className={`relative inline-flex items-center justify-center rounded-[3px] ${FRAME_PADDING[size]} ${className}`}
      style={{
        backgroundColor: chassisBg,
        border: `1px solid ${chassisBorder}`,
      }}
    >
      {/* Four corner bolt-dots — the "machined nameplate" signature */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className="absolute top-1 left-1 h-[3px] w-[3px] rounded-full"
          style={{ backgroundColor: boltColor }}
        />
        <span
          className="absolute top-1 right-1 h-[3px] w-[3px] rounded-full"
          style={{ backgroundColor: boltColor }}
        />
        <span
          className="absolute bottom-1 left-1 h-[3px] w-[3px] rounded-full"
          style={{ backgroundColor: boltColor }}
        />
        <span
          className="absolute bottom-1 right-1 h-[3px] w-[3px] rounded-full"
          style={{ backgroundColor: boltColor }}
        />
      </span>

      {/* Inset frame that "seats" the logo */}
      <span
        className="relative inline-flex items-center justify-center rounded-[2px] px-2 py-1"
        style={{
          backgroundColor: frameBg,
          border: `1px solid ${frameBorder}`,
          boxShadow: insetShadow,
        }}
      >
        <img
          alt={alt}
          src={src}
          className={`${LOGO_HEIGHT[size]} w-auto object-contain block`}
          decoding="async"
          fetchPriority="high"
        />
      </span>
    </span>
  );
}

export default PublicBrandLockup;