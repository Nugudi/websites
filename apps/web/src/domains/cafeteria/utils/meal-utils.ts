/**
 * 식사 타입을 한글 제목으로 변환
 * @param mealType - 식사 타입 (BREAKFAST, LUNCH, DINNER 등)
 * @returns 이모지와 함께 포맷된 한글 제목
 */
export const getMealTypeTitle = (mealType?: string): string => {
  switch (mealType) {
    case "BREAKFAST":
      return "🌅 아침";
    case "LUNCH":
      return "🌞 점심";
    case "DINNER":
      return "🌙 저녁";
    default:
      return "🍴 식사";
  }
};
