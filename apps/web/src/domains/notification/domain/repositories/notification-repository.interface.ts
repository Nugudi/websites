/**
 * Notification Repository Interface
 *
 * Domain layer repository contract
 * - Defines data access operations
 * - Returns Domain Entities (not DTOs)
 * - Implementation in data layer
 *
 * Responsibilities:
 * - Abstract data source details from domain logic
 * - Define business operations (not just CRUD)
 * - Return domain entities in camelCase
 */

import type {
  Notification,
  NotificationList,
} from "../entities/notification.entity";

export interface NotificationRepository {
  /**
   * 알림 목록 조회
   * @returns 알림 목록과 통계 정보
   */
  getNotificationList(): Promise<NotificationList>;

  /**
   * 특정 알림 읽음 처리
   * @param notificationId - 알림 ID
   */
  markAsRead(notificationId: string): Promise<void>;

  /**
   * 모든 알림 읽음 처리
   */
  markAllAsRead(): Promise<void>;

  /**
   * 특정 알림 조회 (선택적)
   * @param notificationId - 알림 ID
   * @returns 알림 상세 정보
   */
  getNotificationById?(notificationId: string): Promise<Notification | null>;
}
