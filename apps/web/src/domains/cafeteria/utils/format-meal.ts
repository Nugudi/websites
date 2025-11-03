// OpenAPI에 정의된 MealType
type MealType = "BREAKFAST" | "LUNCH" | "DINNER";

/**
 * 주어진 값이 유효한 MealType인지 확인
 */
const isMealType = (value?: string): value is MealType => {
  return value === "BREAKFAST" || value === "LUNCH" || value === "DINNER";
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

  switch (mealType) {
    case "BREAKFAST":
      return "🌅 아침";
    case "LUNCH":
      return "🌞 점심";
    case "DINNER":
      return "🌙 저녁";
  }
};
