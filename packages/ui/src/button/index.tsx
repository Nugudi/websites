import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import type React from "react";
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "brand" | "neutral";
type ButtonSize = "sm" | "md" | "lg" | "full";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center rounded-[10px] border-none font-semibold text-[15px] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        brand: "bg-[#00B140] text-white",
        neutral: "bg-[#403F46] text-white",
      },
      size: {
        sm: "h-8 px-4",
        md: "h-10 px-5",
        lg: "h-12 px-6",
        full: "h-12 w-full px-6",
      },
    },
    compoundVariants: [
      {
        variant: "brand",
        className: "disabled:bg-[#D4D3D8] disabled:text-[#F4F4F4]",
      },
      {
        variant: "neutral",
        className: "disabled:bg-[#D4D3D8] disabled:text-[#F4F4F4]",
      },
    ],
    defaultVariants: {
      variant: "brand",
      size: "md",
    },
  },
);

export type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants>;

export const Button = ({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
};
