/**
 * Notification Mapper
 *
 * Converts between DTO (snake_case) and Domain Entity (camelCase)
 * Also converts Entity to UI Types for presentation layer
 * - DTO: From/To API (snake_case)
 * - Entity: Internal domain model (camelCase)
 * - UI Type: For presentation layer (NotificationItem)
 */

import type { Notification } from "../../domain/entities/notification.entity";
import { NotificationCategory } from "../../domain/entities/notification.entity";
import type {
  NotificationItem,
  NotificationType,
} from "../../presentation/types/notification";
import type {
  NotificationDTO,
  NotificationTypeDTO,
} from "../dto/notification.dto";

/**
 * DTO → Domain Entity 변환
 * snake_case → camelCase
 */
export function notificationDtoToDomain(dto: NotificationDTO): Notification {
  return {
    id: dto.id,
    userId: dto.user_id,
    title: dto.title,
    message: dto.message,
    type: mapDtoTypeToEntityType(dto.type),
    isRead: dto.is_read,
    createdAt: dto.created_at,
    readAt: dto.read_at,
    relatedResourceId: dto.related_resource_id,
    relatedResourceType: dto.related_resource_type,
  };
}

/**
 * DTO 배열 → Domain Entity 배열 변환
 */
export function notificationDtoListToDomain(
  dtos: NotificationDTO[],
): Notification[] {
  return dtos.map(notificationDtoToDomain);
}

/**
 * Domain Entity → DTO 변환
 * camelCase → snake_case
 * (POST/PUT 요청 시 사용)
 */
export function notificationDomainToDto(entity: Notification): NotificationDTO {
  return {
    id: entity.id,
    user_id: entity.userId,
    title: entity.title,
    message: entity.message,
    type: mapEntityTypeToDtoType(entity.type),
    is_read: entity.isRead,
    created_at: entity.createdAt,
    read_at: entity.readAt,
    related_resource_id: entity.relatedResourceId,
    related_resource_type: entity.relatedResourceType,
  };
}

/**
 * DTO Type → Entity Type 변환
 */
function mapDtoTypeToEntityType(
  dtoType: NotificationTypeDTO,
): NotificationCategory {
  const typeMap: Record<NotificationTypeDTO, NotificationCategory> = {
    SYSTEM: NotificationCategory.SYSTEM,
    REVIEW: NotificationCategory.REVIEW,
    STAMP: NotificationCategory.STAMP,
    BENEFIT: NotificationCategory.BENEFIT,
  };
  return typeMap[dtoType];
}

/**
 * Entity Type → DTO Type 변환
 */
function mapEntityTypeToDtoType(
  entityType: NotificationCategory,
): NotificationTypeDTO {
  const typeMap: Record<NotificationCategory, NotificationTypeDTO> = {
    [NotificationCategory.SYSTEM]: "SYSTEM",
    [NotificationCategory.REVIEW]: "REVIEW",
    [NotificationCategory.STAMP]: "STAMP",
    [NotificationCategory.BENEFIT]: "BENEFIT",
  };
  return typeMap[entityType];
}

/**
 * ========================================
 * Entity → UI Type 변환 (Presentation Layer용)
 * ========================================
 */

/**
 * NotificationCategory → NotificationType 변환
 * Domain enum을 UI-friendly type으로 변환
 */
function mapCategoryToUiType(category: NotificationCategory): NotificationType {
  const map: Record<NotificationCategory, NotificationType> = {
    [NotificationCategory.SYSTEM]: "notice",
    [NotificationCategory.REVIEW]: "review",
    [NotificationCategory.STAMP]: "point",
    [NotificationCategory.BENEFIT]: "event",
  };
  return map[category] || "notice";
}

/**
 * ISO timestamp → 상대 시간 문자열 변환
 * "2024-01-01T00:00:00Z" → "3일 전"
 */
function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) return `${diffInDays}일 전`;
  if (diffInHours > 0) return `${diffInHours}시간 전`;
  if (diffInMinutes > 0) return `${diffInMinutes}분 전`;
  return "방금 전";
}

/**
 * 리소스 정보 → 내비게이션 링크 생성
 */
function generateLink(
  resourceId?: string,
  resourceType?: string,
): string | undefined {
  if (!resourceId || !resourceType) return undefined;

  const linkMap: Record<string, string> = {
    review: `/reviews/${resourceId}`,
    cafeteria: `/cafeterias/${resourceId}`,
    stamp: "/cafeterias/stamps",
    benefit: "/benefits",
  };
  return linkMap[resourceType];
}

/**
 * Notification Entity → NotificationItem UI Type 변환
 *
 * @param notification Domain Entity
 * @returns NotificationItem UI Type
 */
export function notificationEntityToUi(
  notification: Notification,
): NotificationItem {
  return {
    id: notification.id,
    type: mapCategoryToUiType(notification.type),
    title: notification.title,
    content: notification.message,
    timestamp: formatRelativeTime(notification.createdAt),
    isRead: notification.isRead,
    link: generateLink(
      notification.relatedResourceId,
      notification.relatedResourceType,
    ),
  };
}

/**
 * Notification Entity 배열 → NotificationItem 배열 변환
 */
export function notificationEntityListToUi(
  notifications: Notification[],
): NotificationItem[] {
  return notifications.map(notificationEntityToUi);
}
