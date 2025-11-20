"use client";

import { CafeteriaAdapter } from "@cafeteria/presentation/shared/adapters";
import { cafeteriaKeys } from "@cafeteria/presentation/shared/constants";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getCafeteriaClientContainer } from "@/src/domains/cafeteria/di/cafeteria-client-container";

/**
 * 식당 상세 정보를 조회하는 Query Hook
 *
 * @param cafeteriaId - 조회할 식당 ID
 * @returns CafeteriaDetailItem을 포함한 Suspense Query 결과
 */
export function useGetCafeteriaDetail(cafeteriaId: string) {
  const container = getCafeteriaClientContainer();
  const getCafeteriaByIdUseCase = container.getGetCafeteriaById();

  return useSuspenseQuery({
    queryKey: cafeteriaKeys.detail(cafeteriaId),
    queryFn: async () => {
      const entity = await getCafeteriaByIdUseCase.execute(cafeteriaId);
      return CafeteriaAdapter.toUiDetailItem(entity);
    },
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
  });
}
