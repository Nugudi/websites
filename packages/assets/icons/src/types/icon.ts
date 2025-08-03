import type { ComponentType, SVGProps } from "react";

export type IconComponent = ComponentType<SVGProps<SVGElement>>;

export interface IconData {
  component: IconComponent;
  tags: string[];
}

export type IconRegistry = Record<string, IconData>;

export interface IconSearchResult {
  name: string;
  data: IconData;
}
