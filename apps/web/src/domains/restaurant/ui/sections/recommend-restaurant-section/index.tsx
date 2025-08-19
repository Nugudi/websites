import { Flex } from "@nugudi/react-components-layout";
import RecommendRestaurant from "@/src/domains/restaurant/ui/components/recommend-restaurant";
import * as styles from "./index.css";

const RecommendRestaurantSection = () => {
  const recommendRestaurantData = {
    restaurantId: "1",
    restaurantName: "너구리 푸드",
    restaurantAddress: "너굴너굴 14층",
    restaurantTime: "오전 11시 ~ 오후 2시",
    availablePackaging: true,
  };

  return (
    <Flex direction="column" gap="12px" align="start">
      <Flex direction="column" gap="2px" className={styles.titleContainer}>
        <span className={styles.title}>추천 식당</span>
        <p className={styles.description}>
          현재 위치에서 가장 가까운 식당을 추천해요 !
        </p>
      </Flex>
      <RecommendRestaurant {...recommendRestaurantData} />
    </Flex>
  );
};

export default RecommendRestaurantSection;
