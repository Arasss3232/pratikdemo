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
    <div className="grid place-items-center py-16 px-4 text-center border border-dashed border-outline-variant rounded-lg bg-surface-container-lowest">
      <div className="flex flex-col items-center gap-3 max-w-sm">
        <div className="h-14 w-14 rounded-full bg-surface-container grid place-items-center">
          <Icon name={icon} className="text-[28px] text-on-surface-variant" />
        </div>
        <p className="font-label-bold text-body-md">{title}</p>
        {description && <p className="text-body-sm text-on-surface-variant">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}