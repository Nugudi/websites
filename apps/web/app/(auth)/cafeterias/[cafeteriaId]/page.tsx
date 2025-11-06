import { createCafeteriaServerContainer } from "@cafeteria/di";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CafeteriaDetailView } from "@/src/domains/cafeteria/presentation/ui/views/cafeteria-detail-view";
import getQueryClient from "@/src/shared/infrastructure/configs/tanstack-query/get-query-client";

interface PageProps {
  params: Promise<{
    cafeteriaId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { cafeteriaId } = await params;

  // DI Container로 UseCase 획득
  const container = createCafeteriaServerContainer();
  const getCafeteriaByIdUseCase = container.getGetCafeteriaById();

  // Server-side prefetch
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["cafeteria", "detail", cafeteriaId],
    queryFn: () => getCafeteriaByIdUseCase.execute(cafeteriaId),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 30 * 60 * 1000, // 30분
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaDetailView cafeteriaId={cafeteriaId} />
    </HydrationBoundary>
  );
};

export default Page;
