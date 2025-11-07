"use client";

import { VStack } from "@nugudi/react-components-layout";
import { useMarkNotificationAsRead } from "../../../hooks/mutations/mark-notification-as-read.mutation";
import { useGetNotificationList } from "../../../hooks/queries/get-notification-list.query";
import type { NotificationItem } from "../../../types/notification";
import { NotificationEmpty } from "../../components/notification-empty";
import { NotificationItemCard } from "../../components/notification-item";
import * as styles from "./index.css";

export const NotificationListSection = () => {
  const { data, isLoading, error } = useGetNotificationList();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  if (isLoading) {
    return (
      <VStack className={styles.listContainer}>
        <div>로딩 중...</div>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack className={styles.listContainer}>
        <div>알림을 불러오는 중 오류가 발생했습니다.</div>
      </VStack>
    );
  }

  if (!data || data.notifications.length === 0) {
    return <NotificationEmpty />;
  }

  const notificationItems = data.notifications;

  const handleNotificationClick = (notification: NotificationItem) => {
    if (notification.isRead) {
      return;
    }

    markAsRead(notification.id);

    if (notification.link) {
    }
  };

  return (
    <VStack className={styles.listContainer}>
      {notificationItems.map((notification) => (
        <NotificationItemCard
          key={notification.id}
          notification={notification}
          onClick={handleNotificationClick}
        />
      ))}
    </VStack>
  );
};
