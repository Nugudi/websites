"use client";

import { CafeteriaAdapter } from "@cafeteria/presentation/shared/adapters";
import { cafeteriaKeys } from "@cafeteria/presentation/shared/constants";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getCafeteriaClientContainer } from "@/src/domains/cafeteria/di/cafeteria-client-container";

export function useGetCafeteriaMenuTimeline(
  cafeteriaId: string,
  params: { cursor?: string; size?: number } = {},
) {
  const container = getCafeteriaClientContainer();
  const getMenuTimelineUseCase = container.getGetCafeteriaMenuTimeline();

  return useSuspenseQuery({
    queryKey: cafeteriaKeys.menuTimeline(cafeteriaId, params),
    queryFn: async () => {
      const result = await getMenuTimelineUseCase.execute(cafeteriaId, params);

      return {
        data: CafeteriaAdapter.menuTimelineListToUi(result.data),
        pageInfo: result.pageInfo,
      };
    },
  });
}
