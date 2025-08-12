import type { CSSProperties } from "react";

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  size?: "sm" | "md" | "lg";
  color?: "main" | "zinc";
  className?: string;
  style?: CSSProperties;
}
