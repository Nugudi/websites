export type NavigationItemProps = {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  asChild?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;
