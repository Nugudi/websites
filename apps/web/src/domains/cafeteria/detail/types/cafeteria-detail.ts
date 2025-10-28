export interface CafeteriaDetail {
  id: string;
  name: string;
  location: string;
  operatingHours: string;
  isLiked: boolean;
  isPackagingAvailable: boolean;
  price: number;
  rating: number;
  reviewCount: number;
  date: string;
  menus: {
    breakfast: MenuItem[];
    lunch: MenuItem[];
  };
}

export interface MenuItem {
  name: string;
  category: MenuCategory;
}

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
