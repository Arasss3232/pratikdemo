import { Link } from "@tanstack/react-router";
import { Icon } from "../site-shell";

/**
 * Section header used across the home page — optional eyebrow + action link.
 */
export function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  actionTo,
  align = "start",
}: {
  eyebrow?: string;
  title: string;
  actionLabel?: string;
  actionTo?: string;
  align?: "start" | "center";
}) {
  const centered = align === "center";
  return (
    <div
      className={`mb-10 flex flex-col md:flex-row md:items-end gap-4 ${
        centered ? "text-center md:justify-center" : "md:justify-between"
      }`}
    >
      <div className={centered ? "mx-auto max-w-2xl" : ""}>
        {eyebrow && (
          <div className="font-label-bold text-label-bold text-secondary uppercase tracking-wider mb-2">
            {eyebrow}
          </div>
        )}
        <h2 className="font-headline-lg text-headline-lg text-on-background">{title}</h2>
      </div>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="text-primary font-label-bold text-label-bold hover:underline inline-flex items-center gap-1"
        >
          {actionLabel}
          <Icon name="arrow_forward" className="text-[16px]" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}