import { Flex } from "@nugudi/react-components-layout";
import type { MenuItem } from "@nugudi/react-components-menu-card";
import { Suspense } from "react";
import MenuList from "../../components/menu-list";
import ViewToggleButtons from "../../components/view-toggle-buttons";
import * as styles from "./index.css";
import { MOCK_RESTAURANT_LIST } from "./mock-data";

export interface Restaurant {
  id: string;
  name: string;
  subtitle: string;
  timeRange: string;
  isPackagingAvailable?: boolean;
  items: MenuItem[];
}

const BrowseMenuSection = () => {
  return (
    <Flex direction="column" gap="12px" align="start">
      <Suspense fallback={<Loading />}>
        <ViewToggleButtons />
      </Suspense>
      <MenuList restaurantList={MOCK_RESTAURANT_LIST} />
    </Flex>
  );
};

export default BrowseMenuSection;

const Loading = () => {
  return (
    <Flex className={styles.loadingContainer} justify="center" align="center">
      <p className={styles.loadingText}>즐겨찾기</p>
      <p className={styles.loadingText}>전체보기</p>
    </Flex>
  );
};
