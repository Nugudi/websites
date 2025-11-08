/**
 * Cafeteria Mapper
 */

import { PageInfoSchema } from "@core/types";
// Import types from Domain Layer
import {
  type Cafeteria,
  CafeteriaEntity,
  type CafeteriaMenu,
  type CafeteriaMenuTimeline,
  type MenuAvailability,
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
import { CafeteriaSchema } from "../dto/schemas/cafeteria.schema";
// Import Zod schemas from Data Layer
import {
  CafeteriaMenuSchema,
  MenuAvailabilitySchema,
} from "../dto/schemas/cafeteria-menu.schema";
import { CafeteriaMenuTimelineSchema } from "../dto/schemas/cafeteria-menu-timeline.schema";

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
    businessHours: dto.businessHours,
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
