/**
 * Stamp Mapper
 *
 * Converts between DTO (snake_case) and Domain Entity (camelCase)
 * Also converts Entity to UI Types for presentation layer
 * - DTO: From/To API (snake_case)
 * - Entity: Internal domain model (camelCase)
 * - UI Type: For presentation layer (StampItem)
 */

import type { Stamp } from "../../domain/entities/stamp.entity";
import type { StampItem } from "../../presentation/types/stamp";
import type { StampDTO } from "../dto/stamp.dto";

/**
 * DTO → Domain Entity 변환
 * snake_case → camelCase
 */
export function stampDtoToDomain(dto: StampDTO): Stamp {
  return {
    id: dto.id,
    userId: dto.user_id,
    cafeteriaId: dto.cafeteria_id,
    cafeteriaName: dto.cafeteria_name,
    issuedAt: dto.issued_at,
    expiresAt: dto.expires_at,
    isUsed: dto.is_used,
    usedAt: dto.used_at,
  };
}

/**
 * DTO 배열 → Domain Entity 배열 변환
 */
export function stampDtoListToDomain(dtos: StampDTO[]): Stamp[] {
  return dtos.map(stampDtoToDomain);
}

/**
 * Domain Entity → DTO 변환
 * camelCase → snake_case
 * (POST/PUT 요청 시 사용)
 */
export function stampDomainToDto(entity: Stamp): StampDTO {
  return {
    id: entity.id,
    user_id: entity.userId,
    cafeteria_id: entity.cafeteriaId,
    cafeteria_name: entity.cafeteriaName,
    issued_at: entity.issuedAt,
    expires_at: entity.expiresAt,
    is_used: entity.isUsed,
    used_at: entity.usedAt,
  };
}

/**
 * ========================================
 * Entity → UI Type 변환 (Presentation Layer용)
 * ========================================
 */

/**
 * ISO timestamp → 날짜 문자열 변환
 * "2024-01-01T00:00:00Z" → "2024.01.01"
 */
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * Stamp Entity → StampItem UI Type 변환
 *
 * @param stamp Domain Entity
 * @returns StampItem UI Type
 */
export function stampEntityToUi(stamp: Stamp): StampItem {
  return {
    id: stamp.id,
    cafeteriaName: stamp.cafeteriaName,
    isUsed: stamp.isUsed,
    issuedDate: formatDate(stamp.issuedAt),
  };
}

/**
 * Stamp Entity 배열 → StampItem 배열 변환
 */
export function stampEntityListToUi(stamps: Stamp[]): StampItem[] {
  return stamps.map(stampEntityToUi);
}
