export interface LocalTimeItem {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface TimeRangeItem {
  start: LocalTimeItem;
  end: LocalTimeItem;
}

export interface BusinessHoursItem {
  lunch: TimeRangeItem | null;
  dinner: TimeRangeItem | null;
  note: string | null;
}

export interface MenuItemData {
  id?: number;
  name: string;
  price?: number;
  category?:
    | "RICE"
    | "SOUP"
    | "MAIN_DISH"
    | "SIDE_DISH"
    | "KIMCHI"
    | "SALAD"
    | "DESSERT"
    | "DRINK"
    | "SPECIAL";
  calories?: number | null;
}

export interface NutritionInfoItem {
  kcal?: number;
  walkingMinutes?: number;
  runningMinutes?: number;
  totalCalories?: number | null;
  dailyPercentage?: number | null;
  walkingSteps?: number | null;
  runningKm?: number | null;
  cyclingKm?: number | null;
}

export interface CafeteriaItem {
  id: number;
  name: string;
  address: string;
  addressDetail: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  mealTicketPrice: number | null;
  takeoutAvailable: boolean;
  businessHours: BusinessHoursItem | null;
}

export interface CafeteriaDetailItem extends CafeteriaItem {
  fullAddress: string;
  fullBusinessHours: string;
  hasBusinessHours: boolean;
  hasLocation: boolean;
  hasPhone: boolean;
  hasMealTicketPrice: boolean;
  hasNote: boolean;
  isOpenNow: boolean;
  currentPeriod: "lunch" | "dinner" | "closed";
  canTakeout: boolean;
}

export interface CafeteriaMenuItem {
  id?: number;
  date: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER";
  items: MenuItemData[];
  nutritionInfo?: NutritionInfoItem;
  averageRating?: number;
  totalReviews?: number;
  specialNote?: string | null;
  isLunch: boolean;
  isDinner: boolean;
  hasReviews: boolean;
  hasNutritionInfo: boolean;
  totalCalories: number;
  isHighlyRated: boolean;
}

export interface CafeteriaMenuTimelineItem {
  menuDate: string;
  menus: CafeteriaMenuItem[];
  reviewCount: number;
}

export interface CafeteriaReviewItem {
  id: number;
  restaurantId: number;
  reviewDate: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER";
  tasteTypeId: number;
  content: string;
  mainImageUrl: string | null;
  likeCount: number;
  createdAt: string;
}

export interface CafeteriasWithMenuItem {
  cafeteria: CafeteriaItem;
  menu: CafeteriaMenuItem | null;
}

export interface MenuAvailabilityItem {
  year: number;
  month: number;
  availableDates: number[];
}
