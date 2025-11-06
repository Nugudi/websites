/**
 * Benefit Mapper
 *
 * Converts between DTO (snake_case) and Domain Entity (camelCase)
 * - DTO: From/To API (snake_case)
 * - Entity: Internal domain model (camelCase)
 */

import type { Benefit } from "../../domain/entities/benefit.entity";
import { MenuType } from "../../domain/entities/benefit.entity";
import type { BenefitDTO, MenuTypeDTO } from "../dto/benefit.dto";

/**
 * DTO → Domain Entity 변환
 * snake_case → camelCase
 */
export function benefitDtoToDomain(dto: BenefitDTO): Benefit {
  return {
    id: dto.id,
    cafeteriaId: dto.cafeteria_id,
    cafeteriaName: dto.cafeteria_name,
    menuName: dto.menu_name,
    menuType: mapDtoTypeToEntityType(dto.menu_type),
    price: dto.price,
    discountedPrice: dto.discounted_price,
    description: dto.description,
    imageUrl: dto.image_url,
    availableAt: dto.available_at,
    createdAt: dto.created_at,
  };
}

/**
 * DTO 배열 → Domain Entity 배열 변환
 */
export function benefitDtoListToDomain(dtos: BenefitDTO[]): Benefit[] {
  return dtos.map(benefitDtoToDomain);
}

/**
 * Domain Entity → DTO 변환
 * camelCase → snake_case
 * (POST/PUT 요청 시 사용)
 */
export function benefitDomainToDto(entity: Benefit): BenefitDTO {
  return {
    id: entity.id,
    cafeteria_id: entity.cafeteriaId,
    cafeteria_name: entity.cafeteriaName,
    menu_name: entity.menuName,
    menu_type: mapEntityTypeToDtoType(entity.menuType),
    price: entity.price,
    discounted_price: entity.discountedPrice,
    description: entity.description,
    image_url: entity.imageUrl,
    available_at: entity.availableAt,
    created_at: entity.createdAt,
  };
}

/**
 * DTO Type → Entity Type 변환
 */
function mapDtoTypeToEntityType(dtoType: MenuTypeDTO): MenuType {
  const typeMap: Record<MenuTypeDTO, MenuType> = {
    LUNCH: MenuType.LUNCH,
    DINNER: MenuType.DINNER,
    SNACK: MenuType.SNACK,
  };
  return typeMap[dtoType];
}

/**
 * Entity Type → DTO Type 변환
 */
function mapEntityTypeToDtoType(entityType: MenuType): MenuTypeDTO {
  const typeMap: Record<MenuType, MenuTypeDTO> = {
    [MenuType.LUNCH]: "LUNCH",
    [MenuType.DINNER]: "DINNER",
    [MenuType.SNACK]: "SNACK",
  };
  return typeMap[entityType];
}
