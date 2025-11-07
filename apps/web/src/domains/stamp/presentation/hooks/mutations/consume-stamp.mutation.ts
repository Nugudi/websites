/**
 * useConsumeStamp Mutation Hook
 *
 * 스탬프 사용(소비/교환) 처리를 위한 TanStack Query Mutation 커스텀 훅
 * - Client Container를 통한 UseCase 주입
 * - 성공 시 스탬프 컬렉션 캐시 무효화로 자동 갱신
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStampClientContainer } from "../../../di/stamp-client-container";

export function useConsumeStamp() {
  const queryClient = useQueryClient();

  // Client Container에서 UseCase 획득 (Lazy singleton)
  const container = getStampClientContainer();
  const consumeStampUseCase = container.getConsumeStamp();

  // Consume stamp mutation
  return useMutation({
    mutationFn: (stampId: string) => consumeStampUseCase.execute({ stampId }),
    onSuccess: () => {
      // 성공 시 스탬프 컬렉션 갱신
      queryClient.invalidateQueries({ queryKey: ["stamps", "collection"] });
    },
  });
}
