"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotificationClientContainer } from "../../../di/notification-client-container";
import { NotificationAdapter } from "../../adapters";
import { NOTIFICATION_LIST_QUERY_KEY } from "../../constants/query-keys";

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
