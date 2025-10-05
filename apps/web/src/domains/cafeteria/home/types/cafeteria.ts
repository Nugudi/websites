import type { MenuItem } from "@nugudi/react-components-menu-card";

export interface Cafeteria {
  id: string;
  name: string;
  subtitle: string;
  timeRange: string;
  isPackagingAvailable?: boolean;
  items: MenuItem[];
}
