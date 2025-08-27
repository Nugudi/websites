import { Body, Emphasis, Flex } from "@nugudi/react-components-layout";
import RecommendRestaurant from "@/src/domains/restaurant/ui/components/recommend-restaurant";
import * as styles from "./index.css";

const RecommendRestaurantSection = () => {
  // api 연결 후 mock data 삭제
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
        <Body fontSize="b1" colorShade={700}>
          추천 식당
        </Body>
        <Emphasis fontSize="e1" colorShade={400}>
          현재 위치에서 가장 가까운 식당을 추천해요 !
        </Emphasis>
      </Flex>
      <RecommendRestaurant {...recommendRestaurantData} />
    </Flex>
  );
};

export default RecommendRestaurantSection;
