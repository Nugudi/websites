"use client";

import { VStack } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/components/nav-bar";
import { UserPointsBalanceSection } from "../../sections/user-points-balance-section";
import { UserPointsHistorySection } from "../../sections/user-points-history-section";
import * as styles from "./index.css";

export const UserPointsView = () => {
  return (
    <VStack
      gap={32}
      minH="100dvh"
      h="full"
      w="full"
      className={styles.container}
    >
      <VStack gap={24} p={16} className={styles.content}>
        <NavBar title="내 포인트" />
        <UserPointsBalanceSection />
      </VStack>
      <UserPointsHistorySection />
    </VStack>
  );
};
