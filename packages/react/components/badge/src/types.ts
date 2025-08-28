import type { SemanticTone, SemanticVariant } from "@nugudi/themes";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  children: ReactNode;
  tone?: SemanticTone;
  variant?: SemanticVariant;
  size?: BadgeSize;
  icon?: ReactElement;
}
