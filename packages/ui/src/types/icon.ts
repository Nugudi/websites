import type React from "react";
import type { ComponentType } from "react";

export type IconComponent = ComponentType<{
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  title?: string;
  "aria-label"?: string;
}>;

export interface IconData {
  component: IconComponent;
  tags: string[];
}

export type IconRegistry = Record<string, IconData>;

export interface IconSearchResult {
  name: string;
  data: IconData;
}
