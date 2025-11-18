import dayjs from "dayjs";
import "dayjs/locale/ko";

// Import Domain Types (simple data structures without business logic)
import type {
  CafeteriaMenu,
  MenuItem as CafeteriaMenuItemType,
  CafeteriaMenuTimeline,
  NutritionInfo as CafeteriaNutritionInfo,
} from "../../../data/remote/dto/response/cafeteria-menu-types";
import type { Review } from "../../../data/remote/dto/response/cafeteria-review-types";
// Import Entity classes (with business logic)
import type {
  BusinessHours,
  Cafeteria,
  LocalTime,
  TimeRange,
} from "../../../domain/entities";
import type {
  BusinessHoursItem,
  CafeteriaDetailItem,
  CafeteriaItem,
  CafeteriaMenuItem,
  CafeteriaMenuTimelineItem,
  CafeteriaReviewItem,
  LocalTimeItem,
  MenuItemData,
  NutritionInfoItem,
  TimeRangeItem,
} from "../types";

// Set Korean locale globally for this module
dayjs.locale("ko");

/**
 * Private helper: Formats LocalTime to "HH:mm" string
 */
function _formatLocalTime(time: LocalTime): string {
  const hour = String(time.hour).padStart(2, "0");
  const minute = String(time.minute).padStart(2, "0");
  return `${hour}:${minute}`;
}

/**
 * Private helper: Formats TimeRange to "HH:mm ~ HH:mm" string
 */
function _formatTimeRange(range: TimeRange): string {
  const start = _formatLocalTime(range.start);
  const end = _formatLocalTime(range.end);
  return `${start} ~ ${end}`;
}

/**
 * Private helper: Converts LocalTime to UI item
 */
function _localTimeToUi(time: LocalTime): LocalTimeItem {
  return {
    hour: time.hour,
    minute: time.minute,
    second: time.second,
    nano: time.nano,
  };
}

/**
 * Private helper: Converts TimeRange to UI item
 */
function _timeRangeToUi(range: TimeRange): TimeRangeItem {
  return {
    start: _localTimeToUi(range.start),
    end: _localTimeToUi(range.end),
  };
}

/**
 * Private helper: Converts BusinessHours to UI item
 */
function _businessHoursToUi(
  businessHours: BusinessHours | null,
): BusinessHoursItem | null {
  if (!businessHours) {
    return null;
  }

  const lunch = businessHours.getLunch();
  const dinner = businessHours.getDinner();

  return {
    lunch: lunch ? _timeRangeToUi(lunch) : null,
    dinner: dinner ? _timeRangeToUi(dinner) : null,
    note: businessHours.getNote(),
  };
}

function _menuNutritionToUi(
  nutritionInfo:
    | { kcal?: number; walkingMinutes?: number; runningMinutes?: number }
    | undefined,
): NutritionInfoItem | undefined {
  if (!nutritionInfo) {
    return undefined;
  }

  return {
    kcal: nutritionInfo.kcal,
    walkingMinutes: nutritionInfo.walkingMinutes,
    runningMinutes: nutritionInfo.runningMinutes,
  };
}

/**
 * Private helper: Converts CafeteriaNutritionInfo to UI item
 */
function _cafeteriaNutritionToUi(
  nutritionInfo: CafeteriaNutritionInfo,
): NutritionInfoItem {
  return {
    totalCalories: nutritionInfo.totalCalories,
    dailyPercentage: nutritionInfo.dailyPercentage,
    walkingSteps: nutritionInfo.walkingSteps,
    runningKm: nutritionInfo.runningKm,
    cyclingKm: nutritionInfo.cyclingKm,
  };
}

/**
 * Private helper: Converts menu item to UI data
 */
function _menuItemToUi(item: CafeteriaMenuItemType): MenuItemData {
  return {
    name: item.name,
    category: item.category,
    calories: item.calories,
  };
}

export const CafeteriaAdapter = {
  /**
   * Transform Cafeteria entity to basic UI item
   *
   * @param cafeteria - Domain Cafeteria entity
   * @returns Basic UI-safe CafeteriaItem type
   */
  toUiItem(cafeteria: Cafeteria): CafeteriaItem {
    return {
      id: cafeteria.getId(),
      name: cafeteria.getName(),
      address: cafeteria.getAddress(),
      addressDetail: cafeteria.getAddressDetail(),
      latitude: cafeteria.getLatitude(),
      longitude: cafeteria.getLongitude(),
      phone: cafeteria.getPhone(),
      mealTicketPrice: cafeteria.getMealTicketPrice(),
      takeoutAvailable: cafeteria.getTakeoutAvailable(),
      businessHours: _businessHoursToUi(cafeteria.getBusinessHours()),
    };
  },

  /**
   * Transform Cafeteria entity to detailed UI item
   *
   * @param cafeteria - Domain Cafeteria entity
   * @returns Detailed UI item with computed properties
   */
  toUiDetailItem(cafeteria: Cafeteria): CafeteriaDetailItem {
    const baseItem = this.toUiItem(cafeteria);

    return {
      ...baseItem,
      fullAddress: cafeteria.getFullAddress(),
      fullBusinessHours: this.getFormattedBusinessHours(cafeteria),
      hasBusinessHours: cafeteria.hasBusinessHours(),
      hasLocation: cafeteria.hasLocation(),
      hasPhone: cafeteria.hasPhone(),
      hasMealTicketPrice: cafeteria.hasMealTicketPrice(),
      hasNote: cafeteria.hasNote(),
      isOpenNow: cafeteria.isOpenNow(),
      currentPeriod: cafeteria.getCurrentPeriod(),
      canTakeout: cafeteria.canTakeout(),
    };
  },

  /**
   * Transform array of Cafeteria entities to UI item array
   *
   * @param cafeterias - Array of domain Cafeteria entities
   * @returns Array of basic UI-safe CafeteriaItem types
   */
  toUiList(cafeterias: Cafeteria[]): CafeteriaItem[] {
    return cafeterias.map((cafeteria) => this.toUiItem(cafeteria));
  },

  /**
   * Transform array of Cafeteria entities to detailed UI item array
   *
   * @param cafeterias - Array of domain Cafeteria entities
   * @returns Array of detailed UI items
   */
  toUiDetailList(cafeterias: Cafeteria[]): CafeteriaDetailItem[] {
    return cafeterias.map((cafeteria) => this.toUiDetailItem(cafeteria));
  },

  /**
   * Transform CafeteriaMenu entity to UI menu item
   *
   * @param menu - Domain CafeteriaMenu entity
   * @param date - Date string for the menu
   * @returns UI-safe CafeteriaMenuItem
   */
  cafeteriaMenuToUiItem(menu: CafeteriaMenu, date: string): CafeteriaMenuItem {
    const mealType = menu.mealType as "BREAKFAST" | "LUNCH" | "DINNER";

    return {
      date,
      mealType,
      items: menu.menuItems.map(_menuItemToUi),
      nutritionInfo: _cafeteriaNutritionToUi(menu.nutritionInfo),
      specialNote: menu.specialNote,
      isLunch: mealType === "LUNCH",
      isDinner: mealType === "DINNER",
      hasReviews: false,
      hasNutritionInfo: true,
      totalCalories: menu.nutritionInfo.totalCalories ?? 0,
      isHighlyRated: false,
    };
  },

  /**
   * Transform CafeteriaMenuTimeline to UI timeline item
   *
   * @param timeline - Domain CafeteriaMenuTimeline entity
   * @returns UI-safe timeline item with menus
   */
  menuTimelineToUi(timeline: CafeteriaMenuTimeline): CafeteriaMenuTimelineItem {
    return {
      menuDate: timeline.menuDate,
      menus: timeline.menus.map((menu) =>
        this.cafeteriaMenuToUiItem(menu, timeline.menuDate),
      ),
      reviewCount: timeline.reviewCount,
    };
  },

  /**
   * Transform array of menu timelines to UI timeline array
   *
   * @param timelines - Array of domain timeline entities
   * @returns Array of UI timeline items
   */
  menuTimelineListToUi(
    timelines: CafeteriaMenuTimeline[],
  ): CafeteriaMenuTimelineItem[] {
    return timelines.map((timeline) => this.menuTimelineToUi(timeline));
  },

  /**
   * Transform Review entity to UI item
   *
   * @param review - Domain Review entity
   * @returns UI-safe review item
   */
  reviewToUi(review: Review): CafeteriaReviewItem {
    return {
      id: review.id,
      restaurantId: review.restaurantId,
      reviewDate: review.reviewDate,
      mealType: review.mealType,
      tasteTypeId: review.tasteTypeId,
      content: review.content,
      mainImageUrl: review.mainImageUrl,
      likeCount: review.likeCount,
      createdAt: review.createdAt,
    };
  },

  /**
   * Transform array of reviews to UI item array
   *
   * @param reviews - Array of domain Review entities
   * @returns Array of UI review items
   */
  reviewListToUi(reviews: Review[]): CafeteriaReviewItem[] {
    return reviews.map((review) => this.reviewToUi(review));
  },

  /**
   * Get formatted distance string from user location
   *
   * @param cafeteria - Domain Cafeteria entity
   * @param userLat - User latitude
   * @param userLng - User longitude
   * @returns Formatted distance string or null if unavailable
   */
  getFormattedDistance(
    cafeteria: Cafeteria,
    userLat: number,
    userLng: number,
  ): string | null {
    const distance = cafeteria.getDistanceFrom(userLat, userLng);
    if (distance === null) {
      return null;
    }

    return `${distance.toFixed(2)} km`;
  },

  /**
   * Get operating status text in Korean
   *
   * @param cafeteria - Domain Cafeteria entity
   * @returns Korean status text
   */
  getOperatingStatusText(cafeteria: Cafeteria): string {
    const period = cafeteria.getCurrentPeriod();

    switch (period) {
      case "lunch":
        return "영업 중 (점심)";
      case "dinner":
        return "영업 중 (저녁)";
      case "closed":
        return "영업 종료";
      default:
        return "영업 정보 없음";
    }
  },

  /**
   * Get UI color based on operating status
   *
   * @param cafeteria - Domain Cafeteria entity
   * @returns Color string for UI theming
   */
  getOperatingStatusColor(
    cafeteria: Cafeteria,
  ): "green" | "orange" | "red" | "gray" {
    const period = cafeteria.getCurrentPeriod();

    switch (period) {
      case "lunch":
      case "dinner":
        return "green";
      case "closed":
        return "red";
      default:
        return "gray";
    }
  },

  /**
   * Get formatted business hours string
   *
   * @description
   * Formats BusinessHours entity to Korean UI text.
   * Uses boolean methods from entity (hasLunch, hasDinner) to determine availability,
   * then formats time ranges using helper functions.
   *
   * @param cafeteria - Domain Cafeteria entity
   * @returns Formatted Korean business hours string
   *
   * @example
   * // With lunch and dinner
   * "점심: 11:30 ~ 14:00 / 저녁: 17:00 ~ 20:00"
   *
   * @example
   * // With note
   * "점심: 11:30 ~ 14:00 / 저녁: 17:00 ~ 20:00 (주말 휴무)"
   *
   * @example
   * // No business hours
   * "영업시간 정보 없음"
   */
  getFormattedBusinessHours(cafeteria: Cafeteria): string {
    const businessHours = cafeteria.getBusinessHours();

    if (!businessHours) {
      return "영업시간 정보 없음";
    }

    const parts: string[] = [];

    // Check if has lunch and format
    if (businessHours.hasLunch()) {
      const lunch = businessHours.getLunch();
      if (lunch) {
        parts.push(`점심: ${_formatTimeRange(lunch)}`);
      }
    }

    // Check if has dinner and format
    if (businessHours.hasDinner()) {
      const dinner = businessHours.getDinner();
      if (dinner) {
        parts.push(`저녁: ${_formatTimeRange(dinner)}`);
      }
    }

    if (parts.length === 0) {
      return "영업시간 정보 없음";
    }

    // note는 별도로 표시하므로 영업시간만 반환
    return parts.join(" / ");
  },

  /**
   * Get formatted period string (for specific meal type)
   *
   * @description
   * Formats a specific meal period's operating hours using entity's boolean check
   * (hasLunch/hasDinner) and time range formatting.
   *
   * @param businessHours - BusinessHours entity
   * @param mealType - Meal type to format ("lunch" | "dinner")
   * @returns Formatted time range or "영업 안 함"
   *
   * @example
   * getFormattedPeriod(hours, "lunch") // => "11:30 ~ 14:00"
   * getFormattedPeriod(hours, "dinner") // => "영업 안 함"
   */
  getFormattedPeriod(
    businessHours: BusinessHours | null,
    mealType: "lunch" | "dinner",
  ): string {
    if (!businessHours) {
      return "영업 안 함";
    }

    const hasTime =
      mealType === "lunch"
        ? businessHours.hasLunch()
        : businessHours.hasDinner();

    if (!hasTime) {
      return "영업 안 함";
    }

    const range =
      mealType === "lunch"
        ? businessHours.getLunch()
        : businessHours.getDinner();

    return range ? _formatTimeRange(range) : "영업 안 함";
  },
};
