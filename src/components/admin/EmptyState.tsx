import type { ReactNode } from "react";
import { Icon } from "../site-shell";

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="grid place-items-center py-16 px-6 text-center rounded-2xl"
      style={{
        background: "var(--admin-surface)",
        border: "1px dashed var(--admin-border-strong)",
      }}
    >
      <div className="flex flex-col items-center gap-3 max-w-sm">
        <div
          className="h-16 w-16 rounded-2xl grid place-items-center"
          style={{ background: "var(--admin-yellow-soft)", color: "var(--admin-navy)" }}
        >
          <Icon name={icon} className="text-[30px]" />
        </div>
        <p className="text-[16px] font-semibold" style={{ color: "var(--admin-text)" }}>
          {title}
        </p>
        {description && (
          <p className="text-[14px]" style={{ color: "var(--admin-text-2)" }}>
            {description}
          </p>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}