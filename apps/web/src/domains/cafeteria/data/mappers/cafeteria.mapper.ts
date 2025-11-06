/**
 * Cafeteria Mapper
 *
 * CafeteriaDTO ↔ Cafeteria Entity 변환
 * - DTO: API 응답 형식 (OpenAPI)
 * - Entity: 도메인 객체 (비즈니스 로직 포함)
 */

import type { Cafeteria } from "../../domain/entities/cafeteria.entity";
import type { CafeteriaInfoDTO, GetCafeteriaResponse } from "../dto";

/**
 * Helper: OpenAPI LocalTime 객체를 HH:MM 문자열로 변환
 */
function formatTimeObject(
  timeObj:
    | { hour?: number; minute?: number; second?: number; nano?: number }
    | null
    | undefined,
): string {
  if (!timeObj || timeObj.hour === undefined || timeObj.minute === undefined) {
    return "";
  }
  const hour = String(timeObj.hour).padStart(2, "0");
  const minute = String(timeObj.minute).padStart(2, "0");
  return `${hour}:${minute}`;
}

/**
 * GetCafeteriaResponse DTO → Cafeteria Entity 변환
 *
 * @param dto API 응답 DTO
 * @returns Cafeteria Entity
 */
export function getCafeteriaResponseToDomain(
  dto: GetCafeteriaResponse,
): Cafeteria {
  if (!dto || !dto.cafeteria) {
    throw new Error("Cafeteria info is missing in response");
  }

  const cafeteriaInfo = dto.cafeteria;

  return {
    id: cafeteriaInfo.id ?? 0,
    name: cafeteriaInfo.name ?? "",
    address: cafeteriaInfo.address ?? undefined,
    phoneNumber: cafeteriaInfo.phone ?? undefined,
    imageUrl: undefined, // imageUrl not available in current DTO
    latitude: cafeteriaInfo.latitude ?? undefined,
    longitude: cafeteriaInfo.longitude ?? undefined,
    businessHours: cafeteriaInfo.businessHours
      ? {
          lunch: cafeteriaInfo.businessHours.lunch
            ? {
                start: formatTimeObject(
                  cafeteriaInfo.businessHours.lunch.start,
                ),
                end: formatTimeObject(cafeteriaInfo.businessHours.lunch.end),
              }
            : undefined,
          dinner: cafeteriaInfo.businessHours.dinner
            ? {
                start: formatTimeObject(
                  cafeteriaInfo.businessHours.dinner.start,
                ),
                end: formatTimeObject(cafeteriaInfo.businessHours.dinner.end),
              }
            : undefined,
        }
      : undefined,
  };
}

/**
 * CafeteriaInfoDTO → Cafeteria Entity 변환
 *
 * @param dto CafeteriaInfoDTO
 * @returns Cafeteria Entity
 */
export function cafeteriaInfoDtoToDomain(dto: CafeteriaInfoDTO): Cafeteria {
  return {
    id: dto.id ?? 0,
    name: dto.name ?? "",
    address: dto.address ?? undefined,
    phoneNumber: dto.phone ?? undefined,
    imageUrl: undefined, // imageUrl not available in current DTO
    latitude: dto.latitude ?? undefined,
    longitude: dto.longitude ?? undefined,
    businessHours: dto.businessHours
      ? {
          lunch: dto.businessHours.lunch
            ? {
                start: formatTimeObject(dto.businessHours.lunch.start),
                end: formatTimeObject(dto.businessHours.lunch.end),
              }
            : undefined,
          dinner: dto.businessHours.dinner
            ? {
                start: formatTimeObject(dto.businessHours.dinner.start),
                end: formatTimeObject(dto.businessHours.dinner.end),
              }
            : undefined,
        }
      : undefined,
  };
}

/**
 * Cafeteria Entity → CafeteriaInfoDTO 변환 (필요시)
 *
 * @param entity Cafeteria Entity
 * @returns CafeteriaInfoDTO
 */
export function cafeteriaDomainToDto(
  entity: Cafeteria,
): Partial<CafeteriaInfoDTO> {
  return {
    id: entity.id,
    name: entity.name,
    address: entity.address ?? undefined,
    phone: entity.phoneNumber ?? undefined,
    // imageUrl not available in current DTO
    latitude: entity.latitude ?? undefined,
    longitude: entity.longitude ?? undefined,
    // businessHours conversion would require complex type mapping
  };
}

/**
 * Backward compatibility - 기존 코드에서 사용하는 클래스 형태
 */
export const CafeteriaMapper = {
  getCafeteriaResponseToDomain,
  cafeteriaInfoDtoToDomain,
  toDomain: cafeteriaInfoDtoToDomain,
  toDTO: cafeteriaDomainToDto,
};
