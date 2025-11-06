/**
 * useMarkNotificationAsRead Mutation Hook
 *
 * 알림 읽음 처리를 위한 TanStack Query Mutation 커스텀 훅
 * - Client Container를 통한 UseCase 주입
 * - 성공 시 알림 목록 캐시 무효화로 자동 갱신
 */

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotificationClientContainer } from "../../../di/notification-client-container";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  // Client Container에서 UseCase 획득 (Lazy singleton)
  const container = getNotificationClientContainer();
  const markAsReadUseCase = container.getMarkAsRead();

  // Mark as read mutation
  return useMutation({
    mutationFn: (notificationId: string) =>
      markAsReadUseCase.execute({ notificationId }),
    onSuccess: () => {
      // 성공 시 알림 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
    },
  });
}
