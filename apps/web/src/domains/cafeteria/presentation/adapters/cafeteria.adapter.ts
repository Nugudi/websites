import type {
  BusinessHours,
  LocalTime,
  TimeRange,
} from "../../domain/entities/business-hours.entity";
import type { Cafeteria } from "../../domain/entities/cafeteria.entity";
import type {
  CafeteriaMenu,
  MenuItem as CafeteriaMenuItemType,
  NutritionInfo as CafeteriaNutritionInfo,
} from "../../domain/entities/cafeteria-menu.entity";
import type { CafeteriaMenuTimeline } from "../../domain/entities/cafeteria-menu-timeline.entity";
import type { Review } from "../../domain/entities/cafeteria-review.entity";
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

function localTimeToUi(time: LocalTime): LocalTimeItem {
  return {
    hour: time.hour,
    minute: time.minute,
    second: time.second,
    nano: time.nano,
  };
}

function timeRangeToUi(range: TimeRange): TimeRangeItem {
  return {
    start: localTimeToUi(range.start),
    end: localTimeToUi(range.end),
  };
}

function businessHoursToUi(
  businessHours: BusinessHours | null,
): BusinessHoursItem | null {
  if (!businessHours) {
    return null;
  }

  return {
    lunch: businessHours.lunch ? timeRangeToUi(businessHours.lunch) : null,
    dinner: businessHours.dinner ? timeRangeToUi(businessHours.dinner) : null,
    note: businessHours.note,
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

function cafeteriaNutritionToUi(
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

function menuItemToUi(item: CafeteriaMenuItemType): MenuItemData {
  return {
    name: item.name,
    category: item.category,
    calories: item.calories,
  };
}

export const CafeteriaAdapter = {
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
      businessHours: businessHoursToUi(cafeteria.getBusinessHours()),
    };
  },

  toUiDetailItem(cafeteria: Cafeteria): CafeteriaDetailItem {
    const baseItem = this.toUiItem(cafeteria);

    return {
      ...baseItem,
      fullAddress: cafeteria.getFullAddress(),
      fullBusinessHours: cafeteria.getFullBusinessHours(),
      hasBusinessHours: cafeteria.hasBusinessHours(),
      hasLocation: cafeteria.hasLocation(),
      hasPhone: cafeteria.hasPhone(),
      hasMealTicketPrice: cafeteria.hasMealTicketPrice(),
      isOpenNow: cafeteria.isOpenNow(),
      currentPeriod: cafeteria.getCurrentPeriod(),
      canTakeout: cafeteria.canTakeout(),
      acceptsMealTicket: cafeteria.acceptsMealTicket(),
    };
  },

  toUiList(cafeterias: Cafeteria[]): CafeteriaItem[] {
    return cafeterias.map((cafeteria) => this.toUiItem(cafeteria));
  },

  toUiDetailList(cafeterias: Cafeteria[]): CafeteriaDetailItem[] {
    return cafeterias.map((cafeteria) => this.toUiDetailItem(cafeteria));
  },

  cafeteriaMenuToUiItem(menu: CafeteriaMenu, date: string): CafeteriaMenuItem {
    const mealType = menu.mealType as "BREAKFAST" | "LUNCH" | "DINNER";

    return {
      date,
      mealType,
      items: menu.menuItems.map(menuItemToUi),
      nutritionInfo: cafeteriaNutritionToUi(menu.nutritionInfo),
      specialNote: menu.specialNote,
      isLunch: mealType === "LUNCH",
      isDinner: mealType === "DINNER",
      hasReviews: false,
      hasNutritionInfo: true,
      totalCalories: menu.nutritionInfo.totalCalories ?? 0,
      isHighlyRated: false,
    };
  },

  menuTimelineToUi(timeline: CafeteriaMenuTimeline): CafeteriaMenuTimelineItem {
    return {
      menuDate: timeline.menuDate,
      menus: timeline.menus.map((menu) =>
        this.cafeteriaMenuToUiItem(menu, timeline.menuDate),
      ),
      reviewCount: timeline.reviewCount,
    };
  },

  menuTimelineListToUi(
    timelines: CafeteriaMenuTimeline[],
  ): CafeteriaMenuTimelineItem[] {
    return timelines.map((timeline) => this.menuTimelineToUi(timeline));
  },

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

  reviewListToUi(reviews: Review[]): CafeteriaReviewItem[] {
    return reviews.map((review) => this.reviewToUi(review));
  },

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
};
