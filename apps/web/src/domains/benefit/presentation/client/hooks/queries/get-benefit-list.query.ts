"use client";

import { BenefitAdapter } from "@benefit/presentation/shared/adapters";
import { BENEFIT_LIST_QUERY_KEY } from "@benefit/presentation/shared/constants";
import { useQuery } from "@tanstack/react-query";
import { getBenefitClientContainer } from "@/src/domains/benefit/di/benefit-client-container";

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
