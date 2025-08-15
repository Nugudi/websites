import type { ReactElement, ReactNode } from "react";

export interface StepProps<T> {
  name: T;
  children: ReactNode;
}

export interface StepperProps<T> {
  children: Array<ReactElement<StepProps<T>>>;
}
