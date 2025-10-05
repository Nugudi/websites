"use client";

import { Body, Box, Emphasis, VStack } from "@nugudi/react-components-layout";
import { MenuCard } from "@nugudi/react-components-menu-card";
import { getMockCafeteriaData } from "../../../mocks/cafeteria-mock-data";
import type { CafeteriaDetail } from "../../../types/cafeteria-detail";
import * as styles from "./index.css";

interface CafeteriaInfoTabProps {
  cafeteriaId: string;
}

export const CafeteriaInfoTab = ({ cafeteriaId }: CafeteriaInfoTabProps) => {
  const cafeteria = getMockCafeteriaData(cafeteriaId);

  return (
    <VStack gap={32} pt={16} pb={24}>
      <Menu cafeteria={cafeteria} />
      <NutritionInfoCard />
      <LocationMapCard address={cafeteria.location} />
    </VStack>
  );
};

export const Menu = ({ cafeteria }: { cafeteria: CafeteriaDetail }) => {
  return (
    <VStack gap={12}>
      <VStack gap={4}>
        <Emphasis fontSize="e1" color="main" colorShade={500}>
          오늘 & 이전
        </Emphasis>
        <Body fontSize="b3b" colorShade={600}>
          식단 확인하기
        </Body>
      </VStack>
      <MenuCard
        title={cafeteria.name}
        subtitle={cafeteria.location}
        timeRange={cafeteria.operatingHours}
        items={cafeteria.menus.lunch}
        isPackagingAvailable={cafeteria.isPackagingAvailable}
      />
    </VStack>
  );
};

const NutritionInfoCard = () => {
  return (
    <VStack gap={12}>
      <Body fontSize="b3b" colorShade={600}>
        오늘의 식단 칼로리
      </Body>
      <VStack
        gap={12}
        padding={20}
        borderRadius="lg"
        className={styles.nutritionSection}
      >
        <CalorieInfo />
      </VStack>
    </VStack>
  );
};

const CalorieInfo = () => {
  return (
    <VStack gap={8}>
      <Body fontSize="b3">오늘 점심은 약 840kcal로 추정해요! 🔥</Body>
      <Body fontSize="b3">하루 권장 섭취량의 38%입니다.</Body>
    </VStack>
  );
};

const LocationMapCard = ({ address }: { address: string }) => {
  return (
    <VStack gap={12}>
      <Body fontSize="b3b" colorShade={600}>
        식당 지도
      </Body>
      <MapCard address={address} />
    </VStack>
  );
};

const MapCard = ({ address }: { address: string }) => {
  return (
    <VStack gap={8}>
      <Box height={180} borderRadius="lg" className={styles.mapPlaceholder}>
        <Body fontSize="b3">지도 들어갈 자리</Body>
      </Box>
      <Body fontSize="b3">📍 {address}</Body>
    </VStack>
  );
};
