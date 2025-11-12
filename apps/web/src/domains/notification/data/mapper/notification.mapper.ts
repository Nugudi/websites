/**
 * Notification Mapper
 */

import {
  NOTIFICATION_CATEGORY,
  Notification,
  type NotificationCategory,
} from "../../domain/entities/notification.entity";
import type { NotificationDTO, NotificationTypeDTO } from "../remote/dto";

export function notificationDtoToDomain(dto: NotificationDTO): Notification {
  return new Notification(
    dto.id,
    dto.user_id,
    dto.title,
    dto.message,
    mapDtoTypeToEntityType(dto.type),
    dto.is_read,
    dto.created_at,
    dto.read_at,
    dto.related_resource_id,
    dto.related_resource_type,
  );
}

export function notificationDtoListToDomain(
  dtos: NotificationDTO[],
): Notification[] {
  return dtos.map(notificationDtoToDomain);
}

export function notificationDomainToDto(entity: Notification): NotificationDTO {
  return {
    id: entity.getId(),
    user_id: entity.getUserId(),
    title: entity.getTitle(),
    message: entity.getMessage(),
    type: mapEntityTypeToDtoType(entity.getType()),
    is_read: entity.getIsRead(),
    created_at: entity.getCreatedAt(),
    read_at: entity.getReadAt(),
    related_resource_id: entity.getRelatedResourceId(),
    related_resource_type: entity.getRelatedResourceType(),
  };
}

function mapDtoTypeToEntityType(
  dtoType: NotificationTypeDTO,
): NotificationCategory {
  const typeMap: Record<NotificationTypeDTO, NotificationCategory> = {
    SYSTEM: NOTIFICATION_CATEGORY.SYSTEM,
    REVIEW: NOTIFICATION_CATEGORY.REVIEW,
    STAMP: NOTIFICATION_CATEGORY.STAMP,
    BENEFIT: NOTIFICATION_CATEGORY.BENEFIT,
  };
  return typeMap[dtoType];
}

function mapEntityTypeToDtoType(
  entityType: NotificationCategory,
): NotificationTypeDTO {
  const typeMap: Record<NotificationCategory, NotificationTypeDTO> = {
    [NOTIFICATION_CATEGORY.SYSTEM]: "SYSTEM",
    [NOTIFICATION_CATEGORY.REVIEW]: "REVIEW",
    [NOTIFICATION_CATEGORY.STAMP]: "STAMP",
    [NOTIFICATION_CATEGORY.BENEFIT]: "BENEFIT",
  };
  return typeMap[entityType];
}
