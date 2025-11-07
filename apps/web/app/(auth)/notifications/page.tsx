import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createNotificationServerContainer } from "@/src/domains/notification/di/notification-server-container";
import { NotificationAdapter } from "@/src/domains/notification/presentation/adapters";
import { NotificationView } from "@/src/domains/notification/presentation/ui/views/notification-view";
import { getQueryClient } from "@/src/shared/infrastructure/configs/tanstack-query";

const NotificationsPage = async () => {
  const queryClient = getQueryClient();

  const container = createNotificationServerContainer();
  const getNotificationListUseCase = container.getGetNotificationList();

  await queryClient.prefetchQuery({
    queryKey: ["notifications", "list"],
    queryFn: async () => {
      const result = await getNotificationListUseCase.execute();
      return NotificationAdapter.notificationListToUi(result);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationView />
    </HydrationBoundary>
  );
};

export default NotificationsPage;
