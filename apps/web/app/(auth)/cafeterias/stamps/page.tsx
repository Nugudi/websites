import { getQueryClient } from "@core/infrastructure/configs/tanstack-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createStampServerContainer } from "@/src/domains/stamp/di/stamp-server-container";
import { StampAdapter } from "@/src/domains/stamp/presentation/adapters/stamp.adapter";
import { StampView } from "@/src/domains/stamp/presentation/ui/views/stamp-view";

const CafeteriaStampsPage = async () => {
  const queryClient = getQueryClient();

  const container = createStampServerContainer();
  const getStampCollectionUseCase = container.getGetStampCollection();

  await queryClient.prefetchQuery({
    queryKey: ["stamps", "collection"],
    queryFn: async () => {
      const result = await getStampCollectionUseCase.execute();
      return StampAdapter.stampCollectionToUi(result);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StampView />
    </HydrationBoundary>
  );
};

export default CafeteriaStampsPage;
