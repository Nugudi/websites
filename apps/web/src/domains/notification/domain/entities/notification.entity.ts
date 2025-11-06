/**
 * Notification Entity
 *
 * Core domain object representing a notification
 * - Contains business logic and validation
 * - Independent of external APIs/DTOs
 */

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationCategory;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  relatedResourceId?: string;
  relatedResourceType?: string;
}

export enum NotificationCategory {
  SYSTEM = "SYSTEM",
  REVIEW = "REVIEW",
  STAMP = "STAMP",
  BENEFIT = "BENEFIT",
}

export interface NotificationList {
  notifications: Notification[];
  totalCount: number;
  unreadCount: number;
}
