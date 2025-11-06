/**
 * Cafeteria Mapper
 *
 * DTO → Entity 변환 (Zod 검증 포함)
 * - DTO: API 응답 형식 (OpenAPI, snake_case)
 * - Entity: 도메인 객체 (비즈니스 로직, camelCase)
 */

import { PageInfoSchema } from "@shared/domain/entities";
import {
  type Cafeteria,
  type CafeteriaMenu,
  CafeteriaMenuSchema,
  type CafeteriaMenuTimeline,
  CafeteriaMenuTimelineSchema,
  CafeteriaSchema,
  type CafeteriaWithMenu,
  CafeteriaWithMenuSchema,
  type MenuAvailability,
  MenuAvailabilitySchema,
} from "../../domain/entities";
import type {
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
} from "../dto";

/**
 * CafeteriaInfoDTO → Cafeteria Entity
 */
export function cafeteriaInfoDtoToDomain(dto: CafeteriaInfoDTO): Cafeteria {
  const entity = {
    id: dto.id,
    name: dto.name,
    address: dto.address,
    addressDetail: dto.addressDetail,
    latitude: dto.latitude,
    longitude: dto.longitude,
    phone: dto.phone,
    mealTicketPrice: dto.mealTicketPrice,
    takeoutAvailable: dto.takeoutAvailable,
    businessHours: dto.businessHours,
  };

  return CafeteriaSchema.parse(entity);
}

/**
 * GetCafeteriaResponse DTO → Cafeteria Entity
 */
export function getCafeteriaResponseToDomain(
  dto: GetCafeteriaResponse,
): Cafeteria {
  if (!dto || !dto.cafeteria) {
    throw new Error("Cafeteria info is missing in response");
  }

  return cafeteriaInfoDtoToDomain(dto.cafeteria);
}

/**
 * MenuInfoDTO → CafeteriaMenu Entity
 */
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

/**
 * GetCafeteriaMenuResponse DTO → CafeteriaMenu Entity
 */
export function getCafeteriaMenuResponseToDomain(
  dto: GetCafeteriaMenuResponse,
): CafeteriaMenu {
  if (!dto || !dto.menus || dto.menus.length === 0) {
    throw new Error("Menu info is missing in response");
  }

  return menuInfoDtoToDomain(dto.menus[0]);
}

/**
 * GetCafeteriaWithMenuResponse DTO → CafeteriaWithMenu Entity
 */
export function getCafeteriaWithMenuResponseToDomain(
  dto: GetCafeteriaWithMenuResponse,
): CafeteriaWithMenu {
  const entity = {
    cafeteria: cafeteriaInfoDtoToDomain(dto.cafeteria),
    menus: dto.menus.map((menu) => menuInfoDtoToDomain(menu)),
  };

  return CafeteriaWithMenuSchema.parse(entity);
}

/**
 * GetCafeteriaMenuAvailabilityResponse DTO → MenuAvailability Entity
 */
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

/**
 * PageInfo DTO → PageInfo Entity
 */
export function pageInfoDtoToDomain(dto: PageInfoDTO) {
  const entity = {
    nextCursor: dto.nextCursor,
    size: dto.size,
    hasNext: dto.hasNext,
  };

  return PageInfoSchema.parse(entity);
}

/**
 * RegisterCafeteriaResponse DTO → Cafeteria Entity
 */
export function registerCafeteriaResponseToDomain(
  dto: RegisterCafeteriaResponse,
): Cafeteria {
  if (!dto) {
    throw new Error("RegisterCafeteriaResponse is null");
  }

  // RegisterCafeteriaResponse를 CafeteriaInfoDTO 형태로 변환
  const cafeteriaInfo: CafeteriaInfoDTO = {
    id: dto.cafeteriaId,
    name: dto.name,
    address: dto.address,
    addressDetail: dto.addressDetail,
    latitude: dto.latitude,
    longitude: dto.longitude,
    phone: dto.phone,
    mealTicketPrice: dto.mealTicketPrice,
    businessHours: null, // RegisterCafeteriaResponse doesn't include businessHours
    takeoutAvailable: dto.takeoutAvailable ?? false,
  };

  return cafeteriaInfoDtoToDomain(cafeteriaInfo);
}

/**
 * RegisterCafeteriaMenuResponse DTO → CafeteriaMenu Entity
 */
export function registerCafeteriaMenuResponseToDomain(
  dto: RegisterCafeteriaMenuResponse,
): CafeteriaMenu {
  if (!dto) {
    throw new Error("RegisterCafeteriaMenuResponse is null");
  }

  // RegisterCafeteriaMenuResponse를 MenuInfoDTO 형태로 변환
  const menuInfo: MenuInfoDTO = {
    mealType: dto.mealType,
    menuItems: dto.menuItems,
    specialNote: dto.specialNote,
    nutritionInfo: {
      totalCalories: dto.totalCalories ?? 0,
      dailyPercentage: 0, // Not in RegisterCafeteriaMenuResponse
      walkingSteps: 0, // Not in RegisterCafeteriaMenuResponse
      runningKm: 0, // Not in RegisterCafeteriaMenuResponse
      cyclingKm: 0, // Not in RegisterCafeteriaMenuResponse
      stairsFloors: 0, // Not in RegisterCafeteriaMenuResponse
    },
  };

  return menuInfoDtoToDomain(menuInfo);
}

/**
 * GetCafeteriaMenuTimelineResponse DTO → CafeteriaMenuTimeline Entity
 */
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

/**
 * Backward compatibility
 */
export const CafeteriaMapper = {
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
