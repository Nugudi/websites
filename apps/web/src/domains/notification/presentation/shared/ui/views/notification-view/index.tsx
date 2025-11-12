import { NavBar } from "@core/ui/components/nav-bar";
import { Flex } from "@nugudi/react-components-layout";
import { NotificationListSection } from "../../sections/notification-list-section";
import * as styles from "./index.css";

export const NotificationView = () => {
  return (
    <Flex direction="column" gap={0} className={styles.container}>
      <NavBar title="알림" />
      <NotificationListSection />
    </Flex>
  );
};
