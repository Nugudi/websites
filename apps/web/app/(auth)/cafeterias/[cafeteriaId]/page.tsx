import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createCafeteriaServerContainer } from "@/src/di/cafeteria-server-container";
import { CafeteriaDetailView } from "@/src/domains/cafeteria/ui/views/cafeteria-detail-view";
import getQueryClient from "@/src/shared/infrastructure/configs/tanstack-query/get-query-client";

interface PageProps {
  params: Promise<{
    cafeteriaId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { cafeteriaId } = await params;

  // DI Container로 서비스 획득
  const container = createCafeteriaServerContainer();
  const cafeteriaService = container.getCafeteriaService();

  // Server-side prefetch
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["cafeteria", "detail", cafeteriaId],
    queryFn: () => cafeteriaService.getCafeteriaById(cafeteriaId),
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
