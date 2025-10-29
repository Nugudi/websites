import { Flex } from "@nugudi/react-components-layout";
import { Suspense } from "react";
import { MOCK_CAFETERIA_LIST } from "../../../mocks/menu-mock-data";
import { CafeteriaMenuList } from "../../components/cafeteria-menu-list";
import { CafeteriaViewToggle } from "../../components/cafeteria-view-toggle";
import * as styles from "./index.css";

export const CafeteriaBrowseMenuSection = () => {
  return (
    <Flex direction="column" gap={12} align="start">
      <Suspense fallback={<Loading />}>
        <CafeteriaViewToggle />
      </Suspense>
      <CafeteriaMenuList cafeteriaList={MOCK_CAFETERIA_LIST} />
    </Flex>
  );
};

const Loading = () => {
  return (
    <Flex className={styles.loadingContainer} justify="center" align="center">
      <p className={styles.loadingText}>즐겨찾기</p>
      <p className={styles.loadingText}>전체보기</p>
    </Flex>
  );
};
