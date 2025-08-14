export type NavigationItemProps = {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;
