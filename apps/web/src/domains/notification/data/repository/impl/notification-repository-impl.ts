/**
 * Notification Repository Implementation
 */

import type {
  Notification,
  NotificationList,
} from "../../../domain/entities/notification.entity";
import type { NotificationRepository } from "../../../domain/repositories/notification-repository.interface";
import { notificationDtoListToDomain } from "../../mapper/notification.mapper";
import type { NotificationDataSource } from "../../remote/api/notification-remote-data-source-mock-impl";

export class NotificationRepositoryImpl implements NotificationRepository {
  constructor(private readonly dataSource: NotificationDataSource) {}

  async getNotificationList(): Promise<NotificationList> {
    const response = await this.dataSource.getNotificationList();
    const notifications = notificationDtoListToDomain(response.notifications);

    return {
      notifications,
      totalCount: response.total_count,
      unreadCount: response.unread_count,
    };
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.dataSource.markAsRead(notificationId);
  }

  async markAllAsRead(): Promise<void> {
    await this.dataSource.markAllAsRead();
  }

  async getNotificationById(
    notificationId: string,
  ): Promise<Notification | null> {
    const { notifications } = await this.getNotificationList();
    return notifications.find((n) => n.getId() === notificationId) ?? null;
  }
}
