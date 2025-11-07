/**
 * Cafeteria Menu Entity
 */

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

/** 메뉴 항목 */
export interface MenuItem {
  readonly name: string;
  readonly category: MenuCategory;
  readonly calories: number | null;
}

/** 영양 정보 */
export interface NutritionInfo {
  readonly totalCalories: number | null;
  readonly dailyPercentage: number | null;
  readonly walkingSteps: number | null;
  readonly runningKm: number | null;
  readonly cyclingKm: number | null;
}

/** 구내식당 메뉴 */
export interface CafeteriaMenu {
  readonly mealType: string;
  readonly menuItems: MenuItem[];
  readonly specialNote: string | null;
  readonly nutritionInfo: NutritionInfo;
}

/** 메뉴 가용성 (캘린더용) */
export interface MenuAvailability {
  readonly year: number;
  readonly month: number;
  readonly availableDates: number[];
}

/** MealType Enum */
export type MealType = "BREAKFAST" | "LUNCH" | "DINNER";

/** 구내식당 메뉴 등록 요청 */
export interface RegisterCafeteriaMenuRequest {
  readonly restaurantId: number;
  readonly menuDate: string;
  readonly mealType: MealType;
  readonly menuItems: MenuItem[];
  readonly menuImageFileId?: number | null;
  readonly specialNote?: string | null;
}
