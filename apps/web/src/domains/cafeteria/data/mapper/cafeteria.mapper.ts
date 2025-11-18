/**
 * Cafeteria Mapper
 */

import { PageInfoSchema } from "@core/types";
import { parseHour, parseMinute, parseSecond } from "@core/utils/date";
// Import Entity classes from Domain Layer
import {
  type BusinessHours,
  BusinessHoursEntity,
  type Cafeteria,
  CafeteriaEntity,
} from "../../domain/entities";
// Import DTO types from Data Layer
import type {
  BusinessHoursDTO,
  CafeteriaInfoDTO,
  GetCafeteriaMenuAvailabilityResponse,
  GetCafeteriaMenuResponse,
  GetCafeteriaMenuTimelineResponse,
  GetCafeteriaResponse,
  GetCafeteriaWithMenuResponse,
  MenuInfoDTO,
  PageInfo as PageInfoDTO,
  RegisterCafeteriaMenuResponse,
  RegisterCafeteriaResponse,
} from "../remote/dto";
// Import Domain Types (simple data structures without business logic)
import type {
  CafeteriaMenu,
  CafeteriaMenuTimeline,
  MenuAvailability,
} from "../remote/dto/response/cafeteria-menu-types";
// Import Zod schemas from Data Layer
import { CafeteriaSchema } from "../remote/dto/response/schemas/cafeteria.schema";
import {
  CafeteriaMenuSchema,
  MenuAvailabilitySchema,
} from "../remote/dto/response/schemas/cafeteria-menu.schema";
import { CafeteriaMenuTimelineSchema } from "../remote/dto/response/schemas/cafeteria-menu-timeline.schema";

/**
 * BusinessHoursDTO를 BusinessHours Entity로 변환
 *
 * @param dto - BusinessHoursDTO (nullable)
 * @returns BusinessHours Entity 인스턴스 또는 null
 *
 * @remarks
 * - User domain pattern을 따르는 function-based mapper
 * - DTO가 null이면 null 반환 (영업시간 정보 없음)
 * - Entity 생성 시 자동 검증 수행 (constructor validation)
 */
export function businessHoursDtoToDomain(
  dto: BusinessHoursDTO | null | undefined,
): BusinessHours | null {
  if (!dto) {
    return null;
  }

  // Helper to validate and convert LocalTime DTO
  const convertLocalTime = (time: any) => {
    if (!time) return null;

    // 문자열 형식 처리 ("11:30:00" 또는 "11:30")
    if (typeof time === "string") {
      const parts = time.split(":");
      if (parts.length < 2) return null;

      const hour = parseHour(parts[0]);
      const minute = parseMinute(parts[1]);
      const second = parseSecond(parts[2]);

      if (hour === null || minute === null) return null;

      return { hour, minute, second, nano: 0 };
    }

    return null;
  };

  // Helper to convert TimeRange DTO
  const convertTimeRange = (range: any) => {
    if (!range) return null;
    const start = convertLocalTime(range.start);
    const end = convertLocalTime(range.end);
    if (!start || !end) return null;
    return { start, end };
  };

  return new BusinessHoursEntity({
    lunch: convertTimeRange(dto.lunch),
    dinner: convertTimeRange(dto.dinner),
    note: dto.note ?? null,
  });
}

export function cafeteriaInfoDtoToDomain(dto: CafeteriaInfoDTO): Cafeteria {
  const rawData = {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    addressDetail: dto.addressDetail,
    latitude: dto.latitude,
    longitude: dto.longitude,
    phone: dto.phone,
    mealTicketPrice: dto.mealTicketPrice,
    takeoutAvailable: dto.takeoutAvailable,
    businessHours: businessHoursDtoToDomain(dto.businessHours),
  };

  // Validate and transform with Zod schema - returns validated/transformed data
  const validatedProps = CafeteriaSchema.parse(rawData);

  // Return CafeteriaEntity instance with validated props
  return new CafeteriaEntity(validatedProps);
}

export function getCafeteriaResponseToDomain(
  dto: GetCafeteriaResponse,
): Cafeteria {
  if (!dto || !dto.cafeteria) {
    throw new Error("Cafeteria info is missing in response");
  }

  return cafeteriaInfoDtoToDomain(dto.cafeteria);
}

export function menuInfoDtoToDomain(dto: MenuInfoDTO): CafeteriaMenu {
  if (!dto.nutritionInfo) {
    throw new Error("NutritionInfo is missing in menu response");
  }

  const entity = {
    mealType: dto.mealType,
    menuItems: dto.menuItems.map((item) => ({
      name: item.name,
      category: item.category,
      calories: item.calories,
    })),
    specialNote: dto.specialNote,
    nutritionInfo: {
      totalCalories: dto.nutritionInfo.totalCalories,
      dailyPercentage: dto.nutritionInfo.dailyPercentage,
      walkingSteps: dto.nutritionInfo.walkingSteps,
      runningKm: dto.nutritionInfo.runningKm,
      cyclingKm: dto.nutritionInfo.cyclingKm,
    },
  };

  return CafeteriaMenuSchema.parse(entity);
}

export function getCafeteriaMenuResponseToDomain(
  dto: GetCafeteriaMenuResponse,
): CafeteriaMenu {
  if (!dto || !dto.menus || dto.menus.length === 0) {
    throw new Error("Menu info is missing in response");
  }

  return menuInfoDtoToDomain(dto.menus[0]);
}

export function getCafeteriaWithMenuResponseToDomain(
  dto: GetCafeteriaWithMenuResponse,
): {
  cafeteria: Cafeteria;
  menus: CafeteriaMenu[];
} {
  return {
    cafeteria: cafeteriaInfoDtoToDomain(dto.cafeteria),
    menus: dto.menus.map((menu) => menuInfoDtoToDomain(menu)),
  };
}

export function getCafeteriaMenuAvailabilityResponseToDomain(
  dto: GetCafeteriaMenuAvailabilityResponse,
): MenuAvailability {
  if (!dto) {
    throw new Error("MenuAvailability response is null");
  }

  const entity = {
    year: dto.year,
    month: dto.month,
    availableDates: dto.daysWithMenu,
  };

  return MenuAvailabilitySchema.parse(entity);
}

export function pageInfoDtoToDomain(dto: PageInfoDTO) {
  const entity = {
    nextCursor: dto.nextCursor,
    size: dto.size,
    hasNext: dto.hasNext,
  };

  return PageInfoSchema.parse(entity);
}

export function registerCafeteriaResponseToDomain(
  dto: RegisterCafeteriaResponse,
): Cafeteria {
  if (!dto) {
    throw new Error("RegisterCafeteriaResponse is null");
  }

  const cafeteriaInfo: CafeteriaInfoDTO = {
    id: dto.cafeteriaId,
    name: dto.name,
    address: dto.address,
    addressDetail: dto.addressDetail,
    latitude: dto.latitude,
    longitude: dto.longitude,
    phone: dto.phone,
    mealTicketPrice: dto.mealTicketPrice,
    businessHours: null,
    takeoutAvailable: dto.takeoutAvailable ?? false,
  };

  return cafeteriaInfoDtoToDomain(cafeteriaInfo);
}

export function registerCafeteriaMenuResponseToDomain(
  dto: RegisterCafeteriaMenuResponse,
): CafeteriaMenu {
  if (!dto) {
    throw new Error("RegisterCafeteriaMenuResponse is null");
  }

  const menuInfo: MenuInfoDTO = {
    mealType: dto.mealType,
    menuItems: dto.menuItems,
    specialNote: dto.specialNote,
    nutritionInfo: {
      totalCalories: dto.totalCalories ?? 0,
      dailyPercentage: 0,
      walkingSteps: 0,
      runningKm: 0,
      cyclingKm: 0,
      stairsFloors: 0,
    },
  };

  return menuInfoDtoToDomain(menuInfo);
}

export function getCafeteriaMenuTimelineResponseToDomain(
  dto: GetCafeteriaMenuTimelineResponse,
): CafeteriaMenuTimeline {
  const entity = {
    menuDate: dto.menuDate ?? "",
    menus: (dto.menus ?? []).map((menu) => menuInfoDtoToDomain(menu)),
    reviewCount: dto.reviewCount ?? 0,
  };

  return CafeteriaMenuTimelineSchema.parse(entity);
}

export const CafeteriaMapper = {
  businessHoursDtoToDomain,
  cafeteriaInfoDtoToDomain,
  getCafeteriaResponseToDomain,
  menuInfoDtoToDomain,
  getCafeteriaMenuResponseToDomain,
  getCafeteriaMenuTimelineResponseToDomain,
  getCafeteriaWithMenuResponseToDomain,
  getCafeteriaMenuAvailabilityResponseToDomain,
  pageInfoDtoToDomain,
  registerCafeteriaResponseToDomain,
  registerCafeteriaMenuResponseToDomain,
};
