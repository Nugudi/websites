"use client";

import { VStack } from "@nugudi/react-components-layout";
import { MOCK_NOTIFICATIONS } from "../../../constants/notification";
import { NotificationEmpty } from "../../components/notification-empty";
import { NotificationItemCard } from "../../components/notification-item";
import * as styles from "./index.css";

export const NotificationListSection = () => {
  if (MOCK_NOTIFICATIONS.length === 0) {
    return <NotificationEmpty />;
  }

  return (
    <VStack className={styles.listContainer}>
      {MOCK_NOTIFICATIONS.map((notification) => (
        <NotificationItemCard
          key={notification.id}
          notification={notification}
        />
      ))}
    </VStack>
  );
};
