import { formatRelativeTime } from "@core/utils/date";
import {
  NOTIFICATION_CATEGORY,
  type Notification,
  type NotificationCategory,
  type NotificationList,
} from "../../../domain/entities/notification.entity";
import type { NotificationItem, NotificationType } from "../types/notification";

/**
 * Private helper: Converts notification category to UI-safe type
 */
function _getCategoryUiType(category: NotificationCategory): NotificationType {
  const map: Record<NotificationCategory, NotificationType> = {
    [NOTIFICATION_CATEGORY.SYSTEM]: "notice",
    [NOTIFICATION_CATEGORY.REVIEW]: "review",
    [NOTIFICATION_CATEGORY.STAMP]: "point",
    [NOTIFICATION_CATEGORY.BENEFIT]: "event",
  };

  const uiType = map[category];
  if (!uiType) {
    console.error(`Unknown notification category: ${category}`);
    return "notice";
  }

  return uiType;
}

/**
 * Private helper: Generates resource link based on type and ID
 */
function _generateLink(resourceId: string, resourceType: string): string {
  const linkMap: Record<string, string> = {
    review: `/reviews/${resourceId}`,
    cafeteria: `/cafeterias/${resourceId}`,
    stamp: "/cafeterias/stamps",
    benefit: "/benefits",
  };

  const link = linkMap[resourceType];
  if (!link) {
    console.warn(`Unknown resource type for link generation: ${resourceType}`);
    return "/";
  }

  return link;
}

export const NotificationAdapter = {
  /**
   * Transform Notification entity to UI item
   *
   * Converts domain Notification entity to presentation-layer NotificationItem type.
   * Validates category type and generates appropriate resource links.
   *
   * @param notification - Domain Notification entity
   * @returns UI-safe NotificationItem type
   */
  toUiItem(notification: Notification): NotificationItem {
    return {
      id: notification.getId(),
      type: _getCategoryUiType(notification.getType()),
      title: notification.getTitle(),
      content: notification.getMessage(),
      timestamp: formatRelativeTime(notification.getCreatedAt()),
      isRead: notification.getIsRead(),
      link: notification.hasRelatedResource()
        ? _generateLink(
            notification.getRelatedResourceId() ?? "",
            notification.getRelatedResourceType() ?? "",
          )
        : undefined,
    };
  },

  /**
   * Transform array of Notification entities to UI item array
   *
   * @param notifications - Array of domain Notification entities
   * @returns Array of UI-safe NotificationItem types
   */
  toUiList(notifications: Notification[]): NotificationItem[] {
    return notifications.map((notification) => this.toUiItem(notification));
  },

  /**
   * Transform NotificationList entity to UI list object
   *
   * @param list - Domain NotificationList entity containing notifications and metadata
   * @returns UI object with notifications array, total count, and unread count
   */
  notificationListToUi(list: NotificationList) {
    return {
      notifications: this.toUiList(list.notifications),
      totalCount: list.totalCount,
      unreadCount: list.unreadCount,
    };
  },

  /**
   * Get UI color based on notification status and priority
   *
   * Priority mapping: 3+ → red, 2+ → blue, 1 → green
   * Read/expired notifications → gray
   *
   * @param notification - Domain notification entity
   * @returns Color string for UI theming
   */
  getStatusColor(notification: Notification): string {
    if (notification.getIsRead() || notification.isExpired()) {
      return "gray";
    }

    const priority = notification.getPriority();
    if (priority >= 3) return "red";
    if (priority >= 2) return "blue";
    return "green";
  },

  /**
   * Get action button label based on notification state and type
   *
   * Returns "확인됨" for read notifications, category-specific labels otherwise.
   *
   * @param notification - Domain notification entity
   * @returns Korean label text for action button
   */
  getActionLabel(notification: Notification): string {
    if (notification.getIsRead()) {
      return "확인됨";
    }

    if (!notification.hasRelatedResource()) {
      return "확인";
    }

    const actionMap: Record<NotificationCategory, string> = {
      [NOTIFICATION_CATEGORY.SYSTEM]: "확인하기",
      [NOTIFICATION_CATEGORY.REVIEW]: "리뷰 보기",
      [NOTIFICATION_CATEGORY.STAMP]: "스탬프 확인",
      [NOTIFICATION_CATEGORY.BENEFIT]: "혜택 보기",
    };

    return actionMap[notification.getType()] || "보기";
  },

  /**
   * Determine if notification should be displayed in list
   *
   * Filters out expired notifications from UI display.
   *
   * @param notification - Domain notification entity
   * @returns True if notification should be shown
   */
  shouldShowInList(notification: Notification): boolean {
    return !notification.isExpired();
  },

  shouldShowBadge(notification: Notification): boolean {
    return notification.shouldShowBadge();
  },

  /**
   * Sort notifications by priority, recency, and creation date
   *
   * Sorting order:
   * 1. Higher priority first
   * 2. Recent notifications first (within same priority)
   * 3. Newer creation date first
   *
   * @param notifications - Array of domain entities
   * @returns New sorted array (does not mutate input)
   */
  sortByPriority(notifications: Notification[]): Notification[] {
    return [...notifications].sort((a, b) => {
      const priorityDiff = b.getPriority() - a.getPriority();
      if (priorityDiff !== 0) return priorityDiff;

      const aRecent = a.isRecent();
      const bRecent = b.isRecent();
      if (aRecent && !bRecent) return -1;
      if (!aRecent && bRecent) return 1;

      return (
        new Date(b.getCreatedAt()).getTime() -
        new Date(a.getCreatedAt()).getTime()
      );
    });
  },

  /**
   * Filter notifications to only unread ones
   *
   * @param notifications - Array of domain notification entities
   * @returns Array containing only unread notifications
   */
  filterUnread(notifications: Notification[]): Notification[] {
    return notifications.filter((n) => !n.getIsRead());
  },

  /**
   * Filter notifications by category type
   *
   * @param notifications - Array of domain notification entities
   * @param category - Category to filter by
   * @returns Array containing only notifications of the specified category
   */
  filterByCategory(
    notifications: Notification[],
    category: NotificationCategory,
  ): Notification[] {
    return notifications.filter((n) => n.getType() === category);
  },
};
