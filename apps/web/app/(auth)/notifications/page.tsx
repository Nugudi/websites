import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createNotificationServerContainer } from "@/src/domains/notification/di/notification-server-container";
import { NotificationView } from "@/src/domains/notification/presentation/ui/views/notification-view";
import { getQueryClient } from "@/src/shared/infrastructure/configs/tanstack-query";

const NotificationsPage = async () => {
  const queryClient = getQueryClient();

  // Server Container로 UseCase 획득 (매번 새 인스턴스)
  const container = createNotificationServerContainer();
  const getNotificationListUseCase = container.getGetNotificationList();

  // UseCase를 통한 데이터 prefetch (자동 토큰 주입)
  await queryClient.prefetchQuery({
    queryKey: ["notifications", "list"],
    queryFn: () => getNotificationListUseCase.execute(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationView />
    </HydrationBoundary>
  );
};

export default NotificationsPage;
