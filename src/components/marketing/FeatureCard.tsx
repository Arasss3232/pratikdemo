import { Icon } from "../site-shell";

/**
 * Value-prop tile: icon + title + short description.
 */
export function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-3">
      <Icon name={icon} className="text-[32px] text-secondary" aria-hidden="true" />
      <h3 className="font-headline-md text-headline-md font-bold text-on-background">{title}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{desc}</p>
    </div>
  );
}