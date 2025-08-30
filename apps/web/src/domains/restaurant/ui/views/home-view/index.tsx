import { Flex } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/shared/ui/components/app-header";
import UserWelcomeBanner from "@/src/shared/ui/components/user-welcome-banner";
import BrowseMenuSection from "../../sections/browse-menu-section";
import RecommendRestaurantSection from "../../sections/recommend-restaurant-section";
import * as styles from "./index.css";

const HomeView = () => {
  return (
    <Flex direction="column" className={styles.container} gap="16px">
      <AppHeader />
      <UserWelcomeBanner />
      <BrowseMenuSection />
      <RecommendRestaurantSection />
    </Flex>
  );
};

export default HomeView;
