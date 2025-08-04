export type ChipProps = {
  label: string;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  variant?: "default" | "primary";
  onClick?: () => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;
