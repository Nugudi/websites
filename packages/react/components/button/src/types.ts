import type { vars } from "@nugudi/themes";

export type ButtonProps = {
  color?: keyof typeof vars.colors.$scale;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "brand" | "neutral";
  width?: "auto" | "full";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
