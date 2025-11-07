import { Body, Emphasis, Flex } from "@nugudi/react-components-layout";
import { CafeteriaRecommendCard } from "@/src/domains/cafeteria/presentation/ui/components/cafeteria-recommend-card";
import * as styles from "./index.css";

export const CafeteriaRecommendSection = () => {
  // api 연결 후 mock data 삭제
  const recommendCafeteriaData = {
    cafeteriaId: "1",
    cafeteriaName: "너구리 푸드",
    cafeteriaAddress: "너굴너굴 14층",
    cafeteriaTime: "오전 11시 ~ 오후 2시",
    availablePackaging: true,
  };

  return (
    <Flex direction="column" gap={12} align="start">
      <Flex direction="column" gap={2} className={styles.titleContainer}>
        <Body fontSize="b1" colorShade={700}>
          추천 식당
        </Body>
        <Emphasis fontSize="e1" colorShade={400}>
          현재 위치에서 가장 가까운 식당을 추천해요 !
        </Emphasis>
      </Flex>
      <CafeteriaRecommendCard {...recommendCafeteriaData} />
    </Flex>
  );
};
