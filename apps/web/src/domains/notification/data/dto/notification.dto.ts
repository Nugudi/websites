/**
 * Notification DTO
 *
 * Data Transfer Object for Notification API
 * - snake_case naming (matches Spring API convention)
 * - Used for API communication only
 *
 * Note: 현재 백엔드 API가 없으므로 Entity 구조를 기반으로 정의
 * 백엔드 API 구현 시 실제 스펙에 맞게 수정 필요
 */

export interface NotificationDTO {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationTypeDTO;
  is_read: boolean;
  created_at: string;
  read_at?: string;
  related_resource_id?: string;
  related_resource_type?: string;
}

export type NotificationTypeDTO = "SYSTEM" | "REVIEW" | "STAMP" | "BENEFIT";

export interface GetNotificationListResponseDTO {
  notifications: NotificationDTO[];
  total_count: number;
  unread_count: number;
}

export interface MarkAsReadRequestDTO {
  notification_id: string;
}
