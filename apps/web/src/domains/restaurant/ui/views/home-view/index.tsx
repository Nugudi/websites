import { Flex } from "@nugudi/react-components-layout";
import UserWelcomeBanner from "@/src/shared/ui/components/user-welcome-banner";
import BrowseMenuSection from "../../sections/browse-menu-section";
import RecommendRestaurantSection from "../../sections/recommend-restaurant-section";
import * as styles from "./index.css";

const HomeView = () => {
  return (
    <Flex direction="column" className={styles.container} gap="16px">
      <UserWelcomeBanner />
      <BrowseMenuSection />
      <RecommendRestaurantSection />
    </Flex>
  );
};

export default HomeView;
