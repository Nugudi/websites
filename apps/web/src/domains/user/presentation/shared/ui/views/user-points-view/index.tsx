"use client";

import { NavBar } from "@core/ui/components/nav-bar";
import { VStack } from "@nugudi/react-components-layout";
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
      <NavBar title="내 포인트" background="transparent" />
      <UserPointsBalanceSection />
      <UserPointsHistorySection />
    </VStack>
  );
};
