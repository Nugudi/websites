import { Flex } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/shared/ui/components/app-header";
import UserWelcomeBanner from "@/src/shared/ui/components/user-welcome-banner";
import CafeteriaBrowseMenuSection from "../../sections/cafeteria-browse-menu-section";
import CafeteriaRecommendSection from "../../sections/cafeteria-recommend-section";
import * as styles from "./index.css";

const CafeteriaHomeView = () => {
  return (
    <Flex direction="column" className={styles.container} gap="16px">
      <AppHeader />
      <UserWelcomeBanner />
      <CafeteriaBrowseMenuSection />
      <CafeteriaRecommendSection />
    </Flex>
  );
};

export default CafeteriaHomeView;
