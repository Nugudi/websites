import { Flex } from "@nugudi/react-components-layout";
import UserWelcomeBanner from "@/src/shared/ui/components/user-welcome-banner";
import BrowseMealsSection from "../../sections/browse-meals-section";
import RecommendRestaurantSection from "../../sections/recommend-restaurant-section";
import * as styles from "./index.css";

const HomeView = () => {
  return (
    <Flex direction="column" className={styles.container} gap="16px">
      <UserWelcomeBanner />
      <BrowseMealsSection />
      <RecommendRestaurantSection />
    </Flex>
  );
};

export default HomeView;
