import type { MenuInfoDTO } from "../types";

type MealType = NonNullable<MenuInfoDTO["mealType"]>;

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER"] as const;

const MEAL_TYPE_LABELS: Record<(typeof MEAL_TYPES)[number], string> = {
  BREAKFAST: "🌅 아침",
  LUNCH: "🌞 점심",
  DINNER: "🌙 저녁",
} as const;

const isMealType = (value?: string): value is MealType => {
  return MEAL_TYPES.includes(value as (typeof MEAL_TYPES)[number]);
};

/**
 * 식사 타입을 한글 제목으로 변환
 * @param mealType - 식사 타입 (BREAKFAST, LUNCH, DINNER) 또는 string
 * @returns 이모지와 함께 포맷된 한글 제목, 유효하지 않은 경우 undefined
 */
export const getMealTypeTitle = (mealType?: string) => {
  if (!isMealType(mealType)) {
    return undefined;
  }

  return MEAL_TYPE_LABELS[mealType as keyof typeof MEAL_TYPE_LABELS];
};
