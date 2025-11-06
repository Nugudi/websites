/**
 * useGetStampCollection Query Hook
 *
 * 스탬프 컬렉션 조회를 위한 TanStack Query 커스텀 훅
 * - Client Container를 통한 UseCase 주입
 * - Repository에서 UI-ready data로 변환되어 반환됨
 * - Server prefetch와 동일한 queryKey 사용으로 캐시 공유
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getStampClientContainer } from "../../../di/stamp-client-container";

export function useGetStampCollection() {
  // Client Container에서 UI-ready UseCase 획득 (Lazy singleton)
  const container = getStampClientContainer();
  const getStampCollectionForUIUseCase = container.getGetStampCollectionForUI();

  // TanStack Query로 데이터 fetch (UI-ready data 직접 반환)
  return useQuery({
    queryKey: ["stamps", "collection"],
    queryFn: () => getStampCollectionForUIUseCase.execute(),
  });
}
