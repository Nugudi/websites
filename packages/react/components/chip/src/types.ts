export type ChipProps = {
  label: string;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  variant?: "default" | "primary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
