import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createStampServerContainer } from "@/src/domains/stamp/di/stamp-server-container";
import { StampView } from "@/src/domains/stamp/presentation/ui/views/stamp-view";
import { getQueryClient } from "@/src/shared/infrastructure/configs/tanstack-query";

// 구내식당 스탬프 페이지 (구내식당 투어)
const CafeteriaStampsPage = async () => {
  const queryClient = getQueryClient();

  // Server Container로 UseCase 획득 (매번 새 인스턴스)
  const container = createStampServerContainer();
  const getStampCollectionUseCase = container.getGetStampCollection();

  // UseCase를 통한 데이터 prefetch (자동 토큰 주입)
  await queryClient.prefetchQuery({
    queryKey: ["stamps", "collection"],
    queryFn: () => getStampCollectionUseCase.execute(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StampView />
    </HydrationBoundary>
  );
};

export default CafeteriaStampsPage;
