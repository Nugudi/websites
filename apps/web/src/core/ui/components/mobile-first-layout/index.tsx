"use client";

import { Flex } from "@nugudi/react-components-layout";
import { usePathname } from "next/navigation";
import { TabBar } from "../tab-bar";
import * as styles from "./index.css";

interface MobileFirstLayoutProps {
  children: React.ReactNode;
}

// TabBar를 표시할 경로들
const TAB_BAR_PATHS = ["/", "/benefits", "/profile"];

export const MobileFirstLayout = ({ children }: MobileFirstLayoutProps) => {
  const pathname = usePathname();
  const showTabBar = TAB_BAR_PATHS.includes(pathname);

  return (
    <div className={styles.container} id="mobile-layout-container">
      <Flex
        direction="column"
        align="center"
        justify="space-between"
        className={styles.contentWrapper}
      >
        {children}
        {showTabBar && <TabBar />}
      </Flex>
    </div>
  );
};
