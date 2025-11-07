import { createCafeteriaServerContainer } from "@cafeteria/di";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CafeteriaAdapter } from "@/src/domains/cafeteria/presentation/adapters";
import { CafeteriaDetailView } from "@/src/domains/cafeteria/presentation/ui/views/cafeteria-detail-view";
import getQueryClient from "@/src/shared/infrastructure/configs/tanstack-query/get-query-client";

interface PageProps {
  params: Promise<{
    cafeteriaId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { cafeteriaId } = await params;

  const container = createCafeteriaServerContainer();
  const getCafeteriaByIdUseCase = container.getGetCafeteriaById();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["cafeteria", "detail", cafeteriaId],
    queryFn: async () => {
      const cafeteria = await getCafeteriaByIdUseCase.execute(cafeteriaId);
      return CafeteriaAdapter.toUiDetailItem(cafeteria);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaDetailView cafeteriaId={cafeteriaId} />
    </HydrationBoundary>
  );
};

export default Page;
