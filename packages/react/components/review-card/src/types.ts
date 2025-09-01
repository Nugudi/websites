import type { ComponentPropsWithoutRef } from "react";

export interface Badge {
  emoji: string;
  label: string;
}

export interface ReviewCardProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onClick"> {
  // Optional props for next Image
  imageUrl?: string;
  imageAs?: React.ElementType;
  date: string;
  reviewText: string;
  badges?: Badge[];
  onClick?: () => void;
}
