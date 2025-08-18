export type MenuCategory =
  | "RICE"
  | "NOODLE"
  | "SOUP"
  | "MAIN_DISH"
  | "SIDE_DISH"
  | "KIMCHI"
  | "BREAD_SANDWICH"
  | "SALAD_FRUIT"
  | "DRINK"
  | "OTHER";

export interface MenuItem {
  name: string;
  category: MenuCategory;
}

export interface MenuCardProps {
  title: string;
  subtitle?: string;
  timeRange?: string;
  items: MenuItem[];
  isPackagingAvailable?: boolean;
}

export interface CategoryConfig {
  icon: string;
  color: string;
  label: string;
}
