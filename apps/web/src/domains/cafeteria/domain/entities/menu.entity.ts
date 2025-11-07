/**
 * Menu Entity
 */

export interface MenuItem {
  readonly id?: number;
  readonly name: string;
  readonly price?: number;
  readonly category?: "MAIN" | "SIDE" | "EXTRA";
}

export interface NutritionInfo {
  readonly kcal?: number;
  readonly walkingMinutes?: number;
  readonly runningMinutes?: number;
}

export interface Menu {
  // Getter methods
  getId(): number | undefined;
  getDate(): string;
  getMealType(): "LUNCH" | "DINNER";
  getItems(): MenuItem[];
  getNutritionInfo(): NutritionInfo | undefined;
  getAverageRating(): number | undefined;
  getTotalReviews(): number | undefined;

  // Business logic methods
  isLunch(): boolean;
  isDinner(): boolean;
  hasReviews(): boolean;
  hasNutritionInfo(): boolean;
  getTotalCalories(): number;
  isHighlyRated(): boolean;
  getMainItems(): MenuItem[];
  getSideItems(): MenuItem[];
  toPlainObject(): {
    id?: number;
    date: string;
    mealType: "LUNCH" | "DINNER";
    items: MenuItem[];
    nutritionInfo?: NutritionInfo;
    averageRating?: number;
    totalReviews?: number;
  };
  equals(other: Menu): boolean;
}

export class MenuEntity implements Menu {
  private readonly _id?: number;
  private readonly _date: string;
  private readonly _mealType: "LUNCH" | "DINNER";
  private readonly _items: MenuItem[];
  private readonly _nutritionInfo?: NutritionInfo;
  private readonly _averageRating?: number;
  private readonly _totalReviews?: number;

  constructor(params: {
    id?: number;
    date: string;
    mealType: "LUNCH" | "DINNER";
    items: MenuItem[];
    nutritionInfo?: NutritionInfo;
    averageRating?: number;
    totalReviews?: number;
  }) {
    if (!params.date || !this.isValidDate(params.date)) {
      throw new Error("Invalid date format (expected YYYY-MM-DD)");
    }
    if (!params.mealType) {
      throw new Error("Meal type is required");
    }
    if (!params.items || params.items.length === 0) {
      throw new Error("Menu must have at least one item");
    }

    this._id = params.id;
    this._date = params.date;
    this._mealType = params.mealType;
    this._items = params.items;
    this._nutritionInfo = params.nutritionInfo;
    this._averageRating = params.averageRating;
    this._totalReviews = params.totalReviews;
  }

  // Getter methods
  getId(): number | undefined {
    return this._id;
  }

  getDate(): string {
    return this._date;
  }

  getMealType(): "LUNCH" | "DINNER" {
    return this._mealType;
  }

  getItems(): MenuItem[] {
    return this._items;
  }

  getNutritionInfo(): NutritionInfo | undefined {
    return this._nutritionInfo;
  }

  getAverageRating(): number | undefined {
    return this._averageRating;
  }

  getTotalReviews(): number | undefined {
    return this._totalReviews;
  }

  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  isLunch(): boolean {
    return this._mealType === "LUNCH";
  }

  isDinner(): boolean {
    return this._mealType === "DINNER";
  }

  hasReviews(): boolean {
    return (this._totalReviews ?? 0) > 0;
  }

  hasNutritionInfo(): boolean {
    return !!this._nutritionInfo;
  }

  getTotalCalories(): number {
    return this._nutritionInfo?.kcal ?? 0;
  }

  isHighlyRated(): boolean {
    return (this._averageRating ?? 0) >= 4.0;
  }

  getMainItems(): MenuItem[] {
    return this._items.filter((item) => item.category === "MAIN");
  }

  getSideItems(): MenuItem[] {
    return this._items.filter((item) => item.category === "SIDE");
  }

  toPlainObject() {
    return {
      id: this._id,
      date: this._date,
      mealType: this._mealType,
      items: this._items,
      nutritionInfo: this._nutritionInfo,
      averageRating: this._averageRating,
      totalReviews: this._totalReviews,
    };
  }

  equals(other: Menu): boolean {
    return (
      this._date === other.getDate() &&
      this._mealType === other.getMealType() &&
      (this._id === other.getId() || (!this._id && !other.getId()))
    );
  }
}
