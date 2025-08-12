import { Flex } from "@nugudi/react-components-layout";
import type React from "react";
import TabBar from "@/src/shared/components/tab-bar";
import * as styles from "./layout.css";

const MyPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="space-between"
      className={styles.container}
    >
      <div className={styles.contentWrapper}>{children}</div>
      <TabBar />
    </Flex>
  );
};

export default MyPageLayout;
