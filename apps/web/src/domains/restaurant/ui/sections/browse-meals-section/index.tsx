import { Flex } from "@nugudi/react-components-layout";
import type { MenuItem } from "@nugudi/react-components-menu-card";
import { Suspense } from "react";
import MealList from "../../components/meal-list";
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

const BrowseMealsSection = () => {
  return (
    <Flex direction="column" gap="12px" align="start">
      <Suspense fallback={<Loading />}>
        <ViewToggleButtons />
      </Suspense>
      <MealList restaurantList={MOCK_RESTAURANT_LIST} />
    </Flex>
  );
};

export default BrowseMealsSection;

const Loading = () => {
  return (
    <Flex className={styles.loadingContainer} justify="center" align="center">
      <p className={styles.loadingText}>즐겨찾기</p>
      <p className={styles.loadingText}>전체보기</p>
    </Flex>
  );
};
