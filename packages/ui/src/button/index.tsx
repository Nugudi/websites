import { clsx } from "clsx";
import type React from "react";
import type { ComponentPropsWithoutRef } from "react";
import { buttonRecipe } from "./button.css";

type ButtonVariant = "brand" | "neutral";
type ButtonSize = "sm" | "md" | "lg" | "full";

export type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ComponentPropsWithoutRef<"button">;

export const Button = ({
  children,
  variant = "brand",
  size = "md",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(buttonRecipe({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
};
