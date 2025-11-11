"use client";

import { NotificationAdapter } from "@notification/presentation/shared/adapters";
import { NOTIFICATION_LIST_QUERY_KEY } from "@notification/presentation/shared/constants";
import { useQuery } from "@tanstack/react-query";
import { getNotificationClientContainer } from "@/src/domains/notification/di/notification-client-container";

export function useGetNotificationList() {
  const container = getNotificationClientContainer();
  const getNotificationListUseCase = container.getGetNotificationList();

  return useQuery({
    queryKey: NOTIFICATION_LIST_QUERY_KEY,
    queryFn: async () => {
      const result = await getNotificationListUseCase.execute();
      return NotificationAdapter.notificationListToUi(result);
    },
  });
}
