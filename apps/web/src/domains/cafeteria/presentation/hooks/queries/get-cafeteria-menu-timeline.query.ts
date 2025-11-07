"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getCafeteriaClientContainer } from "../../../di/cafeteria-client-container";
import { CafeteriaAdapter } from "../../adapters";
import { cafeteriaKeys } from "../../constants";

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
