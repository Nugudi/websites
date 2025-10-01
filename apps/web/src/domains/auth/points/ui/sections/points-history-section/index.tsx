"use client";

import { VStack } from "@nugudi/react-components-layout";
import {
  AuthPointsHistoryList,
  type DailyPointData,
} from "../../components/points-history-list";

export const AuthPointsHistorySection = () => {
  // TODO: Replace with actual data from API
  const pointsData = usePointsData();

  return (
    <VStack gap={16}>
      <AuthPointsHistoryList pointsData={pointsData} />
    </VStack>
  );
};

// Mock hook - will be replaced with actual API call
const usePointsData = (): DailyPointData[] => {
  return [
    {
      date: "6월 10일",
      transactions: [
        { id: 1, type: "meal", title: "식단 예측 성공", amount: -100 },
        { id: 2, type: "meal", title: "식단 예측 성공", amount: 10 },
        { id: 3, type: "event", title: "아이콘 구매", amount: 100 },
      ],
    },
    {
      date: "5월 28일",
      transactions: [
        { id: 4, type: "meal", title: "식단 예측 성공", amount: -100 },
        { id: 5, type: "meal", title: "식단 예측 성공", amount: 10 },
        { id: 6, type: "event", title: "아이콘 구매", amount: 100 },
      ],
    },
  ];
};
