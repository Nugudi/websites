import { Flex } from "@nugudi/react-components-layout";
import type { MenuItem } from "@nugudi/react-components-menu-card";
import { Suspense } from "react";
import CafeteriaMenuList from "../../components/cafeteria-menu-list";
import CafeteriaViewToggle from "../../components/cafeteria-view-toggle";
import * as styles from "./index.css";
import { MOCK_CAFETERIA_LIST } from "./mock-data";

export interface Cafeteria {
  id: string;
  name: string;
  subtitle: string;
  timeRange: string;
  isPackagingAvailable?: boolean;
  items: MenuItem[];
}

const CafeteriaBrowseMenuSection = () => {
  return (
    <Flex direction="column" gap="12px" align="start">
      <Suspense fallback={<Loading />}>
        <CafeteriaViewToggle />
      </Suspense>
      <CafeteriaMenuList cafeteriaList={MOCK_CAFETERIA_LIST} />
    </Flex>
  );
};

export default CafeteriaBrowseMenuSection;

const Loading = () => {
  return (
    <Flex className={styles.loadingContainer} justify="center" align="center">
      <p className={styles.loadingText}>즐겨찾기</p>
      <p className={styles.loadingText}>전체보기</p>
    </Flex>
  );
};
