/**
 * Menu Entity
 *
 * 메뉴 도메인 객체
 * - 프레임워크에 독립적
 * - 비즈니스 로직 포함 가능
 * - Immutable 패턴 사용
 */

/**
 * Menu Item Interface
 */
export interface MenuItem {
  readonly id?: number;
  readonly name: string;
  readonly price?: number;
  readonly category?: "MAIN" | "SIDE" | "EXTRA";
}

/**
 * Nutrition Info Interface
 */
export interface NutritionInfo {
  readonly kcal?: number;
  readonly walkingMinutes?: number;
  readonly runningMinutes?: number;
}

/**
 * Menu Entity Interface
 */
export interface Menu {
  readonly id?: number;
  readonly date: string;
  readonly mealType: "LUNCH" | "DINNER";
  readonly items: MenuItem[];
  readonly nutritionInfo?: NutritionInfo;
  readonly averageRating?: number;
  readonly totalReviews?: number;
}

/**
 * Menu Entity Class (with business logic)
 */
export class MenuEntity implements Menu {
  readonly id?: number;
  readonly date: string;
  readonly mealType: "LUNCH" | "DINNER";
  readonly items: MenuItem[];
  readonly nutritionInfo?: NutritionInfo;
  readonly averageRating?: number;
  readonly totalReviews?: number;

  constructor(params: {
    id?: number;
    date: string;
    mealType: "LUNCH" | "DINNER";
    items: MenuItem[];
    nutritionInfo?: NutritionInfo;
    averageRating?: number;
    totalReviews?: number;
  }) {
    // 검증 로직
    if (!params.date || !this.isValidDate(params.date)) {
      throw new Error("Invalid date format (expected YYYY-MM-DD)");
    }
    if (!params.mealType) {
      throw new Error("Meal type is required");
    }
    if (!params.items || params.items.length === 0) {
      throw new Error("Menu must have at least one item");
    }

    this.id = params.id;
    this.date = params.date;
    this.mealType = params.mealType;
    this.items = params.items;
    this.nutritionInfo = params.nutritionInfo;
    this.averageRating = params.averageRating;
    this.totalReviews = params.totalReviews;
  }

  /**
   * 비즈니스 로직: 날짜 형식 검증
   */
  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  /**
   * 비즈니스 로직: 점심 메뉴인지 확인
   */
  isLunch(): boolean {
    return this.mealType === "LUNCH";
  }

  /**
   * 비즈니스 로직: 저녁 메뉴인지 확인
   */
  isDinner(): boolean {
    return this.mealType === "DINNER";
  }

  /**
   * 비즈니스 로직: 리뷰가 있는지 확인
   */
  hasReviews(): boolean {
    return (this.totalReviews ?? 0) > 0;
  }

  /**
   * 비즈니스 로직: 영양 정보가 있는지 확인
   */
  hasNutritionInfo(): boolean {
    return !!this.nutritionInfo;
  }

  /**
   * 비즈니스 로직: 총 칼로리 가져오기
   */
  getTotalCalories(): number {
    return this.nutritionInfo?.kcal ?? 0;
  }

  /**
   * 비즈니스 로직: 평균 평점이 높은지 (4.0 이상)
   */
  isHighlyRated(): boolean {
    return (this.averageRating ?? 0) >= 4.0;
  }

  /**
   * 비즈니스 로직: 메인 메뉴 항목만 가져오기
   */
  getMainItems(): MenuItem[] {
    return this.items.filter((item) => item.category === "MAIN");
  }

  /**
   * 비즈니스 로직: 사이드 메뉴 항목만 가져오기
   */
  getSideItems(): MenuItem[] {
    return this.items.filter((item) => item.category === "SIDE");
  }

  /**
   * Entity를 Plain Object로 변환
   */
  toPlainObject(): Menu {
    return {
      id: this.id,
      date: this.date,
      mealType: this.mealType,
      items: this.items,
      nutritionInfo: this.nutritionInfo,
      averageRating: this.averageRating,
      totalReviews: this.totalReviews,
    };
  }

  /**
   * 동등성 비교
   */
  equals(other: Menu): boolean {
    return (
      this.date === other.date &&
      this.mealType === other.mealType &&
      (this.id === other.id || (!this.id && !other.id))
    );
  }
}
