"use client";

import { useQuery } from "@tanstack/react-query";
import { getBenefitClientContainer } from "../../../di/benefit-client-container";
import { BenefitAdapter } from "../../adapters";
import { BENEFIT_LIST_QUERY_KEY } from "../../constants/query-keys";

export function useGetBenefitList() {
  const container = getBenefitClientContainer();
  const getBenefitListUseCase = container.getGetBenefitList();

  return useQuery({
    queryKey: BENEFIT_LIST_QUERY_KEY,
    queryFn: async () => {
      const result = await getBenefitListUseCase.execute();
      return BenefitAdapter.benefitListToUi(result);
    },
  });
}
