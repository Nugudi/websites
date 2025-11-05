import type { ComponentPropsWithoutRef } from "react";

export interface Badge {
  emoji: string;
  label: string;
}

export interface ReviewCardProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onClick"> {
  // User information
  username: string;
  userLevel: number;

  // Optional props for next Image
  imageUrl?: string;
  imageAs?: React.ElementType;
  imageAlt?: string;
  date: string;
  reviewText: string;
  badges?: Badge[];

  // Actions
  onClick?: () => void;
  rightIcon?: React.ReactNode;
}
