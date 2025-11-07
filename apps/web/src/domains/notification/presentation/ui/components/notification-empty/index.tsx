import { NotiIcon } from "@nugudi/assets-icons";
import { Body, Emphasis, VStack } from "@nugudi/react-components-layout";
import * as styles from "./index.css";

export const NotificationEmpty = () => {
  return (
    <VStack gap={16} align="center" className={styles.emptyContainer}>
      <NotiIcon className={styles.emptyIcon} />
      <VStack gap={8} align="center">
        <Body fontSize="b2" className={styles.emptyTitle}>
          알림이 없습니다
        </Body>
        <Emphasis fontSize="e1" className={styles.emptyDescription}>
          새로운 알림이 도착하면 여기에 표시됩니다
        </Emphasis>
      </VStack>
    </VStack>
  );
};
