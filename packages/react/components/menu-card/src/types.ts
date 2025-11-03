export type MenuCategory =
  | "RICE"
  | "SOUP"
  | "MAIN_DISH"
  | "SIDE_DISH"
  | "KIMCHI"
  | "SALAD"
  | "DESSERT"
  | "DRINK"
  | "SPECIAL";

export interface MenuItem {
  name?: string;
  category?: string;
}

export interface MenuCardProps {
  title: string;
  subtitle?: string;
  timeRange?: string;
  items: MenuItem[];
  isPackagingAvailable?: boolean;
  variant?: "default" | "subtle";
}
