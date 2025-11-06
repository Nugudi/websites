/**
 * useGetNotificationList Query Hook
 *
 * 알림 목록 조회를 위한 TanStack Query 커스텀 훅
 * - Client Container를 통한 UseCase 주입
 * - Server prefetch와 동일한 queryKey 사용으로 캐시 공유
 * - UI-ready data를 직접 반환 (mapper 호출 불필요)
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotificationClientContainer } from "../../../di/notification-client-container";

export function useGetNotificationList() {
  // Client Container에서 UI-ready UseCase 획득 (Lazy singleton)
  const container = getNotificationClientContainer();
  const getNotificationListForUIUseCase =
    container.getGetNotificationListForUI();

  // TanStack Query로 데이터 fetch (UI-ready data 직접 반환)
  return useQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => getNotificationListForUIUseCase.execute(),
  });
}
