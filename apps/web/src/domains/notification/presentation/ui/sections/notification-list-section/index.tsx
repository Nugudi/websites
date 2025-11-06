"use client";

import { VStack } from "@nugudi/react-components-layout";
import { useMarkNotificationAsRead } from "../../../hooks/mutations/mark-notification-as-read.mutation";
import { useGetNotificationList } from "../../../hooks/queries/get-notification-list.query";
import type { NotificationItem } from "../../../types/notification";
import { NotificationEmpty } from "../../components/notification-empty";
import { NotificationItemCard } from "../../components/notification-item";
import * as styles from "./index.css";

export const NotificationListSection = () => {
  // Custom hooks로 데이터 fetch 및 mutation 로직 분리
  // Repository에서 이미 UI-ready data로 변환되어 반환됨
  const { data, isLoading, error } = useGetNotificationList();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  // Loading state
  if (isLoading) {
    return (
      <VStack className={styles.listContainer}>
        <div>로딩 중...</div>
      </VStack>
    );
  }

  // Error state
  if (error) {
    return (
      <VStack className={styles.listContainer}>
        <div>알림을 불러오는 중 오류가 발생했습니다.</div>
      </VStack>
    );
  }

  // Empty state
  if (!data || data.notifications.length === 0) {
    return <NotificationEmpty />;
  }

  // data.notifications는 이미 NotificationItem[] 타입 (UI-ready)
  const notificationItems = data.notifications;

  // Notification 클릭 핸들러 - 읽음 처리
  const handleNotificationClick = (notification: NotificationItem) => {
    // 이미 읽은 알림이면 skip
    if (notification.isRead) {
      return;
    }

    // Mark as read mutation 실행
    markAsRead(notification.id);

    // link가 있으면 해당 페이지로 이동 (선택적)
    if (notification.link) {
      // window.location.href = notification.link;
      // 또는 Next.js router 사용
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
