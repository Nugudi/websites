import { CafeteriaRecommendSection } from "@cafeteria/presentation/sections";
import { AppHeader } from "@core/ui/components/app-header";
import { Flex } from "@nugudi/react-components-layout";
import { UserWelcomeSection } from "@user/presentation/sections";
import { CafeteriaBrowseMenuSection } from "../../sections/cafeteria-browse-menu-section";
import * as styles from "./index.css";

export const CafeteriaHomeView = () => {
  return (
    <Flex direction="column" className={styles.container} gap={16}>
      <AppHeader />
      <UserWelcomeSection />
      <CafeteriaBrowseMenuSection />
      <CafeteriaRecommendSection />
    </Flex>
  );
};
