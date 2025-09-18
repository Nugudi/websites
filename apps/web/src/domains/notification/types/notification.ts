export type NotificationType = "point" | "review" | "menu" | "event" | "notice";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  icon?: string;
  link?: string;
}
