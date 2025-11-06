/**
 * Notification Repository Implementation
 *
 * Data layer repository implementation
 * - Uses DataSource for data access
 * - Converts DTOs to UI-ready types using Mapper
 * - Implements NotificationRepository interface
 *
 * Pattern:
 * 1. DataSource에서 DTO 가져오기 (snake_case)
 * 2. Mapper로 DTO → Entity → UI Type 변환
 * 3. UI-ready data 반환
 */

import type {
  Notification,
  NotificationList,
} from "../../domain/entities/notification.entity";
import type { NotificationRepository } from "../../domain/repositories/notification-repository.interface";
import type { NotificationItem } from "../../presentation/types/notification";
import type { NotificationDataSource } from "../data-sources/notification-mock-data-source";
import {
  notificationDtoListToDomain,
  notificationEntityListToUi,
} from "../mappers/notification.mapper";

/**
 * UI-ready Notification List Response
 */
export interface NotificationListResponse {
  notifications: NotificationItem[];
  totalCount: number;
  unreadCount: number;
}

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(private readonly dataSource: NotificationDataSource) {}

  /**
   * 알림 목록 조회
   * @returns 알림 목록과 통계 정보 (Domain Entity)
   */
  async getNotificationList(): Promise<NotificationList> {
    // 1. DataSource에서 DTO 가져오기 (snake_case)
    const response = await this.dataSource.getNotificationList();

    // 2. Mapper로 Entity 변환 (camelCase)
    const notifications = notificationDtoListToDomain(response.notifications);

    // 3. NotificationList 형식으로 반환
    return {
      notifications,
      totalCount: response.total_count,
      unreadCount: response.unread_count,
    };
  }

  /**
   * 특정 알림 읽음 처리
   * @param notificationId - 알림 ID
   */
  async markAsRead(notificationId: string): Promise<void> {
    await this.dataSource.markAsRead(notificationId);
  }

  /**
   * 모든 알림 읽음 처리
   */
  async markAllAsRead(): Promise<void> {
    await this.dataSource.markAllAsRead();
  }

  /**
   * 특정 알림 조회 (선택적 구현)
   * @param notificationId - 알림 ID
   * @returns 알림 상세 정보
   */
  async getNotificationById(
    notificationId: string,
  ): Promise<Notification | null> {
    const { notifications } = await this.getNotificationList();
    return notifications.find((n) => n.id === notificationId) ?? null;
  }

  /**
   * 알림 목록 조회 (UI-ready data 반환)
   * Presentation layer에서 바로 사용 가능한 형태로 변환하여 반환
   * @returns UI-ready 알림 목록
   */
  async getNotificationListForUI(): Promise<NotificationListResponse> {
    // 1. DataSource에서 DTO 가져오기
    const response = await this.dataSource.getNotificationList();

    // 2. Mapper로 DTO → Entity 변환
    const entities = notificationDtoListToDomain(response.notifications);

    // 3. Mapper로 Entity → UI Type 변환
    const notificationItems = notificationEntityListToUi(entities);

    // 4. UI-ready 형태로 반환
    return {
      notifications: notificationItems,
      totalCount: response.total_count,
      unreadCount: response.unread_count,
    };
  }
}
