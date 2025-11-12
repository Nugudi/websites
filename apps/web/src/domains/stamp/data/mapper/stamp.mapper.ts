/**
 * Stamp Mapper
 */

import { Stamp } from "../../domain/entities/stamp.entity";
import type { StampDTO } from "../remote/dto";

export function stampDtoToDomain(dto: StampDTO): Stamp {
  return new Stamp(
    dto.id,
    dto.user_id,
    dto.cafeteria_id,
    dto.cafeteria_name,
    dto.issued_at,
    dto.is_used,
    dto.expires_at,
    dto.used_at,
  );
}

export function stampDtoListToDomain(dtos: StampDTO[]): Stamp[] {
  return dtos.map(stampDtoToDomain);
}

export function stampDomainToDto(entity: Stamp): StampDTO {
  return {
    id: entity.getId(),
    user_id: entity.getUserId(),
    cafeteria_id: entity.getCafeteriaId(),
    cafeteria_name: entity.getCafeteriaName(),
    issued_at: entity.getIssuedAt(),
    expires_at: entity.getExpiresAt(),
    is_used: entity.getIsUsed(),
    used_at: entity.getUsedAt(),
  };
}
