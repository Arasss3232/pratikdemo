/**
 * Shared button/link styling.
 * Keeps the industrial theme consistent across CTAs.
 */
export type ButtonVariant =
  | "primary" // amber secondary — main CTA
  | "outline-light" // transparent, light border — on dark bg
  | "outline-dark" // transparent, primary border — on light bg
  | "ghost-primary"; // transparent, primary text

export type ButtonSize = "md" | "sm";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded font-label-bold text-label-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2";

const SIZES: Record<ButtonSize, string> = {
  md: "min-h-11 px-8 py-3",
  sm: "min-h-9 px-6 py-2",
};

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-secondary text-on-secondary hover:brightness-90 focus-visible:outline-on-primary",
  "outline-light":
    "bg-transparent border-2 border-inverse-on-surface/60 text-inverse-on-surface hover:border-inverse-on-surface hover:bg-inverse-on-surface/10 focus-visible:outline-inverse-on-surface",
  "outline-dark":
    "bg-transparent border-2 border-primary text-primary hover:bg-surface-variant focus-visible:outline-primary",
  "ghost-primary":
    "bg-transparent text-primary hover:underline focus-visible:outline-primary",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className = "",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`.trim();
}