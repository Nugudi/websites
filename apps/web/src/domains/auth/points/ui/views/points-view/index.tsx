"use client";

import { VStack } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/ui/components/nav-bar";
import { AuthPointsBalanceSection } from "../../sections/points-balance-section";
import { AuthPointsHistorySection } from "../../sections/points-history-section";
import * as styles from "./index.css";

export const AuthPointsView = () => {
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
        <AuthPointsBalanceSection />
      </VStack>
      <AuthPointsHistorySection />
    </VStack>
  );
};
