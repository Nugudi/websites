/**
 * Benefit Mapper
 *
 * Data Layer의 DTO ↔ Domain Entity 변환
 *
 * @remarks
 * - DTO (API Response) → Domain Entity 변환
 * - Clean Architecture: Data Layer 책임
 */

import {
  Benefit,
  MENU_TYPE,
  type MenuType,
} from "../../domain/entities/benefit.entity";
import type { BenefitDTO, MenuTypeDTO } from "../remote/dto";

export function benefitDtoToDomain(dto: BenefitDTO): Benefit {
  return new Benefit(
    dto.id,
    dto.cafeteria_id,
    dto.cafeteria_name,
    dto.menu_name,
    mapDtoTypeToEntityType(dto.menu_type),
    dto.price,
    dto.available_at,
    dto.created_at,
    dto.discounted_price,
    dto.description,
    dto.image_url,
  );
}

export function benefitDtoListToDomain(dtos: BenefitDTO[]): Benefit[] {
  return dtos.map(benefitDtoToDomain);
}

export function benefitDomainToDto(entity: Benefit): BenefitDTO {
  return {
    id: entity.getId(),
    cafeteria_id: entity.getCafeteriaId(),
    cafeteria_name: entity.getCafeteriaName(),
    menu_name: entity.getMenuName(),
    menu_type: mapEntityTypeToDtoType(entity.getMenuType()),
    price: entity.getPrice(),
    discounted_price: entity.getDiscountedPrice(),
    description: entity.getDescription(),
    image_url: entity.getImageUrl(),
    available_at: entity.getAvailableAt(),
    created_at: entity.getCreatedAt(),
  };
}

function mapDtoTypeToEntityType(dtoType: MenuTypeDTO): MenuType {
  const typeMap: Record<MenuTypeDTO, MenuType> = {
    LUNCH: MENU_TYPE.LUNCH,
    DINNER: MENU_TYPE.DINNER,
    SNACK: MENU_TYPE.SNACK,
  };
  return typeMap[dtoType];
}

function mapEntityTypeToDtoType(entityType: MenuType): MenuTypeDTO {
  const typeMap: Record<MenuType, MenuTypeDTO> = {
    [MENU_TYPE.LUNCH]: "LUNCH",
    [MENU_TYPE.DINNER]: "DINNER",
    [MENU_TYPE.SNACK]: "SNACK",
  };
  return typeMap[entityType];
}
