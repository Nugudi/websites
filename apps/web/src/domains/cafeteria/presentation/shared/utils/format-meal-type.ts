/**
 * Meal Type Formatting Utilities
 *
 * Presentation layer utilities for formatting meal types to Korean display names
 */

/**
 * Meal Type to Korean Title Mapping
 */
const MEAL_TYPE_TITLES: Record<string, string> = {
  BREAKFAST: "아침",
  LUNCH: "점심",
  DINNER: "저녁",
};

/**
 * Get Korean title for meal type
 *
 * @param mealType - Meal type string (BREAKFAST, LUNCH, DINNER)
 * @returns Korean title or the original mealType if not found
 *
 * @example
 * ```ts
 * getMealTypeTitle("BREAKFAST") // "아침"
 * getMealTypeTitle("LUNCH") // "점심"
 * getMealTypeTitle("DINNER") // "저녁"
 * getMealTypeTitle("UNKNOWN") // "UNKNOWN"
 * ```
 */
export function getMealTypeTitle(mealType: string): string {
  return MEAL_TYPE_TITLES[mealType] || mealType;
}
