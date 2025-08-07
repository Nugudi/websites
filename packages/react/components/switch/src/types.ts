import type { vars } from "@nugudi/themes";

export type SwitchProps = {
  color?: keyof typeof vars.colors.$scale;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
  defaultSelected?: boolean;
  isSelected?: boolean;
  onToggle?: (isSelected: boolean) => void;
  id?: string;
  label?: React.ReactNode;
  labelPlacement?: "start" | "end";
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "disabled" | "type" | "role" | "id"
>;
