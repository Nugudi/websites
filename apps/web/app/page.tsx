import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CafeteriaHomeView } from "@/src/domains/cafeteria/presentation/ui/views/cafeteria-home-view";
import { userProfileQueryServer } from "@/src/domains/user/presentation/hooks/queries/user-profile.query.server";
import getQueryClient from "@/src/shared/infrastructure/configs/tanstack-query/get-query-client";

export const dynamic = "force-dynamic";

const HomePage = async () => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(userProfileQueryServer);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CafeteriaHomeView />
    </HydrationBoundary>
  );
};

export default HomePage;
