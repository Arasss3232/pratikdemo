import type { ReactNode } from "react";
import { Icon } from "../site-shell";
import { findNavGroup, findNavItem, type AdminTab } from "./nav";

export function PageHeader({
  tab,
  title,
  description,
  action,
}: {
  tab: AdminTab;
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  const item = findNavItem(tab);
  const group = findNavGroup(tab);
  const displayTitle = title ?? item?.label ?? "";

  return (
    <div className="mb-6 flex flex-col gap-2">
      <nav className="flex items-center gap-1 text-body-sm text-on-surface-variant" aria-label="Breadcrumb">
        <span>Yönetim</span>
        {group && (
          <>
            <Icon name="chevron_right" className="text-[14px]" />
            <span>{group.title}</span>
          </>
        )}
        <Icon name="chevron_right" className="text-[14px]" />
        <span className="text-on-surface font-label-bold">{displayTitle}</span>
      </nav>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h1 className="text-headline-lg font-headline-lg text-on-background truncate">{displayTitle}</h1>
          {description && (
            <p className="mt-1 text-body-sm text-on-surface-variant">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}