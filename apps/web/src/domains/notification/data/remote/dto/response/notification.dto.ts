/**
 * Notification DTO
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
