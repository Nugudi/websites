export type BadgeTone =
  | "neutral"
  | "informative"
  | "positive"
  | "warning"
  | "negative"
  | "purple";
export type BadgeVariant = "solid" | "weak" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  className?: string;
}
