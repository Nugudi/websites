"use client";

import { StampAdapter } from "@stamp/presentation/shared/adapters";
import { STAMP_COLLECTION_QUERY_KEY } from "@stamp/presentation/shared/constants";
import { useQuery } from "@tanstack/react-query";
import { getStampClientContainer } from "@/src/domains/stamp/di/stamp-client-container";

export function useGetStampCollection() {
  const container = getStampClientContainer();
  const getStampCollectionUseCase = container.getGetStampCollection();

  return useQuery({
    queryKey: STAMP_COLLECTION_QUERY_KEY,
    queryFn: async () => {
      const result = await getStampCollectionUseCase.execute();
      return StampAdapter.stampCollectionToUi(result);
    },
  });
}
