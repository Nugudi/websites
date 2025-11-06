/**
 * useGetCafeteriaMenuTimeline Query Hook
 *
 * 구내식당 메뉴 타임라인 조회를 위한 TanStack Query 커스텀 훅
 * - Client Container를 통한 UseCase 주입
 * - 중앙 관리되는 queryKey 사용 (캐시 공유 및 무효화 용이)
 * - Suspense 지원 (useSuspenseQuery)
 */

"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getCafeteriaClientContainer } from "../../../di/cafeteria-client-container";
import { cafeteriaKeys } from "../../constants";

export function useGetCafeteriaMenuTimeline(
  cafeteriaId: string,
  params: { cursor?: string; size?: number } = {},
) {
  // Client Container에서 UseCase 획득 (Lazy singleton)
  const container = getCafeteriaClientContainer();
  const getMenuTimelineUseCase = container.getGetCafeteriaMenuTimeline();

  // TanStack Query로 데이터 fetch (Suspense 지원)
  return useSuspenseQuery({
    queryKey: cafeteriaKeys.menuTimeline(cafeteriaId, params),
    queryFn: async () => {
      return getMenuTimelineUseCase.execute(cafeteriaId, params);
    },
  });
}
