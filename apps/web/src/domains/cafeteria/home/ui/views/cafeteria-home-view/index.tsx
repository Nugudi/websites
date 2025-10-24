import { Flex } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/shared/interface-adapters/components/app-header";
import { UserWelcomeSection } from "@/src/shared/interface-adapters/sections/user-welcome-section";
import { CafeteriaBrowseMenuSection } from "../../sections/cafeteria-browse-menu-section";
import { CafeteriaRecommendSection } from "../../sections/cafeteria-recommend-section";
import * as styles from "./index.css";

export const CafeteriaHomeView = () => {
  return (
    <Flex direction="column" className={styles.container} gap="16px">
      <AppHeader />
      <UserWelcomeSection />
      <CafeteriaBrowseMenuSection />
      <CafeteriaRecommendSection />
    </Flex>
  );
};
