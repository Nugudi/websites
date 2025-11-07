"use client";

import { useQuery } from "@tanstack/react-query";
import { getStampClientContainer } from "../../../di/stamp-client-container";
import { StampAdapter } from "../../adapters/stamp.adapter";
import { STAMP_COLLECTION_QUERY_KEY } from "../../constants/query-keys";

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
